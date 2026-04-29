'use client';

import { SUB_PROJECTS } from './data';

interface DashboardHeaderProps {
    userEmail?: string | null;
    onReset: () => void;
}

export default function DashboardHeader({ userEmail, onReset }: DashboardHeaderProps) {
    const total = SUB_PROJECTS.length;
    const inFlight = SUB_PROJECTS.filter(
        (sp) => sp.status === 'in-review' || sp.status === 'in-progress' || sp.status === 'next',
    ).length;
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <section className="px-8 lg:px-12 pt-12 pb-8">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
                    Build status
                </p>
                <button
                    type="button"
                    onClick={() => {
                        if (
                            typeof window !== 'undefined' &&
                            window.confirm('Reset all checkbox state?')
                        ) {
                            onReset();
                        }
                    }}
                    className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-[var(--accent)] transition-colors"
                >
                    Reset checks
                </button>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                nertia — dev dashboard.
            </h1>
            <p className="text-base text-muted leading-relaxed max-w-2xl mb-6">
                Living punch list for the production-engineering-studio
                pivot. Two lanes — Scott (admin) and Claude (code) — plus the
                six sub-projects, what shipped, what&apos;s blocked, and quick
                links. Edit the data file (<code>src/components/dashboard/data.ts</code>) to update.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted font-mono">
                <span>{today}</span>
                <span>
                    Pivot: {inFlight}/{total} in flight
                </span>
                {userEmail && <span>Signed in: {userEmail}</span>}
            </div>
        </section>
    );
}
