"use client";
import MusicSelection from '@/components/MusicSelection'

export const dynamic = 'force-dynamic'

export default function MusicPage() {
  return (
    <main className="min-h-screen p-6">
      <MusicSelection
        giftData={{}}
        onSelectMusic={() => {}}
        onSkipMusic={() => {}}
        onBack={() => {}}
      />
    </main>
  )
}


