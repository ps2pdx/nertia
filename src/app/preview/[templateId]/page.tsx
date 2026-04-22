import { notFound } from "next/navigation";
import { getTemplate } from "@/templates";
import type { CopySchemaField, Site, Template } from "@/templates/types";

function fallbackFor(field: CopySchemaField): string {
  if (field.placeholder) return field.placeholder;
  return `[${field.label}]`;
}

function syntheticSite(template: Template): Site {
  const copy: Record<string, string> = {};
  for (const field of template.copySchema) {
    copy[field.key] = fallbackFor(field);
  }
  return {
    slug: `preview-${template.id}`,
    templateId: template.id,
    copy,
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();

  const site = syntheticSite(template);
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
