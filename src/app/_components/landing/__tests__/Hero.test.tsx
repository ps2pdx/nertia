import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "../Hero";

describe("landing Hero", () => {
  const defaultProps = {
    headline: "A zero-point website",
    ctaLabel: "Start",
    ctaHref: "/generate",
  };

  it("renders the headline as an h1", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/zero-point/i);
  });

  it("renders the cta as a link to the target href", () => {
    render(<Hero {...defaultProps} />);
    const link = screen.getByRole("link", { name: /start/i });
    expect(link).toHaveAttribute("href", "/generate");
  });

  it("renders optional eyebrow when provided", () => {
    render(<Hero {...defaultProps} eyebrow="EARLY ACCESS" />);
    expect(screen.getByText(/early access/i)).toBeInTheDocument();
  });

  it("renders optional sub when provided", () => {
    render(<Hero {...defaultProps} sub="Your site on a subdomain in under a minute." />);
    expect(screen.getByText(/in under a minute/i)).toBeInTheDocument();
  });

  it("renders without eyebrow or sub", () => {
    const { container } = render(<Hero {...defaultProps} />);
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("does not hardcode copy — every text slot is driven by props", () => {
    const { container } = render(
      <Hero
        eyebrow="ALPHA"
        headline="Unique headline phrase XYZ"
        sub="Sub copy sentinel"
        ctaLabel="Ignite"
        ctaHref="/elsewhere"
      />
    );
    expect(container.textContent).toContain("ALPHA");
    expect(container.textContent).toContain("Unique headline phrase XYZ");
    expect(container.textContent).toContain("Sub copy sentinel");
    expect(container.textContent).toContain("Ignite");
  });

  it("does not leak hire-me / founder / consulting copy (product voice regression guard)", () => {
    const { container } = render(<Hero {...defaultProps} eyebrow="ALPHA" sub="Lorem." />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/built by/i);
    expect(text).not.toMatch(/hire me/i);
    expect(text).not.toMatch(/portfolio/i);
    expect(text).not.toMatch(/available for/i);
    expect(text).not.toMatch(/consulting/i);
    expect(text).not.toMatch(/\bscott\b/i);
  });
});
