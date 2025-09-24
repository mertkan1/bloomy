import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PLAN_TO_TOKENS } from '@/lib/payments/plans'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  const rawBody = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      try {
        const session = event.data.object as Stripe.Checkout.Session
        const plan = (session.metadata?.plan || '30d') as keyof typeof PLAN_TO_TOKENS
        const tokenGrant = PLAN_TO_TOKENS[plan]
        const orderId = session.metadata?.order_id
        if (orderId) {
          const supabase = createSupabaseAdminClient()
          await supabase.from('orders').update({ status: 'paid', token_grant: tokenGrant }).eq('id', orderId)
        }
      } catch {}
      break
  }
  return NextResponse.json({ received: true })
}


