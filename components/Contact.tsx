"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";
import Magnetic from "./Magnetic";

const SERVICES = ["Website design", "Adverts", "SEO"];
const BUDGETS = ["< 5k", "5–15k", "15–40k", "40k +"];

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span key={i} className="lt" aria-hidden>
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}

export default function Contact() {
  const [svc, setSvc] = useState<string[]>(["Website design"]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [sent, setSent] = useState(false);

  const toggle = (s: string) => setSvc((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));

  // No backend required: the form composes an email in the visitor's mail app.
  // Swap this for a POST to your CRM / form service when you have one.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Email: ${f.get("email")}`,
      `Company: ${f.get("company") || "—"}`,
      `Interested in: ${svc.join(", ") || "—"}`,
      `Budget: ${budget}`,
      "",
      String(f.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `New project — ${f.get("company") || f.get("name")}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="contact" className="contact section">
      <div className="section__label mono">
        <span>(08)</span> <span>Contact</span>
      </div>
      <h2 className="contact__title" aria-label="Let's make some noise.">
        <span className="contact__line"><Letters text="Let's make" /></span>{" "}
        <span className="contact__line"><Letters text="some " /><span className="contact__noise"><Letters text="noise." /></span></span>
      </h2>

      <div className="contact__grid">
        <div className="contact__aside">
          <p>Tell us what you&apos;re building (or what&apos;s broken). We reply within one working day with honest next steps — even if that&apos;s &quot;you don&apos;t need us yet&quot;.</p>
          <Magnetic>
            <a href={`mailto:${SITE.email}`} className="contact__email" data-cursor="EMAIL">
              {SITE.email}
            </a>
          </Magnetic>
          <ul className="contact__socials">
            {SITE.socials.map((s) => (
              <li key={s.label}><a href={s.href} className="ulink">{s.label} ↗</a></li>
            ))}
          </ul>
        </div>

        {sent ? (
          <div className="form form--sent" role="status">
            <span className="form__big accent">✓</span>
            <h3>Transmission ready.</h3>
            <p>Your email app should have opened with everything filled in — just hit send. Nothing opened? Email us directly at <a className="ulink" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
            <button className="btn btn--ghost" onClick={() => setSent(false)}>Edit message</button>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <input id="f-name" name="name" required placeholder=" " autoComplete="name" />
              <label htmlFor="f-name">Your name *</label>
            </div>
            <div className="field">
              <input id="f-email" name="email" type="email" required placeholder=" " autoComplete="email" />
              <label htmlFor="f-email">Email *</label>
            </div>
            <div className="field field--full">
              <input id="f-company" name="company" placeholder=" " autoComplete="organization" />
              <label htmlFor="f-company">Business name</label>
            </div>

            <fieldset className="chips field--full">
              <legend className="mono">I need —</legend>
              {SERVICES.map((s) => (
                <button type="button" key={s} className={`chip-btn ${svc.includes(s) ? "is-on" : ""}`} aria-pressed={svc.includes(s)} onClick={() => toggle(s)}>
                  {s}
                </button>
              ))}
            </fieldset>

            <fieldset className="chips field--full">
              <legend className="mono">Budget —</legend>
              {BUDGETS.map((b) => (
                <button type="button" key={b} className={`chip-btn ${budget === b ? "is-on" : ""}`} aria-pressed={budget === b} onClick={() => setBudget(b)}>
                  {b}
                </button>
              ))}
            </fieldset>

            <div className="field field--full">
              <textarea id="f-msg" name="message" rows={4} placeholder=" " />
              <label htmlFor="f-msg">Tell us about the project</label>
            </div>

            <div className="field--full form__submit">
              <Magnetic strength={0.25}>
                <button type="submit" className="btn btn--accent btn--xl" data-cursor="SEND">
                  Send it <span aria-hidden>→</span>
                </button>
              </Magnetic>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
