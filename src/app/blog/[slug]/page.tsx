import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import BlogEntry from '@/components/sections/blog/BlogEntry';
import Footer from '@/components/sections/Footer';

export const revalidate = 60;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: 'Not Found' };
    return {
        title: `${post.title} — nertia`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            images: post.hero ? [{ url: post.hero }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: post.hero ? [post.hero] : undefined,
        },
    };
}

export async function generateStaticParams() {
    try {
        const posts = await getAllPosts();
        return posts.map((post) => ({ slug: post.slug }));
    } catch {
        return [];
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const all = await getAllPosts();
    const post = all.find((p) => p.slug === slug) ?? null;
    if (!post) notFound();

    const idx = all.findIndex((p) => p.slug === slug);
    return (
        <>
            <BlogEntry post={post} index={idx + 1} total={all.length} />
            <Footer />
        </>
    );
}
