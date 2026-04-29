import Link from 'next/link';
import type { SubProject, SubProjectStatus } from './data';

interface SubProjectsGridProps {
    subProjects: SubProject[];
}

const STATUS_LABEL: Record<SubProjectStatus, string> = {
    'in-review': 'In review',
    'in-progress': 'In progress',
    next: 'Up next',
    queued: 'Queued',
    done: 'Done',
};

const STATUS_TONE: Record<SubProjectStatus, string> = {
    'in-review': 'border-yellow-500/40 text-yellow-400',
    'in-progress': 'border-[var(--accent)] text-[var(--accent)]',
    next: 'border-blue-500/40 text-blue-400',
    queued: 'border-[var(--card-border)] text-muted',
    done: 'border-[var(--accent)] text-[var(--accent)]',
};

export default function SubProjectsGrid({ subProjects }: SubProjectsGridProps) {
    return (
        <section
            id="sub-projects"
            className="px-8 lg:px-12 py-12 border-t border-[var(--card-border)]"
        >
            <div className="flex items-baseline justify-between gap-4 mb-8">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
                        Pivot
                    </p>
                    <h2 className="text-2xl font-bold">
                        Six sub-projects.
                    </h2>
                </div>
                <p className="text-sm text-muted">
                    Each ships on its own branch + PR.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subProjects.map((sp) => (
                    <SubProjectCard key={sp.id} sp={sp} />
                ))}
            </div>
        </section>
    );
}

function SubProjectCard({ sp }: { sp: SubProject }) {
    const tone = STATUS_TONE[sp.status];
    return (
        <div className="flex flex-col gap-3 p-5 border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors">
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted font-mono">
                    {String(sp.number).padStart(2, '0')}
                </span>
                <span
                    className={`text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border ${tone}`}
                >
                    {STATUS_LABEL[sp.status]}
                </span>
            </div>
            <h3 className="text-base font-semibold leading-tight">
                {sp.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed flex-1">
                {sp.blurb}
            </p>
            {sp.pr && (
                <Link
                    href={sp.pr}
                    target="_blank"
                    rel="noopener"
                    className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] hover:opacity-80 transition-opacity"
                >
                    View PR →
                </Link>
            )}
            {!sp.pr && sp.branch && (
                <code className="text-[11px] text-muted font-mono">{sp.branch}</code>
            )}
        </div>
    );
}
