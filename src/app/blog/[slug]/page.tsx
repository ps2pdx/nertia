import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import PageTemplate from '@/components/PageTemplate';

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: `${post.title} | Nertia`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return (
    <PageTemplate>
      <article className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/blog" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] mb-8 inline-block">
          ← All field notes
        </Link>
        <div className="text-sm text-[var(--muted-foreground)] mb-4">
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-8">{post.title}</h1>
        <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-p:text-[var(--foreground)] prose-a:text-[var(--accent)] prose-strong:text-[var(--foreground)] prose-li:text-[var(--foreground)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </PageTemplate>
  );
}
