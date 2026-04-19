import type { Template } from "@/templates/types";
import { Layout } from "./Layout";

export const tailwindBlog: Template = {
  id: "tailwind-blog",
  displayName: "Tailwind Blog",
  description:
    "Writer/newsletter landing — hero + recent post previews with tags. Light, generous typography. Landing-only port (no MDX pipeline).",
  sourceUrl: "https://github.com/timlrx/tailwind-nextjs-starter-blog",
  sourceAttribution:
    "template sourced from vercel · tailwind-nextjs-starter-blog",
  license: "MIT",
  tags: ["blog", "writer", "newsletter", "editorial", "light"],
  Layout,
  copySchema: [
    {
      key: "hero.headline",
      label: "Headline",
      type: "text",
      placeholder: "Latest",
      required: true,
      maxLength: 40,
    },
    {
      key: "hero.description",
      label: "Description",
      type: "textarea",
      placeholder: "Notes on craft, software, and small experiments.",
      required: true,
      maxLength: 240,
    },
    { key: "post.1.date", label: "Post 1 — date", type: "text", placeholder: "Apr 18, 2026" },
    { key: "post.1.title", label: "Post 1 — title", type: "text", placeholder: "On writing every day", maxLength: 120 },
    { key: "post.1.summary", label: "Post 1 — summary", type: "textarea", placeholder: "A short field report from a longer practice.", maxLength: 280 },
    { key: "post.1.tags", label: "Post 1 — tags (comma-separated)", type: "text", placeholder: "writing, practice" },
    { key: "post.2.date", label: "Post 2 — date", type: "text", placeholder: "Apr 12, 2026" },
    { key: "post.2.title", label: "Post 2 — title", type: "text", maxLength: 120 },
    { key: "post.2.summary", label: "Post 2 — summary", type: "textarea", maxLength: 280 },
    { key: "post.2.tags", label: "Post 2 — tags", type: "text" },
    { key: "post.3.date", label: "Post 3 — date", type: "text" },
    { key: "post.3.title", label: "Post 3 — title", type: "text", maxLength: 120 },
    { key: "post.3.summary", label: "Post 3 — summary", type: "textarea", maxLength: 280 },
    { key: "post.3.tags", label: "Post 3 — tags", type: "text" },
  ],
};
