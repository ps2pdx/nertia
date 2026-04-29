'use client';

import Link from 'next/link';
import type { Lane as LaneData, ChecklistItem, StepGroup } from './data';

interface LaneProps {
    lane: LaneData;
    isChecked: (id: string) => boolean;
    toggle: (id: string) => void;
    hydrated: boolean;
}

export default function Lane({ lane, isChecked, toggle, hydrated }: LaneProps) {
    const checkedCount = hydrated
        ? lane.items.filter((i) => isChecked(i.id)).length
        : 0;
    const total = lane.items.length;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4 pb-2 border-b border-[var(--card-border)]">
                <h3 className="text-base font-semibold uppercase tracking-[0.15em]">
                    {lane.title}
                </h3>
                <span className="text-xs font-mono text-muted">
                    {hydrated ? `${checkedCount}/${total}` : `0/${total}`}
                </span>
            </div>
            {lane.subtitle && (
                <p className="text-sm text-muted leading-relaxed -mt-2">
                    {lane.subtitle}
                </p>
            )}
            <ul className="flex flex-col gap-3">
                {lane.items.map((item) => (
                    <ChecklistItemView
                        key={item.id}
                        item={item}
                        checked={isChecked(item.id)}
                        onToggle={() => toggle(item.id)}
                    />
                ))}
            </ul>
        </div>
    );
}

function ChecklistItemView({
    item,
    checked,
    onToggle,
}: {
    item: ChecklistItem;
    checked: boolean;
    onToggle: () => void;
}) {
    const hasSteps = (item.stepGroups?.length ?? 0) > 0;
    return (
        <li
            className={`flex flex-col gap-2 p-4 border border-[var(--card-border)] bg-[var(--card-bg)] transition-opacity ${
                checked ? 'opacity-50' : ''
            }`}
        >
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onToggle}
                    aria-label={item.title}
                    className="mt-1 w-4 h-4 accent-[var(--accent)] cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p
                        className={`text-sm font-medium leading-snug ${
                            checked ? 'line-through' : ''
                        }`}
                    >
                        {item.href ? (
                            <Link
                                href={item.href}
                                target={item.href.startsWith('http') ? '_blank' : undefined}
                                rel={item.href.startsWith('http') ? 'noopener' : undefined}
                                className="hover:text-[var(--accent)] transition-colors underline underline-offset-2"
                            >
                                {item.title}
                            </Link>
                        ) : (
                            item.title
                        )}
                    </p>
                    {item.note && (
                        <p className="text-xs text-muted leading-relaxed mt-1.5">
                            {item.note}
                        </p>
                    )}
                </div>
            </div>
            {hasSteps && (
                <details className="ml-7 mt-1 group">
                    <summary className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] cursor-pointer hover:opacity-80 select-none list-none">
                        <span className="inline-block transition-transform group-open:rotate-90 mr-1">
                            ▸
                        </span>
                        Show steps
                    </summary>
                    <div className="mt-3 pl-4 border-l-2 border-[var(--accent)] flex flex-col gap-4">
                        {item.stepGroups!.map((group, idx) => (
                            <StepGroupView key={idx} group={group} />
                        ))}
                    </div>
                </details>
            )}
        </li>
    );
}

function StepGroupView({ group }: { group: StepGroup }) {
    return (
        <div className="flex flex-col gap-2">
            {group.heading && (
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
                    {group.heading}
                </h4>
            )}
            <ol className="flex flex-col gap-1.5 text-xs leading-relaxed">
                {group.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                        <span className="text-muted font-mono flex-shrink-0">
                            {idx + 1}.
                        </span>
                        <span className="text-[var(--foreground)]">{step}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
