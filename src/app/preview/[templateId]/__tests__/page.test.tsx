import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Template, Site, CopySchemaField } from "@/templates/types";

const { mockGetTemplate, mockNotFound } = vi.hoisted(() => ({
  mockGetTemplate: vi.fn(),
  mockNotFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/templates", () => ({
  getTemplate: mockGetTemplate,
}));

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

import PreviewPage from "@/app/preview/[templateId]/page";

const layoutSpy = vi.fn();

function makeTemplate(copySchema: CopySchemaField[]): Template {
  return {
    id: "fake",
    displayName: "Fake",
    description: "x",
    sourceUrl: "https://example.com/source",
    sourceAttribution: "template sourced from vercel · fake by tester",
    license: "MIT",
    tags: [],
    copySchema,
    Layout: ({ site }: { site: Site }) => {
      layoutSpy(site);
      return <div data-testid="layout">{site.copy["hero.headline"] ?? ""}</div>;
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("/preview/[templateId]", () => {
  it("calls notFound when template does not exist", async () => {
    mockGetTemplate.mockReturnValue(null);
    await expect(
      PreviewPage({ params: Promise.resolve({ templateId: "nope" }), searchParams: Promise.resolve({}) }),
    ).rejects.toThrow(/NEXT_NOT_FOUND/);
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders the template Layout when template exists", async () => {
    mockGetTemplate.mockReturnValue(
      makeTemplate([
        { key: "hero.headline", label: "Headline", type: "text", placeholder: "Say what you do" },
      ]),
    );
    const ui = await PreviewPage({ params: Promise.resolve({ templateId: "fake" }), searchParams: Promise.resolve({}) });
    render(ui);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("builds synthetic copy from each copySchema placeholder", async () => {
    mockGetTemplate.mockReturnValue(
      makeTemplate([
        { key: "hero.pill", label: "Pill", type: "text", placeholder: "Pill placeholder" },
        { key: "hero.headline", label: "Headline", type: "text", placeholder: "Headline placeholder" },
        { key: "hero.sub", label: "Sub", type: "textarea", placeholder: "Sub placeholder" },
      ]),
    );
    const ui = await PreviewPage({ params: Promise.resolve({ templateId: "fake" }), searchParams: Promise.resolve({}) });
    render(ui);
    expect(layoutSpy).toHaveBeenCalledTimes(1);
    const site = layoutSpy.mock.calls[0][0] as Site;
    expect(site.templateId).toBe("fake");
    expect(site.copy["hero.pill"]).toBe("Pill placeholder");
    expect(site.copy["hero.headline"]).toBe("Headline placeholder");
    expect(site.copy["hero.sub"]).toBe("Sub placeholder");
  });

  it("uses a sensible fallback when a field has no placeholder", async () => {
    mockGetTemplate.mockReturnValue(
      makeTemplate([{ key: "hero.headline", label: "Headline", type: "text" }]),
    );
    const ui = await PreviewPage({ params: Promise.resolve({ templateId: "fake" }), searchParams: Promise.resolve({}) });
    render(ui);
    const site = layoutSpy.mock.calls[0][0] as Site;
    expect(typeof site.copy["hero.headline"]).toBe("string");
    expect(site.copy["hero.headline"].length).toBeGreaterThan(0);
  });

  it("renders the Attribution footer with the template's source attribution", async () => {
    mockGetTemplate.mockReturnValue(
      makeTemplate([{ key: "hero.headline", label: "Headline", type: "text", placeholder: "x" }]),
    );
    const ui = await PreviewPage({ params: Promise.resolve({ templateId: "fake" }), searchParams: Promise.resolve({}) });
    render(ui);
    expect(screen.getByText(/template sourced from vercel · fake by tester/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /built on nertia/i })).toBeInTheDocument();
  });

  it("uses a preview-marker slug on the synthetic site", async () => {
    mockGetTemplate.mockReturnValue(
      makeTemplate([{ key: "hero.headline", label: "Headline", type: "text", placeholder: "x" }]),
    );
    const ui = await PreviewPage({ params: Promise.resolve({ templateId: "fake" }), searchParams: Promise.resolve({}) });
    render(ui);
    const site = layoutSpy.mock.calls[0][0] as Site;
    expect(site.slug).toMatch(/preview/i);
  });

  it("injects CSS variables into a style tag when ?v= is a valid theme token", async () => {
    const { encodeTheme } = await import("@/lib/brandContext");
    const variant = {
      id: "test-1",
      label: "test",
      palette: {
        bg: "#111111",
        fg: "#eeeeee",
        muted: "#888888",
        accent: "#00ffaa",
        headingStart: "#ffffff",
        headingEnd: "#aaaaaa",
      },
      fontPair: { heading: "'Fraunces', serif", body: "'Inter', sans-serif" },
    };
    const v = encodeTheme(variant);
    mockGetTemplate.mockReturnValue(
      makeTemplate([{ key: "hero.headline", label: "Headline", type: "text", placeholder: "x" }]),
    );
    const ui = await PreviewPage({
      params: Promise.resolve({ templateId: "fake" }),
      searchParams: Promise.resolve({ v }),
    });
    const { container } = render(ui);
    const style = container.querySelector("style");
    expect(style).not.toBeNull();
    const css = style?.textContent ?? "";
    expect(css).toContain("--hero-bg:#111111");
    expect(css).toContain("--hero-accent:#00ffaa");
    expect(css).toContain("--hero-font-heading:'Fraunces', serif");
  });

  it("ignores invalid ?v= tokens and renders defaults without a style tag", async () => {
    mockGetTemplate.mockReturnValue(
      makeTemplate([{ key: "hero.headline", label: "Headline", type: "text", placeholder: "x" }]),
    );
    const ui = await PreviewPage({
      params: Promise.resolve({ templateId: "fake" }),
      searchParams: Promise.resolve({ v: "not-a-real-token!!!" }),
    });
    const { container } = render(ui);
    expect(container.querySelector("style")).toBeNull();
  });
});
