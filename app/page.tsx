import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { AiEngineer } from "@/components/ai-engineer"
import { Features } from "@/components/features"
import { Hud } from "@/components/hud"
import { HowItWorks } from "@/components/how-it-works"
import { Pricing } from "@/components/pricing"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <AiEngineer />
        <Features />
        <Hud />
        <HowItWorks />
        <Pricing />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
