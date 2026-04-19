import { notFound } from "next/navigation";
import { getSite } from "@/lib/siteStore";
import { getTemplate } from "@/templates";
import type { Template } from "@/templates/types";

export const revalidate = 60;

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) notFound();

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return {};
  return {
    title: site.copy["hero.headline"] ?? slug,
    description: site.copy["hero.sub"] ?? "",
  };
}
