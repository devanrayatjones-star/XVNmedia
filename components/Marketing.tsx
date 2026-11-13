"use client";

import { useMemo, useRef, useState } from "react";
import { useInView } from "@/lib/hooks";
import Reveal from "./Reveal";

/* An interactive, illustrative marketing dashboard. Toggling channels on the
   left recomputes every number and chart on the right. All data is demo data. */

const WEEKS = 12;
const CHANNELS = [
  { key: "seo", name: "SEO", color: "#c8ff2e", base: 14, growth: 0.16, spend: 0 },
  { key: "google", name: "Google Ads", color: "#5ee7ff", base: 22, growth: 0.06, spend: 900 },
  { key: "meta", name: "Meta Ads", color: "#ff5ec8", base: 17, growth: 0.07, spend: 700 },
  { key: "tiktok", name: "TikTok Ads", color: "#ffb02e", base: 9, growth: 0.11, spend: 400 },
];
const LEAD_VALUE = 120;

const series = (c: (typeof CHANNELS)[number]) =>
  Array.from({ length: WEEKS }, (_, w) => c.base * (1 + c.growth * w) * (0.92 + 0.16 * Math.abs(Math.sin(w * 1.7 + c.base))));

export default function Marketing() {
  const [on, setOn] = useState<Record<string, boolean>>({ seo: true, google: true, meta: true, tiktok: false });
  const panel = useRef<HTMLDivElement>(null);
  const live = useInView(panel);

  const data = useMemo(() => {
    const act = CHANNELS.filter((c) => on[c.key]);
    const per = act.map((c) => ({ c, s: series(c) }));
    const total = Array.from({ length: WEEKS }, (_, w) => per.reduce((a, p) => a + p.s[w], 0));
    const leads = total.reduce((a, b) => a + b, 0);
    const spend = act.reduce((a, c) => a + c.spend * WEEKS, 0);
    const byChannel = per.map((p) => ({ ...p.c, leads: p.s.reduce((a, b) => a + b, 0) }));
    return {
      total,
      leads,
      visitors: leads * 31,
      cpl: spend > 0 ? spend / leads : 0,
      roas: spend > 0 ? (leads * LEAD_VALUE) / spend : 0,
      byChannel,
    };
  }, [on]);

  const max = Math.max(1, ...data.total) * 1.15;
  const pts = data.total.map((v, i) => [(i / (WEEKS - 1)) * 600, 200 - (v / max) * 200] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L600,200 L0,200 Z`;
  const maxCh = Math.max(1, ...data.byChannel.map((c) => c.leads));
  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <section id="marketing" className="mkt section">
      <div className="mkt__left">
        <div className="section__label mono">
          <span>(05)</span> <span>Adverts &amp; SEO, managed</span>
        </div>
        <Reveal as="h2" variant="clip" className="h-xl">
          A website is the <span className="outline">engine.</span> We also bring the <span className="accent">fuel.</span>
        </Reveal>
        <p className="mkt__lede">
          Launch day is day one. We run the adverts and the SEO that send people to your
          site — and we keep tuning until the numbers only go one way. Go on, flip the switches.
        </p>

        <ul className="switches">
          {CHANNELS.map((c) => (
            <li key={c.key}>
              <button
                className={`switch ${on[c.key] ? "is-on" : ""}`}
                style={{ ["--c" as string]: c.color }}
                role="switch"
                aria-checked={on[c.key]}
                onClick={() => setOn((o) => ({ ...o, [c.key]: !o[c.key] }))}
                data-cursor={on[c.key] ? "OFF" : "ON"}
              >
                <span className="switch__track"><span className="switch__knob" /></span>
                <span className="switch__name">{c.name}</span>
                <span className="switch__state mono">{on[c.key] ? "LIVE" : "PAUSED"}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div ref={panel} className={`dash ${live ? "is-live" : ""}`}>
        <div className="dash__top mono">
          <span><i className="dot dot--live" /> Live campaign view</span>
          <span>Last 12 weeks · demo data</span>
        </div>

        <div className="dash__kpis">
          <div className="kpi"><span className="kpi__label mono">Visitors</span><span className="kpi__val">{fmt(data.visitors)}</span></div>
          <div className="kpi"><span className="kpi__label mono">Leads</span><span className="kpi__val accent">{fmt(data.leads)}</span></div>
          <div className="kpi"><span className="kpi__label mono">Cost / lead</span><span className="kpi__val">{data.cpl ? data.cpl.toFixed(2) : "—"}</span></div>
          <div className="kpi"><span className="kpi__label mono">ROAS</span><span className="kpi__val">{data.roas ? data.roas.toFixed(1) + "×" : "∞"}</span></div>
        </div>

        <div className="dash__chart">
          <svg viewBox="0 0 600 200" preserveAspectRatio="none" aria-label="Leads per week">
            <defs>
              <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8ff2e" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#c8ff2e" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[50, 100, 150].map((y) => (
              <line key={y} x1="0" x2="600" y1={y} y2={y} className="dash__gridline" />
            ))}
            <path d={area} fill="url(#dash-fill)" className="dash__area" />
            <path d={line} className="dash__line" pathLength={1} />
            {pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === WEEKS - 1 ? 5 : 2.5} className={i === WEEKS - 1 ? "dash__head" : "dash__pt"} />
            ))}
          </svg>
          <span className="dash__chart-label mono">Leads / week</span>
        </div>

        <div className="dash__bars">
          {data.byChannel.length === 0 && <p className="mono dash__empty">All channels paused. Your competitors say thanks.</p>}
          {data.byChannel.map((c) => (
            <div className="bar" key={c.key}>
              <span className="bar__name mono">{c.name}</span>
              <span className="bar__track">
                <span className="bar__fill" style={{ transform: `scaleX(${live ? c.leads / maxCh : 0})`, background: c.color }} />
              </span>
              <span className="bar__val mono">{fmt(c.leads)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
