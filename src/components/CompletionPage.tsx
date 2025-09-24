import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Sparkles, Facebook, Twitter, MessageCircle, Gift, Info } from 'lucide-react';
import exampleImage from 'figma:asset/8ad8897c666027e964120ebef5888d4b6b9585c7.png';

interface CompletionPageProps {
  giftData: any;
  onContinue: () => void;
  onPreviewMessages: () => void;
}

export default function CompletionPage({ giftData, onContinue, onPreviewMessages }: CompletionPageProps) {
  const [showPage, setShowPage] = useState(false);
  const [giftAnimationComplete, setGiftAnimationComplete] = useState(false);

  useEffect(() => {
    // Start gift opening animation sequence
    const timer1 = setTimeout(() => setGiftAnimationComplete(true), 2500);
    const timer2 = setTimeout(() => setShowPage(true), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Gift Animation Component
  const GiftAnimation = () => (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-[#FF7AA2]/20 via-white to-[#FF9E66]/20 z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        {/* Gift Box Animation */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Gift Box */}
          <motion.div
            className="w-32 h-32 bg-gradient-to-br from-[#FF7AA2] to-[#FF9E66] rounded-2xl mx-auto relative shadow-2xl"
            animate={giftAnimationComplete ? { scale: 0.8, opacity: 0.3 } : {}}
            transition={{ duration: 0.5 }}
          >
            {/* Box Lid */}
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-36 h-8 bg-gradient-to-r from-[#FF9E66] to-[#FFD93D] rounded-xl"
              animate={giftAnimationComplete ? { y: -60, rotateX: -20 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            
            {/* Ribbon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-full bg-[#FFD93D] opacity-80"></div>
              <div className="absolute w-full h-1 bg-[#FFD93D] opacity-80"></div>
            </div>
            
            {/* Bow */}
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-[#FFD93D] rounded-full"
              animate={giftAnimationComplete ? { scale: 1.2, y: -40 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            />
          </motion.div>

          {/* Flower emerging from vase */}
          <AnimatePresence>
            {giftAnimationComplete && (
              <motion.div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: -10 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {/* Vase */}
                <motion.div
                  className="w-16 h-20 bg-gradient-to-b from-[#E5E7EB] to-[#9CA3AF] rounded-b-2xl mx-auto mb-2"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Flower Stem */}
                <motion.div
                  className="w-1 h-12 bg-[#22C55E] mx-auto"
                  initial={{ height: 0 }}
                  animate={{ height: 48 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                
                {/* Flower */}
                <motion.div
                  className="relative w-8 h-8 mx-auto"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-4 bg-gradient-to-t from-[#FF7AA2] to-[#FF9E66] rounded-full"
                      style={{
                        transform: `rotate(${i * 60}deg)`,
                        transformOrigin: 'center bottom',
                        top: '50%',
                        left: '50%',
                        marginTop: '-8px',
                        marginLeft: '-6px'
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                    />
                  ))}
                  <motion.div
                    className="absolute w-2 h-2 bg-[#FCD34D] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Animation Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <h2 className="text-2xl font-bold text-[#111827] mb-2">
            Your Gift is Ready!
          </h2>
          <p className="text-[#6B7280]">
            Opening your digital flower arrangement...
          </p>
        </motion.div>

        {/* Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${30 + Math.random() * 40}%`
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            <Sparkles className="w-full h-full text-[#FFD93D]" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  if (!showPage) {
    return <GiftAnimation />;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-[#FDF2F8] via-[#F3E8FF] to-[#EDE9FE]">
      {/* Header */}
      <header className="px-6 lg:px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#111827]">FloroDay</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Send a Gift</a>
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">My Gifts</a>
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">My Account</a>
          <div className="w-8 h-8 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full"></div>
        </nav>
      </header>

      {/* Main Completion Content */}
      <div className="px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Previous Messages - moved to top */}
          <motion.div
            className="mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-[#111827] mb-8">Previous Messages</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { day: 'Day 2', date: '2024-01-02' },
                { day: 'Day 3', date: '2024-01-03' },
                { day: 'Day 4', date: '2024-01-04' },
                { day: 'Day 5', date: '2024-01-05' }
              ].map((item, index) => (
                <motion.div
                  key={item.day}
                  className="bg-white rounded-xl p-4 shadow-sm text-center"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="font-medium text-[#111827] mb-1">{item.day}</h4>
                  <p className="text-sm text-[#6B7280]">{item.date}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gift Preview Frame - Main completion content */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Preview Frame with Glow */}
            <div className="relative p-8 lg:p-12">
              <motion.div
                className="relative bg-gradient-to-br from-[#F8F9FA] to-[#E5E7EB] rounded-2xl overflow-hidden mb-8"
                style={{ aspectRatio: '1350/1080' }}
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(255, 122, 162, 0.3)',
                    '0 0 40px rgba(255, 158, 102, 0.4)',
                    '0 0 20px rgba(255, 122, 162, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <ImageWithFallback
                  src={giftData?.flower?.image || exampleImage}
                  alt={giftData?.flower?.name || 'Digital Flower Gift'}
                  className="w-full h-full object-cover"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center group cursor-pointer hover:bg-black/20 transition-colors">
                  <motion.div
                    className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-0 h-0 border-l-[12px] border-l-[#111827] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </motion.div>
                </div>

                {/* Sparkle Effects */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  >
                    <Sparkles className="w-full h-full text-[#FFD93D]" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Title Section */}
              <div className="text-center mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] bg-clip-text text-transparent mb-4">
                  You have a special gift!
                </h1>
                <p className="text-lg text-[#6B7280]">
                  Your flower will be revealed tomorrow.
                </p>
              </div>

              {/* Message Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <div className="text-center">
                  <p className="text-[#374151] leading-relaxed mb-6">
                    "{generateExampleMessage()}"
                  </p>
                  <p className="text-[#6B7280] italic">
                    A message from your friend, {giftData?.senderName || 'Sarah'}
                  </p>
                </div>
              </div>

              {/* Share Section */}
              <div className="text-center">
                <p className="text-[#6B7280] mb-4">Share your gift:</p>
                <div className="flex items-center justify-center gap-4">
                  <button className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Facebook className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Twitter className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section - White Background */}
      <div className="bg-white">
        <div className="px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Info Box */}
            <motion.div
              className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-2xl p-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <p className="text-[#92400E] leading-relaxed">
                  All messages have been automatically prepared for you by our AI agent, but don't worry, 
                  you can preview all of them in advance and make manual changes if you wish.
                </p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Button
                onClick={onContinue}
                className="w-full bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl py-6 text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Continue
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 lg:px-8 py-8 border-t border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-md flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#6B7280]">FloroDay</span>
            </div>
            <div className="flex items-center gap-4">
              <Facebook className="w-5 h-5 text-[#6B7280] cursor-pointer hover:text-[#FF7AA2] transition-colors" />
              <Twitter className="w-5 h-5 text-[#6B7280] cursor-pointer hover:text-[#FF7AA2] transition-colors" />
              <MessageCircle className="w-5 h-5 text-[#6B7280] cursor-pointer hover:text-[#FF7AA2] transition-colors" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}