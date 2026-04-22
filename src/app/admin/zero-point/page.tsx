'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/auth-context';
import { isAdminEmail } from '@/lib/admin';

interface WaitlistRow {
    key: string;
    email: string;
    source: string;
    createdAt: number;
}

interface SiteRow {
    slug: string;
    templateId: string;
    createdAt?: number;
    updatedAt?: number;
}

interface Payload {
    waitlist: WaitlistRow[];
    sites: SiteRow[];
    counts: { waitlist: number; sites: number };
}

function formatDate(ts?: number): string {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export default function AdminZeroPointPage() {
    return (
        <AuthGuard>
            <AdminZeroPointInner />
        </AuthGuard>
    );
}

function AdminZeroPointInner() {
    const { user } = useAuth();
    const [data, setData] = useState<Payload | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refreshTick, setRefreshTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/admin/zero-point')
            .then((r) => r.json())
            .then((d) => {
                if (!cancelled) setData(d as Payload);
            })
            .catch((e) => {
                if (!cancelled) setError(String(e));
            });
        return () => {
            cancelled = true;
        };
    }, [refreshTick]);

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
        <main className="max-w-5xl mx-auto px-6 py-16">
            <header className="mb-10 flex items-baseline justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">BTS — Zero-Point</h1>
                    <p className="text-muted text-sm mt-1">
                        Early-access waitlist + generated sites.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setRefreshTick((n) => n + 1)}
                    className="text-xs text-muted hover:text-[var(--foreground)] transition-colors"
                >
                    ↻ refresh
                </button>
            </header>

            {error && (
                <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4 text-sm">
                    {error}
                </div>
            )}

            <section className="mb-12">
                <h2 className="text-xs tracking-[0.2em] uppercase text-muted mb-4">Quick links</h2>
                <ul className="text-sm flex flex-wrap gap-x-6 gap-y-2">
                    <li>
                        <Link href="/intake/zero-point" className="text-[var(--accent)] hover:underline">
                            /intake/zero-point
                        </Link>
                        <span className="text-muted"> — walk the generator flow</span>
                    </li>
                    <li>
                        <Link href="/zero-point" className="text-[var(--accent)] hover:underline">
                            /zero-point
                        </Link>
                        <span className="text-muted"> — public early-access landing</span>
                    </li>
                    <li>
                        <Link href="/design-system" className="text-[var(--accent)] hover:underline">
                            /design-system
                        </Link>
                        <span className="text-muted"> — component catalogue</span>
                    </li>
                </ul>
            </section>

            {data === null ? (
                <p className="text-muted text-sm">Loading…</p>
            ) : (
                <div className="space-y-16">
                    <section>
                        <div className="flex items-baseline justify-between mb-6">
                            <h2 className="text-xl font-bold">Waitlist</h2>
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">
                                {data.counts.waitlist} {data.counts.waitlist === 1 ? 'signup' : 'signups'}
                            </span>
                        </div>
                        {data.waitlist.length === 0 ? (
                            <p className="text-muted text-sm">No signups yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--card-border)]">
                                            <th className="text-left py-3 px-4 font-semibold">Email</th>
                                            <th className="text-left py-3 px-4 font-semibold">Source</th>
                                            <th className="text-left py-3 px-4 font-semibold">Signed up</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.waitlist.map((row) => (
                                            <tr
                                                key={row.key}
                                                className="border-b border-[var(--card-border)]"
                                            >
                                                <td className="py-3 px-4 font-mono text-xs">{row.email}</td>
                                                <td className="py-3 px-4 text-muted">{row.source}</td>
                                                <td className="py-3 px-4 text-muted">
                                                    {formatDate(row.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="flex items-baseline justify-between mb-6">
                            <h2 className="text-xl font-bold">Generated sites</h2>
                            <span className="text-xs tracking-[0.2em] uppercase text-muted">
                                {data.counts.sites} {data.counts.sites === 1 ? 'site' : 'sites'}
                            </span>
                        </div>
                        {data.sites.length === 0 ? (
                            <p className="text-muted text-sm">
                                No sites yet. Walk the intake at{' '}
                                <Link
                                    href="/intake/zero-point"
                                    className="text-[var(--accent)] hover:underline"
                                >
                                    /intake/zero-point
                                </Link>
                                .
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--card-border)]">
                                            <th className="text-left py-3 px-4 font-semibold">Slug</th>
                                            <th className="text-left py-3 px-4 font-semibold">Template</th>
                                            <th className="text-left py-3 px-4 font-semibold">Created</th>
                                            <th className="text-left py-3 px-4 font-semibold">Preview</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.sites.map((row) => (
                                            <tr
                                                key={row.slug}
                                                className="border-b border-[var(--card-border)]"
                                            >
                                                <td className="py-3 px-4 font-mono text-xs">
                                                    {row.slug}
                                                </td>
                                                <td className="py-3 px-4 text-muted">
                                                    {row.templateId}
                                                </td>
                                                <td className="py-3 px-4 text-muted">
                                                    {formatDate(row.createdAt)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Link
                                                        href={`/hosted/${row.slug}`}
                                                        className="text-[var(--accent)] hover:underline"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        open ↗
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                </div>
            )}
        </main>
    );
}
