import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import Anatomy from "@/components/Anatomy";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Work from "@/components/Work";
import Marketing from "@/components/Marketing";
import Process from "@/components/Process";
import Packages from "@/components/Packages";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { homeSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: all values are our own constants
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema()).replace(/</g, "\\u003c") }}
      />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Anatomy />
        <Services />
        <Stats />
        <Work />
        <Marketing />
        <Process />
        <Packages />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
