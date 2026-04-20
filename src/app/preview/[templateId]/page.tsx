import { notFound } from "next/navigation";
import { getTemplate } from "@/templates";
import type { CopySchemaField, Site, Template } from "@/templates/types";
import { decodeTheme, themeToCssVars } from "@/lib/brandContext";

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

function readVParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();

  const resolvedSearchParams = await searchParams;
  const vToken = readVParam(resolvedSearchParams.v);
  const variant = vToken ? decodeTheme(vToken) : null;
  const cssVars = variant ? themeToCssVars(variant) : "";

  const site = syntheticSite(template);
  const { Layout } = template;
  return (
    <>
      {cssVars && <style>{`:root{${cssVars}}`}</style>}
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
