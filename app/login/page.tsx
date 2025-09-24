"use client"
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } })
    if (!error) setSent(true)
    else alert(error.message)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-sm w-full">
        <h1 className="text-2xl font-semibold">Giriş</h1>
        <p className="text-muted-foreground mt-2">E‑posta ile Magic Link gönderelim</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full border rounded-md p-3" required />
          <button className="w-full bg-black text-white rounded-md p-3" type="submit">Gönder</button>
        </form>
        {sent && <p className="text-green-800 mt-3">E‑posta gönderildi. Gelen kutunu kontrol et.</p>}
      </div>
    </main>
  )
}


