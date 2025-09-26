import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { getDictionary, type Locale } from '@/i18n'
import flowerLogoOutline from '@/assets/7f2e338b7c49e282790a86d9a96a4f9a2abdd1f2.png'

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
        <header className="px-6 lg:px-8 py-4 border-b bg-white">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="Go to home">
              <Image src={flowerLogoOutline} alt="Bloomy" width={24} height={24} />
              <span className="text-xl font-semibold">Bloomy</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/(flow)/select-flower" className="text-sm">{dict['nav.myFlowers']}</Link>
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
        <footer className="px-6 lg:px-8 py-10 border-t bg-[#111827] text-white mt-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="Go to home">
              <Image src={flowerLogoOutline} alt="Bloomy" width={20} height={20} />
              <span className="text-lg font-semibold">Bloomy</span>
            </Link>
            <div className="text-sm opacity-80">© {new Date().getFullYear()} Bloomy</div>
          </div>
        </footer>
      </body>
    </html>
  )
}


