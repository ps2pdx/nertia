import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "../HowItWorks";

describe("HowItWorks", () => {
  const steps = [
    { label: "Brief", description: "Tell us the shape of the thing." },
    { label: "Generate", description: "AI picks a direction, writes the copy." },
    { label: "Live", description: "Your site at a subdomain, ready to share." },
  ];

  it("renders one item per step", () => {
    render(<HowItWorks steps={steps} />);
    expect(screen.getByText(/brief/i)).toBeInTheDocument();
    expect(screen.getByText(/generate/i)).toBeInTheDocument();
    expect(screen.getByText(/live/i)).toBeInTheDocument();
  });

  it("renders descriptions when provided", () => {
    render(<HowItWorks steps={steps} />);
    expect(screen.getByText(/ai picks a direction/i)).toBeInTheDocument();
  });

  it("renders without descriptions", () => {
    render(<HowItWorks steps={[{ label: "One" }, { label: "Two" }, { label: "Three" }]} />);
    expect(screen.getByText(/one/i)).toBeInTheDocument();
    expect(screen.getByText(/two/i)).toBeInTheDocument();
    expect(screen.getByText(/three/i)).toBeInTheDocument();
  });

  it("numbers each step sequentially", () => {
    render(<HowItWorks steps={steps} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("does not leak hire-me copy", () => {
    const { container } = render(<HowItWorks steps={steps} />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/built by/i);
    expect(text).not.toMatch(/hire me/i);
    expect(text).not.toMatch(/\bscott\b/i);
  });
});
