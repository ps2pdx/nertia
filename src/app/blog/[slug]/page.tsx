import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import PageTemplate from '@/components/PageTemplate';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: `${post.title} | Nertia`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date, images: post.hero ? [{ url: post.hero }] : undefined },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: post.hero ? [post.hero] : undefined },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map(post => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
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
        {post.hero && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.hero} alt={post.title} className="w-full rounded-lg mb-10 border border-[var(--card-border)]" />
        )}
        <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-p:text-[var(--foreground)] prose-a:text-[var(--accent)] prose-strong:text-[var(--foreground)] prose-li:text-[var(--foreground)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </PageTemplate>
  );
}
