"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAdminToken } from "@/hooks/useAdminToken";
import type { Post } from "@/lib/notepad";

export default function MergePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="p-6 text-sm text-muted">Loading…</div>}>
        <Inner />
      </Suspense>
    </AuthGuard>
  );
}

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = useAdminToken();
  const ids = (params.get("ids") ?? "").split(",").filter(Boolean);
  const [sources, setSources] = useState<Post[]>([]);
  const [method, setMethod] = useState<"ai" | "concat">("ai");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idsKey = ids.join(",");

  useEffect(() => {
    if (!token || ids.length < 2) return;
    Promise.all(
      ids.map((id) =>
        fetch(`/api/admin/notepad/${id}`, { headers: { authorization: `Bearer ${token}` } })
          .then((r) => r.json())
          .then((d) => d.post as Post),
      ),
    ).then(setSources);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, idsKey]);

  async function createMerged() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notepad/merge", {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ sourceIds: ids, composeMethod: method }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      router.push("/admin/notepad");
    } catch (e) {
      setError(String(e));
      setBusy(false);
    }
  }

  if (ids.length < 2) {
    return <div className="p-6 text-sm">Need 2+ source IDs.</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <header className="flex items-center gap-3 pb-3 border-b border-[var(--card-border)]">
        <button onClick={() => router.back()} className="text-xl">✕</button>
        <h1 className="text-base font-semibold">Merge {ids.length} drafts</h1>
      </header>

      <section>
        <div className="text-[10px] uppercase tracking-wide text-muted mb-2">Sources</div>
        <ul className="space-y-1 text-sm">
          {sources.map((s) => (
            <li key={s.id} className="flex gap-2">
              <span className="text-muted">·</span>
              <span>{s.title}</span>
              <span className="ml-auto text-xs text-muted">{s.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex gap-2">
        <button
          onClick={() => setMethod("ai")}
          className={`flex-1 px-3 py-2 rounded border text-sm ${
            method === "ai" ? "bg-purple-500/10 border-purple-500 text-purple-300" : "border-[var(--card-border)] text-muted"
          }`}
        >
          ✨ Claude-compose
        </button>
        <button
          onClick={() => setMethod("concat")}
          className={`flex-1 px-3 py-2 rounded border text-sm ${
            method === "concat" ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]" : "border-[var(--card-border)] text-muted"
          }`}
        >
          Concatenate
        </button>
      </section>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="pt-3 flex gap-2">
        <button onClick={() => router.back()} className="flex-1 border border-[var(--card-border)] rounded py-2 text-sm">
          Cancel
        </button>
        <button
          onClick={createMerged}
          disabled={busy || sources.length < 2}
          className="flex-1 bg-[var(--accent)] text-black rounded py-2 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create draft"}
        </button>
      </div>
    </main>
  );
}
