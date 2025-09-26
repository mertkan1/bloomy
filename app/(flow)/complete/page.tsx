"use client";
import GiftComplete from '@/components/GiftComplete'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function CompletePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen p-6">
      <GiftComplete onBack={() => router.push('/(flow)/preview')} />
    </main>
  )
}


