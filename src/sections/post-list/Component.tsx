import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const headline = copy.headline ?? "";
    const description = copy.description ?? "";

    const posts = [1, 2, 3]
        .map((i) => ({
            date: copy[`post${i}Date`] ?? "",
            title: copy[`post${i}Title`] ?? "",
            summary: copy[`post${i}Summary`] ?? "",
        }))
        .filter((p) => p.title);

    return (
        <section
            className="px-6 py-24 bg-[var(--token-bg)] text-[var(--token-fg)]"
            style={{ fontFamily: "var(--token-font-body)" }}
        >
            <div className="max-w-3xl mx-auto">
                <h1
                    className="text-4xl sm:text-5xl font-bold mb-4"
                    style={{ fontFamily: "var(--token-font-heading)" }}
                >
                    {headline}
                </h1>
                {description && (
                    <p
                        className="text-base mb-16"
                        style={{ color: "var(--token-muted)" }}
                    >
                        {description}
                    </p>
                )}
                <div className="flex flex-col gap-10">
                    {posts.map((p, i) => (
                        <article
                            key={i}
                            className="border-b pb-10 last:border-b-0 last:pb-0"
                            style={{ borderColor: "var(--token-muted)" }}
                        >
                            {p.date && (
                                <p
                                    className="text-xs tracking-wide uppercase mb-2"
                                    style={{ color: "var(--token-muted)" }}
                                >
                                    {p.date}
                                </p>
                            )}
                            <h2
                                className="text-2xl font-semibold mb-3"
                                style={{ fontFamily: "var(--token-font-heading)" }}
                            >
                                {p.title}
                            </h2>
                            {p.summary && (
                                <p
                                    className="text-base leading-relaxed"
                                    style={{ color: "var(--token-muted)" }}
                                >
                                    {p.summary}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
