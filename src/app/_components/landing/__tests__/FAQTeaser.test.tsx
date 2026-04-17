import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FAQTeaser } from "../FAQTeaser";

describe("FAQTeaser", () => {
  const items = [
    { question: "Is it really free?", answer: "Yes — the subdomain tier is $0 forever." },
    { question: "Can I edit after?", answer: "Yes — regenerate any section or swap palette inline." },
    { question: "What if I want my own domain?", answer: "Upgrade any time — bespoke build + consult." },
  ];

  it("renders each question", () => {
    render(<FAQTeaser items={items} />);
    expect(screen.getByText(/really free/i)).toBeInTheDocument();
    expect(screen.getByText(/edit after/i)).toBeInTheDocument();
    expect(screen.getByText(/own domain/i)).toBeInTheDocument();
  });

  it("renders each answer", () => {
    render(<FAQTeaser items={items} />);
    expect(screen.getByText(/subdomain tier is \$0/i)).toBeInTheDocument();
    expect(screen.getByText(/swap palette inline/i)).toBeInTheDocument();
  });

  it("links to the full FAQ page", () => {
    render(<FAQTeaser items={items} fullFaqHref="/faq" />);
    const link = screen.getByRole("link", { name: /all faqs/i });
    expect(link).toHaveAttribute("href", "/faq");
  });

  it("omits the link when no href is provided", () => {
    render(<FAQTeaser items={items} />);
    expect(screen.queryByRole("link", { name: /all faqs/i })).not.toBeInTheDocument();
  });

  it("does not leak hire-me copy", () => {
    const { container } = render(<FAQTeaser items={items} />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/built by/i);
    expect(text).not.toMatch(/hire me/i);
    expect(text).not.toMatch(/\bscott\b/i);
  });
});
