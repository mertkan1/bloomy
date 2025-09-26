"use client";
import MusicSelection from '@/components/MusicSelection'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function MusicPage() {
  const router = useRouter()
  return (
    <main className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <MusicSelection
          giftData={{}}
          onSelectMusic={() => router.push('/(flow)/preview')}
          onSkipMusic={() => router.push('/(flow)/preview')}
          onBack={() => router.push('/(flow)/prepare')}
        />
      </div>
    </main>
  )
}


