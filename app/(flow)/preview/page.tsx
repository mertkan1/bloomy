"use client";
import PreviewPage from '@/components/PreviewPage'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Preview() {
  const router = useRouter()
  return (
    <main className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <PreviewPage
          giftData={{}}
          onBackToDashboard={() => router.push('/(flow)/music')}
        />
      </div>
    </main>
  )
}


