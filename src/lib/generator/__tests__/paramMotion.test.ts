import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: vi.fn(function(this: any) {
      this.messages = { create: mockCreate };
    }),
  };
});

import { paramMotion } from "@/lib/generator/paramMotion";

beforeEach(() => mockCreate.mockReset());

describe("paramMotion", () => {
  it("returns parsed motion config", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"variant":"breath","intensity":"low","accent":"#00d4ff"}' }],
    });
    const out = await paramMotion({ direction: "zero-point", accent: "#00d4ff" });
    expect(out.variant).toBe("breath");
  });

  it("falls back for invalid JSON", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "bad" }] });
    const out = await paramMotion({ direction: "zero-point", accent: "#00d4ff" });
    expect(out.variant).toBeTypeOf("string");
    expect(out.accent).toBe("#00d4ff");
  });
});
