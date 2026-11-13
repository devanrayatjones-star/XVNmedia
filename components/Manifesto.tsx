"use client";

import { useRef, type ReactNode } from "react";
import { clamp, useScrollFrame } from "@/lib/hooks";

type Tok = string | { chip: ReactNode };

const TOKENS: Tok[] = [
  ..."XVN is a studio for businesses that are done being invisible. We design, build and launch websites".split(" "),
  { chip: <span className="chip chip--browser"><i /><i /><i /> &lt;site/&gt;</span> },
  ..."that load fast, rank high and convert".split(" "),
  { chip: <span className="chip chip--toggle"><span /></span> },
  ..."hard — then we run the marketing".split(" "),
  {
    chip: (
      <span className="chip chip--spark">
        <svg viewBox="0 0 60 20" aria-hidden>
          <polyline points="0,18 10,14 20,15 30,9 40,10 50,4 60,2" />
        </svg>
      </span>
    ),
  },
  ..."that keeps the right people pouring in. One team. One plan. Zero".split(" "),
  { chip: <span className="chip chip--btn">excuses →</span> },
];

export default function Manifesto() {
  const wrap = useRef<HTMLDivElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);

  useScrollFrame(() => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.1));
    const n = spans.current.length;
    spans.current.forEach((s, i) => s?.classList.toggle("lit", i / n < p));
  });

  return (
    <section className="manifesto section" aria-labelledby="manifesto-h">
      <div className="section__label mono">
        <span>(01)</span> <span id="manifesto-h">Manifesto</span>
      </div>
      <div ref={wrap} className="manifesto__text">
        {TOKENS.map((t, i) => (
          <span key={i} ref={(el) => { spans.current[i] = el; }} className="mw">
            {typeof t === "string" ? t : t.chip}{" "}
          </span>
        ))}
      </div>
    </section>
  );
}
