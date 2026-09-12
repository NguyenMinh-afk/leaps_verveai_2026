/**
 * VERVEAI — Dashboard page (⑥ — web-portal).
 *
 * Aggregated stats: total classes, total students, pending interventions,
 * total skills. Pulled from Gateway via svc-class + svc-bkt.
 *
 * Falls back to mock data when the API is unreachable so the page
 * remains demoable offline.
 */

'use client';

import { useEffect, useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { ApiError, api, getGatewayUrl } from '@/lib/api/apiClient';
import type { DashboardStats } from '@/types';

const FALLBACK_STATS: DashboardStats = {
  classCount: 0,
  studentCount: 0,
  pendingInterventions: 0,
  skillCount: 0,
};

async function fetchStats(): Promise<DashboardStats> {
  const [classes, skills] = await Promise.all([
    api.get<unknown[]>('/api/class/classes').catch(() => []),
    api.get<unknown[]>('/api/bkt/skills').catch(() => []),
  ]);
  return {
    classCount: Array.isArray(classes) ? classes.length : 0,
    studentCount: 0,
    pendingInterventions: 0,
    skillCount: Array.isArray(skills) ? skills.length : 0,
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(FALLBACK_STATS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchStats()
      .then((result) => {
        if (!cancelled) {
          setStats(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load dashboard');
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
      <h1 className="text-3xl font-bold text-foreground">Teacher dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Gateway endpoint: <code className="text-xs">{getGatewayUrl()}</code>
      </p>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}. Showing last known values.
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Classes" value={stats.classCount} loading={loading} />
        <StatCard label="Students" value={stats.studentCount} loading={loading} />
        <StatCard
          label="Pending interventions"
          value={stats.pendingInterventions}
          loading={loading}
        />
        <StatCard label="Skills" value={stats.skillCount} loading={loading} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Quick links</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li>
            <a
              href="/teacher/classes"
              className="block rounded-md border border-border bg-background px-4 py-3 hover:bg-accent transition-colors"
            >
              Browse classes and students →
            </a>
          </li>
          <li>
            <a
              href="/teacher/skills"
              className="block rounded-md border border-border bg-background px-4 py-3 hover:bg-accent transition-colors"
            >
              Inspect skill tree →
            </a>
          </li>
          <li>
            <a
              href="/teacher/items"
              className="block rounded-md border border-border bg-background px-4 py-3 hover:bg-accent transition-colors"
            >
              Review content items →
            </a>
          </li>
        </ul>
      </section>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">
        {loading ? <span className="text-muted-foreground">…</span> : value}
      </p>
    </div>
  );
}
