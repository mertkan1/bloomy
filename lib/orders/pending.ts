import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { PlanKey } from '@/lib/payments/plans'

type CreatePendingOrderInput = {
  orderId: string
  flowerId: string
  plan: PlanKey
  buyerName?: string
  recipientName?: string
  theme?: string
}

export async function createPendingOrder(input: CreatePendingOrderInput) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from('orders').insert({
    id: input.orderId,
    flower_id: input.flowerId,
    plan: input.plan,
    buyer_name: input.buyerName ?? null,
    recipient_name: input.recipientName ?? null,
    theme: input.theme ?? null,
    token_grant: 0,
    status: 'pending',
  })
  if (error) throw error
}


