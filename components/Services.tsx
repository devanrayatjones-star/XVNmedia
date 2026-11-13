"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const SERVICES = [
  { name: "Website design", glyph: "</>", hue: 72, tags: ["Design", "Build", "Hosting & care"], desc: "Custom-designed, hand-built and blisteringly fast. Every layout is built around the one thing you need visitors to do — and it looks incredible doing it." },
  { name: "Adverts", glyph: "↗", hue: 25, tags: ["Google Ads", "Meta Ads", "TikTok Ads"], desc: "Campaigns planned, built, run and ruthlessly optimised. Every click tracked all the way to a paying customer, reported monthly in plain English." },
  { name: "SEO", glyph: "#1", hue: 140, tags: ["Technical", "Local", "On-page"], desc: "Technical foundations, local dominance and pages that answer exactly what your customers are searching — so you show up first, for free." },
];

export default function Services() {
  const [hover, setHover] = useState<number | null>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const pos = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.14;
      cur.y += (pos.y - cur.y) * 0.14;
      const rot = Math.max(-12, Math.min(12, (pos.x - cur.x) * 0.15));
      if (card.current) card.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%) rotate(${rot}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const s = hover !== null ? SERVICES[hover] : null;

  return (
    <section id="services" className="services section">
      <div className="section__head">
        <div className="section__label mono">
          <span>(03)</span> <span>Services</span>
        </div>
        <Reveal as="h2" variant="clip" className="h-xl">
          Three things. <span className="outline">Done</span> properly.
        </Reveal>
      </div>

      <ul className="svc" onPointerLeave={() => setHover(null)}>
        {SERVICES.map((sv, i) => (
          <li
            key={sv.name}
            className={`svc__row ${hover === i ? "is-hover" : ""}`}
            onPointerEnter={() => setHover(i)}
            data-cursor="↗"
            tabIndex={0}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
          >
            <span className="svc__num mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="svc__name">{sv.name}</span>
            <span className="svc__tags">
              {sv.tags.map((t) => (
                <span key={t} className="pill">{t}</span>
              ))}
            </span>
            <span className="svc__arrow" aria-hidden>→</span>
            <p className="svc__desc">{sv.desc}</p>
          </li>
        ))}
      </ul>

      <div
        ref={card}
        className={`svc-card ${s ? "is-on" : ""}`}
        style={{ ["--h" as string]: s?.hue ?? 72 }}
        aria-hidden
      >
        <span className="svc-card__glyph">{s?.glyph}</span>
        <span className="svc-card__name mono">{s?.name}</span>
      </div>
    </section>
  );
}
