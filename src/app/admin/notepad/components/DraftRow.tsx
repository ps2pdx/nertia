"use client";
import type { Post } from "@/lib/notepad";
import { ExpandedRow } from "./ExpandedRow";

interface Props {
  post: Post;
  selected: boolean;
  expanded: boolean;
  showCheckbox: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onUpdate: (post: Post) => void;
}

const DOT: Record<string, string> = {
  draft: "#6b7280",
  ready: "#f59e0b",
  published: "#22c55e",
  merged: "#a78bfa",
  archived: "#444",
};

export function DraftRow({ post, selected, expanded, showCheckbox, onToggleSelect, onToggleExpand, onUpdate }: Props) {
  return (
    <li className={`border-b border-[var(--card-border)] ${expanded ? "bg-[var(--card-bg)]" : ""}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4"
          />
        )}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: DOT[post.status] }}
          aria-label={post.status}
        />
        <button
          onClick={onToggleExpand}
          className="flex-1 text-left text-sm truncate flex items-center gap-2"
        >
          <span className="truncate">{post.title || "(untitled)"}</span>
          {post.merged_from && post.merged_from.length > 0 && (
            <span
              className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded border border-purple-500/60 text-purple-300 flex-shrink-0"
              title={`Merged from ${post.merged_from.length} drafts`}
            >
              merged ·{post.merged_from.length}
            </span>
          )}
          {post.status === "merged" && post.merged_into && (
            <span
              className="text-[9px] uppercase tracking-wide text-muted flex-shrink-0"
              title="This draft was merged into another draft"
            >
              → merged
            </span>
          )}
        </button>
        <span className="text-xs text-muted">{post.date}</span>
      </div>
      {expanded && <ExpandedRow post={post} onUpdate={onUpdate} />}
    </li>
  );
}
