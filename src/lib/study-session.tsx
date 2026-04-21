"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "java-core:study-session";

export interface SessionConfig {
  durationMs: number;
  goalTopics: number | null;
}

export interface ActiveSession {
  startedAt: number;
  durationMs: number;
  goalTopics: number | null;
  initialDoneIds: string[];
}

interface SessionContextValue {
  active: ActiveSession | null;
  start: (config: SessionConfig, initialDoneIds: string[]) => void;
  end: () => void;
  remainingMs: number;
  elapsedMs: number;
  isFinished: boolean;
}

const Ctx = createContext<SessionContextValue | null>(null);

function readStored(): ActiveSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveSession;
  } catch {
    return null;
  }
}

function writeStored(s: ActiveSession | null) {
  if (typeof window === "undefined") return;
  if (s) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  else sessionStorage.removeItem(STORAGE_KEY);
}

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveSession | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const tick = useRef<number | null>(null);

  useEffect(() => {
    setActive(readStored());
  }, []);

  useEffect(() => {
    if (!active) {
      if (tick.current) window.clearInterval(tick.current);
      tick.current = null;
      return;
    }
    setNow(Date.now());
    tick.current = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
      tick.current = null;
    };
  }, [active]);

  const start = useCallback((config: SessionConfig, initialDoneIds: string[]) => {
    const s: ActiveSession = {
      startedAt: Date.now(),
      durationMs: config.durationMs,
      goalTopics: config.goalTopics,
      initialDoneIds,
    };
    setActive(s);
    writeStored(s);
    setNow(Date.now());
  }, []);

  const end = useCallback(() => {
    setActive(null);
    writeStored(null);
  }, []);

  const elapsedMs = active ? Math.max(0, now - active.startedAt) : 0;
  const remainingMs = active ? Math.max(0, active.durationMs - elapsedMs) : 0;
  const isFinished = Boolean(active && remainingMs === 0);

  const value = useMemo(
    () => ({ active, start, end, remainingMs, elapsedMs, isFinished }),
    [active, start, end, remainingMs, elapsedMs, isFinished]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudySession(): SessionContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStudySession must be used within StudySessionProvider");
  return ctx;
}

export function formatMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
