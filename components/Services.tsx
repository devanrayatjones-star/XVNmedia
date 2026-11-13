"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const SERVICES = [
  { name: "Web design", glyph: "◐", hue: 72, tags: ["UI / UX", "Wireframes", "Design systems"], desc: "Interfaces with opinions. Every layout is designed around the one thing you need visitors to do." },
  { name: "Web development", glyph: "</>", hue: 190, tags: ["Next.js", "WordPress", "Webflow"], desc: "Hand-built, accessible and blisteringly fast. Green Core Web Vitals are the starting line, not the goal." },
  { name: "E-commerce", glyph: "£€$", hue: 330, tags: ["Shopify", "Checkout CRO", "Product feeds"], desc: "Stores that make buying feel inevitable — from first product view to the order-confirmed email." },
  { name: "SEO", glyph: "#1", hue: 140, tags: ["Technical", "Local", "Content"], desc: "Technical foundations, local dominance and content that answers what your customers are actually searching." },
  { name: "Paid ads", glyph: "↗", hue: 25, tags: ["Google", "Meta", "TikTok"], desc: "Campaigns built, run and ruthlessly optimised. Every click tracked all the way to a customer." },
  { name: "Social media", glyph: "♥", hue: 280, tags: ["Strategy", "Content", "Community"], desc: "Scroll-stopping content and a calendar that never goes quiet, managed end to end." },
  { name: "Branding", glyph: "✦", hue: 50, tags: ["Identity", "Tone of voice", "Guidelines"], desc: "A look and a voice people remember — applied consistently everywhere you show up." },
  { name: "Analytics & CRO", glyph: "%", hue: 210, tags: ["GA4", "Heatmaps", "A/B tests"], desc: "We measure everything, then turn the numbers into changes that lift conversion month after month." },
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
          Everything your business needs <span className="outline">online.</span>
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
