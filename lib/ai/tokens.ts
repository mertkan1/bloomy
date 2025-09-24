import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function ensureHasTokenAndConsume(orderId: string) {
  const supabase = createSupabaseServerClient()
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, token_grant, token_used, status')
    .eq('id', orderId)
    .single()
  if (error || !order) throw new Error('Order not found')
  if (order.status !== 'paid') throw new Error('Order not paid')
  if ((order.token_used ?? 0) >= (order.token_grant ?? 0)) throw new Error('No tokens left')
  const { error: updErr } = await supabase
    .from('orders')
    .update({ token_used: (order.token_used ?? 0) + 1 })
    .eq('id', orderId)
  if (updErr) throw updErr
}

export async function upsertDailyMessage(orderId: string, dayIndex: number, content: string, generatedBy: 'ai' | 'manual') {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('daily_messages')
    .upsert({ order_id: orderId, day_index: dayIndex, content, generated_by: generatedBy })
  if (error) throw error
}

export async function logAiEvent(orderId: string, kind: 'generate' | 'regenerate', tokens: number = 1) {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('ai_events')
    .insert({ order_id: orderId, kind, tokens })
  if (error) throw error
}


