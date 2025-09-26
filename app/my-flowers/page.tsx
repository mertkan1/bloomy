"use client";
import MyFlowers from '@/components/MyFlowers'

export const dynamic = 'force-dynamic'

export default function MyFlowersPage() {
  return (
    <main className="min-h-screen p-8">
      <MyFlowers
        userEmail={"demo@example.com"}
        onLogout={() => {}}
        onViewGift={() => {}}
        onHome={() => {}}
        onSendGift={() => {}}
      />
    </main>
  )
}


