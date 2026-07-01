import { describe, it, expect } from "vitest";
import { coerceDepth, loadDepth, DEFAULT_DEPTH } from "./depth";

describe("depth", () => {
  it("coerces valid values", () => {
    expect(coerceDepth("quick")).toBe("quick");
    expect(coerceDepth("standard")).toBe("standard");
    expect(coerceDepth("deep")).toBe("deep");
  });
  it("coerces invalid/null to the default", () => {
    expect(coerceDepth("nonsense")).toBe(DEFAULT_DEPTH);
    expect(coerceDepth(null)).toBe(DEFAULT_DEPTH);
    expect(DEFAULT_DEPTH).toBe("standard");
  });
  it("loadDepth returns the default under SSR (no window)", () => {
    expect(loadDepth()).toBe(DEFAULT_DEPTH);
  });
});
