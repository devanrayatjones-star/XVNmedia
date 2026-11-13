import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <span className="mono footer__label">Studio</span>
          <p>Website design, adverts and SEO for businesses that want to be noticed.</p>
        </div>
        <div>
          <span className="mono footer__label">Explore</span>
          <ul>
            <li><a className="ulink" href="#anatomy">Anatomy</a></li>
            <li><a className="ulink" href="#services">Services</a></li>
            <li><a className="ulink" href="#work">Work</a></li>
            <li><a className="ulink" href="#marketing">Ads &amp; SEO</a></li>
          </ul>
        </div>
        <div>
          <span className="mono footer__label">Follow</span>
          <ul>
            {SITE.socials.map((s) => (
              <li key={s.label}><a className="ulink" href={s.href}>{s.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <span className="mono footer__label">Say hi</span>
          <a className="ulink" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href="#top" className="footer__top-btn" data-cursor="UP">↑ Back to top</a>
        </div>
      </div>

      <div className="footer__word" aria-hidden>
        {"XVN".split("").map((c) => (
          <span key={c}>{c}</span>
        ))}
        <sup>®</sup>
      </div>

      <div className="footer__bottom mono">
        <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
        <span>Built loud, by hand. No templates were harmed.</span>
      </div>
    </footer>
  );
}
