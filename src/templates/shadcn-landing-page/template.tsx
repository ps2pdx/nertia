import type { Template } from "@/templates/types";
import { Layout } from "./Layout";

export const shadcnLandingPage: Template = {
  id: "shadcn-landing-page",
  displayName: "Shadcn Landing",
  description:
    "Centered marketing hero with two-color gradient accent words, sub copy, and a primary + optional secondary CTA. Dark, clean, utility-first.",
  sourceUrl: "https://github.com/leoMirandaa/shadcn-landing-page",
  sourceAttribution:
    "template sourced from vercel · shadcn-landing-page by leoMirandaa",
  license: "MIT",
  tags: ["marketing", "hero", "centered", "gradient-text", "dark", "shadcn"],
  Layout,
  copySchema: [
    {
      key: "hero.accentPrimary",
      label: "Accent word (lead)",
      type: "text",
      placeholder: "Acme",
      required: true,
      maxLength: 30,
    },
    {
      key: "hero.headline",
      label: "Headline (mid-text between accents)",
      type: "text",
      placeholder: "landing page for",
      required: true,
      maxLength: 80,
    },
    {
      key: "hero.accentSecondary",
      label: "Accent word (secondary, optional)",
      type: "text",
      placeholder: "small teams",
      required: false,
      maxLength: 30,
    },
    {
      key: "hero.headlineSuffix",
      label: "Headline tail (optional)",
      type: "text",
      placeholder: "shipping fast",
      required: false,
      maxLength: 60,
    },
    {
      key: "hero.sub",
      label: "Sub copy",
      type: "textarea",
      placeholder: "An opinionated marketing surface that adapts to your copy.",
      required: true,
      maxLength: 220,
    },
    {
      key: "hero.primaryCtaLabel",
      label: "Primary CTA label",
      type: "text",
      placeholder: "Start free",
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
