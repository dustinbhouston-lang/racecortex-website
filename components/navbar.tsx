"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { NavbarUser } from "@/components/navbar-user"

const navLinks = [
  { label: "AI Engineer", href: "/#ai-engineer" },
  { label: "Platform", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/racecortex-logo-horizontal-white.png"
            alt="RaceCortex"
            width={2488}
            height={372}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

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
          {/* Desktop: full auth-aware dropdown (signed in = email + menu; signed out = Log in link) */}
          <NavbarUser />
          <a
            href="/#pricing"
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
              {/* Mobile: simple link to /download — full dropdown UX is fiddly inside mobile sheets */}
              <Link
                href="/download"
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <a
                href="/#pricing"
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
