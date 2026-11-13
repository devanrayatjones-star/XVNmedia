"use client";

import { useRef } from "react";
import { useScrollFrame } from "@/lib/hooks";

export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useScrollFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    if (num.current) num.current.textContent = String(Math.round(p * 100)).padStart(3, "0") + "%";
  });
  return (
    <>
      <div className="progress" aria-hidden>
        <div ref={bar} className="progress__bar" />
      </div>
      <span ref={num} className="progress__num" aria-hidden>
        000%
      </span>
    </>
  );
}
