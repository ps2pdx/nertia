import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import Footer from '@/components/sections/Footer';

export const revalidate = 60;

export const metadata = {
    title: 'Field Notes — nertia',
    description: 'Writing on applied AI GTM, brand systems, and propulsion-driven product work.',
};

function fmtDate(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toISOString().slice(0, 10);
}

export default async function BlogIndex() {
    const posts = await getAllPosts();

    return (
        <>
            <main className="blog-root">
                <header className="blog-head">
                    <div className="blog-head__eyebrow t-eyebrow">FIELD NOTES</div>
                    <h1 className="blog-head__title">
                        WRITING<span style={{ color: 'var(--accent)' }}>.</span>
                    </h1>
                    <p className="blog-head__sub">
                        Raw output from the workbench. Applied AI GTM, brand systems, and the propulsion problems they solve.
                    </p>
                </header>

                <ol className="blog-ticker" role="list">
                    {posts.map((post, i) => {
                        const num = String(i + 1).padStart(2, '0');
                        return (
                            <li key={post.slug} className="blog-ticker__row">
                                <Link href={`/blog/${post.slug}`} className="blog-ticker__link">
                                    <span className="blog-ticker__num">{num}</span>
                                    <span className="blog-ticker__title">{post.title}</span>
                                    <span className="blog-ticker__excerpt">{post.excerpt || ''}</span>
                                    <span className="blog-ticker__route">
                                        <span className="blog-ticker__date">{fmtDate(post.date)}</span>
                                        <span className="blog-ticker__arrow" aria-hidden>↗</span>
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ol>

                {posts.length === 0 && (
                    <div className="blog-empty">
                        <span className="t-mono fg-quiet">{'// no posts yet — drafts brewing in /admin/notepad'}</span>
                    </div>
                )}

                <footer className="blog-foot">
                    <span className="blog-foot__bracket">[ FOR EDUCATIONAL PURPOSES ]</span>
                    <span className="t-mono fg-quiet">{posts.length} entries · n.[ai] · portland</span>
                </footer>
            </main>
            <Footer />
        </>
    );
}
