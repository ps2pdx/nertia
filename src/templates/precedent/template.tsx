import type { Template } from "@/templates/types";
import { Layout } from "./Layout";

export const precedent: Template = {
  id: "precedent",
  displayName: "Precedent",
  description:
    "Clean, centered marketing hero with staggered fade-up motion and a pill/headline/CTA stack.",
  sourceUrl: "https://github.com/steven-tey/precedent",
  sourceAttribution: "template sourced from vercel · precedent by steven-tey",
  license: "MIT",
  tags: ["marketing", "hero", "centered", "gradient-text", "clean"],
  Layout,
  copySchema: [
    {
      key: "hero.pill",
      label: "Eyebrow pill (optional)",
      type: "text",
      placeholder: "New · now in beta",
      required: false,
      maxLength: 60,
    },
    {
      key: "hero.headline",
      label: "Headline",
      type: "text",
      placeholder: "Building blocks for your next idea",
      required: true,
      maxLength: 120,
    },
    {
      key: "hero.sub",
      label: "Sub copy",
      type: "textarea",
      placeholder: "A one-sentence description of what you do.",
      required: false,
      maxLength: 220,
    },
    {
      key: "hero.primaryCtaLabel",
      label: "Primary CTA label",
      type: "text",
      placeholder: "Get started",
      required: true,
      maxLength: 24,
    },
    {
      key: "hero.primaryCtaHref",
      label: "Primary CTA link",
      type: "text",
      placeholder: "https://example.com/signup",
      required: true,
    },
    {
      key: "hero.secondaryCtaLabel",
      label: "Secondary CTA label (optional)",
      type: "text",
      placeholder: "View on GitHub",
      required: false,
      maxLength: 28,
    },
    {
      key: "hero.secondaryCtaHref",
      label: "Secondary CTA link (optional)",
      type: "text",
      placeholder: "https://github.com/you/project",
      required: false,
    },
  ],
};
