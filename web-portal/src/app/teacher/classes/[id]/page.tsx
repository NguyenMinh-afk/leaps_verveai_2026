/**
 * VERVEAI — Class detail + enrolled students (⑦ — web-portal).
 */

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { ApiError } from '@/lib/api/apiClient';
import {
  getClass,
  getClassStats,
  listClassStudents,
  type ClassDetail,
  type StudentSummary,
} from '@/lib/api/classes';

interface ClassStats {
  studentCount: number;
  averageMastery: number | null;
}

export default function ClassDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    Promise.all([getClass(id), getClassStats(id).catch(() => null), listClassStudents(id).catch(() => [])])
      .then(([detail, stat, roster]) => {
        if (cancelled) return;
        setClassDetail(detail);
        setStudents(roster);
        setStats(stat);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load class');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <AppShell>
      <div className="mb-6">
        <Link href="/teacher/classes" className="text-sm text-primary hover:underline">
          ← All classes
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {classDetail && (
        <>
          <header>
            <h1 className="text-3xl font-bold text-foreground">{classDetail.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Subject: {classDetail.subject ?? '—'}
            </p>
          </header>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatPill label="Students" value={stats?.studentCount ?? '—'} />
            <StatPill
              label="Average mastery"
              value={
                stats?.averageMastery === null || stats?.averageMastery === undefined
                  ? '—'
                  : `${(stats.averageMastery * 100).toFixed(0)}%`
              }
            />
            <StatPill label="Subject" value={classDetail.subject ?? '—'} />
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Enrolled students</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Student roster is sourced from svc-class. Per-student progress
              lives at <Link href="/teacher/skills" className="text-primary hover:underline">/teacher/skills</Link>.
            </p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {students.length === 0 && (
                <li className="text-sm text-muted-foreground">No students enrolled yet.</li>
              )}
              {students.map((s) => (
                <li
                  key={s.id}
                  className="rounded-md border border-border bg-background px-4 py-3"
                >
                  <p className="font-medium">{s.name}</p>
                  {s.email && (
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </AppShell>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
