"use client";
import PreviewPage from '@/components/PreviewPage'

export const dynamic = 'force-dynamic'

export default function Preview() {
  return (
    <main className="min-h-screen p-6">
      <PreviewPage
        giftData={{}}
        onBackToDashboard={() => {}}
      />
    </main>
  )
}


