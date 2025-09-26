import GiftComplete from '@/components/GiftComplete'

export const dynamic = 'force-dynamic'

export default function CompletePage() {
  return (
    <main className="min-h-screen p-6">
      <GiftComplete onBack={() => history.back()} />
    </main>
  )
}


