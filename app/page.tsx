import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { UseCases } from "@/components/UseCases";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureGrid />
        <HowItWorks />
        <UseCases />
      </main>
      <Footer />
    </>
  );
}
