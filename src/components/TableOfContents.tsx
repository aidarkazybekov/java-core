"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { slugify } from "./Markdown";

interface Heading {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

function extractHeadings(md: string): Heading[] {
  const out: Heading[] = [];
  const lines = md.split("\n");
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length as 1 | 2 | 3;
    const text = m[2].replace(/[`*_]/g, "").trim();
    out.push({ id: slugify(text), text, level });
  }
  return out;
}

interface TableOfContentsProps {
  markdown: string;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export default function TableOfContents({ markdown, containerRef }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(markdown), [markdown]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const root = containerRef?.current ?? null;

    observerRef.current?.disconnect();
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        });
        // pick first heading (by document order) that is visible
        for (const h of headings) {
          if (visible.has(h.id)) {
            setActiveId(h.id);
            return;
          }
        }
      },
      {
        root,
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [headings, containerRef]);

  if (headings.length < 2) return null;

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label="On-page navigation"
      className="text-[11px] leading-[1.5]"
    >
      <div className="text-[10px] text-text-muted tracking-[2px] uppercase mb-3">
        On this page
      </div>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => {
          const active = activeId === h.id;
          return (
            <li
              key={h.id}
              className={h.level === 3 ? "pl-6" : h.level === 2 ? "pl-3" : "pl-3"}
              style={h.level === 1 ? { paddingLeft: "0.75rem" } : undefined}
            >
              <a
                href={`#${h.id}`}
                onClick={handleClick(h.id)}
                className={`block -ml-px pl-3 border-l-2 py-0.5 transition-colors ${
                  active
                    ? "border-l-accent-green text-accent-green"
                    : "border-l-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
