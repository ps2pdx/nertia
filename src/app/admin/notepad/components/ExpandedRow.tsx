"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { projectOf, type Post } from "@/lib/notepad";
import { useAdminToken } from "@/hooks/useAdminToken";
import { PolishDiff } from "./PolishDiff";
import { HeroUpload } from "./HeroUpload";

interface Props {
  post: Post;
  knownProjects: string[];
  onUpdate: (post: Post) => void;
}

export function ExpandedRow({ post, knownProjects, onUpdate }: Props) {
  const token = useAdminToken();
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [project, setProject] = useState(projectOf(post));
  const [slug, setSlug] = useState(post.slug ?? slugify(post.title));
  const [polishSuggestion, setPolishSuggestion] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [bodyMode, setBodyMode] = useState<"edit" | "preview">("edit");

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
    if (!token) return;
    const finalSlug = slug.trim() || slugify(title || post.title);
    if (!finalSlug) {
      setPublishError("Slug required");
      return;
    }
    setBusy(true);
    setPublishError(null);
    try {
      const res = await fetch(`/api/admin/notepad/${post.id}/publish`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ slug: finalSlug }),
      });
      if (res.ok) {
        setSlug(finalSlug);
        onUpdate({ ...post, status: "published", slug: finalSlug, published_at: Date.now() });
      } else {
        setPublishError((await res.json()).error ?? `HTTP ${res.status}`);
      }
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

      <Field label="Project">
        <input
          value={project}
          onChange={(e) => setProject(e.target.value)}
          onBlur={() => {
            const trimmed = project.trim();
            if (trimmed !== projectOf(post)) {
              savePatch({ project: trimmed || null });
            }
          }}
          list={`projects-${post.id}`}
          placeholder="project name"
          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm"
        />
        <datalist id={`projects-${post.id}`}>
          {knownProjects.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </Field>

      <Field label="Tags">
        <div className="flex flex-col gap-2">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs tracking-wide px-3 py-1 border border-[var(--card-border)] text-muted inline-flex items-center gap-2"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => {
                      const next = post.tags.filter((x) => x !== t);
                      setTags(next.join(", "));
                      savePatch({ tags: next });
                    }}
                    className="text-muted hover:text-red-400 leading-none text-sm"
                    aria-label={`remove tag ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onBlur={() => {
              const arr = tags.split(",").map((t) => t.trim()).filter(Boolean);
              const sameAsPost = arr.length === post.tags.length && arr.every((t, i) => t === post.tags[i]);
              if (!sameAsPost) savePatch({ tags: arr });
            }}
            className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm"
            placeholder="comma, separated"
          />
        </div>
      </Field>

      <Field label="Slug">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted whitespace-nowrap">nertia.ai/blog/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={() => {
                const trimmed = slug.trim();
                if (trimmed && trimmed !== post.slug) savePatch({ slug: trimmed });
              }}
              placeholder={slugify(title || post.title)}
              className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm"
            />
          </div>
          {post.status === "published" && (
            <span className="text-[10px] text-amber-400/80">
              Published — changing the slug will break the live URL.
            </span>
          )}
        </div>
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
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 text-[10px] uppercase tracking-wide">
              <button
                type="button"
                onClick={() => setBodyMode("edit")}
                className={`px-2 py-1 border ${
                  bodyMode === "edit"
                    ? "border-[var(--foreground)] text-[var(--foreground)]"
                    : "border-[var(--card-border)] text-muted hover:text-[var(--foreground)]"
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setBodyMode("preview")}
                className={`px-2 py-1 border ${
                  bodyMode === "preview"
                    ? "border-[var(--foreground)] text-[var(--foreground)]"
                    : "border-[var(--card-border)] text-muted hover:text-[var(--foreground)]"
                }`}
              >
                Preview
              </button>
            </div>
            {bodyMode === "edit" ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onBlur={() => body !== post.body && savePatch({ body })}
                rows={14}
                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-3 py-2 text-base leading-relaxed"
              />
            ) : (
              <div className="border border-[var(--card-border)] rounded px-4 py-3 min-h-[200px] prose prose-invert max-w-none prose-headings:font-semibold prose-p:text-[var(--foreground)] prose-a:text-[var(--accent)] prose-strong:text-[var(--foreground)] prose-li:text-[var(--foreground)]">
                {body.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
                ) : (
                  <p className="text-muted italic">Empty body.</p>
                )}
              </div>
            )}
          </div>
        )}
      </Field>

      {publishError && (
        <div className="text-xs text-red-400 border border-red-500/40 bg-red-500/5 rounded px-3 py-2">
          Publish failed: {publishError}
        </div>
      )}

      <div className="flex gap-2 flex-wrap pt-1">
        <button
          onClick={publish}
          disabled={busy}
          className="px-3 py-1.5 bg-[var(--accent)] text-black rounded text-sm font-semibold disabled:opacity-50"
        >
          {post.status === "published" ? "Republish" : "Publish"}
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
