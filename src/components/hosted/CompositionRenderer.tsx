import { getSection } from "@/sections";
import type { CompositionSite, Tokens } from "@/lib/siteShapes";

/**
 * Renders a composition-keyed Site:
 *   - Injects tokens as CSS custom properties on the root wrapper so every
 *     section can style with var(--token-bg), var(--token-accent), etc.
 *   - Walks composition.sections in order. For each instance, slices
 *     site.copy down to just that instance's slots (strips the instanceId
 *     prefix), looks up the section component in the registry, renders.
 *   - Appends the nertia attribution footer.
 *
 * Sections not found in the registry are skipped with a dev-only warning
 * rather than rendered as broken boxes.
 */
export default function CompositionRenderer({ site }: { site: CompositionSite }) {
    const tokenStyle = tokensToCssVars(site.tokens);

    return (
        <div style={tokenStyle} className="min-h-screen">
            {site.composition.sections.map((inst) => {
                const section = getSection(inst.id);
                if (!section) {
                    if (process.env.NODE_ENV !== "production") {
                        console.warn(
                            `[CompositionRenderer] unknown section id "${inst.id}" on site ${site.slug}`,
                        );
                    }
                    return null;
                }
                const copyForInstance = extractInstanceCopy(site.copy, inst.instanceId);
                const SectionComponent = section.Component;
                return <SectionComponent key={inst.instanceId} copy={copyForInstance} />;
            })}
            <Attribution />
        </div>
    );
}

function Attribution() {
    return (
        <footer
            className="py-5 text-center text-xs"
            style={{
                color: "var(--token-muted, #6b6b6b)",
                borderTop: "1px solid var(--token-muted, #1f1f1f)",
                fontFamily: "var(--token-font-body)",
            }}
        >
            <a href="https://nertia.ai" style={{ color: "inherit" }}>
                built on nertia
            </a>
        </footer>
    );
}

function tokensToCssVars(tokens: Tokens): React.CSSProperties {
    const { palette: p, fontPair: f } = tokens;
    return {
        ["--token-bg" as string]: p.bg,
        ["--token-fg" as string]: p.fg,
        ["--token-muted" as string]: p.muted,
        ["--token-accent" as string]: p.accent,
        ["--token-heading-start" as string]: p.headingStart,
        ["--token-heading-end" as string]: p.headingEnd,
        ["--token-font-heading" as string]: f.heading,
        ["--token-font-body" as string]: f.body,
        backgroundColor: p.bg,
        color: p.fg,
    };
}

/**
 * Slice site.copy to just the slots belonging to one section instance,
 * stripping the `{instanceId}.` prefix so components receive
 * `{ headline, sub, ... }` and not `{ "hero-1.headline", ... }`.
 */
function extractInstanceCopy(
    siteCopy: Record<string, string>,
    instanceId: string,
): Record<string, string> {
    const prefix = `${instanceId}.`;
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(siteCopy)) {
        if (key.startsWith(prefix)) {
            out[key.slice(prefix.length)] = value;
        }
    }
    return out;
}
