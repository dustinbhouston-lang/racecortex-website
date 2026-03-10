import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { AiEngineer } from "@/components/ai-engineer"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { TelemetryPreview } from "@/components/telemetry-preview"
import { Pricing } from "@/components/pricing"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Page() {
  // Force rebuild - icon update
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <AiEngineer />
      <Features />
      <HowItWorks />
      <TelemetryPreview />
      <Pricing />
      <CtaSection />
      <Footer />
    </main>
  )
}
