/**
 * VERVEAI — Classes list page (⑦ — web-portal).
 *
 * Shows all classes owned by the signed-in teacher. Clicking a row
 * navigates to `/teacher/classes/:id` which renders the class detail
 * with enrolled students.
 */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { ApiError } from '@/lib/api/apiClient';
import { listClasses, type ClassSummary } from '@/lib/api/classes';

export default function ClassesListPage() {
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listClasses()
      .then((result) => {
        if (!cancelled) {
          setClasses(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load classes');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {classes.length} {classes.length === 1 ? 'class' : 'classes'} available
          </p>
        </div>
      </header>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Students</th>
              <th className="px-4 py-3 font-medium text-right">Open</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-8 text-center text-muted-foreground" colSpan={4}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && classes.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-muted-foreground" colSpan={4}>
                  No classes found.
                </td>
              </tr>
            )}
            {!loading &&
              classes.map((cls) => (
                <tr key={cls.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{cls.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {cls.subject ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {cls.studentCount ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/teacher/classes/${encodeURIComponent(cls.id)}`}
                      className="text-primary hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
