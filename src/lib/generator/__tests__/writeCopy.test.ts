import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: mockCreate };
  }
  return { default: MockAnthropic };
});

import { writeCopy } from "@/lib/generator/writeCopy";

beforeEach(() => mockCreate.mockReset());

const goodResponse = JSON.stringify({
  hero: { eyebrow: "ACME", headline: "We build things.", sub: "Small and true.", cta: "Talk" },
  sections: [{ type: "feature", headline: "F", body: "B" }],
});

describe("writeCopy", () => {
  it("returns parsed copy", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: goodResponse }] });
    const out = await writeCopy({ direction: "zero-point", briefSummary: "acme", tone: "quiet" });
    expect(out.hero.headline).toBe("We build things.");
  });

  it("strips em-dashes via humanize pass", async () => {
    const withDash = JSON.stringify({
      hero: { eyebrow: "X", headline: "We build \u2014 carefully.", sub: "", cta: "Go" },
      sections: [],
    });
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: withDash }] });
    const out = await writeCopy({ direction: "zero-point", briefSummary: "x", tone: "y" });
    expect(out.hero.headline).not.toContain("\u2014");
  });

  it("strips banned phrases", async () => {
    const banned = JSON.stringify({
      hero: { eyebrow: "X", headline: "Unlock the real power of AI.", sub: "", cta: "Go" },
      sections: [],
    });
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: banned }] });
    const out = await writeCopy({ direction: "zero-point", briefSummary: "x", tone: "y" });
    expect(out.hero.headline.toLowerCase()).not.toContain("the real power");
  });
});
