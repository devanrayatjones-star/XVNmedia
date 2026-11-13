"use client";

import ParticleGlobe from "./ParticleGlobe";
import ScrambleText from "./ScrambleText";
import Magnetic from "./Magnetic";

const BADGE = "XVN MEDIA ✦ WEBSITES ✦ ADVERTS ✦ SEO ✦ ";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <ParticleGlobe />

      {/* overlay — pointer-events: none so the globe underneath stays interactive */}
      <div className="hero__ui">
        <div className="hero__top">
          <span className="tag">
            <i className="dot dot--live" />
            <ScrambleText text="DIGITAL STUDIO — NOW BOOKING" delay={2000} />
          </span>
          <span className="hero__hint mono">
            <ScrambleText text="↳ DRAG YOUR CURSOR THROUGH THE GLOBE" delay={2300} />
          </span>
        </div>

        <span className="hero__corner hero__corner--tl" />
        <span className="hero__corner hero__corner--tr" />
        <span className="hero__corner hero__corner--bl" />
        <span className="hero__corner hero__corner--br" />

        <div className="hero__bottom">
          <h1 className="hero__title">
            <span className="hero__kicker">Website design, adverts &amp; SEO —</span>{" "}
            <span className="line"><span>Websites that</span></span>{" "}
            <span className="line">
              <span>
                <em className="outline">refuse</em> to be
              </span>
            </span>{" "}
            <span className="line">
              <span>
                ignored<b className="accent">.</b>
              </span>
            </span>
          </h1>

          <div className="hero__side">
            <p>
              XVN Media designs websites for businesses, then runs the adverts and SEO that fill them
              with customers. We make the site. Then we make it <strong>work</strong>.
            </p>
            <div className="hero__ctas">
              <Magnetic>
                <a href="#contact" className="btn btn--accent btn--lg" data-cursor="LET'S GO">
                  Start a project <span aria-hidden>→</span>
                </a>
              </Magnetic>
              <a href="#work" className="btn btn--ghost btn--lg" data-cursor="LOOK">
                See the work
              </a>
            </div>
          </div>
        </div>

        <a href="#anatomy" className="badge" aria-label="Scroll to explore" data-cursor="SCROLL">
          <svg viewBox="0 0 120 120" aria-hidden>
            <defs>
              <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text>
              <textPath href="#badge-circle">{BADGE}</textPath>
            </text>
          </svg>
          <span className="badge__arrow" aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
