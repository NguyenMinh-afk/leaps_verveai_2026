/**
 * Bundle management service (svc-content).
 *
 * Handles bundle lifecycle:
 *   BUILDING → BUILT → SIGNED → PUBLISHED
 *
 * Signing uses Ed25519 (TS-19/TS-20):
 * - Keys persisted to PEM files in KEYS_DIR
 * - Bundle content is hashed (SHA-256) before signing
 * - Fingerprint of the public key is stored alongside the signature
 */

import { Prisma } from '../generated/prisma/index.js';
import { NotFoundError, ConflictError, ValidationError } from '@verveai/error-types';
import { validate } from '@verveai/common-node';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import {
  type BuildBundleInput,
  type PaginationInput,
  buildBundleSchema,
  paginationSchema,
} from '../validators/bundle.validator.js';
import {
  getOrCreateKeyPair,
  computeHash,
  sign,
  publicKeyFingerprint,
} from '../utils/ed25519.js';
import type { PaginationResult } from '@verveai/common-node';

// ─── Result types ──────────────────────────────────────────────────────────────

export type BundleStatus = 'BUILDING' | 'BUILT' | 'SIGNED' | 'PUBLISHED';

export interface BundleSignature {
  id: string;
  bundleId: string;
  publicKeyFingerprint: string;
  signature: string;
  signedAt: Date;
}

export interface Bundle {
  id: string;
  name: string;
  version: string;
  status: BundleStatus;
  contentIds: string[];
  createdAt: Date;
  publishedAt?: Date;
  signatures: BundleSignature[];
}

export interface BundleListResult {
  items: Bundle[];
  pagination: PaginationResult;
}

function toBundle(
  m: Prisma.bundleGetPayload<Record<string, never>>,
  sigs: Array<Prisma.bundle_signatureGetPayload<Record<string, never>>> = [],
): Bundle {
  return {
    id: m.id,
    name: m.name,
    version: m.version,
    status: m.status,
    contentIds: m.content_ids,
    createdAt: m.created_at,
    publishedAt: m.published_at ?? undefined,
    signatures: sigs.map((s) => ({
      id: s.id,
      bundleId: s.bundle_id,
      publicKeyFingerprint: s.public_key_fingerprint,
      signature: s.signature,
      signedAt: s.signed_at,
    })),
  };
}

// ─── List bundles ─────────────────────────────────────────────────────────────

/**
 * List all bundles with pagination.
 * Includes signature count per bundle.
 */
export async function listBundles(params: unknown): Promise<BundleListResult> {
  const parsed = validate(paginationSchema, params);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid pagination parameters');
  }

  const { skip, take } = parsed.data as PaginationInput;

  const [items, total] = await Promise.all([
    prisma.bundle.findMany({
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: {
        _count: { select: { signatures: true } },
      },
    }),
    prisma.bundle.count(),
  ]);

  const pagination: PaginationResult = {
    page: Math.floor(skip / take) + 1,
    pageSize: take,
    total,
    totalPages: Math.max(1, Math.ceil(total / take)),
    hasNext: skip + items.length < total,
    hasPrev: skip > 0,
  };

  return {
    items: (items as unknown as Array<Parameters<typeof toBundle>[0] & { _count?: { signatures: number } }>).map((m) => ({
      ...toBundle(m),
      signatures: [], // lightweight list — load signatures on detail
    })),
    pagination,
  };
}

// ─── Get one bundle ────────────────────────────────────────────────────────────

/**
 * Get a bundle by ID including its full signature list.
 */
export async function getBundle(id: string): Promise<Bundle | null> {
  const bundle = await prisma.bundle.findUnique({
    where: { id },
    include: {
      signatures: {
        orderBy: { signed_at: 'desc' },
      },
    },
  });

  if (!bundle) {
    return null;
  }

  return toBundle(bundle, bundle.signatures);
}

// ─── Build bundle ──────────────────────────────────────────────────────────────

/**
 * Build a new bundle from a list of content IDs.
 *
 * - All content items must exist and be APPROVED.
 * - If any content is missing or not APPROVED, the build fails.
 * - Bundle is created with status = BUILT.
 */
