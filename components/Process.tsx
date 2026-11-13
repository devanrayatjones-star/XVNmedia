"use client";

import { useRef } from "react";
import { clamp, useScrollFrame } from "@/lib/hooks";
import Reveal from "./Reveal";

const STEPS = [
  { n: "01", t: "Discover", when: "Week 1", d: "Workshops, competitor teardown, keyword research and a brutally honest audit of what you have now." },
  { n: "02", t: "Design", when: "Weeks 2–3", d: "Wireframes, then full visual design. You see real pages early and often — no big reveal surprises." },
  { n: "03", t: "Build", when: "Weeks 3–6", d: "Hand-coded, tested on every screen size, tuned for speed, wired up to analytics before launch." },
  { n: "04", t: "Grow", when: "Forever", d: "SEO, adverts and monthly reporting. We keep pushing the numbers long after the confetti." },
];

export default function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useScrollFrame(() => {
    const el = wrap.current;
    if (!el || !line.current) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp((vh * 0.75 - r.top) / (r.height * 0.9));
    line.current.style.transform = `scaleX(${p})`;
    el.querySelectorAll<HTMLElement>(".proc__step").forEach((s, i, all) => {
      s.classList.toggle("is-lit", p >= i / all.length + 0.02);
    });
  });

  return (
    <section className="proc section" aria-labelledby="proc-h">
      <div className="section__head">
        <div className="section__label mono">
          <span>(06)</span> <span id="proc-h">Process</span>
        </div>
        <Reveal as="h2" variant="clip" className="h-xl">
          Four steps. <span className="outline">No</span> mystery.
        </Reveal>
      </div>
      <div ref={wrap} className="proc__wrap">
        <span className="proc__rail"><span ref={line} /></span>
        {STEPS.map((s) => (
          <div className="proc__step" key={s.n}>
            <span className="proc__dot" />
            <span className="proc__n">{s.n}</span>
            <span className="proc__when mono">{s.when}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
