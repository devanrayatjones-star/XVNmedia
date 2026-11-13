"use client";

import { useEffect, useState } from "react";
import Magnetic from "./Magnetic";

const LINKS = [
  { href: "#anatomy", label: "Anatomy" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#marketing", label: "Ads & SEO" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fmt = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    fmt();
    const id = setInterval(fmt, 1000);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
        <a href="#top" className="nav__logo" data-cursor="TOP">
          XVN<sup>®</sup>
          <span className="nav__logo-sub">media</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} className="nav__link">
              <span className="nav__idx">0{i + 1}</span>
              <span className="nav__roll" data-text={l.label}>
                <span>{l.label}</span>
              </span>
            </a>
          ))}
        </nav>
        <div className="nav__right">
          <span className="nav__clock" suppressHydrationWarning>
            <i className="dot dot--live" /> {time || "--:--:--"}
          </span>
          <Magnetic>
            <a href="#contact" className="btn btn--accent btn--sm" data-cursor="GO">
              Start a project
            </a>
          </Magnetic>
          <button
            className={`nav__burger ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}>
              <a href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                <span>0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
