import type { DoneItem } from './data';

interface DoneListProps {
    items: DoneItem[];
}

export default function DoneList({ items }: DoneListProps) {
    // Group by date for visual scanability
    const byDate = items.reduce<Record<string, DoneItem[]>>((acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
    }, {});
    const dates = Object.keys(byDate).sort().reverse();

    return (
        <section
            id="done"
            className="px-8 lg:px-12 py-12 border-t border-[var(--card-border)]"
        >
            <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
                    Done so far
                </p>
                <h2 className="text-2xl font-bold">
                    Receipts.
                </h2>
            </div>
            <div className="flex flex-col gap-8">
                {dates.map((date) => (
                    <div key={date} className="flex flex-col gap-3">
                        <h3 className="text-[10px] uppercase tracking-[0.25em] text-muted font-mono">
                            {date}
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            {byDate[date].map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-start gap-3 text-sm leading-relaxed"
                                >
                                    <span
                                        className="text-[var(--accent)] flex-shrink-0 mt-0.5"
                                        aria-hidden
                                    >
                                        ✓
                                    </span>
                                    <span className="text-muted">{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
