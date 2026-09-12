/**
 * VERVEAI — Content Items browser (⑧ — web-portal).
 *
 * Lists content items from svc-content (via Gateway). Allows filtering
 * by `type` and `status`. Reviewers can drill into items.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { ApiError } from '@/lib/api/apiClient';
import { listContent, type ContentItem, type ContentStatus, type ContentType } from '@/lib/api/content';

const STATUS_OPTIONS: { value: ContentStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'IN_REVIEW', label: 'In review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const TYPE_OPTIONS: { value: ContentType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All types' },
  { value: 'QUESTION', label: 'Question' },
  { value: 'EXPLANATION', label: 'Explanation' },
  { value: 'EXAMPLE', label: 'Example' },
  { value: 'EXERCISE', label: 'Exercise' },
];

export default function ItemsPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<ContentType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params: { type?: ContentType; status?: ContentStatus } = {};
    if (typeFilter !== 'ALL') params.type = typeFilter;
    if (statusFilter !== 'ALL') params.status = statusFilter;

    listContent(params)
      .then((result) => {
        if (!cancelled) {
          setItems(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load content');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [typeFilter, statusFilter]);

  const grouped = useMemo(() => {
    const buckets: Record<ContentStatus, ContentItem[]> = {
      DRAFT: [],
      IN_REVIEW: [],
      APPROVED: [],
      PUBLISHED: [],
      ARCHIVED: [],
    };
    for (const item of items) {
      if (buckets[item.status]) {
        buckets[item.status].push(item);
      }
    }
    return buckets;
  }, [items]);

  return (
    <AppShell>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content items</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse, filter and inspect items from svc-content.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ContentType | 'ALL')}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'ALL')}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="mt-6 space-y-6">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">No content items match.</p>
        )}
        {STATUS_OPTIONS.filter((o) => o.value !== 'ALL').map((opt) => {
          const list = grouped[opt.value as ContentStatus] ?? [];
          if (list.length === 0) return null;
          return (
            <div key={opt.value}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {opt.label} ({list.length})
              </h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-md border border-border bg-background p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.title}</p>
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {item.type}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Difficulty {item.difficulty} · updated{' '}
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
