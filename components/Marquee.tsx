"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

const A = ["Web design", "Development", "E-commerce", "SEO", "Paid social", "Google Ads", "Branding", "Copy", "Analytics"];
const B = ["Faster", "Louder", "Sharper", "Higher-ranking", "Better-converting", "Unignorable"];

function Row({ words, dir, className }: { words: string[]; dir: 1 | -1; className: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      // scroll velocity speeds the tape up and leans it in the scroll direction
      vel += (dy * 0.9 - vel) * 0.12;
      const speed = 70 + Math.abs(vel) * 18;
      const half = el.scrollWidth / 2;
      x -= dir * speed * dt * (vel < -0.5 ? -1 : 1);
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      const skew = Math.max(-14, Math.min(14, vel * 0.6));
      el.style.transform = `translate3d(${x}px,0,0) skewX(${-skew}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [dir]);

  const items = [...words, ...words];
  return (
    <div className={`tape ${className}`}>
      <div ref={track} className="tape__track">
        {[0, 1].map((k) => (
          <span className="tape__set" key={k} aria-hidden={k === 1}>
            {items.map((w, i) => (
              <span className="tape__item" key={i}>
                {w}
                <span className="tape__star">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="tapes" aria-label="What we do">
      <Row words={A} dir={1} className="tape--accent" />
      <Row words={B} dir={-1} className="tape--white" />
    </section>
  );
}
