import Link from "next/link";
import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const wordmark = copy.wordmark ?? "";
    const links = [
        { label: copy.link1Label, href: copy.link1Href },
        { label: copy.link2Label, href: copy.link2Href },
        { label: copy.link3Label, href: copy.link3Href },
    ].filter((l) => l.label && l.href);

    return (
        <nav
            className="flex items-center justify-between px-6 lg:px-12 py-5 border-b"
            style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--card-border)",
                color: "var(--foreground)",
            }}
        >
            <Link
                href="/"
                className="text-sm tracking-wide"
                style={{ fontFamily: "var(--font-heading)" }}
            >
                {wordmark}
            </Link>
            {links.length > 0 && (
                <div
                    className="flex items-center gap-6 text-sm"
                    style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--muted)",
                    }}
                >
                    {links.map((l, i) => (
                        <a
                            key={i}
                            href={l.href}
                            className="transition-colors hover:opacity-80"
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}
