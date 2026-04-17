import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: mockCreate };
  }
  return { default: MockAnthropic };
});

import { pickDirection } from "@/lib/generator/pickDirection";

beforeEach(() => mockCreate.mockReset());

describe("pickDirection", () => {
  it("returns the parsed direction name", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"direction":"zero-point","reason":"tech/concept lean"}' }],
    });
    const out = await pickDirection({ briefSummary: "AI research lab", tone: "quiet" });
    expect(out.direction).toBe("zero-point");
    expect(mockCreate).toHaveBeenCalled();
  });

  it("falls back to zero-point if model returns unknown direction", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"direction":"does-not-exist","reason":"x"}' }],
    });
    const out = await pickDirection({ briefSummary: "x", tone: "y" });
    expect(out.direction).toBe("zero-point");
  });

  it("falls back on invalid JSON", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "nonsense" }] });
    const out = await pickDirection({ briefSummary: "x", tone: "y" });
    expect(out.direction).toBe("zero-point");
  });
});
