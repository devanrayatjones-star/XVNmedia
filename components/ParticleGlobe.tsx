"use client";

import { useEffect, useRef } from "react";

/* ───────────────────────────────────────────────────────────────────────────
   PARTICLE GLOBE — a cinematic, interactive particle sphere.

   Pure-black hero. Thousands of glowing white dots are scattered in darkness,
   then pulled into the shape of a 3D sphere over ~3.5s (silhouette particles
   arrive first so the outline reads before the volume fills in). Once formed
   the globe rotates slowly and forever. Moving the cursor over it disturbs only
   the local patch of dots under the pointer — they spread outward, jitter with a
   little digital turbulence, and then heal back into place as the cursor leaves.

   Everything is one self-contained client component: a single <canvas> driven by
   a hand-rolled 3D projection (no Three.js / WebGL / external libraries), all
   styling inline, no images. Geometry is stored as unit vectors and re-scaled to
   the canvas every frame, so resizing never rebuilds or restarts the animation.

   Two passes per frame: pass 1 rotates + projects every particle into screen
   space (and eases the cursor displacement); the indices are then depth-sorted
   (painter's algorithm, far → near); pass 2 draws them additively ('lighter')
   so overlapping dots bloom naturally at the denser, brighter rim.

   Honours prefers-reduced-motion: the globe is rendered already-formed and still,
   with no rotation, formation or cursor reaction.

   XVN site adaptations (the globe itself is unchanged):
   • the wrapper is `position: absolute` so it fills the hero section rather
     than the whole viewport, and
   • the rAF loop pauses while the hero is scrolled off-screen, so the rest of
     the page doesn't pay for an invisible animation.
   ─────────────────────────────────────────────────────────────────────────── */

// ── tunables ────────────────────────────────────────────────────────────────
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const TILT = -0.42; // fixed view tilt (radians) — looks slightly from above
const ROT_SPEED = 0.16; // globe spin (rad/s) → ~39s per revolution, calm
const FORM_SPREAD = 1.9; // s — stagger window for particles to begin arriving
const FORM_DUR = 1.55; // s — how long each particle takes to fly home

type Particles = {
  n: number;
  // home position on/in the unit sphere (length = rr ≤ 1)
  hx: Float32Array;
  hy: Float32Array;
  hz: Float32Array;
  // scattered start position (in R-units, length ~2.2–4.0)
  sx: Float32Array;
  sy: Float32Array;
  sz: Float32Array;
  delay: Float32Array; // s — when this particle starts moving
  size: Float32Array; // px base size
  bright: Float32Array; // 0..1 base brightness
  phase: Float32Array; // turbulence phase
  // per-frame mutable cursor displacement (screen px), eased for soft healing
  pdx: Float32Array;
  pdy: Float32Array;
  // scratch (filled every frame in pass 1)
  px: Float32Array;
  py: Float32Array;
  pz: Float32Array;
  pa: Float32Array; // alpha
  ps: Float32Array; // draw size
  ph: Float32Array; // halo flag (1 = draw bloom halo)
};

