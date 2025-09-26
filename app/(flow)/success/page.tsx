"use client";
import SuccessPage from '@/components/SuccessPage'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Success() {
  const router = useRouter()
  return (
    <main className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <SuccessPage
          purchaseData={{ plan: '30', giftData: { selectedThemes: [], senderName: 'Demo', recipientEmail: 'demo@example.com' } }}
          giftId={'demo-id'}
          onEditMessages={() => router.push('/(flow)/message')}
          onViewGift={() => router.push('/gift/demo-id')}
        />
      </div>
    </main>
  )
}


