import GiftViewPage from '@/components/GiftViewPage'

export default function GiftPage({ params }: { params: { code: string } }) {
  return (
    <main className="min-h-screen">
      <GiftViewPage />
    </main>
  )
}


