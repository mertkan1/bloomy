import { NextRequest, NextResponse } from 'next/server'
import { ensureHasTokenAndConsume, upsertDailyMessage, logAiEvent } from '@/lib/ai/tokens'
import { generateAIMessage } from '@/lib/ai/llm'

export async function POST(req: NextRequest) {
  try {
    const { orderId, dayIndex, theme, names } = await req.json()
    await ensureHasTokenAndConsume(orderId)
    
    // AI ile gerçek mesaj üretimi
    const content = await generateAIMessage({
      dayIndex,
      theme: theme || 'romantik',
      buyerName: names?.buyer || 'sevgili',
      recipientName: names?.recipient || 'sevgili'
    })
    
    await upsertDailyMessage(orderId, dayIndex, content, 'ai')
    await logAiEvent(orderId, 'generate', 1)
    return NextResponse.json({ ok: true, content })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}


