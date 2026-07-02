'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { NavbarUser } from '@/components/navbar-user'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'AI Engineer', href: '/#ai-engineer' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[#26262B] bg-[rgba(12,12,14,0.72)] backdrop-blur-xl'
          : 'bg-[rgba(12,12,14,0.30)] backdrop-blur-md'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
      >
        {/* Logo */}
        <Link href="/" aria-label="RaceCortex home" className="flex shrink-0 items-center gap-2">
          <Image
            src="/brand/racecortex-logo-horizontal-white.png"
            alt="RaceCortex"
            width={2488}
            height={372}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-sm px-1 font-mono text-xs uppercase tracking-[0.12em] text-[#AEB1B8] transition-colors hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA + auth */}
        <div className="hidden items-center gap-6 lg:flex">
          {/* Auth-aware: signed in = account menu; signed out = Log in link */}
          <NavbarUser />
          <a
            href="/#early-access"
            className="rounded-[4px] bg-[#FF4D00] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.1em] text-[#0C0C0E] transition-colors hover:bg-[#CC3E00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0E]"
          >
            Get Early Access
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col justify-center gap-1.5 rounded-sm p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00] lg:hidden"
        >
          <span
            className={`block h-px w-6 bg-[#F4F4F2] transition-transform duration-200 ${menuOpen ? 'translate-y-[5px] rotate-45' : ''}`}
          />
          <span
            className={`block h-px w-6 bg-[#F4F4F2] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-px w-6 bg-[#F4F4F2] transition-transform duration-200 ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-[#26262B] bg-[rgba(12,12,14,0.97)] px-6 py-4 backdrop-blur-md lg:hidden"
        >
          <ul className="flex flex-col gap-4" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm py-2 font-mono text-xs uppercase tracking-[0.12em] text-[#AEB1B8] transition-colors hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              {/* Mobile: simple Log in link — the full account dropdown is fiddly inside a sheet */}
              <Link
                href="/download"
                onClick={() => setMenuOpen(false)}
                className="block rounded-sm py-2 font-mono text-xs uppercase tracking-[0.12em] text-[#AEB1B8] transition-colors hover:text-[#F4F4F2]"
              >
                Log in
              </Link>
            </li>
            <li>
              <a
                href="/#early-access"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-[4px] bg-[#FF4D00] px-5 py-2.5 text-center font-display text-xs font-semibold uppercase tracking-[0.1em] text-[#0C0C0E] transition-colors hover:bg-[#CC3E00]"
              >
                Get Early Access
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
