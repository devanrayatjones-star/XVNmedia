import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — website design, adverts and SEO`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card (also used for Twitter/X), rendered at build time.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000",
          color: "#f2f1ec",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, letterSpacing: 4, color: "#8d8c86" }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#c8ff2e" }} />
          WEBSITE DESIGN · ADVERTS · SEO
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3, textTransform: "uppercase" }}>
          <span>Websites that</span>
          <span>refuse to be</span>
          <span style={{ display: "flex" }}>
            ignored<span style={{ color: "#c8ff2e" }}>.</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 120, fontWeight: 800, letterSpacing: -6, lineHeight: 0.8 }}>XVN</span>
          <span style={{ fontSize: 26, background: "#c8ff2e", color: "#000", padding: "14px 26px", borderRadius: 999 }}>
            Get a free quote →
          </span>
        </div>
      </div>
    ),
    size
  );
}
