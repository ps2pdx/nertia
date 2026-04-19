import type { Template } from "./types";
import { precedent } from "./precedent/template";
import { portfolio } from "./portfolio/template";
import { linkfree } from "./linkfree/template";
import { shadcnLandingPage } from "./shadcn-landing-page/template";
import { tailwindBlog } from "./tailwind-blog/template";
import { skolaczk } from "./skolaczk/template";

/**
 * Template registry. Each template is a Vercel-sourced layout with declared copy slots.
 * Attribution required on every rendered site.
 *
 * To add a template: create src/templates/{id}/ with README.md, template.tsx (exports Template),
 * then import + add to `templates` below.
 */
export const templates: Record<string, Template> = {
  [precedent.id]: precedent,
  [portfolio.id]: portfolio,
  [shadcnLandingPage.id]: shadcnLandingPage,
  [linkfree.id]: linkfree,
  [tailwindBlog.id]: tailwindBlog,
  [skolaczk.id]: skolaczk,
};

export function getTemplate(id: string): Template | null {
  return templates[id] ?? null;
}

export function listTemplates(): Template[] {
  return Object.values(templates);
}
