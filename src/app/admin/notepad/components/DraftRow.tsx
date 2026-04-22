"use client";
import type { Post } from "@/lib/notepad";
import { ExpandedRow } from "./ExpandedRow";

interface Props {
  post: Post;
  selected: boolean;
  expanded: boolean;
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

export function DraftRow({ post, selected, expanded, onToggleSelect, onToggleExpand, onUpdate }: Props) {
  return (
    <li className={`border-b border-[var(--card-border)] ${expanded ? "bg-[var(--card-bg)]" : ""}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4"
        />
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: DOT[post.status] }}
          aria-label={post.status}
        />
        <button
          onClick={onToggleExpand}
          className="flex-1 text-left text-sm truncate"
        >
          {post.title || "(untitled)"}
        </button>
        <span className="text-xs text-muted">{post.date}</span>
      </div>
      {expanded && <ExpandedRow post={post} onUpdate={onUpdate} />}
    </li>
  );
}
