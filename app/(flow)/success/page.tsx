"use client";
import SuccessPage from '@/components/SuccessPage'

export const dynamic = 'force-dynamic'

export default function Success() {
  return (
    <main className="min-h-screen p-6">
      <SuccessPage
        purchaseData={{ plan: '30', giftData: { selectedThemes: [], senderName: 'Demo', recipientEmail: 'demo@example.com' } }}
        giftId={'demo-id'}
        onEditMessages={() => {}}
        onViewGift={() => {}}
      />
    </main>
  )
}


