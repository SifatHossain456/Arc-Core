import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureGrid />
      </main>
      <Footer />
    </>
  );
}
