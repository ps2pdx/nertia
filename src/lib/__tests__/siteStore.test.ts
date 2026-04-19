import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockRef = vi.fn(() => ({ get: mockGet, set: mockSet }));

vi.mock("@/lib/firebaseAdmin", () => ({
  getAdminDb: () => ({ ref: mockRef }),
}));

import { getSite, putSite, slugIsTaken } from "@/lib/siteStore";
import type { Site } from "@/templates/types";

beforeEach(() => {
  mockGet.mockReset();
  mockSet.mockReset();
  mockRef.mockClear();
});

const fixture: Site = {
  slug: "acme",
  templateId: "precedent",
  copy: {
    "hero.headline": "Acme builds things.",
    "hero.sub": "Small, true, shipped fast.",
    "hero.cta": "Get started",
  },
};

describe("siteStore", () => {
  it("getSite returns parsed site when found", async () => {
    mockGet.mockResolvedValue({ exists: () => true, val: () => fixture });
    const out = await getSite("acme");
    expect(out?.slug).toBe("acme");
    expect(out?.templateId).toBe("precedent");
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
    const written = (mockSet.mock.calls[0] as [Site])[0];
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
