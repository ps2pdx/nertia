'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/auth-context';
import { isAdminEmail } from '@/lib/admin';
import type { CandidatePost } from '@/lib/blog-candidates';

export default function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <AuthGuard>
      <Editor slug={slug} />
    </AuthGuard>
  );
}

function Editor({ slug }: { slug: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<CandidatePost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    fetch(`/api/admin/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => (data.post ? setPost(data.post) : setError(data.error)))
      .catch((e) => setError(String(e)));
  }, [slug]);

  if (!isAdminEmail(user?.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-muted text-sm">Not authorized.</p>
      </div>
    );
  }

  if (error)
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-sm text-red-400">{error}</p>
        <Link href="/admin/blog" className="text-sm text-muted mt-4 inline-block">
          ← back
        </Link>
      </main>
    );

  if (!post)
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 text-muted text-sm">
        Loading…
      </main>
    );

  async function save() {
    if (!post) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setSavedAt(new Date().toLocaleTimeString());
    } catch (e) {
      alert(`save failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!post) return;
    if (
      !confirm(
        `Publish "${post.title}" to /blog/${post.slug}?\n\nThis moves the .md file from blog-candidates → blog. You'll still need to git commit + push.`
      )
    )
      return;
    setBusy(true);
    try {
      // save first to flush any pending edits
      await fetch(`/api/admin/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const res = await fetch(`/api/admin/blog/${slug}`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      router.push('/admin/blog');
    } catch (e) {
      alert(`publish failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function discard() {
    if (!post) return;
    if (
      !confirm(
        `Delete candidate "${post.title}"? This removes the .md file from blog-candidates.`
      )
    )
      return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push('/admin/blog');
    } catch (e) {
      alert(`delete failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/admin/blog"
        className="text-xs text-muted hover:text-[var(--accent)] transition"
      >
        ← back to BTS
      </Link>

      <div className="mt-6 mb-4 flex items-baseline justify-between gap-4">
        <input
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className="w-full bg-transparent text-2xl font-semibold outline-none"
          placeholder="Title"
        />
        <span className="text-xs text-muted shrink-0">
          {savedAt ? `saved ${savedAt}` : 'unsaved'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <label className="space-y-1">
          <span className="text-xs text-muted">slug</span>
          <input
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
            className="w-full rounded border border-[var(--card-border)] bg-transparent px-2 py-1"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted">date</span>
          <input
            value={post.date}
            onChange={(e) => setPost({ ...post, date: e.target.value })}
            placeholder="YYYY-MM-DD"
            className="w-full rounded border border-[var(--card-border)] bg-transparent px-2 py-1"
          />
        </label>
        <label className="col-span-2 space-y-1">
          <span className="text-xs text-muted">excerpt</span>
          <input
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            className="w-full rounded border border-[var(--card-border)] bg-transparent px-2 py-1"
          />
        </label>
        <label className="col-span-2 space-y-1">
          <span className="text-xs text-muted">hero (path under /public, e.g. /blog/foo.png)</span>
          <input
            value={post.hero ?? ''}
            onChange={(e) => setPost({ ...post, hero: e.target.value })}
            className="w-full rounded border border-[var(--card-border)] bg-transparent px-2 py-1"
          />
        </label>
        <label className="col-span-2 space-y-1">
          <span className="text-xs text-muted">tags (comma)</span>
          <input
            value={post.tags.join(', ')}
            onChange={(e) =>
              setPost({
                ...post,
                tags: e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
            className="w-full rounded border border-[var(--card-border)] bg-transparent px-2 py-1"
          />
        </label>
      </div>

      <div className="mb-2 flex gap-3 border-b border-[var(--card-border)] text-sm">
        {(['edit', 'preview'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-2 pb-2 ${
              tab === t
                ? 'border-[var(--accent)] text-[var(--foreground)]'
                : 'border-transparent text-muted hover:text-[var(--foreground)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'edit' ? (
        <textarea
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          rows={28}
          className="w-full rounded border border-[var(--card-border)] bg-transparent p-3 font-mono text-sm leading-relaxed outline-none"
        />
      ) : (
        <article className="rounded border border-[var(--card-border)] p-6 prose prose-invert max-w-none">
          <h1>{post.title}</h1>
          {post.hero && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.hero}
              alt={post.title}
              className="w-full rounded-lg my-6"
            />
          )}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
      )}

      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={save}
          disabled={busy}
          className="rounded border border-[var(--card-border)] px-3 py-1.5 text-sm hover:border-[var(--accent)] transition disabled:opacity-50"
        >
          {busy ? 'working…' : 'save'}
        </button>
        <button
          onClick={publish}
          disabled={busy}
          className="rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3 py-1.5 text-sm transition disabled:opacity-50"
        >
          publish →
        </button>
        <button
          onClick={discard}
          disabled={busy}
          className="ml-auto text-xs text-muted hover:text-red-400 transition"
        >
          discard
        </button>
      </div>
    </main>
  );
}
