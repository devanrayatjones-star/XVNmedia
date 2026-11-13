"use client";

import { useEffect, useRef, useState } from "react";
import { sectionProgress, useScrollFrame } from "@/lib/hooks";

// Placeholder case studies — replace with real client work.
const PROJECTS = [
  { name: "Halden & Co.", kind: "Architecture studio", scope: "Website · SEO", result: "+184% enquiries", art: "a", year: "2026" },
  { name: "Volta Fitness", kind: "Gym chain · 6 sites", scope: "Website · Paid social", result: "3.1× ROAS", art: "b", year: "2026" },
  { name: "Nori Kitchen", kind: "Restaurant group", scope: "Website · Local SEO", result: "#1 for 40 terms", art: "c", year: "2025" },
  { name: "Ferro Motors", kind: "Car dealership", scope: "E-commerce · Google Ads", result: "−46% cost per lead", art: "d", year: "2025" },
  { name: "Lumen Dental", kind: "Private clinic", scope: "Rebrand · Website", result: "+92% bookings", art: "e", year: "2025" },
];

function Card({ p, i }: { p: (typeof PROJECTS)[number]; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-y * 10}deg`);
    el.style.setProperty("--ry", `${x * 14}deg`);
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <a ref={ref} href="#contact" className="work-card" onPointerMove={onMove} onPointerLeave={onLeave} data-cursor="VIEW">
      <div className={`work-card__art art-${p.art}`}>
        <span className="work-card__big">{p.name.split(" ")[0]}</span>
        <span className="work-card__shine" />
      </div>
      <div className="work-card__meta">
        <span className="mono">{String(i + 1).padStart(2, "0")} — {p.year}</span>
        <h3>{p.name}</h3>
        <span className="work-card__kind">{p.kind}</span>
        <span className="work-card__scope mono">{p.scope}</span>
        <span className="work-card__result">{p.result}</span>
      </div>
    </a>
  );
}

export default function Work() {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  // the section is as tall as the horizontal distance the track needs to travel
  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      const dist = track.current.scrollWidth - window.innerWidth;
      setHeight(Math.max(0, dist) + window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useScrollFrame(() => {
    if (!sec.current || !track.current) return;
    const p = sectionProgress(sec.current);
    const dist = track.current.scrollWidth - window.innerWidth;
    track.current.style.transform = `translate3d(${-p * Math.max(0, dist)}px,0,0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  });

  return (
    <section id="work" ref={sec} className="work" style={height ? { height } : undefined}>
      <div className="work__pin">
        <div className="work__head">
          <div className="section__label mono">
            <span>(04)</span> <span>Selected work</span>
          </div>
          <span className="work__progress"><span ref={bar} /></span>
        </div>
        <div ref={track} className="work__track">
          <div className="work__intro">
            <h2 className="h-xl">
              Proof,
              <br />
              <span className="outline">not</span> promises.
            </h2>
            <p>Sites we&apos;ve built and the marketing we run behind them. Scroll sideways →</p>
          </div>
          {PROJECTS.map((p, i) => (
            <Card key={p.name} p={p} i={i} />
          ))}
          <a href="#contact" className="work-card work-card--next" data-cursor="YOU?">
            <span className="work-card__next">
              Your
              <br />
              project
              <br />
              here<span className="accent">→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
