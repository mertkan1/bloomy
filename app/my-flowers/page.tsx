import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function MyFlowersPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">My flowers</h1>
      <p className="text-muted-foreground mt-2">Hoş geldin, {user?.email}</p>
      <div className="mt-6">Burada hediye sayfalarını listeleyeceğiz.</div>
    </main>
  )
}


