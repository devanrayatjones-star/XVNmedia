"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01XVN";

/**
 * Decodes `text` from random glyphs into the real string. Plays on mount
 * (after `delay` ms) and again on hover when `replayOnHover` is set.
 */
export default function ScrambleText({
  text,
  delay = 0,
  duration = 900,
  replayOnHover = false,
  className = "",
}: {
  text: string;
  delay?: number;
  duration?: number;
  replayOnHover?: boolean;
  className?: string;
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const play = () => {
    if (prefersReducedMotion()) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const settle = i / text.length;
        if (ch === " " || p >= settle * 0.7 + 0.3) s += ch;
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    timer.current = setTimeout(play, delay);
    return () => {
      clearTimeout(timer.current);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      className={className}
      aria-label={text}
      onPointerEnter={replayOnHover ? play : undefined}
    >
      <span aria-hidden>{out}</span>
    </span>
  );
}
