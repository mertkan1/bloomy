import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import SelectFlower from './components/SelectFlower';
import CraftGift from './components/CraftGift';
import GiftGrowing from './components/GiftGrowing';
import MusicSelection from './components/MusicSelection';
import CompletionPage from './components/CompletionPage';
import PreviewPage from './components/PreviewPage';
import PurchasePage from './components/PurchasePage';
import SuccessPage from './components/SuccessPage';
import MessageReviewPage from './components/MessageReviewPage';
import GiftViewPage from './components/GiftViewPage';
import MyFlowers from './components/MyFlowers';
import { Heart, Sparkles, MessageCircle, Share2, Globe, ChevronDown, User, LogIn, LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import flowerLogo from 'figma:asset/b2dfc7a842334267c53e217f862d55a3f4d30a90.png';
import flowerLogoGradient from 'figma:asset/47650059587febef5d2ffcbe8595697331a8c807.png';
import flowerLogoOutline from 'figma:asset/7f2e338b7c49e282790a86d9a96a4f9a2abdd1f2.png';

type Page = 'home' | 'select-flower' | 'craft-gift' | 'gift-growing' | 'music-selection' | 'completion' | 'preview' | 'purchase' | 'success' | 'message-review' | 'gift-view' | 'my-flowers';

interface Flower {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isLimited?: boolean;
  stock?: number;
  totalStock?: number;
}

// Initialize Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [giftData, setGiftData] = useState<any>(null);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [currentGiftId, setCurrentGiftId] = useState<string | null>(null);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoggingIn(true);
    try {
      // Demo mode: Simulate magic link process
      toast.success('Demo mode: Simulating magic link...');
      setShowLoginModal(false);
      setLoginEmail('');
      
      // Simulate successful login after delay
      setTimeout(() => {
        const mockUser = { 
          email: loginEmail, 
          id: `user_${Date.now()}`,
          access_token: 'demo_token_' + Date.now()
        };
        setUser(mockUser);
        toast.success('Signed in successfully!');
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login simulation failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentPage('home');
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleSelectFlower = (flower: Flower) => {
    setSelectedFlower(flower);
    setCurrentPage('craft-gift');
  };

  const handleSendGift = (newGiftData: any) => {
    console.log('Gift sent:', newGiftData);
    setGiftData(newGiftData);
    // Navigate to the growing/loading page
    setCurrentPage('gift-growing');
  };

  const handleGiftComplete = () => {
    setCurrentPage('music-selection');
  };

  const handleContinue = () => {
    // Navigate to purchase page after completion
    setCurrentPage('purchase');
  };

  const handleMusicSelect = (musicData: any) => {
    // Add music selection to gift data
    setGiftData(prev => ({
      ...prev,
      music: musicData
    }));
    setCurrentPage('purchase');
  };

  const handleSkipMusic = () => {
    // Continue without music
    setCurrentPage('purchase');
  };

  const handlePreviewMessages = () => {
    setCurrentPage('preview');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedFlower(null);
    setGiftData(null);
    setPurchaseData(null);
  };

  const handleProceedToPayment = (newPurchaseData: any) => {
    setPurchaseData(newPurchaseData);
    setCurrentPage('success');
  };

  const handleEditMessages = () => {
    setCurrentPage('message-review');
  };

  const handleBackToSuccess = () => {
    setCurrentPage('success');
  };

  const handleCompleteReview = () => {
    setCurrentPage('success');
  };

  const handleViewGift = (giftId?: string) => {
    // If giftId is provided, use it. Otherwise, generate a demo gift ID
    const viewGiftId = giftId || `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    setCurrentGiftId(viewGiftId);
    setCurrentPage('gift-view');
  };

  if (currentPage === 'select-flower') {
    return (
      <SelectFlower 
        onBack={() => setCurrentPage('home')}
        onSelectFlower={handleSelectFlower}
      />
    );
  }

  if (currentPage === 'craft-gift' && selectedFlower) {
    return (
      <CraftGift 
        flower={selectedFlower}
        onBack={() => setCurrentPage('select-flower')}
        onSendGift={handleSendGift}
      />
    );
  }

  if (currentPage === 'gift-growing') {
    return (
      <GiftGrowing onComplete={handleGiftComplete} />
    );
  }

  if (currentPage === 'music-selection' && giftData) {
    return (
      <MusicSelection 
        giftData={giftData}
        onSelectMusic={handleMusicSelect}
        onSkipMusic={handleSkipMusic}
        onBack={() => setCurrentPage('craft-gift')}
      />
    );
  }

  if (currentPage === 'completion' && giftData) {
    return (
      <CompletionPage 
        giftData={giftData}
        onContinue={handleContinue}
        onPreviewMessages={handlePreviewMessages}
      />
    );
  }

  if (currentPage === 'preview' && giftData) {
    return (
      <PreviewPage 
        giftData={giftData}
        onBackToDashboard={handleBackToHome}
      />
    );
  }

  if (currentPage === 'purchase' && giftData) {
    return (
      <PurchasePage 
        giftData={giftData}
        onBack={() => setCurrentPage('completion')}
        onProceedToPayment={handleProceedToPayment}
      />
    );
  }

  if (currentPage === 'success' && purchaseData) {
    return (
      <SuccessPage 
        purchaseData={purchaseData}
        giftId={purchaseData.giftId || `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`}
        onEditMessages={handleEditMessages}
        onViewGift={handleViewGift}
      />
    );
  }

  if (currentPage === 'message-review' && purchaseData) {
    return (
      <MessageReviewPage 
        purchaseData={purchaseData}
        onBackToSuccess={handleBackToSuccess}
        onCompleteReview={handleCompleteReview}
      />
    );
  }

  if (currentPage === 'gift-view' && currentGiftId) {
    return (
      <GiftViewPage 
        giftId={currentGiftId}
        onBack={handleBackToHome}
      />
    );
  }

  if (currentPage === 'my-flowers') {
    return (
      <MyFlowers 
        userEmail={user?.email || 'demo@example.com'}
        onLogout={handleLogout}
        onViewGift={handleViewGift}
        onHome={handleBackToHome}
        onSendGift={() => setCurrentPage('select-flower')}
        user={user}
      />
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={flowerLogoOutline} alt="Bloomy" className="w-6 h-6 object-contain" />
          <span className="text-2xl font-semibold text-[#111827]">Bloomy</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('select-flower')}
            className="text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            Send a Gift
          </button>
          <button 
            onClick={() => setCurrentPage('my-flowers')}
            className="text-[#FF7AA2] hover:text-[#FF9E66] transition-colors font-medium"
          >
            My Flowers
          </button>
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">About</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Globe className="w-5 h-5 text-[#6B7280] cursor-pointer hover:text-[#111827] transition-colors" />
          
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280]">Welcome, {user.email.split('@')[0]}</span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button 
                onClick={() => setCurrentPage('select-flower')}
                className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-6 py-2 hover:shadow-lg transition-all duration-300"
              >
                Send Flowers
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6B7280] hover:text-[#111827] transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold text-[#111827]">
                      Sign in to Bloomy
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="border-[#E5E7EB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2]"
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      />
                    </div>
                    <Button
                      onClick={handleLogin}
                      disabled={isLoggingIn}
                      className="w-full bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-xl py-3 hover:shadow-lg transition-all duration-300"
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending magic link...
                        </>
                      ) : (
                        'Send magic link'
                      )}
                    </Button>
                    <p className="text-sm text-[#6B7280] text-center">
                      We'll send you a magic link to sign in instantly
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={() => setCurrentPage('select-flower')}
                className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-6 py-2 hover:shadow-lg transition-all duration-300"
              >
                Send Flowers
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-[#111827] leading-tight">
                A Gift Beyond Time
              </h1>
              <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg">
                Experience the art of digital floristry. Send an exclusive, limited edition floral video, 
                paired with a unique AI-crafted message, creating a memory that will never fade.
              </p>
            </div>
            
            <Button 
              size="lg"
              onClick={() => setCurrentPage('select-flower')}
              className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-8 py-4 text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Create a Gift
            </Button>
          </div>
          
          <div className="relative">
            <div className="aspect-[1350/1080] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#FAF8F6] to-[#E5E7EB]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1698849071904-090feee32e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZmxvd2VyJTIwYXJyYW5nZW1lbnQlMjBib3VxdWV0fGVufDF8fHx8MTc1Nzg3NzQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Elegant digital flower arrangement"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
              <Sparkles className="w-6 h-6 text-[#FF7AA2]" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
              <MessageCircle className="w-6 h-6 text-[#FF9E66]" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-8 py-16 bg-[#FAF8F6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">How It Works</h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              A new way to send love
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center mx-auto">
                <img src={flowerLogoOutline} alt="" className="w-8 h-8 object-contain brightness-0 invert" />
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">Visit a Flower</h3>
              <p className="text-[#6B7280]">
                We create gorgeous arrangements for every occasion. Browse our curated collection of exclusive digital blooms that captivate and inspire.
              </p>
            </div>
            
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">AI Creates Messages</h3>
              <p className="text-[#6B7280]">
                Our AI crafts personalized messages based on your theme, creating a unique experience that evolves with each passing day.
              </p>
            </div>
            
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center mx-auto">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#111827]">Share Beautiful</h3>
              <p className="text-[#6B7280]">
                Share your digital gift through QR codes, links, or direct email. Create lasting memories that can be treasured forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Testimonials Section */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">What Our Users Say</h2>
            <p className="text-lg text-[#6B7280]">
              Real stories from those we've helped create meaningful moments
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1720456485619-8ef428357cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHdvbWFuJTIwcG9ydHJhaXQlMjB0ZXN0aW1vbmlhbHxlbnwxfHx8fDE3NTc4Nzc0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Maria Rodriguez"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-[#111827]">Maria Rodriguez</h4>
                  <p className="text-sm text-[#6B7280]">Designer</p>
                </div>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                "Bloomy transformed how I express love to my family. The AI messages were so thoughtful and personal, 
                it felt like having a poet write for me every day."
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTc3OTUxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="James Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-[#111827]">James Chen</h4>
                  <p className="text-sm text-[#6B7280]">Entrepreneur</p>
                </div>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                "I sent a 365-day flower to my mother for her birthday. She calls me every morning to read the new message. 
                It's brought us closer than ever before."
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1745434159123-4908d0b9df94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwd29tYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTc4Nzc0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sarah Wilson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-[#111827]">Sarah Wilson</h4>
                  <p className="text-sm text-[#6B7280]">Teacher</p>
                </div>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                "The quality of the digital flowers is breathtaking. My partner was amazed by the attention to detail 
                and the beautiful messages that accompanied each day."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 py-16 bg-[#FAF8F6]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-2xl px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left text-lg font-medium text-[#111827] hover:no-underline py-6">
                What exactly is a digital flower?
              </AccordionTrigger>
              <AccordionContent className="text-[#6B7280] pb-6">
                A digital flower is a high-quality, exclusive video artwork (1350x1080) featuring beautiful floral arrangements. 
                Each flower is carefully crafted by our artists and paired with AI-generated personalized messages that evolve daily.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-white rounded-2xl px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left text-lg font-medium text-[#111827] hover:no-underline py-6">
                How do the AI-generated messages work?
              </AccordionTrigger>
              <AccordionContent className="text-[#6B7280] pb-6">
                Our advanced AI creates unique, personalized messages based on the theme you choose. Whether romantic, motivational, 
                or friendly, each message is crafted to feel authentic and meaningful, updating daily throughout your chosen duration.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-white rounded-2xl px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left text-lg font-medium text-[#111827] hover:no-underline py-6">
                Are the digital flowers really limited edition?
              </AccordionTrigger>
              <AccordionContent className="text-[#6B7280] pb-6">
                Yes! Our limited edition flowers are truly exclusive, with only 100 copies available. Once sold out, 
                they're retired forever, making your gift truly unique and collectible.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-white rounded-2xl px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left text-lg font-medium text-[#111827] hover:no-underline py-6">
                How long do the daily messages continue?
              </AccordionTrigger>
              <AccordionContent className="text-[#6B7280] pb-6">
                You can choose between 30-day or 365-day packages. This is a one-time purchase, and your recipient 
                will receive new messages daily for your selected duration. No recurring charges or renewals.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-16 bg-[#111827]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <img src={flowerLogoOutline} alt="Bloomy" className="w-6 h-6 object-contain" />
              <span className="text-2xl font-semibold text-white">Bloomy</span>
            </div>
            
            <nav className="flex items-center gap-8">
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-[#6B7280] hover:text-white transition-colors"
              >
                Home
              </button>
              <a href="#" className="text-[#6B7280] hover:text-white transition-colors">About</a>
              <a href="#" className="text-[#6B7280] hover:text-white transition-colors">Contact</a>
              <button 
                onClick={() => setCurrentPage('my-flowers')}
                className="text-[#FF7AA2] hover:text-[#FF9E66] transition-colors"
              >
                My Flowers
              </button>
            </nav>
            
            <Button 
              onClick={() => setCurrentPage('select-flower')}
              className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-6 py-2 hover:shadow-lg transition-all duration-300"
            >
              Start Creating
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[#374151] text-center">
            <p className="text-[#6B7280]">
              © 2024 Bloomy. Crafting digital memories that last forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}