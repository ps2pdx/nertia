import { getSection } from "@/sections";
import type { CompositionSite } from "@/lib/siteShapes";

/**
 * Renders a composition-keyed Site:
 *   - Injects the user's brand color as `--accent` on the root wrapper so
 *     every section's accent colors resolve to that hex. Everything else
 *     (dark/light mode, foreground/background, fonts, muted, card borders)
 *     cascades from nertia's globals.css via prefers-color-scheme.
 *   - Walks composition.sections in order. For each instance, slices
 *     site.copy down to just that instance's slots (strips the instanceId
 *     prefix), looks up the section component in the registry, renders.
 *   - Appends the nertia attribution footer.
 *
 * Sections not found in the registry are skipped with a dev-only warning
 * rather than rendered as broken boxes.
 */
export default function CompositionRenderer({ site }: { site: CompositionSite }) {
    const wrapperStyle: React.CSSProperties = {
        ["--accent" as string]: site.brandColor,
    };

    return (
        <div
            style={wrapperStyle}
            className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"
        >
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
            className="py-5 text-center text-xs border-t"
            style={{
                color: "var(--muted)",
                borderColor: "var(--card-border)",
                fontFamily: "var(--font-body)",
            }}
        >
            <a href="https://nertia.ai" style={{ color: "inherit" }}>
                built on nertia
            </a>
        </footer>
    );
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
