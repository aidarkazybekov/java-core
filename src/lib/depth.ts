export type Depth = "quick" | "standard" | "deep";
export const DEFAULT_DEPTH: Depth = "standard";
const STORAGE_KEY = "devcore:depth";

export function coerceDepth(raw: string | null): Depth {
  return raw === "quick" || raw === "standard" || raw === "deep" ? raw : DEFAULT_DEPTH;
}

export function loadDepth(): Depth {
  if (typeof window === "undefined") return DEFAULT_DEPTH;
  try {
    return coerceDepth(localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_DEPTH;
  }
}

export function saveDepth(d: Depth): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, d);
  } catch {
    // ignore
  }
}
