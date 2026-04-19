import type { Site } from "@/templates/types";

const MAX_POSTS = 3;

type Post = {
  date?: string;
  title: string;
  summary?: string;
  tags?: string[];
};

function readPosts(copy: Record<string, string>): Post[] {
  const out: Post[] = [];
  for (let i = 1; i <= MAX_POSTS; i++) {
    const title = copy[`post.${i}.title`];
    if (!title) continue;
    const tagsRaw = copy[`post.${i}.tags`];
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : undefined;
    out.push({
      title,
      date: copy[`post.${i}.date`],
      summary: copy[`post.${i}.summary`],
      tags,
    });
  }
  return out;
}

/**
 * tailwind-blog — adapted from timlrx/tailwind-nextjs-starter-blog (MIT).
 * Landing-only port: hero (headline + description) + a list of recent
 * post previews. Post pages and MDX pipeline are intentionally out of
 * scope for MVP.
 *
 * Copy slots:
 * - hero.headline       (required, e.g. "Latest")
 * - hero.description    (required)
 * - post.{1..3}.title   (each optional; post hidden if title absent)
 * - post.{1..3}.date    (optional, free-text)
 * - post.{1..3}.summary (optional)
 * - post.{1..3}.tags    (optional, comma-separated)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  const posts = readPosts(c);

  return (
    <div
      className="min-h-screen px-6 py-12 md:py-16"
      style={{
        backgroundColor: "#ffffff",
        color: "#111827",
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <main className="mx-auto w-full max-w-3xl divide-y divide-gray-200">
        <section className="space-y-3 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            {c["hero.headline"]}
          </h1>
          <p className="text-lg leading-7 text-gray-500">{c["hero.description"]}</p>
        </section>

        {posts.length === 0 ? (
          <p className="py-12 text-base text-gray-500">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {posts.map((post, i) => (
              <li key={i} className="py-10">
                <article className="space-y-3">
                  {post.date && (
                    <p className="text-sm font-medium text-gray-500">
                      <time>{post.date}</time>
                    </p>
                  )}
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {post.title}
                  </h2>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium uppercase tracking-wide text-blue-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {post.summary && (
                    <p className="prose max-w-none text-base leading-7 text-gray-600">
                      {post.summary}
                    </p>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
