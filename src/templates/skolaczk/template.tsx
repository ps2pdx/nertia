import type { Template } from "@/templates/types";
import { Layout } from "./Layout";

export const skolaczk: Template = {
  id: "skolaczk",
  displayName: "Skolaczk Starter",
  description:
    "Minimal centered marketing variant. Thin top nav with brand wordmark, monospace gradient-accent headline, and clean primary + secondary CTAs.",
  sourceUrl: "https://github.com/Skolaczk/next-starter",
  sourceAttribution: "template sourced from vercel · next-starter-skolaczk",
  license: "MIT",
  tags: ["marketing", "minimal", "monospace", "centered", "starter"],
  Layout,
  copySchema: [
    {
      key: "nav.brand",
      label: "Brand wordmark (top nav)",
      type: "text",
      placeholder: "acme",
      required: true,
      maxLength: 30,
    },
    {
      key: "hero.accent",
      label: "Headline accent word",
      type: "text",
      placeholder: "Acme",
      required: true,
      maxLength: 30,
    },
    {
      key: "hero.headline",
      label: "Headline (rest of phrase)",
      type: "text",
      placeholder: "starter template",
      required: true,
      maxLength: 80,
    },
    {
      key: "hero.sub",
      label: "Sub copy",
      type: "textarea",
      placeholder: "An opinionated minimal starting point for the next thing.",
      required: true,
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
      placeholder: "https://example.com/start",
      required: true,
    },
    {
      key: "hero.secondaryCtaLabel",
      label: "Secondary CTA label (optional)",
      type: "text",
      placeholder: "GitHub",
      required: false,
      maxLength: 24,
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
