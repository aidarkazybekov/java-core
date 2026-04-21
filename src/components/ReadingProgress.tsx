"use client";

import { useEffect, useState, RefObject } from "react";

interface ReadingProgressProps {
  scrollRef: RefObject<HTMLElement | null>;
}

export default function ReadingProgress({ scrollRef }: ReadingProgressProps) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) {
        setPct(0);
        return;
      }
      const ratio = Math.min(1, Math.max(0, el.scrollTop / max));
      setPct(ratio * 100);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [scrollRef]);

  return (
    <div className="sticky top-0 left-0 right-0 h-[2px] bg-transparent z-20 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-accent-green to-accent-cyan transition-[width] duration-75 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
