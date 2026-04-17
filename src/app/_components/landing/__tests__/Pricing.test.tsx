import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pricing } from "../Pricing";

describe("Pricing", () => {
  const tiers = [
    {
      name: "Free",
      tagline: "Your site on a subdomain.",
      price: "$0",
      bullets: ["AI picks a direction", "Edit anytime", "Hosted forever"],
      cta: { label: "Start", href: "/generate" },
    },
    {
      name: "Custom domain",
      tagline: "Your own .com with a built-to-taste refresh.",
      price: "from $99",
      bullets: ["Custom domain included", "30-min creative consult", "Bespoke build"],
      cta: { label: "Book consult", href: "/consult" },
    },
  ];

  it("renders each tier", () => {
    render(<Pricing tiers={tiers} />);
    expect(screen.getByRole("heading", { name: /^free$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /custom domain/i })).toBeInTheDocument();
  });

  it("renders price for each tier", () => {
    render(<Pricing tiers={tiers} />);
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText(/from \$99/i)).toBeInTheDocument();
  });

  it("renders bullets per tier", () => {
    render(<Pricing tiers={tiers} />);
    expect(screen.getByText(/ai picks a direction/i)).toBeInTheDocument();
    expect(screen.getByText(/bespoke build/i)).toBeInTheDocument();
  });

  it("renders each cta as a link to its href", () => {
    render(<Pricing tiers={tiers} />);
    expect(screen.getByRole("link", { name: /start/i })).toHaveAttribute("href", "/generate");
    expect(screen.getByRole("link", { name: /book consult/i })).toHaveAttribute("href", "/consult");
  });

  it("does not leak hire-me / founder copy on the free tier", () => {
    const { container } = render(<Pricing tiers={[tiers[0]]} />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/built by/i);
    expect(text).not.toMatch(/hire me/i);
    expect(text).not.toMatch(/\bscott\b/i);
    expect(text).not.toMatch(/portfolio/i);
  });
});
