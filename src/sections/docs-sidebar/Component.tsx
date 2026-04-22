import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const title = copy.title || "Docs";
    const contentHeading = copy.contentHeading || "";
    const contentBody = copy.contentBody ?? "";

    const navItems = [1, 2, 3, 4, 5, 6]
        .map((i) => ({
            label: copy[`navLabel${i}`],
            href: copy[`navHref${i}`],
        }))
        .filter((n) => n.label && n.href);

    return (
        <section
            className="bg-[var(--background)] text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row">
                <aside
                    className="w-full md:w-64 md:min-h-[70svh] px-6 py-8 md:py-12 bg-[var(--card-bg)] md:border-r"
                    style={{ borderColor: "var(--card-border)" }}
                >
                    <p
                        className="text-xs uppercase tracking-[0.3em] mb-6"
                        style={{ color: "var(--accent)" }}
                    >
                        {title}
                    </p>
                    {navItems.length > 0 && (
                        <nav className="flex flex-col gap-3">
                            {navItems.map((n, i) => (
                                <a
                                    key={i}
                                    href={n.href}
                                    className="text-sm transition-colors hover:text-[var(--accent)]"
                                    style={{ color: "var(--foreground)" }}
                                >
                                    {n.label}
                                </a>
                            ))}
                        </nav>
                    )}
                </aside>
                <div className="flex-1 px-6 py-10 md:py-16">
                    {contentHeading && (
                        <h2
                            className="text-3xl md:text-4xl font-bold mb-6"
                            style={{
                                fontFamily: "var(--font-heading)",
                                color: "var(--foreground)",
                            }}
                        >
                            {contentHeading}
                        </h2>
                    )}
                    {contentBody && (
                        <p
                            className="text-base md:text-lg leading-relaxed max-w-2xl"
                            style={{ color: "var(--foreground)" }}
                        >
                            {contentBody}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
