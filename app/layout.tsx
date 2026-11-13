import type { Metadata, Viewport } from "next";
import { Syne, Inter_Tight, JetBrains_Mono } from "next/font/google";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

const display = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--f-display" });
const body = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono" });

export const metadata: Metadata = {
  title: "XVN Media — Website design, adverts & SEO",
  description:
    "XVN Media designs high-performance websites for businesses, then fills them with customers through adverts and SEO.",
  openGraph: {
    title: "XVN Media — Websites & marketing that refuse to be ignored",
    description: "Website design, adverts and SEO for businesses.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a href="#services" className="skip">Skip to content</a>
        <Loader />
        <Nav />
        <ScrollProgress />
        {children}
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
