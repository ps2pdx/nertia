import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Direction } from "@/directions/types";

vi.mock("@/directions", () => ({
  listStableDirections: vi.fn(),
  directions: {},
  getDirection: vi.fn(),
}));

import { listStableDirections } from "@/directions";
import { DirectionSampler } from "../DirectionSampler";

const makeDirection = (name: string, overrides: Partial<Direction> = {}): Direction => ({
  name,
  displayName: name.replace(/-/g, " "),
  tags: ["example"],
  paletteConstraints: {
    mode: "dark",
    accentCount: 1,
    backgroundBias: "near-black",
    saturation: "muted-to-vivid-accent",
  },
  slotSchema: {
    hero: { eyebrow: true, headline: true, sub: true, cta: true },
    sections: { min: 0, max: 5, types: ["feature", "cta"] },
  },
  motion: { variant: "breath", intensity: "low" },
  status: "stable",
  ...overrides,
});

describe("DirectionSampler", () => {
  it("renders one tile per stable direction", () => {
    vi.mocked(listStableDirections).mockReturnValue([
      makeDirection("zero-point"),
      makeDirection("editorial"),
      makeDirection("brutalist"),
    ]);
    render(<DirectionSampler />);
    expect(screen.getByText(/zero point/i)).toBeInTheDocument();
    expect(screen.getByText(/editorial/i)).toBeInTheDocument();
    expect(screen.getByText(/brutalist/i)).toBeInTheDocument();
  });

  it("shows tags per direction", () => {
    vi.mocked(listStableDirections).mockReturnValue([
      makeDirection("zero-point", { tags: ["minimal", "scientific", "dark"] }),
    ]);
    render(<DirectionSampler />);
    expect(screen.getByText(/minimal/i)).toBeInTheDocument();
    expect(screen.getByText(/scientific/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
  });

  it("renders an empty state when no stable directions exist", () => {
    vi.mocked(listStableDirections).mockReturnValue([]);
    render(<DirectionSampler />);
    expect(screen.getByTestId("direction-sampler-empty")).toBeInTheDocument();
  });

  it("does not leak hire-me / founder copy", () => {
    vi.mocked(listStableDirections).mockReturnValue([makeDirection("zero-point")]);
    const { container } = render(<DirectionSampler />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/built by/i);
    expect(text).not.toMatch(/hire me/i);
    expect(text).not.toMatch(/\bscott\b/i);
  });
});
