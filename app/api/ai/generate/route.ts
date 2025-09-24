import { NextRequest, NextResponse } from 'next/server'
import { ensureHasTokenAndConsume, upsertDailyMessage } from '@/lib/ai/tokens'

export async function POST(req: NextRequest) {
  try {
    const { orderId, dayIndex, theme, names } = await req.json()
    await ensureHasTokenAndConsume(orderId)
    // TODO: Burada AI çağrısı yapın. Şimdilik mock içerik.
    const content = `Sevgili ${names?.recipient ?? 'sevgili'}, tema: ${theme ?? 'romantik'} – güzel bir gün olsun!`
    await upsertDailyMessage(orderId, dayIndex, content, 'ai')
    return NextResponse.json({ ok: true, content })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}


