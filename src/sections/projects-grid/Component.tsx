import type { SectionProps } from "../types";

interface Project {
    title: string;
    desc: string;
    imageUrl: string;
}

function projectFrom(copy: Record<string, string>, n: 1 | 2 | 3 | 4): Project {
    return {
        title: copy[`project${n}Title`] ?? "",
        desc: copy[`project${n}Desc`] ?? "",
        imageUrl: copy[`project${n}ImageUrl`] ?? "",
    };
}

export function Component({ copy }: SectionProps) {
    const heading = copy.heading || "Selected work";
    const projects: Project[] = [
        projectFrom(copy, 1),
        projectFrom(copy, 2),
        projectFrom(copy, 3),
        projectFrom(copy, 4),
    ].filter((p) => p.title || p.desc || p.imageUrl);

    return (
        <section
            className="px-6 py-24 bg-[var(--background)] text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className="max-w-5xl mx-auto">
                <p
                    className="text-xs uppercase tracking-[0.3em] mb-10"
                    style={{ color: "var(--accent)" }}
                >
                    {heading}
                </p>
                {projects.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                        Add projects to populate this grid.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {projects.map((p, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-3 bg-[var(--card-bg)] border rounded-2xl overflow-hidden"
                                style={{ borderColor: "var(--card-border)" }}
                            >
                                {p.imageUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={p.imageUrl}
                                        alt={p.title}
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                )}
                                <div className="p-5 flex flex-col gap-2">
                                    {p.title && (
                                        <h3
                                            className="text-lg font-semibold"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                color: "var(--foreground)",
                                            }}
                                        >
                                            {p.title}
                                        </h3>
                                    )}
                                    {p.desc && (
                                        <p
                                            className="text-sm leading-relaxed"
                                            style={{ color: "var(--muted)" }}
                                        >
                                            {p.desc}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
