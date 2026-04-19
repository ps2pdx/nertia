import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const fullCopy: Record<string, string> = {
  "hero.headline": "Latest",
  "hero.description": "Notes on craft, software, and small experiments.",
  "post.1.date": "Apr 18, 2026",
  "post.1.title": "On writing every day",
  "post.1.summary": "A short field report from a longer practice.",
  "post.1.tags": "writing, practice",
  "post.2.date": "Apr 12, 2026",
  "post.2.title": "Why I left the platform",
  "post.2.summary": "And what I'd build instead.",
  "post.3.date": "Mar 30, 2026",
  "post.3.title": "Small tools win",
  "post.3.summary": "Notes on building software a person can hold.",
  "post.3.tags": "tools, design",
};

const fullSite: Site = { slug: "writer", templateId: "tailwind-blog", copy: fullCopy };

describe("tailwind-blog Layout", () => {
  it("renders the hero headline as h1", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/latest/i);
  });

  it("renders the hero description", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/notes on craft/i)).toBeInTheDocument();
  });

  it("renders each provided post with title, summary, and date", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/on writing every day/i)).toBeInTheDocument();
    expect(screen.getByText(/why i left the platform/i)).toBeInTheDocument();
    expect(screen.getByText(/small tools win/i)).toBeInTheDocument();
    expect(screen.getByText(/short field report/i)).toBeInTheDocument();
    expect(screen.getByText(/apr 18, 2026/i)).toBeInTheDocument();
  });

  it("renders comma-separated tags as separate chips", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/^writing$/i)).toBeInTheDocument();
    expect(screen.getByText(/^practice$/i)).toBeInTheDocument();
    expect(screen.getByText(/^tools$/i)).toBeInTheDocument();
    expect(screen.getByText(/^design$/i)).toBeInTheDocument();
  });

  it("omits posts that have no title", () => {
    const copy = { ...fullCopy };
    delete copy["post.2.title"];
    render(<Layout site={{ ...fullSite, copy }} />);
    expect(screen.queryByText(/why i left the platform/i)).not.toBeInTheDocument();
    expect(screen.getByText(/on writing every day/i)).toBeInTheDocument();
  });

  it("renders an empty-state message when no posts have titles", () => {
    const minimal: Site = {
      slug: "min",
      templateId: "tailwind-blog",
      copy: {
        "hero.headline": "Soon",
        "hero.description": "First piece coming.",
      },
    };
    render(<Layout site={minimal} />);
    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
  });

  it("does not render a tags row when post tags absent", () => {
    const copy = { ...fullCopy };
    delete copy["post.2.tags"];
    render(<Layout site={{ ...fullSite, copy }} />);
    // post.1 still has its tags
    expect(screen.getByText(/^writing$/i)).toBeInTheDocument();
  });

  it("contains no founder/hire-me copy", () => {
    const { container } = render(<Layout site={fullSite} />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const phrase of [
      "hire me",
      "built by scott",
      "available for",
      "my portfolio",
      "contact me for",
      "freelance",
      "consulting",
      "resume",
    ]) {
      expect(text).not.toContain(phrase);
    }
  });
});
