"use client";
import type { Post, Status } from "@/lib/notepad";

export type FilterState = {
  statuses: Status[];
  projects: string[];
  search: string;
};

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  allPosts: Post[];
}

const STATUSES_VISIBLE: Status[] = ["ready", "draft", "published"];

export function ChipFilter({ filter, onChange, allPosts }: Props) {
  const counts: Record<Status, number> = {
    draft: 0, ready: 0, published: 0, merged: 0, archived: 0,
  };
  for (const p of allPosts) counts[p.status]++;

  const projectCounts = new Map<string, number>();
  for (const p of allPosts) {
    const proj = p.cwd?.split("/").pop() ?? "unknown";
    projectCounts.set(proj, (projectCounts.get(proj) ?? 0) + 1);
  }

  const sortedProjects = Array.from(projectCounts.entries()).sort((a, b) => b[1] - a[1]);

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

  return (
    <div className="sticky top-[49px] bg-[var(--background)] z-10 border-b border-[var(--card-border)]">
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
      {sortedProjects.length > 0 && (
        <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
          <span className="text-[10px] uppercase tracking-wide text-muted self-center whitespace-nowrap">
            project
          </span>
          {sortedProjects.map(([proj, n]) => (
            <button
              key={proj}
              onClick={() => toggleProject(proj)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border ${
                filter.projects.includes(proj)
                  ? "bg-blue-500 text-white border-blue-500 font-semibold"
                  : "border-[var(--card-border)] text-muted"
              }`}
            >
              {proj} {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
