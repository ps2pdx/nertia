import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BrandWordmark } from '@/components/Brand';
import type { BlogPost } from '@/lib/blog';

interface BlogEntryProps {
    post: BlogPost;
    index?: number; // optional position in the field-notes list (e.g. 03)
    total?: number;
}

function fmtDate(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toISOString().slice(0, 10);
}

export default function BlogEntry({ post, index, total }: BlogEntryProps) {
    const num = index !== undefined ? String(index).padStart(2, '0') : '01';

    return (
        <article className="entry-root">
            <header className="entry-topbar">
                <div className="entry-topbar__brand">
                    <BrandWordmark size={14} />
                </div>
                <span className="t-mono fg-quiet">
                    FIELD NOTES · {num}
                    {total !== undefined ? ` / ${String(total).padStart(2, '0')}` : ''}
                    {' · '}{fmtDate(post.date)}
                </span>
            </header>

            <section className="entry-hero">
                <Link href="/blog" className="entry-hero__back">
                    <span aria-hidden>←</span> ALL FIELD NOTES
                </Link>

                <div className="entry-hero__meta">
                    <span className="t-mono entry-hero__num">{num}</span>
                    <span className="entry-hero__date">{fmtDate(post.date)}</span>
                    {post.tags?.length > 0 && (
                        <span className="entry-hero__tags">
                            {post.tags.slice(0, 4).map((tag) => (
                                <span key={tag} className="entry-hero__tag">{tag}</span>
                            ))}
                        </span>
                    )}
                </div>

                <h1 className="entry-hero__title">{post.title}</h1>

                {post.excerpt && (
                    <p className="entry-hero__excerpt">{post.excerpt}</p>
                )}
            </section>

            {post.hero && (
                <figure className="entry-hero-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.hero} alt={post.title} />
                </figure>
            )}

            <section className="entry-body">
                <div className="entry-body__inner">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                </div>
            </section>

            <footer className="entry-foot">
                <span className="t-mono fg-quiet">
                    {'// '}{fmtDate(post.date)} · {post.tags?.join(' · ') || 'untagged'}
                </span>
                <Link href="/blog" className="entry-foot__back">
                    NEXT ENTRY ↗
                </Link>
            </footer>
        </article>
    );
}
