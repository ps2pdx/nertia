import { getTemplate } from "@/templates";
import type { Template } from "@/templates/types";
import type { LegacySite } from "@/lib/siteShapes";
import { notFound } from "next/navigation";

/**
 * Renders a legacy template-keyed Site — the pre-composition shape.
 * Existing 16 sites in Firebase go through this path. When all sites
 * are migrated to compositions, this + src/templates/ can retire.
 */
export default function LegacyTemplateRenderer({ site }: { site: LegacySite }) {
    const template = getTemplate(site.templateId);
    if (!template) notFound();
    const { Layout } = template;
    return (
        <>
            <Layout site={site} />
            <Attribution template={template} />
        </>
    );
}

function Attribution({ template }: { template: Template }) {
    return (
        <footer
            className="py-5 text-center text-xs"
            style={{
                color: "var(--attribution-fg, #6b6b6b)",
                borderTop: "1px solid var(--attribution-border, #1f1f1f)",
            }}
        >
            {template.sourceAttribution} ·{" "}
            <a href="https://nertia.ai" style={{ color: "inherit" }}>
                built on nertia
            </a>
        </footer>
    );
}
