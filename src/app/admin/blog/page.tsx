'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/auth-context';
import { isAdminEmail } from '@/lib/admin';
import type { CandidatePost } from '@/lib/blog-candidates';

export default function AdminBlogPage() {
  return (
    <AuthGuard>
      <AdminBlogInner />
    </AuthGuard>
  );
}

function AdminBlogInner() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<CandidatePost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => setCandidates(data.candidates))
      .catch((e) => setError(String(e)));
  }, []);

  if (!isAdminEmail(user?.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Not authorized</h1>
          <p className="text-muted text-sm">
            Signed in as <code>{user?.email}</code>. Add your email to{' '}
            <code>NEXT_PUBLIC_ADMIN_EMAILS</code> in <code>.env.local</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">BTS — Blog</h1>
        <p className="text-muted text-sm mt-1">
          Drafts auto-captured from the notepad pipeline. Review, edit, publish.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4 text-sm">
          {error}
        </div>
      )}

      {candidates === null ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : candidates.length === 0 ? (
        <p className="text-muted text-sm">
          No candidates. Sync drafts with{' '}
          <code>~/.claude/skills/notepad/bin/notepad-sync</code>.
        </p>
      ) : (
        <ul className="space-y-3">
          {candidates.map((c) => (
            <li
              key={c.filename}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 hover:border-[var(--accent)] transition"
            >
              <div className="flex items-baseline justify-between gap-4">
                <Link
                  href={`/admin/blog/${c.slug}`}
                  className="text-base font-semibold hover:text-[var(--accent)] transition"
                >
                  {c.title}
                </Link>
                <div className="text-xs text-muted shrink-0">
                  {c.date} · {c.authored ? 'authored' : c.source ?? 'imported'}
                </div>
              </div>
              {c.excerpt && (
                <p className="text-sm text-muted mt-2 line-clamp-2">
                  {c.excerpt}
                </p>
              )}
              {c.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 text-xs rounded border border-[var(--card-border)] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
