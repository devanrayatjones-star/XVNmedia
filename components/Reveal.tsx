"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "@/lib/hooks";

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  as?: "div" | "section" | "li" | "p" | "span" | "h2" | "h3";
  className?: string;
  delay?: number;
  variant?: "up" | "clip" | "fade" | "scale";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const style = { "--d": `${delay}ms` } as CSSProperties;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} style={style} className={`reveal reveal--${variant} ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
