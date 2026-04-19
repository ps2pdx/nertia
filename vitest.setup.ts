import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Default test env — individual tests may override
process.env.ANTHROPIC_API_KEY = "test-anthropic-key";
process.env.USE_DEMO_MODE = "true";

// Silence Firebase noise unless a test explicitly asserts on it
vi.mock("firebase/app", async () => {
  const actual = await vi.importActual<typeof import("firebase/app")>("firebase/app");
  return { ...actual };
});
