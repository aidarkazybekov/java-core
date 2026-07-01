import { describe, it, expect } from "vitest";
import { isVisible, visibleSections } from "./lesson-layers";

describe("lesson-layers", () => {
  it("quick shows only tldr/analogy/diagram/recap", () => {
    expect(visibleSections("quick")).toEqual(new Set(["tldr", "analogy", "diagram", "recap"]));
  });
  it("standard adds the lesson body", () => {
    expect(isVisible("howItWorks", "standard")).toBe(true);
    expect(isVisible("code", "standard")).toBe(true);
    expect(isVisible("interview", "standard")).toBe(false);
  });
  it("deep adds interview/spring/glossary", () => {
    expect(isVisible("interview", "deep")).toBe(true);
    expect(isVisible("spring", "deep")).toBe(true);
    expect(isVisible("glossary", "deep")).toBe(true);
  });
  it("tldr is visible at every depth", () => {
    for (const d of ["quick", "standard", "deep"] as const) expect(isVisible("tldr", d)).toBe(true);
  });
});
