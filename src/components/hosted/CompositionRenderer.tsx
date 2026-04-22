import type { CompositionSite } from "@/lib/siteShapes";

/**
 * Renders a composition-keyed Site by walking `site.composition.sections`
 * and rendering each section from the registry. Phase 1 is a placeholder —
 * Phase 2 wires the actual section registry and token injection.
 */
export default function CompositionRenderer({ site }: { site: CompositionSite }) {
    return (
        <main className="mx-auto max-w-3xl px-6 py-16">
            <p className="text-xs tracking-[0.2em] uppercase text-muted mb-4">
                Composition renderer · placeholder
            </p>
            <h1 className="text-3xl font-bold mb-6">{site.slug}</h1>
            <pre className="text-xs overflow-x-auto bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded">
                {JSON.stringify(
                    {
                        composition: site.composition,
                        tokens: site.tokens,
                        copy: site.copy,
                    },
                    null,
                    2,
                )}
            </pre>
            <p className="text-xs text-muted mt-4">
                Section components land in Phase 2.
            </p>
        </main>
    );
}
