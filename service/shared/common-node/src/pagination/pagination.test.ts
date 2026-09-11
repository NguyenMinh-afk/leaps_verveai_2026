import { describe, it, expect } from 'vitest';
import {
  buildPrismaOffset,
  buildPrismaTake,
  buildCursor,
  parseCursor,
  buildPrismaCursor,
  computePagination,
} from '../src/pagination';

describe('pagination', () => {
  describe('buildPrismaOffset', () => {
    it('should compute correct offset for page 1', () => {
      expect(buildPrismaOffset(1, 20)).toBe(0);
    });

    it('should compute correct offset for page 3', () => {
      expect(buildPrismaOffset(3, 20)).toBe(40);
    });

    it('should treat page 0 as page 1', () => {
      expect(buildPrismaOffset(0, 20)).toBe(0);
    });

    it('should treat negative page as page 1', () => {
      expect(buildPrismaOffset(-5, 20)).toBe(0);
    });
  });

  describe('buildPrismaTake', () => {
    it('should cap at maxPageSize', () => {
      expect(buildPrismaTake(200, 100)).toBe(100);
    });

    it('should handle negative values', () => {
      expect(buildPrismaTake(-5)).toBe(1);
    });
  });

  describe('cursor round-trip', () => {
    it('should encode and decode UUID correctly', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const cursor = buildCursor(id);
      expect(parseCursor(cursor)).toBe(id);
    });

    it('should produce URL-safe base64', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const cursor = buildCursor(id);
      expect(/^[A-Za-z0-9_-]+$/.test(cursor)).toBe(true);
    });
  });

  describe('computePagination', () => {
    it('should compute meta for first page', () => {
      const meta = computePagination(1, 20, 100);
      expect(meta.hasNext).toBe(true);
      expect(meta.hasPrev).toBe(false);
      expect(meta.totalPages).toBe(5);
    });

    it('should compute meta for last page', () => {
      const meta = computePagination(5, 20, 100);
      expect(meta.hasNext).toBe(false);
      expect(meta.hasPrev).toBe(true);
    });

    it('should compute meta for single page', () => {
      const meta = computePagination(1, 20, 5);
      expect(meta.hasNext).toBe(false);
      expect(meta.hasPrev).toBe(false);
      expect(meta.totalPages).toBe(1);
    });

    it('should handle empty results', () => {
      const meta = computePagination(1, 20, 0);
      expect(meta.totalPages).toBe(1);
      expect(meta.hasNext).toBe(false);
      expect(meta.hasPrev).toBe(false);
    });
  });
});
