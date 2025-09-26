"use client";
import MessageReviewPage from '@/components/MessageReviewPage'

export const dynamic = 'force-dynamic'

export default function MessageThemePage() {
  return (
    <main className="min-h-screen p-6">
      <MessageReviewPage
        purchaseData={{ plan: '30', giftData: { selectedThemes: [], recipientEmail: 'demo@example.com' } }}
        onBackToSuccess={() => {}}
        onCompleteReview={() => {}}
      />
    </main>
  )
}


