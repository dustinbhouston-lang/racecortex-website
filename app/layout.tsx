import type { Metadata, Viewport } from 'next'
import { Inter, Oxanium, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteBackground } from '@/components/site-background'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oxanium',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0a',
}

export const metadata: Metadata = {
  title: 'RaceCortex — Your AI Race Engineer',
  description:
    'An AI engineer that rides shotgun every session — it reads your telemetry, calls your race, and answers when you ask, so you can keep your eyes on the track.',
  keywords: ['sim racing', 'iRacing', 'AI race engineer', 'race telemetry', 'Clive', 'RaceCortex'],
  openGraph: {
    title: 'RaceCortex — Your AI Race Engineer',
    description:
      'An AI engineer that rides shotgun every session — it reads your telemetry, calls your race, and answers when you ask.',
    siteName: 'RaceCortex',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/brand/racecortex-icon-black-256.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/brand/racecortex-icon-white-32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/brand/racecortex-icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/brand/racecortex-icon-white-512.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oxanium.variable} ${ibmPlexMono.variable} bg-background`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        <SiteBackground />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
