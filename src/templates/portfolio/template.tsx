import type { Template } from "@/templates/types";
import { Layout } from "./Layout";

export const portfolio: Template = {
  id: "portfolio",
  displayName: "Portfolio",
  description:
    "Personal/creator portfolio with avatar, intro, and about. Soft blur-fade motion on load. Light aesthetic.",
  sourceUrl: "https://github.com/dillionverma/portfolio",
  sourceAttribution:
    "template sourced from vercel · magicui-portfolio by dillionverma",
  license: "MIT",
  tags: ["portfolio", "personal", "creator", "minimal", "light"],
  Layout,
  copySchema: [
    {
      key: "hero.greeting",
      label: "Greeting",
      type: "text",
      placeholder: "Hi, I'm",
      required: true,
      maxLength: 30,
    },
    {
      key: "hero.name",
      label: "Your name",
      type: "text",
      placeholder: "Jane Hernandez",
      required: true,
      maxLength: 40,
    },
    {
      key: "hero.description",
      label: "Tagline",
      type: "textarea",
      placeholder: "Designer and developer based in Portland.",
      required: true,
      maxLength: 200,
    },
    {
      key: "hero.avatarInitials",
      label: "Avatar initials",
      type: "text",
      placeholder: "JH",
      required: true,
      maxLength: 3,
    },
    {
      key: "about.heading",
      label: "About section heading (optional)",
      type: "text",
      placeholder: "About",
      required: false,
      maxLength: 30,
    },
    {
      key: "about.body",
      label: "About — a paragraph or two",
      type: "textarea",
      placeholder: "I make things that feel good — websites, brand identities, and the occasional animated loop.",
      required: false,
      maxLength: 800,
    },
  ],
};
