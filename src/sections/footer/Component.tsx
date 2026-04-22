import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const wordmark = copy.wordmark ?? "";
    const tagline = copy.tagline ?? "";

    return (
        <section
            className="px-6 py-12 bg-[var(--token-bg)] border-t"
            style={{ borderColor: "var(--token-muted)" }}
        >
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                {wordmark && (
                    <p
                        className="text-lg"
                        style={{
                            fontFamily: "var(--token-font-heading)",
                            color: "var(--token-fg)",
                        }}
                    >
                        {wordmark}
                    </p>
                )}
                {tagline && (
                    <p
                        className="text-sm"
                        style={{
                            color: "var(--token-muted)",
                            fontFamily: "var(--token-font-body)",
                        }}
                    >
                        {tagline}
                    </p>
                )}
            </div>
        </section>
    );
}
