"use client";

import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

const PACKS = [
  {
    name: "Launch",
    for: "New businesses & refreshes",
    items: ["Up to 6 custom pages", "Mobile-first design", "On-page SEO setup", "Conversion tracking", "30 days of support"],
  },
  {
    name: "Grow",
    for: "Ready to be found",
    featured: true,
    items: ["Everything in Launch", "Unlimited pages + CMS", "Monthly SEO", "Google & Meta ads managed", "Monthly performance report"],
  },
  {
    name: "Dominate",
    for: "Own your market",
    items: ["Everything in Grow", "Ads on every platform", "Advanced technical SEO", "Landing page per campaign", "Dedicated account lead"],
  },
];

export default function Packages() {
  return (
    <section className="packs section" aria-labelledby="packs-h">
      <div className="section__head">
        <div className="section__label mono">
          <span>(07)</span> <span id="packs-h">Ways to work with us</span>
        </div>
        <Reveal as="h2" variant="clip" className="h-xl">
          Pick a <span className="outline">gear.</span>
        </Reveal>
      </div>
      <div className="packs__grid">
        {PACKS.map((p, i) => (
          <Reveal key={p.name} delay={i * 120} variant="scale" className={`pack ${p.featured ? "pack--featured" : ""}`}>
            <div className="pack__inner">
              {p.featured && <span className="pack__flag mono">Full service</span>}
              <span className="pack__idx mono">0{i + 1}</span>
              <h3 className="pack__name">{p.name}</h3>
              <span className="pack__for">{p.for}</span>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>
                    <span className="accent">✦</span> {it}
                  </li>
                ))}
              </ul>
              <Magnetic strength={0.2}>
                <a href="#contact" className={`btn ${p.featured ? "btn--accent" : "btn--ghost"}`} data-cursor="QUOTE">
                  Get a quote →
                </a>
              </Magnetic>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
