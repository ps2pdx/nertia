import type { Template } from "@/templates/types";
import { Layout } from "./Layout";

export const samuelKraft: Template = {
  id: "samuel-kraft",
  displayName: "Samuel Kraft",
  description:
    "Motion-forward personal/portfolio. Large name + tagline hero, then a Selected Work list with time-stamped project rows. Staggered fade-up motion (--index).",
  sourceUrl: "https://github.com/samuelkraft/samuelkraft-next",
  sourceAttribution: "template sourced from vercel · samuelkraft-next",
  license: "MIT",
  tags: ["portfolio", "personal", "creator", "motion", "dark"],
  Layout,
  copySchema: [
    {
      key: "hero.name",
      label: "Your name",
      type: "text",
      placeholder: "Sam Kraft",
      required: true,
      maxLength: 40,
    },
    {
      key: "hero.tagline",
      label: "Tagline",
      type: "text",
      placeholder: "I design & build interfaces.",
      required: true,
      maxLength: 100,
    },
    {
      key: "work.heading",
      label: "Work section heading (optional)",
      type: "text",
      placeholder: "Selected work",
      required: false,
      maxLength: 40,
    },
    { key: "work.1.time", label: "Project 1 — time", type: "text", placeholder: "2024" },
    { key: "work.1.title", label: "Project 1 — title", type: "text", placeholder: "Tracklib", maxLength: 60 },
    { key: "work.1.description", label: "Project 1 — description", type: "textarea", maxLength: 200 },
    { key: "work.2.time", label: "Project 2 — time", type: "text" },
    { key: "work.2.title", label: "Project 2 — title", type: "text", maxLength: 60 },
    { key: "work.2.description", label: "Project 2 — description", type: "textarea", maxLength: 200 },
    { key: "work.3.time", label: "Project 3 — time", type: "text" },
    { key: "work.3.title", label: "Project 3 — title", type: "text", maxLength: 60 },
    { key: "work.3.description", label: "Project 3 — description", type: "textarea", maxLength: 200 },
  ],
};
