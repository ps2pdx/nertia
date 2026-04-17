import { describe, it, expect } from "vitest";
import { directions, getDirection, listStableDirections } from "@/directions";
import sample from "@/directions/zero-point/sample.json";
import { SiteConfigSchema } from "@/directions/types";

describe("directions registry", () => {
  it("includes zero-point", () => {
    expect(directions["zero-point"]).toBeDefined();
    expect(getDirection("zero-point")?.displayName).toBe("Zero-Point");
  });
  it("lists only stable directions", () => {
    const stable = listStableDirections();
    expect(stable.length).toBeGreaterThan(0);
    stable.forEach((d) => expect(d.status).toBe("stable"));
  });
  it("zero-point sample validates", () => {
    expect(() => SiteConfigSchema.parse(sample)).not.toThrow();
  });
});
