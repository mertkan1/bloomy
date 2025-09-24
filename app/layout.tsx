import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'Blooomy',
    template: '%s · Blooomy',
  },
  description: 'Dijital çiçek videosu hediye – günlük AI mesajlarla',
  openGraph: {
    title: 'Blooomy',
    description: 'Dijital çiçek videosu hediye – günlük AI mesajlarla',
    type: 'website',
    url: '/',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}


