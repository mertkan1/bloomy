import Image from 'next/image'
import flowerLogoOutline from '@/assets/7f2e338b7c49e282790a86d9a96a4f9a2abdd1f2.png'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={flowerLogoOutline} alt="Bloomy" width={24} height={24} />
          <span className="text-2xl font-semibold text-[#111827]">Bloomy</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-[#6B7280] hover:text-[#111827] transition-colors">Home</a>
          <a href="/(flow)/select-flower" className="text-[#6B7280] hover:text-[#111827] transition-colors">Send a Gift</a>
          <a href="#how" className="text-[#6B7280] hover:text-[#111827] transition-colors">How it works</a>
        </nav>
        <a
          href="/(flow)/select-flower"
          className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-6 py-2 hover:shadow-lg transition-all duration-300"
        >
          Start Creating
        </a>
      </header>

      <section className="px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-[#111827] leading-tight">
                A Gift Beyond Time
              </h1>
              <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg">
                Experience the art of digital floristry. Send an exclusive, limited edition floral video,
                paired with a unique AI-crafted message.
              </p>
            </div>
            <a
              href="/(flow)/select-flower"
              className="inline-block bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-8 py-4 text-lg hover:shadow-xl transition-all duration-300"
            >
              Create a Gift
            </a>
          </div>
          <div className="relative">
            <div className="aspect-[1350/1080] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#FAF8F6] to-[#E5E7EB]">
              <Image
                src="https://images.unsplash.com/photo-1698849071904-090feee32e73?auto=format&fit=crop&w=1350&q=80"
                alt="Elegant digital flower arrangement"
                width={1350}
                height={1080}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="px-8 py-16 bg-[#FAF8F6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">How It Works</h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">A new way to send love</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center mx-auto">
                <Image src={flowerLogoOutline} alt="" width={32} height={32} className="brightness-0 invert" />
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">Visit a Flower</h3>
              <p className="text-[#6B7280]">Browse our curated collection of exclusive digital blooms.</p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-xl">AI</span>
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">AI Creates Messages</h3>
              <p className="text-[#6B7280]">Personalized daily notes that evolve over time.</p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-xl">↗</span>
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">Share Beautiful</h3>
              <p className="text-[#6B7280]">Deliver via link, QR, or email — memories that last.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


