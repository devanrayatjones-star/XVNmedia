"use client";

import { useRef, useState } from "react";
import { sectionProgress, useScrollFrame } from "@/lib/hooks";

/* A pinned section that assembles a website one element at a time as you
   scroll, putting each element under a devtools-style spotlight. */

const STEPS = [
  { tag: "<nav>", sel: "header.nav", size: "1280 × 64", name: "Navigation", note: "Three clicks to anything. Sticky, obvious, thumb-friendly. Nobody should ever have to hunt.", spec: ["sticky", "≤ 5 links", "keyboard-ready"] },
  { tag: "<h1>", sel: "h1.headline", size: "1280 × 212", name: "Headline", note: "Seven words to earn the next seven seconds. Say what you do and who it's for — loudly.", spec: ["clamp()", "1 per page", "keyword-led"] },
  { tag: "<button>", sel: "a.cta", size: "220 × 56", name: "Call to action", note: "One job. Impossible to miss. Repeated down the page until somebody clicks it.", spec: ["44px+ target", "AA contrast", "tracked"] },
  { tag: "<img>", sel: "figure.visual", size: "1280 × 540", name: "Visuals", note: "Art-directed, compressed and lazy-loaded. Pretty and fast are not opposites.", spec: ["AVIF/WebP", "srcset", "LCP-safe"] },
  { tag: "<section>", sel: "section.proof", size: "1280 × 320", name: "Social proof", note: "Reviews, logos and numbers placed exactly where doubt creeps in.", spec: ["3-up grid", "schema.org", "real quotes"] },
  { tag: "<form>", sel: "form.lead", size: "640 × 180", name: "Conversion", note: "The fewest fields possible, every submission traced back to the ad or search that caused it.", spec: ["3 fields", "GA4 events", "CRM sync"] },
  { tag: "<footer>", sel: "footer.site", size: "1280 × 120", name: "Footer", note: "The last chance to convert — and a safety net of links that search engines love.", spec: ["NAP", "sitemap", "socials"] },
];

export default function Anatomy() {
  const sec = useRef<HTMLElement>(null);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  useScrollFrame(() => {
    if (!sec.current) return;
    const p = sectionProgress(sec.current);
    // first slice of the scroll shows the empty browser, last slice the finished page
    const s = Math.min(STEPS.length - 1, Math.floor(((p - 0.06) / 0.84) * STEPS.length));
    setStep(p < 0.06 ? -1 : s);
    setDone(p > 0.92);
  });

  const cls = (i: number) =>
    `mk ${step >= i ? "is-built" : ""} ${step === i && !done ? "is-active" : ""}`;
  const active = STEPS[Math.max(0, step)];

  return (
    <section id="anatomy" ref={sec} className="anatomy" style={{ height: `${(STEPS.length + 2) * 75}vh` }}>
      <div className="anatomy__pin">
        <div className="anatomy__info">
          <h2 className="section__label mono">
            <span>(02)</span> <span>Anatomy of a website design that sells</span>
          </h2>

          <div className="anatomy__count mono">
            <span className="accent">{String(Math.max(0, step + 1)).padStart(2, "0")}</span> /{" "}
            {String(STEPS.length).padStart(2, "0")}
          </div>

          <div className="anatomy__current" key={step}>
            {step < 0 ? (
              <>
                <p className="anatomy__tag">&lt;html&gt;</p>
                <h3 className="anatomy__name">Every element earns its place.</h3>
                <p className="anatomy__note">
                  Keep scrolling. We&apos;ll build a page in front of you and show you what each part is
                  actually <em>for</em>.
                </p>
              </>
            ) : done ? (
              <>
                <p className="anatomy__tag accent">200 OK</p>
                <h3 className="anatomy__name">Assembled. Shipped. Selling.</h3>
                <p className="anatomy__note">
                  Seven elements, zero filler. That&apos;s the blueprint behind every site we launch.
                </p>
              </>
            ) : (
              <>
                <p className="anatomy__tag">{active.tag}</p>
                <h3 className="anatomy__name">{active.name}</h3>
                <p className="anatomy__note">{active.note}</p>
                <ul className="anatomy__spec">
                  {active.spec.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <ol className="anatomy__list">
            {STEPS.map((s, i) => (
              <li key={s.tag} className={i < step || done ? "is-past" : i === step ? "is-now" : ""}>
                <span className="mono">{s.tag}</span>
                <i style={{ transform: `scaleX(${i < step || done ? 1 : i === step ? 0.5 : 0})` }} />
              </li>
            ))}
          </ol>
        </div>

        <div className={`browser ${done ? "is-done" : ""}`} aria-hidden>
          <div className="browser__chrome">
            <span className="browser__dots"><i /><i /><i /></span>
            <span className="browser__url mono">
              <span className="browser__lock">⌁</span> https://your-business.com
              <span className="caret" />
            </span>
            <span className="browser__status mono">{done ? "200 OK" : step < 0 ? "idle" : "building…"}</span>
          </div>

          <div className="browser__page">
            <div className="browser__grid" />

            <div className={cls(0) + " mk-nav"} data-tag={`${STEPS[0].sel}  ${STEPS[0].size}`}>
              <b>YOURCO</b>
              <span className="mk-links"><i /><i /><i /><i /></span>
              <span className="mk-pill">Book now</span>
            </div>

            <div className={cls(1) + " mk-h1"} data-tag={`${STEPS[1].sel}  ${STEPS[1].size}`}>
              Your business,
              <br />
              but <span className="accent">louder.</span>
            </div>

            <div className={cls(2) + " mk-cta"} data-tag={`${STEPS[2].sel}  ${STEPS[2].size}`}>
              Get a free quote →
            </div>

            <div className={cls(3) + " mk-img"} data-tag={`${STEPS[3].sel}  ${STEPS[3].size}`}>
              <span className="mk-sun" />
              <span className="mk-hill mk-hill--a" />
              <span className="mk-hill mk-hill--b" />
            </div>

            <div className={cls(4) + " mk-proof"} data-tag={`${STEPS[4].sel}  ${STEPS[4].size}`}>
              {[0, 1, 2].map((k) => (
                <span key={k}>
                  <em>★★★★★</em>
                  <i />
                  <i />
                </span>
              ))}
            </div>

            <div className={cls(5) + " mk-form"} data-tag={`${STEPS[5].sel}  ${STEPS[5].size}`}>
              <span className="mk-input">Name</span>
              <span className="mk-input">Email</span>
              <span className="mk-send">Send</span>
            </div>

            <div className={cls(6) + " mk-foot"} data-tag={`${STEPS[6].sel}  ${STEPS[6].size}`}>
              <b>YOURCO</b>
              <span className="mk-links"><i /><i /><i /></span>
              <span>© {new Date().getFullYear()}</span>
            </div>

            <div className="browser__scan" />
          </div>
        </div>
      </div>
    </section>
  );
}
