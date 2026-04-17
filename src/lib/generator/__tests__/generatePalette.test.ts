import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: mockCreate };
  }
  return { default: MockAnthropic };
});

import { generatePalette } from "@/lib/generator/generatePalette";

beforeEach(() => mockCreate.mockReset());

describe("generatePalette", () => {
  it("returns a valid palette", async () => {
    mockCreate.mockResolvedValue({
      content: [
        { type: "text", text: '{"bg":"#0a0a0a","fg":"#f5f5f5","accent":"#00d4ff","muted":"#6b6b6b"}' },
      ],
    });
    const out = await generatePalette({ direction: "zero-point", briefSummary: "AI lab" });
    expect(out.bg).toBe("#0a0a0a");
    expect(out.accent).toBe("#00d4ff");
  });

  it("falls back on invalid JSON", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "bad" }] });
    const out = await generatePalette({ direction: "zero-point", briefSummary: "x" });
    expect(out.bg).toMatch(/^#/);
  });

  it("falls back on invalid hex", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"bg":"not-a-hex","fg":"#fff","accent":"#0ff","muted":"#888"}' }],
    });
    const out = await generatePalette({ direction: "zero-point", briefSummary: "x" });
    expect(out.bg).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
