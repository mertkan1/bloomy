import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

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
      <body>
        <header className="px-6 lg:px-8 py-4 border-b">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">Blooomy</Link>
            <div className="flex items-center gap-4">
              <Link href="/my-flowers" className="text-sm">My flowers</Link>
              <Link href="/login" className="text-sm">Login</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}


