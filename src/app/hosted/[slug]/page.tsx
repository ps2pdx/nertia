import { notFound } from "next/navigation";
import { getSite } from "@/lib/siteStore";
import { isCompositionSite } from "@/lib/siteShapes";
import LegacyTemplateRenderer from "@/components/hosted/LegacyTemplateRenderer";
import CompositionRenderer from "@/components/hosted/CompositionRenderer";

export const revalidate = 60;

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) notFound();

  if (isCompositionSite(site)) {
    return <CompositionRenderer site={site} />;
  }
  return <LegacyTemplateRenderer site={site} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return {};
  if (isCompositionSite(site)) {
    // best-effort: pick first copy value as title; sections will own metadata later
    const firstCopy = Object.values(site.copy)[0] ?? slug;
    return { title: firstCopy, description: "" };
  }
  return {
    title: site.copy["hero.headline"] ?? slug,
    description: site.copy["hero.sub"] ?? "",
  };
}
