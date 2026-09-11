/**
 * Tests for the bundle service.
 *
 * Mocks Prisma client and Ed25519 helpers so we exercise the state machine
 * without needing a real PostgreSQL connection or filesystem.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock @verveai/common-node logger to avoid pino/winston clashes
vi.mock('@verveai/common-node', async () => {
  const actual = await vi.importActual<typeof import('@verveai/common-node')>(
    '@verveai/common-node',
  );
  return {
    ...actual,
  };
});

// Mock Prisma client
vi.mock('../../src/prisma/client', () => {
  const content_item = {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    groupBy: vi.fn(),
    updateMany: vi.fn(),
  };
  const review = {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    groupBy: vi.fn(),
  };
  const bundle = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    groupBy: vi.fn(),
  };
  const bundle_signature = {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
  };
  return {
    prisma: {
      content_item,
      review,
      bundle,
      bundle_signature,
      $transaction: vi.fn(),
      $queryRaw: vi.fn(),
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    },
    disconnectPrisma: vi.fn(),
  };
});

// Mock Ed25519 helpers so tests are deterministic and don't touch the disk
vi.mock('../../src/utils/ed25519', () => ({
  getOrCreateKeyPair: vi.fn(),
  computeHash: vi.fn(),
  sign: vi.fn(),
  verify: vi.fn(),
  publicKeyFingerprint: vi.fn(),
}));

// Mock logger to avoid noisy output
vi.mock('../../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    child: vi.fn().mockReturnThis(),
  },
  createChildLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

import * as bundleService from '../../src/services/bundle.service';
import { prisma } from '../../src/prisma/client';
import * as ed25519 from '../../src/utils/ed25519';

const mockPrisma = prisma as unknown as {
  bundle: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    groupBy: ReturnType<typeof vi.fn>;
  };
  content_item: {
    count: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    groupBy: ReturnType<typeof vi.fn>;
  };
  bundle_signature: {
    create: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('buildBundle', () => {
  it('creates a bundle when all content is APPROVED', async () => {
    mockPrisma.content_item.count.mockResolvedValueOnce(2);
    mockPrisma.bundle.create.mockResolvedValueOnce({
      id: 'b-1',
      name: 'My Bundle',
      version: '1.0.0',
      status: 'BUILT',
      content_ids: ['c-1', 'c-2'],
      created_at: new Date(),
      published_at: null,
      signatures: [],
    });

    const result = await bundleService.buildBundle({
      name: 'My Bundle',
      contentIds: ['c-1', 'c-2'],
    });

    expect(mockPrisma.content_item.count).toHaveBeenCalledWith({
      where: {
        id: { in: ['c-1', 'c-2'] },
        status: 'APPROVED',
        deleted_at: null,
      },
    });
    expect(result.status).toBe('BUILT');
    expect(result.name).toBe('My Bundle');
  });

  it('throws ConflictError when not all content is APPROVED', async () => {
    mockPrisma.content_item.count.mockResolvedValueOnce(1); // 1 of 2 is APPROVED
    await expect(
      bundleService.buildBundle({
        name: 'My Bundle',
        contentIds: ['c-1', 'c-2'],
      }),
    ).rejects.toThrow(/not APPROVED/);
  });

  it('rejects duplicate content IDs (extra ValidationError)', async () => {
    mockPrisma.content_item.count.mockResolvedValueOnce(2);
    await expect(
      bundleService.buildBundle({
        name: 'My Bundle',
        contentIds: ['c-1', 'c-1'],
      }),
    ).rejects.toThrow();
  });

  it('rejects invalid name (too short)', async () => {
    await expect(
      bundleService.buildBundle({ name: 'a', contentIds: ['c-1'] }),
    ).rejects.toThrow();
  });
});

describe('signBundle', () => {
  it('transitions BUILT → SIGNED and persists signature', async () => {
    const createdAt = new Date('2024-01-01T00:00:00Z');
    mockPrisma.bundle.findUnique.mockResolvedValueOnce({
      id: 'b-1',
      name: 'Test',
      version: '1.0.0',
      status: 'BUILT',
      content_ids: ['c-1'],
      created_at: createdAt,
      published_at: null,
    });

    vi.mocked(ed25519.computeHash).mockReturnValueOnce('abc123');
    vi.mocked(ed25519.getOrCreateKeyPair).mockResolvedValueOnce({
      publicKey: 'pub',
      privateKey: 'priv',
    });
    vi.mocked(ed25519.sign).mockReturnValueOnce('base64signature');
    vi.mocked(ed25519.publicKeyFingerprint).mockReturnValueOnce('fp');

    mockPrisma.bundle_signature.create.mockResolvedValueOnce({
      id: 'sig-1',
      bundle_id: 'b-1',
      public_key_fingerprint: 'fp',
      signature: 'base64signature',
      signed_at: new Date(),
    });
    mockPrisma.bundle.update.mockResolvedValueOnce({});

    const result = await bundleService.signBundle('b-1');

    expect(ed25519.computeHash).toHaveBeenCalled();
    expect(ed25519.sign).toHaveBeenCalledWith('priv', 'abc123');
    expect(ed25519.publicKeyFingerprint).toHaveBeenCalledWith('pub');
    expect(mockPrisma.bundle_signature.create).toHaveBeenCalledWith({
      data: {
        bundle_id: 'b-1',
        public_key_fingerprint: 'fp',
        signature: 'base64signature',
      },
    });
    expect(mockPrisma.bundle.update).toHaveBeenCalledWith({
      where: { id: 'b-1' },
      data: { status: 'SIGNED' },
    });
    expect(result.publicKeyFingerprint).toBe('fp');
    expect(result.signature).toBe('base64signature');
  });

  it('throws NotFoundError when bundle does not exist', async () => {
    mockPrisma.bundle.findUnique.mockResolvedValueOnce(null);
    await expect(bundleService.signBundle('missing')).rejects.toThrow(/Bundle.*not found/);
  });

  it('throws ConflictError when bundle is not in BUILT state', async () => {
    mockPrisma.bundle.findUnique.mockResolvedValueOnce({
      id: 'b-1',
      name: 'Test',
      version: '1.0.0',
      status: 'SIGNED',
      content_ids: ['c-1'],
      created_at: new Date(),
      published_at: null,
    });
    await expect(bundleService.signBundle('b-1')).rejects.toThrow(/cannot be signed/);
  });
});

describe('publishBundle', () => {
  it('transitions SIGNED → PUBLISHED and stamps published_at', async () => {
    mockPrisma.bundle.findUnique.mockResolvedValueOnce({
      id: 'b-1',
      name: 'Test',
      version: '1.0.0',
      status: 'SIGNED',
      content_ids: ['c-1'],
      created_at: new Date(),
      published_at: null,
      signatures: [{ id: 'sig-1', bundle_id: 'b-1', public_key_fingerprint: 'fp', signature: 'sig', signed_at: new Date() }],
    });

    mockPrisma.bundle.update.mockResolvedValueOnce({
      id: 'b-1',
      name: 'Test',
      version: '1.0.0',
      status: 'PUBLISHED',
      content_ids: ['c-1'],
      created_at: new Date(),
      published_at: new Date(),
      signatures: [],
    });

    const result = await bundleService.publishBundle('b-1');
    expect(result.status).toBe('PUBLISHED');
    expect(mockPrisma.bundle.update).toHaveBeenCalled();
    const callArgs = mockPrisma.bundle.update.mock.calls[0]?.[0] as { data: { status: string; published_at: Date } };
    expect(callArgs.data.status).toBe('PUBLISHED');
    expect(callArgs.data.published_at).toBeInstanceOf(Date);
  });

  it('throws ConflictError when no signatures exist', async () => {
    mockPrisma.bundle.findUnique.mockResolvedValueOnce({
      id: 'b-1',
      name: 'Test',
      version: '1.0.0',
      status: 'SIGNED',
      content_ids: ['c-1'],
      created_at: new Date(),
      published_at: null,
      signatures: [],
    });
    await expect(bundleService.publishBundle('b-1')).rejects.toThrow(/no signatures/);
  });

  it('throws ConflictError when bundle is not SIGNED', async () => {
    mockPrisma.bundle.findUnique.mockResolvedValueOnce({
      id: 'b-1',
      name: 'Test',
      version: '1.0.0',
      status: 'BUILT',
      content_ids: ['c-1'],
      created_at: new Date(),
      published_at: null,
      signatures: [{ id: 'sig-1', bundle_id: 'b-1', public_key_fingerprint: 'fp', signature: 'sig', signed_at: new Date() }],
    });
    await expect(bundleService.publishBundle('b-1')).rejects.toThrow(/cannot be published/);
  });

  it('throws NotFoundError when bundle missing', async () => {
    mockPrisma.bundle.findUnique.mockResolvedValueOnce(null);
    await expect(bundleService.publishBundle('missing')).rejects.toThrow();
  });
});

describe('getBundle', () => {
  it('returns the bundle with signatures', async () => {
    mockPrisma.bundle.findUnique.mockResolvedValueOnce({
      id: 'b-1',
      name: 'Test',
      version: '1.0.0',
      status: 'SIGNED',
      content_ids: ['c-1'],
      created_at: new Date(),
      published_at: null,
      signatures: [
        {
          id: 'sig-1',
          bundle_id: 'b-1',
          public_key_fingerprint: 'fp',
          signature: 'sig',
          signed_at: new Date(),
        },
      ],
    });
    const result = await bundleService.getBundle('b-1');
    expect(result).not.toBeNull();
    expect(result?.signatures).toHaveLength(1);
  });

  it('returns null when bundle not found', async () => {
    mockPrisma.bundle.findUnique.mockResolvedValueOnce(null);
    const result = await bundleService.getBundle('missing');
    expect(result).toBeNull();
  });
});

describe('listBundles', () => {
  it('returns paginated result with default pagination', async () => {
    mockPrisma.bundle.findMany.mockResolvedValueOnce([
      {
        id: 'b-1',
        name: 'B1',
        version: '1.0.0',
        status: 'BUILT',
        content_ids: ['c-1'],
        created_at: new Date(),
        published_at: null,
        _count: { signatures: 0 },
      },
    ]);
    mockPrisma.bundle.count.mockResolvedValueOnce(1);

    const result = await bundleService.listBundles({});
    expect(result.items).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.hasPrev).toBe(false);
  });

  it('coerces string pagination params', async () => {
    mockPrisma.bundle.findMany.mockResolvedValueOnce([]);
    mockPrisma.bundle.count.mockResolvedValueOnce(0);

    await bundleService.listBundles({ skip: '0', take: '10' } as unknown as Record<string, unknown>);
    expect(mockPrisma.bundle.findMany).toHaveBeenCalled();
  });

  it('rejects invalid pagination (negative take)', async () => {
    await expect(
      bundleService.listBundles({ skip: 0, take: 0 }),
    ).rejects.toThrow();
  });
});
