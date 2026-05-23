import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Menu from "@/components/Menu";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Services />
        <Menu />
        <CTA />
      </main>
      <Footer showWordmark />
    </>
  );
}
