"use client"
import { useSearchParams } from 'next/navigation'
import PurchasePage from '@/components/PurchasePage'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const params = useSearchParams()
  const router = useRouter()
  const flowerId = params.get('flowerId') || undefined
  return (
    <main className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <PurchasePage
          giftData={{ flower: { id: flowerId } }}
          onBack={() => router.push('/(flow)/preview')}
          onProceedToPayment={() => router.push('/(flow)/success')}
        />
      </div>
    </main>
  )
}


