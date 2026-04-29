'use client';

import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/auth-context';
import { isAdminEmail } from '@/lib/admin';
import PageTemplate from '@/components/PageTemplate';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubProjectsGrid from '@/components/dashboard/SubProjectsGrid';
import Lane from '@/components/dashboard/Lane';
import DoneList from '@/components/dashboard/DoneList';
import BlockersTable from '@/components/dashboard/BlockersTable';
import QuickLinks from '@/components/dashboard/QuickLinks';
import {
    SUB_PROJECTS,
    TODAY_LANES,
    DONE,
    BLOCKERS,
    QUICK_LINKS,
} from '@/components/dashboard/data';
import { useChecklistState } from '@/hooks/useChecklistState';

export default function DashboardPage() {
    return (
        <AuthGuard>
            <Inner />
        </AuthGuard>
    );
}

function Inner() {
    const { user } = useAuth();
    const { isChecked, toggle, reset, hydrated } = useChecklistState();

    if (!isAdminEmail(user?.email)) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <p className="text-sm text-muted">
                    Signed in as <code>{user?.email}</code>. Not authorized.
                </p>
            </div>
        );
    }

    return (
        <PageTemplate>
            <DashboardHeader userEmail={user?.email} onReset={reset} />

            <SubProjectsGrid subProjects={SUB_PROJECTS} />

            <section
                id="today"
                className="px-8 lg:px-12 py-12 border-t border-[var(--card-border)]"
            >
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
                        Today
                    </p>
                    <h2 className="text-2xl font-bold">
                        Two lanes.
                    </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {TODAY_LANES.map((lane) => (
                        <Lane
                            key={lane.id}
                            lane={lane}
                            isChecked={isChecked}
                            toggle={toggle}
                            hydrated={hydrated}
                        />
                    ))}
                </div>
            </section>

            <BlockersTable blockers={BLOCKERS} />
            <DoneList items={DONE} />
            <QuickLinks links={QUICK_LINKS} />

            <section className="px-8 lg:px-12 py-12 border-t border-[var(--card-border)]">
                <p className="text-xs text-muted leading-relaxed max-w-2xl">
                    Edit the dashboard at{' '}
                    <code>src/components/dashboard/data.ts</code> — that file
                    holds all sub-project state, today&apos;s lanes, the
                    historical checklist, blockers, and quick links. Checkbox
                    state lives in browser localStorage under{' '}
                    <code>nertia-dashboard-checklist</code>.
                </p>
            </section>
        </PageTemplate>
    );
}
