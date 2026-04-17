import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "@/directions/zero-point/Layout";
import sample from "@/directions/zero-point/sample.json";
import type { SiteConfig } from "@/directions/types";

describe("zero-point Layout", () => {
  const site = sample as unknown as SiteConfig;

  it("renders the headline", () => {
    render(<Layout site={site} />);
    expect(screen.getByRole("heading", { name: /from vacuum, everything/i })).toBeInTheDocument();
  });

  it("renders the eyebrow", () => {
    render(<Layout site={site} />);
    expect(screen.getByText(/zero-point/i)).toBeInTheDocument();
  });

  it("renders the cta", () => {
    render(<Layout site={site} />);
    expect(screen.getAllByRole("button", { name: /begin/i }).length).toBeGreaterThan(0);
  });

  it("renders all sections", () => {
    render(<Layout site={site} />);
    expect(screen.getByText(/latent/i)).toBeInTheDocument();
  });

  it("applies palette as inline CSS variables", () => {
    const { container } = render(<Layout site={site} />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.getPropertyValue("--bg")).toBe("#0a0a0a");
    expect(root.style.getPropertyValue("--accent")).toBe("#00d4ff");
  });
});
