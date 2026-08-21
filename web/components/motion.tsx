"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reveals its children when they scroll into view, staggered by `index`.
 *
 * Content is present in the DOM from the start — only opacity animates — so
 * nothing is hidden from search or assistive tech, and anyone who asked for
 * reduced motion just sees it immediately.
 */
export function Reveal({
  children,
  index = 0,
  step = 70,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  index?: number;
  /** Milliseconds between successive items. */
  step?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown ? "true" : "false"}
      style={{ ["--reveal-delay" as string]: `${Math.min(index * step, 480)}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Lifts each route into place on navigation. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}

/**
 * Counts a figure up when it first scrolls into view. Used for headline
 * numbers only — a counting price or seat count would read as instability.
 */
export function CountUp({
  value,
  format,
  duration = 900,
  className = "",
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      observer.disconnect();

      const from = 0;
      const start = performance.now();
      let raf = 0;

      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // easeOutCubic — fast start, settled finish
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(from + (value - from) * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  // Later value changes (a slider moving) apply immediately, not as a count.
  useEffect(() => {
    if (started.current) setDisplay(value);
  }, [value]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {format(display)}
    </span>
  );
}
