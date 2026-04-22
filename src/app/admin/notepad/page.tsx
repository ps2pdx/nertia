"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail } from "@/lib/admin";
import { useAdminToken } from "@/hooks/useAdminToken";
import type { Post } from "@/lib/notepad";
import { ChipFilter, type FilterState } from "./components/ChipFilter";
import { DraftRow } from "./components/DraftRow";

export default function AdminNotepadPage() {
  return (
    <AuthGuard>
      <Inner />
    </AuthGuard>
  );
}

function Inner() {
  const router = useRouter();
  const { user } = useAuth();
  const token = useAdminToken();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({ statuses: ["ready"], projects: [], search: "" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mergeMode, setMergeMode] = useState(false);

  function exitMergeMode() {
    setMergeMode(false);
    setSelected(new Set());
  }

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/notepad/list", { headers: { authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => setPosts(data.posts))
      .catch((e) => setError(String(e)));
  }, [token]);

  if (!isAdminEmail(user?.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-muted">
          Signed in as <code>{user?.email}</code>. Not authorized.
        </p>
      </div>
    );
  }

  const visible = (posts ?? []).filter((p) => {
    if (filter.statuses.length && !filter.statuses.includes(p.status)) return false;
    if (filter.search && !p.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  function goMerge() {
    const ids = Array.from(selected);
    const params = new URLSearchParams({ ids: ids.join(",") });
    router.push(`/admin/notepad/merge?${params}`);
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto">
      <header className="px-4 py-3 border-b border-[var(--card-border)] flex items-center gap-3 sticky top-0 bg-[var(--background)] z-10">
        <h1 className="text-base font-semibold">Notepad</h1>
        <span className="text-xs text-muted">
          {mergeMode ? `${selected.size} selected` : `${visible.length} / ${posts?.length ?? 0}`}
        </span>
        {mergeMode ? (
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={exitMergeMode}
              className="text-xs uppercase tracking-wide text-muted hover:text-[var(--foreground)]"
            >
              Cancel
            </button>
            <button
              onClick={goMerge}
              disabled={selected.size < 2}
              className="text-xs uppercase tracking-wide border border-[var(--card-border)] px-3 py-1 hover:border-[var(--foreground)] disabled:opacity-40 disabled:hover:border-[var(--card-border)]"
            >
              Merge{selected.size >= 2 ? ` ${selected.size} →` : " →"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setMergeMode(true)}
            className="ml-auto text-xs uppercase tracking-wide border border-[var(--card-border)] px-3 py-1 hover:border-[var(--foreground)]"
          >
            Merge
          </button>
        )}
      </header>

      <ChipFilter filter={filter} onChange={setFilter} allPosts={posts ?? []} />

      {error && <div className="mx-4 my-3 text-sm text-red-500">{error}</div>}

      {posts === null ? (
        <p className="p-4 text-sm text-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="p-4 text-sm text-muted">No drafts match this filter.</p>
      ) : (
        <ul>
          {visible.map((p) => (
            <DraftRow
              key={p.id}
              post={p}
              selected={selected.has(p.id)}
              expanded={expanded === p.id}
              showCheckbox={mergeMode}
              onToggleSelect={() => toggleSelect(p.id)}
              onToggleExpand={() => toggleExpand(p.id)}
              onUpdate={(updated) =>
                setPosts((prev) => prev?.map((x) => (x.id === updated.id ? updated : x)) ?? null)
              }
            />
          ))}
        </ul>
      )}

    </main>
  );
}
