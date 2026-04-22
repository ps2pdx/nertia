"use client";
import { useState } from "react";
import type { Post } from "@/lib/notepad";
import { useAdminToken } from "@/hooks/useAdminToken";
import { PolishDiff } from "./PolishDiff";
import { HeroUpload } from "./HeroUpload";

interface Props {
  post: Post;
  onUpdate: (post: Post) => void;
}

export function ExpandedRow({ post, onUpdate }: Props) {
  const token = useAdminToken();
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [polishSuggestion, setPolishSuggestion] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function savePatch(patch: Partial<Post>) {
    if (!token) return;
    const res = await fetch(`/api/admin/notepad/${post.id}`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) onUpdate({ ...post, ...patch } as Post);
  }

  async function publish() {
    const slug = window.prompt("Slug:", post.slug ?? slugify(post.title));
    if (!slug || !token) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/notepad/${post.id}/publish`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) onUpdate({ ...post, status: "published", slug, published_at: Date.now() });
      else alert(`Publish failed: ${(await res.json()).error}`);
    } finally {
      setBusy(false);
    }
  }

  async function requestPolish() {
    if (!token) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/notepad/${post.id}/polish`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: "{}",
      });
      if (res.ok) {
        const data = await res.json();
        setPolishSuggestion(data.polished);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-4 pb-4 space-y-3">
      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== post.title && savePatch({ title })}
          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm"
        />
      </Field>

      <Field label="Tags">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onBlur={() => {
            const arr = tags.split(",").map((t) => t.trim()).filter(Boolean);
            savePatch({ tags: arr });
          }}
          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm"
          placeholder="comma, separated"
        />
      </Field>

      <Field label="Hero">
        <HeroUpload post={post} onUpdate={(url) => { savePatch({ hero: url }); onUpdate({ ...post, hero: url }); }} />
      </Field>

      <Field label="Body">
        {polishSuggestion ? (
          <PolishDiff
            original={body}
            suggestion={polishSuggestion}
            onAccept={() => {
              setBody(polishSuggestion);
              savePatch({ body: polishSuggestion });
              setPolishSuggestion(null);
            }}
            onReject={() => setPolishSuggestion(null)}
            onRegenerate={requestPolish}
          />
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={() => body !== post.body && savePatch({ body })}
            rows={12}
            className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm font-mono"
          />
        )}
      </Field>

      <div className="flex gap-2 flex-wrap pt-1">
        <button
          onClick={publish}
          disabled={busy}
          className="px-3 py-1.5 bg-[var(--accent)] text-black rounded text-sm font-semibold disabled:opacity-50"
        >
          Publish
        </button>
        <button
          onClick={requestPolish}
          disabled={busy}
          className="px-3 py-1.5 border border-[var(--card-border)] rounded text-sm disabled:opacity-50"
        >
          ✨ Polish
        </button>
        <button
          onClick={async () => {
            if (!confirm("Delete this draft?") || !token) return;
            const res = await fetch(`/api/admin/notepad/${post.id}`, {
              method: "DELETE",
              headers: { authorization: `Bearer ${token}` },
            });
            if (res.ok) onUpdate({ ...post, status: "archived" });
          }}
          className="px-3 py-1.5 border border-[var(--card-border)] rounded text-sm text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted mb-1">{label}</div>
      {children}
    </div>
  );
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}
