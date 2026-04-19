import type { Template } from "@/templates/types";
import { Layout } from "./Layout";

export const chiangV4: Template = {
  id: "chiang-v4",
  displayName: "Chiang V4",
  description:
    "Dark navy + teal accent dev portfolio hero. Monospace teal eyebrow, large name, tagline, slate bio, single outline CTA. Staggered fade-up motion.",
  sourceUrl: "https://github.com/bchiang7/v4",
  sourceAttribution: "template sourced from vercel · brittanychiang-v4",
  license: "MIT",
  tags: ["portfolio", "dev", "dark", "teal", "editorial"],
  Layout,
  copySchema: [
    {
      key: "hero.eyebrow",
      label: "Eyebrow (small monospace teal line)",
      type: "text",
      placeholder: "Hi, my name is",
      required: true,
      maxLength: 40,
    },
    {
      key: "hero.name",
      label: "Name (huge headline)",
      type: "text",
      placeholder: "Sam Rivera.",
      required: true,
      maxLength: 60,
    },
    {
      key: "hero.tagline",
      label: "Tagline (second large line)",
      type: "text",
      placeholder: "I build things for the web.",
      required: true,
      maxLength: 80,
    },
    {
      key: "hero.bio",
      label: "Bio paragraph",
      type: "textarea",
      placeholder:
        "I'm a software engineer specializing in building accessible, human-centered products.",
      required: true,
      maxLength: 320,
    },
    {
      key: "hero.ctaLabel",
      label: "CTA label",
      type: "text",
      placeholder: "Get in touch",
      required: true,
      maxLength: 24,
    },
    {
      key: "hero.ctaHref",
      label: "CTA link",
      type: "text",
      placeholder: "mailto:hello@example.com",
      required: true,
    },
  ],
};
