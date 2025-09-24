"use client"
import { useRouter } from 'next/navigation'
import SelectFlower from '@/components/SelectFlower'

export default function SelectFlowerPage() {
  const router = useRouter()
  return (
    <main className="min-h-screen p-6">
      <SelectFlower onSelectFlower={(f) => router.push(`/app/checkout?flowerId=${encodeURIComponent(f.id)}`)} />
    </main>
  )
}


