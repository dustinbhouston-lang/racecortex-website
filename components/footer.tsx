import Image from 'next/image'
import Link from 'next/link'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Quick Start', href: '/start' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
  Community: [
    { label: 'Discord', href: 'https://discord.gg/QB23G2Ujb' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[#26262B]" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Logo + tagline */}
          <div className="lg:col-span-1">
            <Link href="/" aria-label="RaceCortex home">
              <Image
                src="/brand/racecortex-logo-horizontal-white.png"
                alt="RaceCortex"
                width={2488}
                height={372}
                className="mb-3 h-7 w-auto object-contain"
              />
            </Link>
            <p className="font-sans text-xs leading-relaxed text-[#8A8C92]">
              Your AI race engineer for sim racing.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8A8C92]">
                {group}
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="rounded-sm font-sans text-sm text-[#AEB1B8] transition-colors hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#26262B] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-lg font-mono text-[9px] leading-relaxed text-[#8A8C92]">
            Independent product &mdash; not affiliated with, endorsed by, or sponsored by
            iRacing.com Motorsport Simulations, LLC.
          </p>
          <p className="shrink-0 font-mono text-[9px] text-[#8A8C92]">
            &copy; {new Date().getFullYear()} RaceCortex LLC
          </p>
        </div>
      </div>
    </footer>
  )
}
