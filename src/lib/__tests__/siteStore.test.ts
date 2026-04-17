import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockRef = vi.fn(() => ({ get: mockGet, set: mockSet }));

vi.mock("@/lib/firebaseAdmin", () => ({
  getAdminDb: () => ({ ref: mockRef }),
}));

import { getSite, putSite, slugIsTaken } from "@/lib/siteStore";
import type { SiteConfig } from "@/directions/types";

beforeEach(() => {
  mockGet.mockReset();
  mockSet.mockReset();
  mockRef.mockClear();
});

const fixture: SiteConfig = {
  slug: "acme",
  direction: "zero-point",
  palette: { bg: "#0a0a0a", fg: "#ffffff", accent: "#00ffff", muted: "#888888" },
  typography: { heading: "Inter", body: "Inter", scale: 1.25 },
  copy: { hero: { eyebrow: "", headline: "H", sub: "S", cta: "C" }, sections: [] },
  motionConfig: { variant: "breath", intensity: "low", accent: "#00ffff" },
  images: {},
  tier: "free",
};

describe("siteStore", () => {
  it("getSite returns parsed config when found", async () => {
    mockGet.mockResolvedValue({ exists: () => true, val: () => fixture });
    const out = await getSite("acme");
    expect(out?.slug).toBe("acme");
    expect(mockRef).toHaveBeenCalledWith("sites/acme");
  });

  it("getSite returns null when not found", async () => {
    mockGet.mockResolvedValue({ exists: () => false, val: () => null });
    expect(await getSite("nope")).toBeNull();
  });

  it("putSite writes to the right path with timestamps", async () => {
    mockSet.mockResolvedValue(undefined);
    const out = await putSite(fixture);
    expect(mockRef).toHaveBeenCalledWith("sites/acme");
    expect(mockSet).toHaveBeenCalled();
    const written = (mockSet.mock.calls[0] as [SiteConfig])[0];
    expect(written.createdAt).toBeTypeOf("number");
    expect(written.updatedAt).toBeTypeOf("number");
    expect(out.slug).toBe("acme");
  });

  it("slugIsTaken checks existence", async () => {
    mockGet.mockResolvedValue({ exists: () => true, val: () => fixture });
    expect(await slugIsTaken("acme")).toBe(true);
    mockGet.mockResolvedValue({ exists: () => false });
    expect(await slugIsTaken("free")).toBe(false);
  });
});
