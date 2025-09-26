"use client";
import CraftGift from '@/components/CraftGift'

export const dynamic = 'force-dynamic'

export default function PreparePage() {
  return (
    <main className="min-h-screen p-6">
      <CraftGift
        flower={{ id: 'demo', name: 'Demo Flower', description: 'Demo', price: 0, image: '' }}
        onBack={() => {}}
        onSendGift={() => {}}
      />
    </main>
  )
}


