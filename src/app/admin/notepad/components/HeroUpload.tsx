"use client";
import { useRef, useState } from "react";
import type { Post } from "@/lib/notepad";
import { useAdminToken } from "@/hooks/useAdminToken";

interface Props {
  post: Post;
  onUpdate: (url: string) => void;
}

export function HeroUpload({ post, onUpdate }: Props) {
  const token = useAdminToken();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    if (!token) return;
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    form.append("postId", post.id);
    form.append("kind", "hero");
    try {
      const res = await fetch("/api/admin/notepad/media/upload", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        onUpdate(data.url);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {post.hero ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.hero}
            alt="hero"
            className="w-full max-h-64 object-contain rounded border border-[var(--card-border)] bg-[var(--card-bg)]"
          />
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="uppercase tracking-wide text-muted hover:text-[var(--foreground)] disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onUpdate("")}
              disabled={busy}
              className="uppercase tracking-wide text-red-500 hover:text-red-400 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-full h-20 border border-dashed border-[var(--card-border)] rounded flex items-center justify-center text-xs text-muted disabled:opacity-50"
        >
          {busy ? "Uploading…" : "📷 Upload hero"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
