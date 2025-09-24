export type PlanKey = '30d' | '365d'

export const PLAN_TO_TOKENS: Record<PlanKey, number> = {
  '30d': 100,
  '365d': 1000,
}

export function getStripePriceId(plan: PlanKey) {
  if (plan === '30d') return process.env.NEXT_PUBLIC_STRIPE_PRICE_30D
  if (plan === '365d') return process.env.NEXT_PUBLIC_STRIPE_PRICE_365D
  return undefined
}