function buildParticles(): Particles {
  const surface = typeof window !== "undefined" && window.innerWidth < 720 ? 1700 : 2600;
  const interior = Math.round(surface * 0.27);
  const n = surface + interior;

  const p: Particles = {
    n,
    hx: new Float32Array(n), hy: new Float32Array(n), hz: new Float32Array(n),
    sx: new Float32Array(n), sy: new Float32Array(n), sz: new Float32Array(n),
    delay: new Float32Array(n), size: new Float32Array(n),
    bright: new Float32Array(n), phase: new Float32Array(n),
    pdx: new Float32Array(n), pdy: new Float32Array(n),
    px: new Float32Array(n), py: new Float32Array(n), pz: new Float32Array(n),
    pa: new Float32Array(n), ps: new Float32Array(n), ph: new Float32Array(n),
  };

  for (let i = 0; i < n; i++) {
    let ux: number, uy: number, uz: number, rr: number;

    if (i < surface) {
      // even surface distribution via the Fibonacci sphere
      const y = 1 - (i / (surface - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GOLDEN_ANGLE;
      ux = Math.cos(theta) * r;
      uy = y;
      uz = Math.sin(theta) * r;
      rr = 1;
      p.size[i] = 0.7 + Math.random() * 0.95;
      p.bright[i] = 0.55 + Math.random() * 0.45;
    } else {
      // interior volume points — random direction, pulled inward, dimmer/smaller
      const y = Math.random() * 2 - 1;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = Math.random() * Math.PI * 2;
      ux = Math.cos(theta) * r;
      uy = y;
      uz = Math.sin(theta) * r;
      rr = 0.55 + Math.random() * 0.37;
      p.size[i] = 0.5 + Math.random() * 0.6;
      p.bright[i] = 0.28 + Math.random() * 0.4;
    }

    p.hx[i] = ux * rr;
    p.hy[i] = uy * rr;
    p.hz[i] = uz * rr;

    // scattered start: a random direction far out in darkness
    const sy = Math.random() * 2 - 1;
    const sr = Math.sqrt(Math.max(0, 1 - sy * sy));
    const st = Math.random() * Math.PI * 2;
    const dist = 2.2 + Math.random() * 1.8;
    p.sx[i] = Math.cos(st) * sr * dist;
    p.sy[i] = sy * dist;
    p.sz[i] = Math.sin(st) * sr * dist;

    // outline forms first: silhouette particles (|nz| small at rest) arrive early
    const rimInit = 1 - Math.abs(uz); // 1 at the equator/edge of the rest view
    p.delay[i] = (1 - rimInit) * FORM_SPREAD * 0.62 + Math.random() * FORM_SPREAD * 0.5;
    p.phase[i] = Math.random() * Math.PI * 2;
  }

  return p;
}

export default function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const P = buildParticles();
    const order = new Int32Array(P.n);
    for (let i = 0; i < P.n; i++) order[i] = i;

    let w = 0, h = 0, dpr = 1;
    const pointer = { x: 0, y: 0, active: false };
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Setting canvas.width wipes the bitmap; the rAF loop repaints next frame.
      // Under reduced motion there is no loop, so repaint the still globe here.
      if (reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    };
    const ro = new ResizeObserver(resize);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    if (!reduce) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointerdown", onMove);
    }

    let raf = 0;
    const start = performance.now();

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const R = 0.34 * Math.min(w, h);
      const FOCAL = 3.4 * R;
      const cx = w / 2;
      const cy = h / 2;

      const angle = reduce ? 0.6 : t * ROT_SPEED;
      const cy_ = Math.cos(angle), sy_ = Math.sin(angle);
      const cb = Math.cos(TILT), sb = Math.sin(TILT);

      const infl = 0.33 * R;          // cursor influence radius
      const maxPush = 0.52 * infl;    // how far dots spread from the cursor
      const jitAmp = 0.16 * infl;     // turbulence amplitude

      // ── pass 1: rotate, project, ease cursor displacement ──
      for (let i = 0; i < P.n; i++) {
        // formation: ease scattered start → home
        let prog: number;
        if (reduce) {
          prog = 1;
        } else {
          prog = (t - P.delay[i]) / FORM_DUR;
          prog = prog < 0 ? 0 : prog > 1 ? 1 : prog;
          prog = 1 - Math.pow(1 - prog, 3); // easeOutCubic
        }

        const hx = P.hx[i], hy = P.hy[i], hz = P.hz[i];
        const cxv = P.sx[i] + (hx - P.sx[i]) * prog;
        const cyv = P.sy[i] + (hy - P.sy[i]) * prog;
        const czv = P.sz[i] + (hz - P.sz[i]) * prog;

        // rotate around Y, then tilt around X
        const rx = cxv * cy_ + czv * sy_;
        let rz = -cxv * sy_ + czv * cy_;
        const ry = cyv * cb - rz * sb;
        rz = cyv * sb + rz * cb;

        const len = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1e-4;
        const nz = rz / len; // facing: +1 toward viewer, -1 away

        const X = rx * R, Y = ry * R, Z = rz * R;
        let denom = FOCAL - Z;
        if (denom < 0.3 * R) denom = 0.3 * R;
        const persp = FOCAL / denom;

        let sxp = cx + X * persp;
        let syp = cy - Y * persp;

        // ── local cursor distortion (front hemisphere only, once formed) ──
        let targetX = 0, targetY = 0, disturb = 0;
        if (pointer.active && nz > 0 && prog > 0.92) {
          const dx = sxp - pointer.x;
          const dy = syp - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < infl) {
            const fall = 0.5 - 0.5 * Math.cos((1 - d / infl) * Math.PI); // smooth 0..1
            const inv = d > 1e-3 ? 1 / d : 0;
            targetX = dx * inv * fall * maxPush;
            targetY = dy * inv * fall * maxPush;
            disturb = fall;
          }
        }
        // soft spring toward target → gives the "healing" recovery on exit
        P.pdx[i] += (targetX - P.pdx[i]) * 0.14;
        P.pdy[i] += (targetY - P.pdy[i]) * 0.14;

        // digital turbulence: smooth sinusoidal scramble scaled by disturbance
        const live = Math.max(disturb, Math.min(1, Math.hypot(P.pdx[i], P.pdy[i]) / maxPush));
        if (live > 0.001) {
          const ph = P.phase[i];
          sxp += P.pdx[i] + Math.sin(t * 9 + ph) * jitAmp * live;
          syp += P.pdy[i] + Math.cos(t * 11 + ph * 1.7) * jitAmp * live;
        }

        // shading: dim the far side, brighten the silhouette rim
        const front = 0.5 + 0.5 * nz;
        const rim = 1 - Math.abs(nz);
        let alpha = prog * P.bright[i] * (0.26 + 0.74 * front) * (0.78 + 0.6 * rim);
        if (alpha > 1) alpha = 1;

        P.px[i] = sxp;
        P.py[i] = syp;
        P.pz[i] = Z;
        P.pa[i] = alpha;
        P.ps[i] = Math.max(0.45, P.size[i] * persp * (0.82 + 0.5 * rim));
        P.ph[i] = rim > 0.62 && front > 0.5 && prog > 0.6 ? 1 : 0;
      }

      // ── depth sort: far → near (painter's algorithm) ──
      order.sort((a, b) => P.pz[a] - P.pz[b]);

      // ── pass 2: draw additively so dense regions bloom ──
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let k = 0; k < P.n; k++) {
        const i = order[k];
        const a = P.pa[i];
        if (a <= 0.012) continue;
        const x = P.px[i], y = P.py[i], s = P.ps[i];

        // soft bloom halo on the brightest rim particles
        if (P.ph[i]) {
          ctx.fillStyle = `rgba(214,224,255,${a * 0.16})`;
          ctx.beginPath();
          ctx.arc(x, y, s * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // keep looping only while the hero is on screen
      if (!reduce && visible) raf = requestAnimationFrame(frame);
      else if (!reduce) raf = 0;
    };

    // pause/resume the loop as the hero leaves/enters the viewport
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduce && raf === 0) raf = requestAnimationFrame(frame);
    });

    // Size the canvas (and paint the still globe under reduced motion) now that
    // `frame`/`raf` exist, then start observing + run the loop for motion users.
    resize();
    ro.observe(canvas);
    io.observe(canvas);
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label="Interactive particle globe"
        role="img"
        style={{ display: "block", width: "100%", height: "100%", cursor: "crosshair" }}
      />
      {/* subtle vignette for depth — purely cosmetic */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 100% at 50% 50%, transparent 52%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
