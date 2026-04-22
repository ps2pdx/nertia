import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const initials = copy.avatarInitials ?? "";
    const name = copy.name ?? "";
    const tagline = copy.tagline ?? "";
    const bio = copy.bio ?? "";

    const links = [1, 2, 3, 4, 5, 6]
        .map((i) => ({
            label: copy[`link${i}Label`],
            href: copy[`link${i}Href`],
        }))
        .filter((l) => l.label && l.href);

    return (
        <section
            className="min-h-[80svh] px-6 py-16 flex flex-col items-center bg-[var(--background)] text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className="w-full max-w-md flex flex-col items-center text-center">
                {initials && (
                    <div
                        className="w-20 h-20 rounded-full border-2 flex items-center justify-center text-xl mb-6"
                        style={{
                            borderColor: "var(--accent)",
                            color: "var(--accent)",
                            fontFamily: "var(--font-heading)",
                        }}
                    >
                        {initials}
                    </div>
                )}
                <h1
                    className="text-2xl font-bold mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    {name}
                </h1>
                {tagline && (
                    <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
                        {tagline}
                    </p>
                )}
                {bio && (
                    <p
                        className="text-sm mb-8 max-w-sm leading-relaxed"
                        style={{ color: "var(--foreground)" }}
                    >
                        {bio}
                    </p>
                )}
                <div className="w-full flex flex-col gap-3 mt-6">
                    {links.map((l, i) => (
                        <a
                            key={i}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-3 border rounded-full text-sm text-center transition-colors hover:opacity-80"
                            style={{
                                borderColor: "var(--accent)",
                                color: "var(--accent)",
                            }}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
