"use client";
import CraftGift from '@/components/CraftGift'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function PreparePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <CraftGift
          flower={{ id: 'demo', name: 'Demo Flower', description: 'Demo', price: 0, image: '' }}
          onBack={() => router.push('/(flow)/select-flower')}
          onSendGift={() => router.push('/(flow)/music')}
        />
      </div>
    </main>
  )
}


