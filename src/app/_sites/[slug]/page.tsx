import { notFound } from "next/navigation";
import { getSite } from "@/lib/siteStore";
import { Layout as ZeroPointLayout } from "@/directions/zero-point/Layout";
import type { SiteConfig } from "@/directions/types";

export const revalidate = 60;

function renderDirection(site: SiteConfig) {
  switch (site.direction) {
    case "zero-point":
      return <ZeroPointLayout site={site} />;
    default:
      return <ZeroPointLayout site={site} />; // fallback to flagship
  }
}

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) notFound();
  return renderDirection(site);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return {};
  return {
    title: site.copy.hero.headline,
    description: site.copy.hero.sub,
  };
}
