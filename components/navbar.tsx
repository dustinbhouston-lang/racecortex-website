"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "AI Engineer", href: "#ai-engineer" },
  { label: "Platform", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-primary-foreground">
              <path d="M2 9L9 2L16 9L9 16L2 9Z" fill="currentColor" />
              <path d="M5 9L9 5L13 9L9 13L5 9Z" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            RACECORTEX
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </a>
          <a
            href="#pricing"
            className="inline-flex h-10 items-center rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Early Access
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-sm text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-5 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <a
                href="#"
                className="text-base font-medium text-muted-foreground"
              >
                Log in
              </a>
              <a
                href="#pricing"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-5 text-base font-semibold text-primary-foreground"
              >
                Get Early Access
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
