import GiftViewPage from '@/components/GiftViewPage'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function GiftPage({ params }: { params: { code: string } }) {
  const supabase = createSupabaseServerClient()
  // Skeleton: paid ve code eşleşmesiyle order verisini çek
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('gift_code', params.code)
    .eq('status', 'paid')
    .single()
  // Daily messages (public read by gift_code would require a view or edge function; skeleton keeps it simple)
  const { data: messages } = await supabase
    .from('daily_messages')
    .select('*')
    .eq('order_id', order?.id || '')
    .order('day_index', { ascending: true })

  return (
    <main className="min-h-screen">
      <GiftViewPage />
    </main>
  )
}


