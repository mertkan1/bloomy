"use client"
import { useSearchParams } from 'next/navigation'
import PurchasePage from '@/components/PurchasePage'

export default function CheckoutPage() {
  const params = useSearchParams()
  const flowerId = params.get('flowerId') || undefined
  return (
    <main className="min-h-screen p-6">
      <PurchasePage onBack={() => history.back()} onProceedToPayment={() => {}} giftData={{ flower: { id: flowerId } }} />
    </main>
  )
}


