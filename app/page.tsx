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

export default function Home() {
  return (
    <>
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
