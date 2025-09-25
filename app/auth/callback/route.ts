import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '~/lib/supabase/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.nextUrl)
  const redirect = url.searchParams.get('redirect') || '/my-flowers'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL(redirect, req.url))
  }

  const supabase = createSupabaseServerClient()
  await supabase.auth.getSession()
  return NextResponse.redirect(new URL(redirect, req.url))
}


