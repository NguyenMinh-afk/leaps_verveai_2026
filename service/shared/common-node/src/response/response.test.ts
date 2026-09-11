import { describe, it, expect } from 'vitest';
import {
  success,
  error,
  paginate,
  parsePagination,
} from '../src/response';

describe('response', () => {
  describe('success', () => {
    it('should return success shape with data', () => {
      const res = success({ id: '123', name: 'Alice' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual({ id: '123', name: 'Alice' });
      expect(res.error).toBeNull();
    });

    it('should work with null data', () => {
      const res = success(null);
      expect(res.success).toBe(true);
      expect(res.data).toBeNull();
    });

    it('should work with array data', () => {
      const res = success([1, 2, 3]);
      expect(res.success).toBe(true);
      expect(res.data).toEqual([1, 2, 3]);
    });
  });

  describe('error', () => {
    it('should return error shape with code and message', () => {
      const res = error('VALIDATION_FAILED', 'Email is invalid');
      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('VALIDATION_FAILED');
      expect(res.error?.message).toBe('Email is invalid');
      expect(res.error?.details).toBeUndefined();
    });

    it('should include details when provided', () => {
      const details = [{ path: 'email', message: 'Invalid format' }];
      const res = error('VALIDATION_FAILED', 'Validation failed', details);
      expect(res.error?.details).toEqual(details);
    });
  });

  describe('paginate', () => {
    it('should build correct meta for page 1 of 5', () => {
      const items = [{ id: '1' }, { id: '2' }];
      const res = paginate(items, 1, 2, 10);
      expect(res.data).toEqual(items);
      expect(res.meta.page).toBe(1);
      expect(res.meta.pageSize).toBe(2);
      expect(res.meta.total).toBe(10);
      expect(res.meta.totalPages).toBe(5);
      expect(res.meta.hasNext).toBe(true);
      expect(res.meta.hasPrev).toBe(false);
    });

    it('should build correct meta for page 3 of 5', () => {
      const res = paginate(['a'], 3, 2, 10);
      expect(res.meta.hasNext).toBe(true);
      expect(res.meta.hasPrev).toBe(true);
    });

    it('should handle last page correctly', () => {
      const res = paginate(['a'], 5, 2, 10);
      expect(res.meta.hasNext).toBe(false);
      expect(res.meta.hasPrev).toBe(true);
    });

    it('should handle empty results', () => {
      const res = paginate([], 1, 10, 0);
      expect(res.meta.totalPages).toBe(1);
      expect(res.meta.hasNext).toBe(false);
      expect(res.meta.hasPrev).toBe(false);
    });
  });

  describe('parsePagination', () => {
    it('should parse valid page and pageSize', () => {
      const { page, pageSize } = parsePagination({ page: '3', pageSize: '25' });
      expect(page).toBe(3);
      expect(pageSize).toBe(25);
    });

    it('should default page to 1 for missing/invalid values', () => {
      const { page, pageSize } = parsePagination({});
      expect(page).toBe(1);
      expect(pageSize).toBe(20);
    });

    it('should cap pageSize at 100', () => {
      const { pageSize } = parsePagination({ pageSize: '500' });
      expect(pageSize).toBe(100);
    });

    it('should handle negative values', () => {
      const { page, pageSize } = parsePagination({ page: '-5', pageSize: '-1' });
      expect(page).toBe(1);
      expect(pageSize).toBe(20);
    });
  });
});
