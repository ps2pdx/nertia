"use client";
import { projectOf, categoryOf, PROJECT_CATEGORIES, type Post, type Status, type ProjectCategory } from "@/lib/notepad";

export type DateBucket = "today" | "7d" | "30d" | "older";

export type FilterState = {
  statuses: Status[];
  projects: string[];
  dateBucket: DateBucket | null;
  search: string;
};

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  allPosts: Post[];
  topOffset?: string;
}

const STATUSES_VISIBLE: Status[] = ["ready", "draft", "published"];
const DATE_BUCKETS: DateBucket[] = ["today", "7d", "30d", "older"];

function bucketOf(dateStr: string, now: Date): DateBucket {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "older";
  const days = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days <= 7) return "7d";
  if (days <= 30) return "30d";
  return "older";
}

export function ChipFilter({ filter, onChange, allPosts, topOffset = "49px" }: Props) {
  const counts: Record<Status, number> = {
    draft: 0, ready: 0, published: 0, merged: 0, archived: 0,
  };
  for (const p of allPosts) counts[p.status]++;

  const categoryCounts: Record<ProjectCategory, number> = {
    nertia: 0, ableton: 0, vantage: 0, "zen-holo": 0, misc: 0,
  };
  for (const p of allPosts) categoryCounts[categoryOf(projectOf(p))]++;

  const visibleCategories = PROJECT_CATEGORIES.filter((c) => categoryCounts[c] > 0);

  const now = new Date();
  const dateCounts: Record<DateBucket, number> = { today: 0, "7d": 0, "30d": 0, older: 0 };
  for (const p of allPosts) dateCounts[bucketOf(p.date, now)]++;

  function toggleStatus(s: Status) {
    const next = filter.statuses.includes(s)
      ? filter.statuses.filter((x) => x !== s)
      : [...filter.statuses, s];
    onChange({ ...filter, statuses: next });
  }

  function toggleProject(p: string) {
    const next = filter.projects.includes(p)
      ? filter.projects.filter((x) => x !== p)
      : [...filter.projects, p];
    onChange({ ...filter, projects: next });
  }

  function toggleBucket(b: DateBucket) {
    onChange({ ...filter, dateBucket: filter.dateBucket === b ? null : b });
  }

  return (
    <div className="sticky bg-[var(--background)] z-10 border-b border-[var(--card-border)]" style={{ top: topOffset }}>
      <div className="px-4 py-2">
        <input
          type="search"
          value={filter.search}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          placeholder="Search drafts..."
          className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md px-3 py-1.5 text-sm"
        />
      </div>
      <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
        <span className="text-[10px] uppercase tracking-wide text-muted self-center whitespace-nowrap">
          status
        </span>
        {STATUSES_VISIBLE.map((s) => (
          <button
            key={s}
            onClick={() => toggleStatus(s)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border ${
              filter.statuses.includes(s)
                ? "bg-[var(--accent)] text-black border-[var(--accent)] font-semibold"
                : "border-[var(--card-border)] text-muted"
            }`}
          >
            {s} {counts[s]}
          </button>
        ))}
      </div>
      {visibleCategories.length > 0 && (
        <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
          <span className="text-[10px] uppercase tracking-wide text-muted self-center whitespace-nowrap">
            project
          </span>
          {visibleCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleProject(cat)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border ${
                filter.projects.includes(cat)
                  ? "bg-blue-500 text-white border-blue-500 font-semibold"
                  : "border-[var(--card-border)] text-muted"
              }`}
            >
              {cat} {categoryCounts[cat]}
            </button>
          ))}
        </div>
      )}
      <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
        <span className="text-[10px] uppercase tracking-wide text-muted self-center whitespace-nowrap">
          date
        </span>
        {DATE_BUCKETS.map((b) => (
          <button
            key={b}
            onClick={() => toggleBucket(b)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border ${
              filter.dateBucket === b
                ? "bg-amber-500 text-black border-amber-500 font-semibold"
                : "border-[var(--card-border)] text-muted"
            }`}
          >
            {b} {dateCounts[b]}
          </button>
        ))}
      </div>
    </div>
  );
}
