import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripePriceId, type PlanKey } from '@/lib/payments/plans'
import { generateId } from '@/lib/utils/ids'
import { createPendingOrder } from '@/lib/orders/pending'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  try {
    const { plan, successUrl, cancelUrl, flowerId } = await req.json() as { plan: PlanKey, successUrl: string, cancelUrl: string, flowerId?: string }
    const priceId = getStripePriceId(plan)
    if (!priceId) throw new Error('Price not configured')
    const orderId = generateId('order')
    if (flowerId) {
      try {
        await createPendingOrder({ orderId, flowerId, plan })
      } catch {}
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { plan, order_id: orderId, flower_id: flowerId || '' },
    })
    return NextResponse.json({ id: session.id, url: session.url, orderId })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}


