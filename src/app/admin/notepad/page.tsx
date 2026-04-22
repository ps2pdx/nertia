"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail } from "@/lib/admin";
import { useAdminToken } from "@/hooks/useAdminToken";
import { projectOf, categoryOf, type Post } from "@/lib/notepad";
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
  const [filter, setFilter] = useState<FilterState>({ statuses: ["ready"], projects: [], dateBucket: null, search: "" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [batchBusy, setBatchBusy] = useState(false);

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  function reloadPosts() {
    if (!token) return;
    fetch("/api/admin/notepad/list", { headers: { authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => setPosts(data.posts))
      .catch((e) => setError(String(e)));
  }

  useEffect(() => {
    reloadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const now = new Date();
  const visible = (posts ?? []).filter((p) => {
    if (filter.statuses.length && !filter.statuses.includes(p.status)) return false;
    if (filter.projects.length && !filter.projects.includes(categoryOf(projectOf(p)))) return false;
    if (filter.search && !p.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.dateBucket) {
      const d = new Date(p.date);
      const days = isNaN(d.getTime()) ? Infinity : Math.floor((now.getTime() - d.getTime()) / 86_400_000);
      const inBucket =
        filter.dateBucket === "today" ? days <= 0 :
        filter.dateBucket === "7d" ? days > 0 && days <= 7 :
        filter.dateBucket === "30d" ? days > 7 && days <= 30 :
        days > 30;
      if (!inBucket) return false;
    }
    return true;
  });

  const allVisibleSelected = visible.length > 0 && visible.every((p) => selected.has(p.id));
  function toggleSelectAllVisible() {
    if (allVisibleSelected) {
      const next = new Set(selected);
      for (const p of visible) next.delete(p.id);
      setSelected(next);
    } else {
      const next = new Set(selected);
      for (const p of visible) next.add(p.id);
      setSelected(next);
    }
  }

  const knownProjects = Array.from(new Set((posts ?? []).map(projectOf))).sort();

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

  async function runBatch(action: "delete" | "draft" | "ready" | "published") {
    if (!token || selected.size === 0) return;
    if (action === "delete" && !confirm(`Delete ${selected.size} draft${selected.size === 1 ? "" : "s"}? This cannot be undone.`)) return;
    setBatchBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notepad/batch", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      if (data.failed?.length) {
        setError(`${data.succeeded} ${action}d, ${data.failed.length} failed: ${data.failed.map((f: { id: string; error: string }) => `${f.id}: ${f.error}`).join("; ")}`);
      }
      reloadPosts();
      exitSelectMode();
    } catch (e) {
      setError(String(e));
    } finally {
      setBatchBusy(false);
    }
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto">
      <header className="px-4 py-3 border-b border-[var(--card-border)] flex items-center gap-3 sticky top-0 bg-[var(--background)] z-20">
        <h1 className="text-base font-semibold">Notepad</h1>
        <span className="text-xs text-muted">
          {selectMode ? `${selected.size} selected` : `${visible.length} / ${posts?.length ?? 0}`}
        </span>
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
              showCheckbox={selectMode}
              knownProjects={knownProjects}
              onToggleSelect={() => toggleSelect(p.id)}
              onToggleExpand={() => toggleExpand(p.id)}
              onUpdate={(updated) =>
                setPosts((prev) => prev?.map((x) => (x.id === updated.id ? updated : x)) ?? null)
              }
            />
          ))}
        </ul>
      )}

      <div className="sticky bottom-0 bg-[var(--background)] border-t border-[var(--card-border)] z-20">
        {selectMode ? (
          <>
            <div className="px-3 py-2 flex items-center gap-2 border-b border-[var(--card-border)]/50">
              <button
                onClick={exitSelectMode}
                disabled={batchBusy}
                aria-label="Cancel"
                className="w-8 h-8 grid place-items-center border border-[var(--card-border)] text-muted hover:text-[var(--foreground)] hover:border-[var(--foreground)] disabled:opacity-40"
              >
                ✕
              </button>
              <button
                onClick={toggleSelectAllVisible}
                disabled={visible.length === 0 || batchBusy}
                aria-label={allVisibleSelected ? "Clear selection" : "Select all visible"}
                className="w-8 h-8 grid place-items-center border border-[var(--card-border)] text-muted hover:text-[var(--foreground)] hover:border-[var(--foreground)] disabled:opacity-40"
              >
                {allVisibleSelected ? "☑" : "☐"}
              </button>
              <span className="text-xs text-muted ml-1">
                {selected.size} selected
              </span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              <button
                onClick={goMerge}
                disabled={selected.size < 2 || batchBusy}
                className={`w-full text-sm uppercase tracking-wide py-3 font-semibold ${
                  selected.size >= 2 && !batchBusy
                    ? "bg-blue-500 text-white hover:bg-blue-400"
                    : "border border-[var(--card-border)] text-muted opacity-40"
                }`}
              >
                Merge{selected.size >= 2 ? ` ${selected.size} →` : " →"}
              </button>
              <button
                onClick={() => runBatch("published")}
                disabled={selected.size === 0 || batchBusy}
                className="w-full text-xs uppercase tracking-wide bg-[var(--accent)] text-black py-2.5 hover:brightness-110 disabled:opacity-40 font-semibold"
              >
                Publish
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => runBatch("draft")}
                  disabled={selected.size === 0 || batchBusy}
                  className="text-[11px] uppercase tracking-wide border border-[var(--card-border)] text-muted py-1.5 hover:border-[var(--foreground)] disabled:opacity-40"
                >
                  → Draft
                </button>
                <button
                  onClick={() => runBatch("ready")}
                  disabled={selected.size === 0 || batchBusy}
                  className="text-[11px] uppercase tracking-wide border border-[var(--card-border)] text-muted py-1.5 hover:border-[var(--foreground)] disabled:opacity-40"
                >
                  → Ready
                </button>
              </div>
              <button
                onClick={() => runBatch("delete")}
                disabled={selected.size === 0 || batchBusy}
                className="w-full text-[10px] uppercase tracking-wide text-red-400/80 hover:text-red-400 py-1 text-center disabled:opacity-40"
              >
                Delete{selected.size > 0 ? ` ${selected.size} draft${selected.size === 1 ? "" : "s"}` : ""}
              </button>
            </div>
          </>
        ) : (
          <div className="px-4 py-2 flex items-center">
            <span className="flex-1" />
            <button
              onClick={() => setSelectMode(true)}
              className="text-xs uppercase tracking-wide border border-blue-500 text-blue-400 px-4 py-1.5 hover:bg-blue-500/10"
            >
              Select
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
