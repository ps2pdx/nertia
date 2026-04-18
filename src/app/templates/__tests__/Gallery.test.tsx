import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Template } from "@/templates/types";

vi.mock("@/templates", () => ({
  listTemplates: vi.fn(),
  getTemplate: vi.fn(),
  templates: {},
}));

import { listTemplates } from "@/templates";
import { Gallery } from "../Gallery";

const makeTemplate = (id: string, overrides: Partial<Template> = {}): Template => ({
  id,
  displayName: id,
  description: `${id} description`,
  sourceUrl: `https://github.com/example/${id}`,
  sourceAttribution: `template sourced from vercel · ${id}`,
  license: "MIT",
  tags: ["test"],
  copySchema: [],
  Layout: () => null,
  ...overrides,
});

describe("Gallery", () => {
  it("renders one card per template", () => {
    vi.mocked(listTemplates).mockReturnValue([
      makeTemplate("precedent", { displayName: "Precedent" }),
      makeTemplate("magicui", { displayName: "Magic UI" }),
    ]);
    render(<Gallery />);
    expect(screen.getByRole("heading", { name: /precedent/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /magic ui/i })).toBeInTheDocument();
  });

  it("renders each template's description", () => {
    vi.mocked(listTemplates).mockReturnValue([
      makeTemplate("precedent", {
        displayName: "Precedent",
        description: "Clean centered marketing hero.",
      }),
    ]);
    render(<Gallery />);
    expect(screen.getByText(/clean centered marketing/i)).toBeInTheDocument();
  });

  it("links each card to /generate/{templateId}", () => {
    vi.mocked(listTemplates).mockReturnValue([
      makeTemplate("precedent", { displayName: "Precedent" }),
    ]);
    render(<Gallery />);
    const link = screen.getByRole("link", { name: /precedent/i });
    expect(link).toHaveAttribute("href", "/generate/precedent");
  });

  it("renders tags per template", () => {
    vi.mocked(listTemplates).mockReturnValue([
      makeTemplate("precedent", {
        displayName: "Precedent",
        tags: ["marketing", "hero", "clean"],
      }),
    ]);
    render(<Gallery />);
    expect(screen.getByText(/marketing/i)).toBeInTheDocument();
    expect(screen.getByText(/hero/i)).toBeInTheDocument();
    expect(screen.getByText(/clean/i)).toBeInTheDocument();
  });

  it("shows attribution per template", () => {
    vi.mocked(listTemplates).mockReturnValue([
      makeTemplate("precedent", {
        displayName: "Precedent",
        sourceAttribution: "template sourced from vercel · precedent by steven-tey",
      }),
    ]);
    render(<Gallery />);
    expect(screen.getByText(/precedent by steven-tey/i)).toBeInTheDocument();
  });

  it("renders an empty state when no templates are registered", () => {
    vi.mocked(listTemplates).mockReturnValue([]);
    render(<Gallery />);
    expect(screen.getByTestId("gallery-empty")).toBeInTheDocument();
  });
});
