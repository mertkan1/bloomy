import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, ArrowLeft, Sparkles, Calendar, Crown, Timer, Lock, Eye } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';
import exampleImage from 'figma:asset/8ad8897c666027e964120ebef5888d4b6b9585c7.png';

interface PreviewPageProps {
  giftData: any;
  onBackToDashboard: () => void;
}

export default function PreviewPage({ giftData, onBackToDashboard }: PreviewPageProps) {
  const [countdown, setCountdown] = useState(8); // 8 second countdown
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasTriggeredCelebration, setHasTriggeredCelebration] = useState(false);

  // Auto-redirect timer
  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onBackToDashboard();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, onBackToDashboard]);

  // Trigger celebration effect on load
  useEffect(() => {
    if (!hasTriggeredCelebration) {
      setTimeout(() => {
        setShowConfetti(true);
        setHasTriggeredCelebration(true);
      }, 1000);
    }
  }, [hasTriggeredCelebration]);

  // Generate example AI message based on themes
  const generateExampleMessage = () => {
    const themes = giftData?.selectedThemes || [];
    let baseMessage = `Dear ${giftData?.recipientName || 'Friend'}, I hope this message finds you well. I wanted to send you a little something to brighten your day and let you know I'm thinking of you. Wishing you all the best.`;
    
    if (themes.includes('romantik')) {
      baseMessage = `My dearest ${giftData?.recipientName || 'Love'}, with each passing day, my heart grows fonder of you. This flower blooms as my love does - endlessly and beautifully. You are the sunshine that makes my world brighter.`;
    } else if (themes.includes('motivasyon')) {
      baseMessage = `Dear ${giftData?.recipientName || 'Champion'}, remember that every challenge you face is just another opportunity to show your incredible strength. You have everything it takes to achieve your dreams. Keep pushing forward!`;
    } else if (themes.includes('espirili')) {
      baseMessage = `Hey ${giftData?.recipientName || 'Superstar'}! Life's too short for boring flowers, so here's a digital one that won't need watering (you're welcome!). Hope this brings a smile to your beautiful face today!`;
    }
    
    return baseMessage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF2F8] via-[#F3E8FF] to-[#EDE9FE] relative overflow-hidden">
      {/* Confetti Effect */}
      <ConfettiEffect trigger={showConfetti} />
      
      {/* Preview Mode Notice */}
      <div className="px-6 lg:px-8 py-4 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border-b border-[#F59E0B]/20 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <Eye className="w-5 h-5 text-[#92400E]" />
          <span className="text-[#92400E] font-medium">
            Preview Mode – This is how your gift will look
          </span>
          <Lock className="w-4 h-4 text-[#92400E]" />
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {i % 3 === 0 ? (
              <Heart className="w-6 h-6 text-[#FF7AA2]" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-5 h-5 text-[#FF9E66]" />
            ) : (
              <Crown className="w-5 h-5 text-[#FCD34D]" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="px-6 lg:px-8 py-6 bg-white/90 backdrop-blur-md border-b border-white/20 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">FloroDay</span>
          </div>
          
          <Button
            onClick={onBackToDashboard}
            variant="ghost"
            className="text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Gift Display */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-8 lg:p-12">
              {/* Day Counter */}
              <motion.div
                className="flex items-center justify-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white px-6 py-3 rounded-2xl">
                  <Calendar className="w-6 h-6" />
                  <span className="text-lg font-medium">
                    Preview of Day 1
                  </span>
                </div>
              </motion.div>

              {/* Enhanced Flower Display */}
              <motion.div
                className="relative bg-gradient-to-br from-[#FFF8F0] via-[#FEFCF6] to-[#F8F9FA] rounded-3xl overflow-hidden mb-8 shadow-2xl"
                style={{ aspectRatio: '1350/1080' }}
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: 0,
                  boxShadow: [
                    '0 20px 60px rgba(255, 122, 162, 0.4)',
                    '0 30px 80px rgba(255, 158, 102, 0.5)',
                    '0 20px 60px rgba(255, 122, 162, 0.4)'
                  ]
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.4,
                  boxShadow: { duration: 4, repeat: Infinity }
                }}
              >
                {/* Golden border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FCD34D] via-[#FF9E66] to-[#FF7AA2] rounded-3xl p-1">
                  <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] to-[#F8F9FA] rounded-[calc(1.5rem-4px)]">
                    <ImageWithFallback
                      src={giftData?.flower?.image || exampleImage}
                      alt={giftData?.flower?.name || 'Digital Flower Gift'}
                      className="w-full h-full object-cover rounded-[calc(1.5rem-4px)]"
                    />
                  </div>
                </div>
                
                {/* Preview Badge */}
                <div className="absolute top-4 right-4 bg-[#6366F1] text-white px-3 py-1 rounded-full text-sm font-medium">
                  PREVIEW
                </div>

                {/* Enhanced Play Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10 flex items-center justify-center group cursor-pointer hover:from-black/10 hover:to-black/15 transition-all duration-500">
                  <motion.div
                    className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/50"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      boxShadow: [
                        '0 10px 30px rgba(0,0,0,0.1)',
                        '0 15px 40px rgba(255,122,162,0.3)',
                        '0 10px 30px rgba(0,0,0,0.1)'
                      ]
                    }}
                    transition={{
                      boxShadow: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <div className="w-0 h-0 border-l-[16px] border-l-[#111827] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                  </motion.div>
                </div>

                {/* Enhanced Sparkle Effects */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: `${15 + Math.random() * 70}%`
                    }}
                    animate={{
                      scale: [0, 1.2, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.25
                    }}
                  >
                    {i % 4 === 0 ? (
                      <Sparkles className="w-4 h-4 text-[#FFD93D]" />
                    ) : i % 4 === 1 ? (
                      <Heart className="w-3 h-3 text-[#FF7AA2]" />
                    ) : i % 4 === 2 ? (
                      <Crown className="w-3 h-3 text-[#FCD34D]" />
                    ) : (
                      <div className="w-2 h-2 bg-gradient-to-r from-[#FF9E66] to-[#FCD34D] rounded-full" />
                    )}
                  </motion.div>
                ))}

                {/* Elegant frame corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#FCD34D] rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#FCD34D] rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#FCD34D] rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#FCD34D] rounded-br-lg" />
              </motion.div>

              {/* Enhanced Title Section */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div
                  className="inline-block mb-4"
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-[#FF7AA2] via-[#FF9E66] to-[#FCD34D] bg-clip-text text-transparent mb-2">
                    You have a special gift!
                  </h1>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Crown className="w-6 h-6 text-[#FCD34D]" />
                    <span className="text-lg font-medium text-[#6B7280]">A precious moment just for you</span>
                    <Crown className="w-6 h-6 text-[#FCD34D]" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Enhanced Current Message */}
              <motion.div
                className="relative bg-gradient-to-br from-white via-[#FEFCF6] to-white rounded-3xl p-10 shadow-2xl border border-[#FCD34D]/20 mb-8"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3, delay: 0.8 }}
              >
                {/* Decorative elements */}
                <div className="absolute top-4 left-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-[#FCD34D]" />
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-6 h-6 text-[#FF7AA2]" />
                  </motion.div>
                </div>

                <div className="text-center">
                  <motion.div
                    className="relative bg-[#FEFCF6] rounded-2xl p-8 mb-6 border border-[#FCD34D]/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="absolute top-2 left-2 text-4xl text-[#FCD34D]/30">"</div>
                    <div className="absolute bottom-2 right-2 text-4xl text-[#FCD34D]/30 rotate-180">"</div>
                    <p className="text-[#374151] leading-relaxed text-lg px-6">
                      {generateExampleMessage()}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[#6B7280] text-sm">With endless love from</p>
                      <p className="text-[#111827] font-semibold text-lg">{giftData?.senderName || 'Your Secret Admirer'}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Moved countdown to bottom */}
              <motion.p 
                className="text-center text-lg text-[#6B7280] bg-white/50 rounded-2xl px-6 py-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                29 more magical days await you
              </motion.p>
            </div>
          </motion.div>

          {/* Bottom Section - Auto-redirect notice and Continue Button */}
          <div className="space-y-6">
            {/* Auto-redirect notice */}
            {autoRedirect && countdown > 0 && (
              <motion.div 
                className="bg-white rounded-xl p-6 border border-[#E5E7EB] text-center shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Timer className="w-5 h-5 text-[#FF7AA2]" />
                  <span className="text-[#6B7280] font-medium">
                    Auto-continuing to purchase in {countdown} seconds
                  </span>
                </div>
                <Button
                  onClick={() => setAutoRedirect(false)}
                  variant="ghost"
                  size="sm"
                  className="text-sm text-[#6B7280] hover:text-[#111827]"
                >
                  Cancel auto-redirect
                </Button>
              </motion.div>
            )}
            
            {/* Continue Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <Button
                onClick={onBackToDashboard}
                className="w-full bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl py-6 text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {autoRedirect ? `Continue to Purchase (${countdown}s)` : 'Continue to Purchase'}
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-8 bg-white/50 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-md flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#6B7280] font-medium">FloroDay</span>
          </div>
          <p className="text-sm text-[#9CA3AF]">
            Creating beautiful digital memories that last forever
          </p>
        </div>
      </footer>
    </div>
  );
}