"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, prefersReducedMotion } from "@/lib/hooks";

// Placeholder figures — swap for your real numbers.
const STATS = [
  { to: 140, suffix: "+", label: "Websites launched", sub: "and every one of them still live" },
  { to: 312, suffix: "%", label: "Avg. organic traffic lift", sub: "12 months after launch" },
  { to: 0.9, suffix: "s", decimals: 1, label: "Median load time", sub: "Largest Contentful Paint, mobile" },
  { to: 24, suffix: "/7", label: "Campaign monitoring", sub: "because ads don't sleep" },
];

function Counter({ to, decimals = 0, suffix, run }: { to: number; decimals?: number; suffix: string; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setV(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1800);
      setV(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return (
    <span className="stat__num">
      {v.toFixed(decimals)}
      <span className="accent">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const run = useInView(ref);
  return (
    <section className="stats section" aria-label="By the numbers">
      <div ref={ref} className="stats__grid">
        {STATS.map((s, i) => (
          <div className={`stat ${run ? "is-in" : ""}`} key={s.label} style={{ transitionDelay: `${i * 90}ms` }}>
            <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} run={run} />
            <span className="stat__label">{s.label}</span>
            <span className="stat__sub mono">{s.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
