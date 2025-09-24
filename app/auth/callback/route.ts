import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  const url = new URL(req.nextUrl)
  const redirect = url.searchParams.get('redirect') || '/my-flowers'
  return NextResponse.redirect(new URL(redirect, req.url))
}