export async function buildBundle(data: unknown): Promise<Bundle> {
  const parsed = validate(buildBundleSchema, data);
  if (!parsed.ok) {
    throw new ValidationError(parsed.error.issues, 'Invalid bundle data');
  }

  const { name, contentIds } = parsed.data as BuildBundleInput;

  // Verify all content items are APPROVED
  const approvedCount = await prisma.content_item.count({
    where: {
      id: { in: contentIds },
      status: 'APPROVED',
      deleted_at: null,
    },
  });

  if (approvedCount !== contentIds.length) {
    const missingOrNotApproved = contentIds.length - approvedCount;
    throw new ConflictError(
      `Cannot build bundle: ${missingOrNotApproved} content item(s) are not APPROVED or do not exist. All content must be APPROVED.`,
    );
  }

  // Check for duplicate IDs
  const uniqueIds = new Set(contentIds);
  if (uniqueIds.size !== contentIds.length) {
    throw new ValidationError(
      [{ path: ['contentIds'], message: 'Duplicate content IDs provided', code: 'custom' }],
      'Duplicate content IDs',
    );
  }

  const bundle = await prisma.bundle.create({
    data: {
      name,
      content_ids: contentIds,
      status: 'BUILT',
    },
    include: { signatures: true },
  });

  logger.info('Bundle built', { bundleId: bundle.id, contentCount: contentIds.length });

  return toBundle(bundle, bundle.signatures);
}

// ─── Sign bundle ───────────────────────────────────────────────────────────────

/**
 * Sign a bundle with Ed25519.
 *
 * - Loads (or creates) the Ed25519 key pair from PEM files.
 * - Serialises bundle metadata + content IDs as the signing payload.
 * - Computes SHA-256 hash, signs, stores signature + public-key fingerprint.
 * - Transitions bundle status: BUILT → SIGNED.
 */
export async function signBundle(id: string): Promise<BundleSignature> {
  const bundle = await prisma.bundle.findUnique({ where: { id } });

  if (!bundle) {
    throw new NotFoundError('Bundle', id);
  }

  if (bundle.status !== 'BUILT') {
    throw new ConflictError(
      `Bundle ${id} is ${bundle.status} and cannot be signed. Only BUILT bundles can be signed.`,
    );
  }

  // Build canonical payload to sign
  const payload = JSON.stringify({
    bundleId: bundle.id,
    name: bundle.name,
    version: bundle.version,
    contentIds: bundle.content_ids,
    createdAt: bundle.created_at.toISOString(),
  });

  const contentHash = computeHash(payload);

  // Sign the hash
  const { publicKey, privateKey } = await getOrCreateKeyPair();
  const signature = sign(privateKey, contentHash);
  const fingerprint = publicKeyFingerprint(publicKey);

  // Persist
  const sigRecord = await prisma.bundle_signature.create({
    data: {
      bundle_id: id,
      public_key_fingerprint: fingerprint,
      signature,
    },
  });

  // Transition bundle to SIGNED
  await prisma.bundle.update({
    where: { id },
    data: { status: 'SIGNED' },
  });

  logger.info('Bundle signed', { bundleId: id, fingerprint });

  return {
    id: sigRecord.id,
    bundleId: sigRecord.bundle_id,
    publicKeyFingerprint: sigRecord.public_key_fingerprint,
    signature: sigRecord.signature,
    signedAt: sigRecord.signed_at,
  };
}

// ─── Publish bundle ───────────────────────────────────────────────────────────

/**
 * Publish a signed bundle.
 * Transitions status: SIGNED → PUBLISHED.
 * Sets published_at to the current timestamp.
 */
export async function publishBundle(id: string): Promise<Bundle> {
  const bundle = await prisma.bundle.findUnique({
    where: { id },
    include: { signatures: true },
  });

  if (!bundle) {
    throw new NotFoundError('Bundle', id);
  }

  if (bundle.status !== 'SIGNED') {
    throw new ConflictError(
      `Bundle ${id} is ${bundle.status} and cannot be published. Only SIGNED bundles can be published.`,
    );
  }

  if (bundle.signatures.length === 0) {
    throw new ConflictError(`Bundle ${id} has no signatures and cannot be published.`);
  }

  const updated = await prisma.bundle.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      published_at: new Date(),
    },
    include: { signatures: true },
  });

  logger.info('Bundle published', { bundleId: id });

  return toBundle(updated, updated.signatures);
}
