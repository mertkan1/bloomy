import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { getDictionary, type Locale } from '@/i18n'

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
  const cookieStore = cookies()
  const locale = (cookieStore.get('lang')?.value as Locale) || 'tr'
  const dict = getDictionary(locale)
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <header className="px-6 lg:px-8 py-4 border-b">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">Blooomy</Link>
            <div className="flex items-center gap-4">
              <Link href="/my-flowers" className="text-sm">{dict['nav.myFlowers']}</Link>
              <Link href="/login" className="text-sm">{dict['nav.login']}</Link>
              <form action="/lang" method="post">
                <select name="lang" defaultValue={locale} className="text-sm border rounded px-2 py-1">
                  <option value="tr">TR</option>
                  <option value="en">EN</option>
                </select>
              </form>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}


