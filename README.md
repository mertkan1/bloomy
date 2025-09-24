 # Bloomy – Dijital Çiçek Video Hediye (Next.js 14 App Router)

 Üretime hazır iskelet: Next.js 14 App Router + TypeScript + TailwindCSS, Supabase (Auth/DB/RLS), Stripe Checkout & Webhook, AI mesaj üretimi (OpenAI/Anthropic), i18n (TR/EN), dinamik OG görselleri.

 ## Hızlı Başlangıç

 ```bash
 npm i
 npm run dev
 ```

 Gerekli environment değişkenlerini `.env.local` dosyasına koyun. Örnek için `ENV.NEXT.EXAMPLE.txt` dosyasını kullanın.

 ## Environment Değişkenleri

 `ENV.NEXT.EXAMPLE.txt` içinde örnekleri bulabilirsiniz. Özet:

 - Public
   - `NEXT_PUBLIC_BASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRIPE_PRICE_30D`
   - `NEXT_PUBLIC_STRIPE_PRICE_365D`
 - Server-only
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY`
 - AI Sağlayıcı (seçmeli)
   - `AI_PROVIDER=openai` veya `AI_PROVIDER=anthropic`
   - OpenAI: `OPENAI_API_KEY`
   - Anthropic: `ANTHROPIC_API_KEY`

 ## Supabase

 - Auth: Magic Link akışı (`/login`, `/auth/callback`).
 - DB/RLS: `supabase/migrations/0001_schema.sql` şeması: `profiles`, `flowers`, `orders`, `daily_messages`, `ai_events`, tetikleyici ve RLS politikaları.
 - Admin: Webhook için `lib/supabase/admin.ts` `service_role` kullanır.

 ## Stripe

 - Checkout: `POST /api/payments/checkout` sipariş oluşturur ve Stripe Checkout oturumunu açar.
 - Webhook: `POST /api/payments/webhook` başarılı ödemede siparişi `paid` yapar ve token tanımlar.
 - Planlar: `lib/payments/plans.ts` fiyat ID/token eşleşmeleri.

 ### Webhook Kurulumu

 ```bash
 stripe login
 stripe listen --forward-to http://localhost:3000/api/payments/webhook
 ```

 Gelen `whsec_...` değerini `.env.local` dosyasına `STRIPE_WEBHOOK_SECRET` olarak ekleyin.

 ## AI Mesaj Üretimi

 - Endpoint: `POST /api/ai/generate` body: `{ orderId, dayIndex, theme, names: { buyer, recipient } }`
 - Akış: Token kontrol → LLM çağrısı (OpenAI/Anthropic) → `daily_messages` upsert → `ai_events` insert.
 - Sağlayıcı seçimi ve fallback: `lib/ai/llm.ts`.

 ## i18n (TR/EN)

 - Sözlükler: `i18n/dictionaries/tr.json`, `i18n/dictionaries/en.json`
 - Yükleyici: `i18n/index.ts`
 - Dil: `app/lang/route.ts` cookie tabanlı.

 ## OG/SEO

 - Dinamik OG: `app/og/route.tsx`, `app/og/[code]/route.tsx`
 - Gift sayfası: `app/gift/[code]/page.tsx` SSR + i18n meta.

 ## Akış Sayfaları

 - `/(flow)/select-flower` → çiçek seçimi
 - `/(flow)/message-theme` → tema seçimi
 - `/(flow)/music` → müzik seçimi (opsiyonel)
 - `/(flow)/preview` → önizleme
 - `/(flow)/checkout` → plan seçimi ve ödeme
 - `/(flow)/prepare` → hazırlama
 - `/(flow)/success` → başarı
 - `/my-flowers` → kullanıcı çiçekleri (korumalı)
 - `/gift/[code]` → alıcı sayfası (SSR)

 ## Vercel Dağıtım

 - Stripe webhook Node.js runtime ile çalışır (App Router default uygundur).
 - Ortam değişkenlerini Vercel’e ekleyin (Dev/Preview/Prod).
 - Build komutu: `npm run build`

 ## Scriptler

 ```json
 {
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint"
   }
 }
 ```

 ## Güvenlik

 - RLS politikaları aktiftir, sunucu çağrıları kullanıcı oturumu ile yapılır.
 - Webhook güncellemeleri `service_role` ile yapılır; anahtar sadece sunucu tarafında tutulmalıdır.

 ---

 Sorular için issue açabilir veya PR gönderebilirsiniz. 🎉
  