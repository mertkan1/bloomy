export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">Blooomy</h1>
        <p className="text-muted-foreground">Dijital çiçek hediye akışını başlat.</p>
        <div className="flex items-center gap-4 justify-center">
          <a className="underline" href="/(flow)/select-flower">Çiçek seç</a>
          <a className="underline" href="/(flow)/message">Mesaj</a>
          <a className="underline" href="/(flow)/music">Müzik</a>
          <a className="underline" href="/(flow)/preview">Önizleme</a>
          <a className="underline" href="/(flow)/checkout">Ödeme</a>
        </div>
      </div>
    </main>
  )
}


