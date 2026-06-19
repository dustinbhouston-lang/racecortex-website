import type { ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function LegalPageWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-5 pt-28 pb-20 lg:px-8 lg:pt-32">
        <div className="rc-prose">{children}</div>
      </main>
      <Footer />
    </>
  )
}
