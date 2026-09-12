/**
 * Ed25519 helpers for bundle signing (TS-19/TS-20).
 *
 * - getOrCreateKeyPair: load from PEM files, generate if absent
 * - computeHash: SHA-256 of content string
 * - sign: Ed25519 signature in base64
 * - verify: verify Ed25519 signature
 */

import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Resolve the key directory at call time so tests can override
 * `process.env['KEYS_DIR']` in `beforeAll` (the module is already
 * imported by then, so a module-level `const` would have frozen the
 * default `/app/keys` path).
 */
function keysDir(): string {
  return process.env['KEYS_DIR'] ?? '/app/keys';
}

const PRIV_FILENAME = 'private.pem';
const PUB_FILENAME = 'public.pem';

function privPath(): string {
  return path.join(keysDir(), PRIV_FILENAME);
}

function pubPath(): string {
  return path.join(keysDir(), PUB_FILENAME);
}

/**
 * Load Ed25519 key pair from PEM files, creating them if absent.
 * Private key is saved with mode 0o600 (owner read/write only).
 * Public key is saved with mode 0o644 (world readable).
 */
export async function getOrCreateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const priv = privPath();
  const pub = pubPath();

  try {
    const [privateKey, publicKey] = await Promise.all([
      fs.readFile(priv, 'utf-8'),
      fs.readFile(pub, 'utf-8'),
    ]);
    return { publicKey, privateKey };
  } catch {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    const privPem = privateKey.export({ format: 'pem', type: 'pkcs8' }).toString();
    const pubPem = publicKey.export({ format: 'pem', type: 'spki' }).toString();
    await fs.mkdir(keysDir(), { recursive: true });
    await fs.writeFile(priv, privPem, { mode: 0o600 });
    await fs.writeFile(pub, pubPem, { mode: 0o644 });
    return { publicKey: pubPem, privateKey: privPem };
  }
}

/**
 * Compute SHA-256 hex digest of the given content string.
 */
export function computeHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

/**
 * Sign content with an Ed25519 private key.
 * Returns the signature encoded as base64.
 */
export function sign(privateKeyPem: string, content: string): string {
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return crypto.sign(null, Buffer.from(content, 'utf-8'), privateKey).toString('base64');
}

/**
 * Verify an Ed25519 signature over content using a public key.
 * Returns true if valid, false otherwise (including malformed inputs).
 */
export function verify(publicKeyPem: string, content: string, signature: string): boolean {
  try {
    const publicKey = crypto.createPublicKey(publicKeyPem);
    return crypto.verify(
      null,
      Buffer.from(content, 'utf-8'),
      publicKey,
      Buffer.from(signature, 'base64'),
    );
  } catch {
    return false;
  }
}

/**
 * Derive a short SHA-256 fingerprint of a public key.
 * Takes the first 32 hex characters of the SHA-256 SPKI digest.
 */
export function publicKeyFingerprint(publicKeyPem: string): string {
  return crypto
    .createHash('sha256')
    .update(publicKeyPem)
    .digest('hex')
    .slice(0, 32);
}
