import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../Layout";
import type { Site } from "@/templates/types";

const fullCopy: Record<string, string> = {
  "hero.name": "Sam Kraft",
  "hero.tagline": "I design & build interfaces.",
  "work.heading": "Selected projects",
  "work.1.time": "2024",
  "work.1.title": "Tracklib",
  "work.1.description": "Helped redesign the world's largest sample library.",
  "work.2.time": "2023",
  "work.2.title": "Bitrefill",
  "work.2.description": "Fast crypto checkout for everyday spending.",
  "work.3.time": "2022",
  "work.3.title": "Trail Routes",
  "work.3.description": "Side project for sharing running routes.",
};

const fullSite: Site = { slug: "sam", templateId: "samuel-kraft", copy: fullCopy };

describe("samuel-kraft Layout", () => {
  it("renders the name as h1", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/sam kraft/i);
  });

  it("renders the tagline", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/design & build interfaces/i)).toBeInTheDocument();
  });

  it("renders the work section heading", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByRole("heading", { name: /selected projects/i })).toBeInTheDocument();
  });

  it("defaults work heading when not provided", () => {
    const { "work.heading": _h, ...restCopy } = fullCopy;
    render(<Layout site={{ ...fullSite, copy: restCopy }} />);
    expect(screen.getByRole("heading", { name: /selected work/i })).toBeInTheDocument();
  });

  it("renders each provided project with title, description, and time", () => {
    render(<Layout site={fullSite} />);
    expect(screen.getByText(/tracklib/i)).toBeInTheDocument();
    expect(screen.getByText(/bitrefill/i)).toBeInTheDocument();
    expect(screen.getByText(/trail routes/i)).toBeInTheDocument();
    expect(screen.getByText(/sample library/i)).toBeInTheDocument();
    expect(screen.getByText(/^2024$/)).toBeInTheDocument();
  });

  it("omits projects with no title", () => {
    const copy = { ...fullCopy };
    delete copy["work.2.title"];
    render(<Layout site={{ ...fullSite, copy }} />);
    expect(screen.queryByText(/bitrefill/i)).not.toBeInTheDocument();
    expect(screen.getByText(/tracklib/i)).toBeInTheDocument();
  });

  it("omits the entire work section when no projects have titles", () => {
    const minimal: Site = {
      slug: "min",
      templateId: "samuel-kraft",
      copy: { "hero.name": "Jamie", "hero.tagline": "hello" },
    };
    render(<Layout site={minimal} />);
    expect(screen.queryByRole("heading", { name: /selected/i })).not.toBeInTheDocument();
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
