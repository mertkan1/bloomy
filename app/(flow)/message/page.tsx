"use client";
import MessageReviewPage from '@/components/MessageReviewPage'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function MessagePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <MessageReviewPage
          purchaseData={{ plan: '30', giftData: { selectedThemes: [], recipientEmail: 'demo@example.com' } }}
          onBackToSuccess={() => router.push('/(flow)/success')}
          onCompleteReview={() => router.push('/(flow)/success')}
        />
      </div>
    </main>
  )
}


