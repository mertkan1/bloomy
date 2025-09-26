"use client"
import { useRouter } from 'next/navigation'
import SelectFlower from '@/components/SelectFlower'

export default function SelectFlowerPage() {
  const router = useRouter()
  return (
    <main className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#111827] mb-8">Çiçeğini Seç</h1>
        <SelectFlower
          onSelectFlower={(f) => router.push(`/checkout?flowerId=${encodeURIComponent(f.id)}`)}
          onBack={() => router.back()}
        />
      </div>
    </main>
  )
}


