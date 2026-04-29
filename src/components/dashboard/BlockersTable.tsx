import type { Blocker } from './data';

interface BlockersTableProps {
    blockers: Blocker[];
}

const PRIORITY_LABEL: Record<Blocker['priority'], string> = {
    gating: 'Gating',
    launch: 'Launch',
    polish: 'Polish',
    deferred: 'Deferred',
};

const PRIORITY_TONE: Record<Blocker['priority'], string> = {
    gating: 'border-red-500/60 text-red-400',
    launch: 'border-orange-500/50 text-orange-400',
    polish: 'border-yellow-500/40 text-yellow-400',
    deferred: 'border-[var(--card-border)] text-muted',
};

const PRIORITY_ORDER: Record<Blocker['priority'], number> = {
    gating: 0,
    launch: 1,
    polish: 2,
    deferred: 3,
};

export default function BlockersTable({ blockers }: BlockersTableProps) {
    const sorted = [...blockers].sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
    );

    return (
        <section
            id="blocked"
            className="px-8 lg:px-12 py-12 border-t border-[var(--card-border)]"
        >
            <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
                    Blocked
                </p>
                <h2 className="text-2xl font-bold">
                    Awaiting.
                </h2>
            </div>
            <div className="flex flex-col">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-[var(--card-border)] text-[10px] uppercase tracking-[0.25em] text-muted font-mono">
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-4">Item</div>
                    <div className="col-span-6">Impact</div>
                </div>
                {sorted.map((b) => (
                    <div
                        key={b.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b border-[var(--card-border)]"
                    >
                        <div className="md:col-span-2">
                            <span
                                className={`inline-block text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border ${PRIORITY_TONE[b.priority]}`}
                            >
                                {PRIORITY_LABEL[b.priority]}
                            </span>
                        </div>
                        <div className="md:col-span-4 text-sm font-medium">
                            {b.item}
                        </div>
                        <div className="md:col-span-6 text-sm text-muted leading-relaxed">
                            {b.impact}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
