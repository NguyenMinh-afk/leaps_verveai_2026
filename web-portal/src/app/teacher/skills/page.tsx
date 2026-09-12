/**
 * VERVEAI — Skills browser (⑧ — web-portal).
 *
 * Lists skills from svc-bkt (via Gateway) and exposes difficulty + prereq
 * metadata. Used by teachers to inspect the knowledge graph.
 */

'use client';

import { useEffect, useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { ApiError } from '@/lib/api/apiClient';
import { listSkills, type Skill } from '@/lib/api/content';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listSkills()
      .then((result) => {
        if (!cancelled) {
          setSkills(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load skills');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = filter.trim()
    ? skills.filter(
        (s) =>
          s.name.toLowerCase().includes(filter.toLowerCase()) ||
          s.code.toLowerCase().includes(filter.toLowerCase()),
      )
    : skills;

  return (
    <AppShell>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Knowledge graph sourced from svc-bkt.
          </p>
        </div>
        <input
          type="search"
          placeholder="Filter by name or code…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </header>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-sm text-muted-foreground col-span-full">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">
            No skills match the current filter.
          </p>
        )}
        {filtered.map((skill) => (
          <article
            key={skill.id}
            className="rounded-lg border border-border bg-background p-4"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">{skill.name}</h2>
                <p className="text-xs text-muted-foreground">code: {skill.code}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Difficulty {skill.difficulty}
              </span>
            </header>
            {skill.description && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                {skill.description}
              </p>
            )}
            {skill.prereqSkills.length > 0 && (
              <footer className="mt-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Prereqs</p>
                <p className="mt-1 text-xs text-foreground">
                  {skill.prereqSkills.length} prerequisite skill(s)
                </p>
              </footer>
            )}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
