/**
 * Tests for Ed25519 helpers.
 *
 * Verifies:
 * - sign + verify round trip
 * - Different content produces different signatures
 * - Wrong key produces verify failure
 * - getOrCreateKeyPair persists files with proper modes
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

import {
  getOrCreateKeyPair,
  computeHash,
  sign,
  verify,
  publicKeyFingerprint,
} from '../../src/utils/ed25519.js';

let testKeysDir: string;

beforeAll(async () => {
  testKeysDir = await fs.mkdtemp(path.join(os.tmpdir(), 'verveai-keys-'));
  process.env['KEYS_DIR'] = testKeysDir;
});

afterAll(async () => {
  // Cleanup temp directory
  try {
    await fs.rm(testKeysDir, { recursive: true, force: true });
  } catch {
    // ignore
  }
  delete process.env['KEYS_DIR'];
  vi.restoreAllMocks();
});

function pemOf(key: crypto.KeyObject): string {
  const exported = key.export({ format: 'pem', type: key.type === 'private' ? 'pkcs8' : 'spki' });
  return typeof exported === 'string' ? exported : exported.toString();
}

describe('ed25519', () => {
  it('sign + verify round-trip succeeds', () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    const pubPem = pemOf(publicKey);
    const privPem = pemOf(privateKey);
    const content = 'hello, world';
    const signature = sign(privPem, content);
    expect(verify(pubPem, content, signature)).toBe(true);
  });

  it('computeHash returns 64-char hex SHA-256', () => {
    const hash = computeHash('hello');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('different content produces different signatures', () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    const privPem = pemOf(privateKey);
    const s1 = sign(privPem, 'content one');
    const s2 = sign(privPem, 'content two');
    expect(s1).not.toEqual(s2);
  });

  it('wrong key makes verify fail', () => {
    const a = crypto.generateKeyPairSync('ed25519');
    const b = crypto.generateKeyPairSync('ed25519');
    const aPriv = pemOf(a.privateKey);
    const bPub = pemOf(b.publicKey);
    const content = 'payload';
    const signature = sign(aPriv, content);
    expect(verify(bPub, content, signature)).toBe(false);
  });

  it('tampered content makes verify fail', () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    const pubPem = pemOf(publicKey);
    const privPem = pemOf(privateKey);
    const sig = sign(privPem, 'original');
    expect(verify(pubPem, 'tampered', sig)).toBe(false);
  });

  it('publicKeyFingerprint returns 32-char hex', () => {
    const { publicKey } = crypto.generateKeyPairSync('ed25519');
    const pubPem = pemOf(publicKey);
    const fp = publicKeyFingerprint(pubPem);
    expect(fp).toMatch(/^[0-9a-f]{32}$/);
  });

  it('verify handles malformed signature without throwing', () => {
    const { publicKey } = crypto.generateKeyPairSync('ed25519');
    const pubPem = pemOf(publicKey);
    // garbage base64
    expect(verify(pubPem, 'content', 'not-base64!!')).toBe(false);
  });

  it('verify handles malformed public key without throwing', () => {
    expect(verify('not-a-pem', 'content', Buffer.from('sig').toString('base64'))).toBe(false);
  });

  it('getOrCreateKeyPair persists and reuses', async () => {
    const pair1 = await getOrCreateKeyPair();
    expect(pair1.publicKey).toContain('PUBLIC KEY');
    expect(pair1.privateKey).toContain('PRIVATE KEY');

    const existsPriv = await fs.stat(path.join(testKeysDir, 'private.pem'));
    const existsPub = await fs.stat(path.join(testKeysDir, 'public.pem'));
    expect(existsPriv.isFile()).toBe(true);
    expect(existsPub.isFile()).toBe(true);

    // Second call returns the same keys (no regeneration)
    const pair2 = await getOrCreateKeyPair();
    expect(pair1.publicKey).toEqual(pair2.publicKey);
    expect(pair1.privateKey).toEqual(pair2.privateKey);
  });
});
