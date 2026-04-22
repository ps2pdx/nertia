import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import PageTemplate from '@/components/PageTemplate';

export const revalidate = 60;

export const metadata = {
  title: 'Blog | Nertia',
  description: 'Field notes and writing from Scott Campbell at Nertia.',
};

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <PageTemplate>
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-bold mb-4">Field Notes</h1>
        <p className="text-[var(--muted-foreground)] mb-12">Raw writing from the workbench.</p>
        <div className="flex flex-col gap-8">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block rounded-lg border border-[var(--card-border)] hover:border-[var(--accent)] transition overflow-hidden">
              {post.hero && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.hero} alt={post.title} className="w-full aspect-video object-cover" />
              )}
              <div className="p-6">
                <div className="text-sm text-[var(--muted-foreground)] mb-2">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-[var(--accent)] transition">{post.title}</h2>
                <p className="text-[var(--muted-foreground)]">{post.excerpt}</p>
              </div>
            </Link>
          ))}
          {posts.length === 0 && <p className="text-[var(--muted-foreground)]">No posts yet.</p>}
        </div>
      </div>
    </PageTemplate>
  );
}
