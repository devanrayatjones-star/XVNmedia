"use client";

import { useEffect, useState } from "react";

/**
 * Intro curtain. The exit is a pure-CSS animation (see .loader in globals.css),
 * so the page is revealed even if JavaScript never runs. JS only drives the
 * 000 → 100 counter and removes the node afterwards.
 */
export default function Loader() {
  const [n, setN] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1500);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = setTimeout(() => setGone(true), 2700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  if (gone) return null;
  return (
    <div className="loader" aria-hidden>
      <div className="loader__word">
        {"XVN".split("").map((c, i) => (
          <span key={i} style={{ animationDelay: `${i * 90}ms` }}>
            {c}
          </span>
        ))}
      </div>
      <div className="loader__meta">
        <span>Loading the loudest site on your screen</span>
        <span className="loader__count">{String(n).padStart(3, "0")}</span>
      </div>
      <div className="loader__bar" style={{ transform: `scaleX(${n / 100})` }} />
    </div>
  );
}
