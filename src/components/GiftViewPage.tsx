'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, History, Play, Pause } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';
import exampleImage from '@/assets/8ad8897c666027e964120ebef5888d4b6b9585c7.png';
import whiteFlowerIcon from '@/assets/5475b1411dea4e76a005dd69e4f4fca7bc3fafe7.png';
import flowerLogo from '@/assets/b2dfc7a842334267c53e217f862d55a3f4d30a90.png';
import flowerLogoGradient from '@/assets/47650059587febef5d2ffcbe8595697331a8c807.png';
import flowerLogoOutline from '@/assets/7f2e338b7c49e282790a86d9a96a4f9a2abdd1f2.png';

const exampleImageSrc = typeof exampleImage === 'string' ? exampleImage : exampleImage.src;
const whiteFlowerIconSrc = typeof whiteFlowerIcon === 'string' ? whiteFlowerIcon : whiteFlowerIcon.src;
const flowerLogoSrc = typeof flowerLogo === 'string' ? flowerLogo : flowerLogo.src;
const flowerLogoGradientSrc = typeof flowerLogoGradient === 'string' ? flowerLogoGradient : flowerLogoGradient.src;
const flowerLogoOutlineSrc = typeof flowerLogoOutline === 'string' ? flowerLogoOutline : flowerLogoOutline.src;

type GiftMessageInput =
  | string
  | {
      content?: string | null;
      message?: string | null;
      body?: string | null;
      text?: string | null;
      day_index?: number | null;
      dayIndex?: number | null;
    };

type GiftMessage = {
  content: string;
  dayIndex: number;
};

type SupabaseOrder = {
  id?: string;
  gift_code?: string | null;
  plan?: string | null;
  buyer_name?: string | null;
  recipient_name?: string | null;
  theme?: string | null;
  themes?: string[] | null;
  song_id?: string | null;
  status?: string | null;
  created_at?: string | null;
  start_date?: string | null;
  duration_days?: number | null;
  flower?: {
    name?: string | null;
    media_url?: string | null;
  } | null;
  flower_name?: string | null;
  flower_media_url?: string | null;
  flower_image?: string | null;
  sender_name?: string | null;
  [key: string]: unknown;
};

type GiftData = {
  id: string;
  flower: {
    name: string;
    image: string;
  };
  recipientName: string;
  senderName: string;
  startDate: string;
  duration: number;
  themes: string[];
  plan: string;
  status: string;
  music?: {
    track: {
      name: string;
      artist: string;
    };
  };
};

interface GiftViewPageProps {
  giftId?: string;
  order?: SupabaseOrder | null;
  messages?: GiftMessageInput[];
  onBack?: () => void;
}

export default function GiftViewPage({ giftId, order, messages: initialMessages = [], onBack }: GiftViewPageProps = {}) {
  const resolvedGiftId = giftId ?? order?.gift_code ?? order?.id ?? 'demo';
  const normalizedInitialMessages = useMemo(() => {
    if (!Array.isArray(initialMessages)) return [] as GiftMessage[];

    return initialMessages
      .map((msg, index) => {
        if (typeof msg === 'string') {
          return { content: msg, dayIndex: index + 1 } satisfies GiftMessage;
        }

        const fallback =
          (typeof msg?.content === 'string' && msg.content) ||
          (typeof msg?.message === 'string' && msg.message) ||
          (typeof msg?.body === 'string' && msg.body) ||
          (typeof msg?.text === 'string' && msg.text) ||
          '';

        return { content: fallback, dayIndex: (msg?.day_index ?? msg?.dayIndex ?? index) + 1 } satisfies GiftMessage;
      })
      .filter((msg): msg is GiftMessage => Boolean(msg.content?.trim()));
  }, [initialMessages]);
  const normalizedInitialMessageStrings = useMemo(
    () => normalizedInitialMessages.map((msg) => msg.content),
    [normalizedInitialMessages]
  );
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasTriggeredCelebration, setHasTriggeredCelebration] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const derivedGiftData = useMemo<GiftData | null>(() => {
    if (!order) return null;

    const plan = typeof order.plan === 'string' && order.plan.length > 0 ? order.plan : '30d';
    const durationFromOrder =
      typeof order.duration_days === 'number' && order.duration_days > 0
        ? order.duration_days
        : plan === '365d'
        ? 365
        : 30;
    const startDate = (() => {
      if (typeof order.start_date === 'string' && order.start_date) return order.start_date;
      if (typeof order.created_at === 'string' && order.created_at) {
        return order.created_at.split('T')[0];
      }
      return new Date().toISOString().split('T')[0];
    })();
    const flowerName =
      (order.flower?.name && typeof order.flower.name === 'string' && order.flower.name) ||
      (typeof order.flower_name === 'string' && order.flower_name) ||
      'Bloomy Flower';
    const flowerImage =
      (order.flower?.media_url && typeof order.flower.media_url === 'string' && order.flower.media_url) ||
      (typeof order.flower_media_url === 'string' && order.flower_media_url) ||
      (typeof order.flower_image === 'string' && order.flower_image) ||
      exampleImageSrc;
    const senderName =
      (typeof order.buyer_name === 'string' && order.buyer_name) ||
      (typeof order.sender_name === 'string' && order.sender_name) ||
      'Your Secret Admirer';
    const recipientName =
      (typeof order.recipient_name === 'string' && order.recipient_name) ||
      'Elif';
    const status = (typeof order.status === 'string' && order.status) || 'active';
    const themes = (() => {
      if (Array.isArray(order.themes)) {
        return order.themes.filter((theme): theme is string => typeof theme === 'string');
      }
      if (typeof order.theme === 'string' && order.theme.length > 0) {
        return [order.theme];
      }
      return ['romantic'];
    })();

    const music =
      typeof order.song_id === 'string' && order.song_id.length > 0
        ? {
            track: {
              name: 'Custom Selection',
              artist: order.song_id,
            },
          }
        : undefined;

    return {
      id: resolvedGiftId,
      flower: {
        name: flowerName,
        image: flowerImage,
      },
      recipientName,
      senderName,
      startDate,
      duration: Math.max(1, durationFromOrder),
      themes,
      plan,
      status,
      music,
    } satisfies GiftData;
  }, [order, resolvedGiftId]);
  const [giftData, setGiftData] = useState<GiftData | null>(derivedGiftData);
  const [messages, setMessages] = useState<string[]>(
    normalizedInitialMessageStrings.length > 0 ? normalizedInitialMessageStrings : []
  );
  const celebrationTimeoutRef = useRef<number | null>(null);

  const scheduleCelebration = useCallback(() => {
    if (hasTriggeredCelebration) return;
    if (celebrationTimeoutRef.current) {
      window.clearTimeout(celebrationTimeoutRef.current);
    }
    celebrationTimeoutRef.current = window.setTimeout(() => {
      setShowConfetti(true);
      setHasTriggeredCelebration(true);
    }, 1000);
  }, [hasTriggeredCelebration]);

  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (derivedGiftData) {
      setGiftData(derivedGiftData);
    }
  }, [derivedGiftData]);

  useEffect(() => {
    if (normalizedInitialMessageStrings.length === 0) {
      return;
    }

    const total = normalizedInitialMessageStrings.length;
    setMessages((prev) => {
      if (prev.length === total && prev.every((value, index) => value === normalizedInitialMessageStrings[index])) {
        return prev;
      }
      return [...normalizedInitialMessageStrings];
    });
    setCurrentDay(Math.max(1, total));
    setSelectedDay(Math.max(1, total));
    scheduleCelebration();
  }, [normalizedInitialMessageStrings, scheduleCelebration]);

  const generateAllMessages = useCallback((totalDays: number, data: GiftData): string[] => {
    const messageTemplates = [
      `Dear ${data.recipientName}, with each passing day, my heart grows fonder of you. This flower blooms as my love does - endlessly and beautifully. You are the sunshine that makes my world brighter.`,
      `My beloved ${data.recipientName}, every sunrise brings new reasons to smile, and you are always at the top of that list. Your presence in my life is a gift I treasure beyond words.`,
      `Sweet ${data.recipientName}, like this eternal flower, my feelings for you will never fade. You have captured my heart completely, and I am grateful for every moment we share.`,
      `Hello beautiful ${data.recipientName}, another day, another opportunity to tell you how much you mean to me. Your kindness and grace make the world a more beautiful place.`,
      `Dearest ${data.recipientName}, in a world full of temporary things, you are my constant. My love for you grows stronger with each passing day, just like this blooming flower.`,
      `${data.recipientName}, watching this flower bloom reminds me of how our bond continues to flourish. Each day brings new beauty, new hope, and new reasons to cherish you.`,
      `My dear ${data.recipientName}, time may pass, but some things remain eternal - like the beauty of this flower and my appreciation for you. You make every day special.`,
      `${data.recipientName}, in the garden of life, you are the most precious bloom. Your presence brings color and joy to every moment we share together.`,
      `Beloved ${data.recipientName}, just as this digital flower defies time, so does my gratitude for having you in my life. You are truly one of a kind.`,
      `Dear ${data.recipientName}, another day of this beautiful journey together. May this flower remind you that you are loved, valued, and deeply appreciated.`,
    ];

    const generatedMessages: string[] = [];
    for (let day = 1; day <= totalDays; day += 1) {
      const template = messageTemplates[(day - 1) % messageTemplates.length];
      const variations = [
        template,
        template.replace('Dear ', 'Hello ').replace('Dearest ', 'My dear '),
        template.replace('My beloved ', 'Sweet ').replace('Sweet ', 'Dear '),
      ];
      const selectedMessage = variations[day % variations.length];
      generatedMessages.push(selectedMessage);
    }

    return generatedMessages;
  }, []);

  useEffect(() => {
    if (normalizedInitialMessageStrings.length > 0) {
      return;
    }
    if (derivedGiftData) {
      const simulatedDay = Math.min(derivedGiftData.duration, Math.max(1, Math.ceil(derivedGiftData.duration / 10)));
      setCurrentDay(simulatedDay);
      setSelectedDay(simulatedDay);
      setMessages((prev) => (prev.length > 0 ? prev : generateAllMessages(simulatedDay, derivedGiftData)));
      scheduleCelebration();
      return;
    }
    if (giftData) {
      return;
    }

    let isCancelled = false;
    const fetchGiftData = async () => {
      const fallbackGiftData: GiftData = {
        id: resolvedGiftId,
        flower: {
          name: 'Premium Rose Collection',
          image: exampleImageSrc,
        },
        recipientName: 'Elif',
        senderName: 'Your Secret Admirer',
        startDate: new Date().toISOString().split('T')[0],
        duration: 30,
        themes: ['romantic', 'inspirational'],
        plan: '30d',
        status: 'active',
        music: {
          track: {
            name: 'Eternal Love',
            artist: 'Florence Symphony',
          },
        },
      };

      if (isCancelled) return;

      setGiftData(fallbackGiftData);
      const simulatedDay = Math.min(fallbackGiftData.duration, 3);
      setCurrentDay(simulatedDay);
      setSelectedDay(simulatedDay);
      setMessages(generateAllMessages(simulatedDay, fallbackGiftData));
      scheduleCelebration();
    };

    fetchGiftData();

    return () => {
      isCancelled = true;
    };
  }, [
    normalizedInitialMessageStrings,
    derivedGiftData,
    giftData,
    generateAllMessages,
    scheduleCelebration,
    resolvedGiftId,
  ]);

  // Auto-play music when component mounts
  useEffect(() => {
    if (giftData?.music) {
      // Simulate playing music after a short delay
      setTimeout(() => {
        setIsPlaying(true);
      }, 2000);
    }
  }, [giftData]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual audio playback
  };

  const goToPreviousDay = () => {
    if (selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    }
  };

  const goToNextDay = () => {
    if (selectedDay < currentDay) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const getCurrentMessage = () => {
    return messages[selectedDay - 1] || 'Loading message...';
  };

  if (!giftData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px rgba(255, 122, 162, 0.3)',
                '0 0 40px rgba(255, 122, 162, 0.6)',
                '0 0 20px rgba(255, 122, 162, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={flowerLogoSrc} alt="Bloomy" className="w-20 h-20 object-contain" />
          </motion.div>
          <motion.p 
            className="text-lg text-[#6B7280] font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Opening your special gift...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Confetti Effect */}
      <ConfettiEffect trigger={showConfetti} />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const iconSrc = i % 3 === 0 ? whiteFlowerIconSrc : flowerLogoOutlineSrc;
          return (
            <motion.div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <img src={iconSrc} alt="" className="w-8 h-8 opacity-60" />
            </motion.div>
          );
        })}
      </div>

      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <img src={flowerLogoOutlineSrc} alt="Bloomy" className="w-6 h-6 object-contain" />
          <span className="text-2xl font-semibold text-[#111827]">Bloomy</span>
        </div>
        
        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Gift Display */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8 border border-[#E5E7EB]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-8 lg:p-12">
              {/* Day Counter & Navigation */}
              <motion.div
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Button
                  onClick={goToPreviousDay}
                  disabled={selectedDay === 1}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 border-[#E5E7EB] hover:border-[#FF7AA2]"
                >
                  <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                </Button>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[#FF7AA2]" />
                  <span className="text-lg font-medium text-[#111827]">
                    Day {selectedDay} of {giftData.duration}
                  </span>
                  {selectedDay !== currentDay && (
                    <span className="text-sm bg-[#FAF8F6] text-[#6B7280] px-2 py-1 rounded-full">
                      Past Message
                    </span>
                  )}
                </div>
                
                <Button
                  onClick={goToNextDay}
                  disabled={selectedDay === currentDay}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 border-[#E5E7EB] hover:border-[#FF7AA2]"
                >
                  <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </motion.div>

              {/* Enhanced Flower Display */}
              <motion.div
                className="relative bg-gradient-to-br from-[#FAF8F6] to-[#F0F0F0] rounded-3xl overflow-hidden mb-8"
                style={{ aspectRatio: '1350/1080' }}
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.4
                }}
              >
                <div className="absolute inset-0">
                  <img
                    src={flowerLogoGradientSrc}
                    alt=""
                    className="absolute -top-8 -right-8 w-40 h-40 opacity-30 blur-sm rotate-12"
                  />
                </div>
                {/* Subtle border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7AA2]/10 via-[#FF9E66]/5 to-[#FF7AA2]/10 rounded-3xl p-[1px]">
                  <div className="w-full h-full bg-gradient-to-br from-[#FAF8F6] to-[#F0F0F0] rounded-[calc(1.5rem-1px)]">
                    <ImageWithFallback
                      src={giftData?.flower?.image ?? exampleImageSrc}
                      alt={giftData?.flower?.name ?? 'Bloomy Flower'}
                      className="w-full h-full object-cover rounded-[calc(1.5rem-1px)]"
                    />
                  </div>
                </div>
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 flex items-center justify-center group cursor-pointer hover:from-black/10 hover:to-black/10 transition-all duration-500">
                  <motion.div
                    className="w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-0 h-0 border-l-[14px] border-l-[#FF7AA2] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </motion.div>
                </div>



                {/* Elegant frame corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[#FF7AA2]/30 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-[#FF7AA2]/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[#FF7AA2]/30 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[#FF7AA2]/30 rounded-br-lg" />
              </motion.div>

              {/* Title Section */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div
                  className="inline-block mb-4"
                  animate={{ 
                    scale: [1, 1.01, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <h1 className="text-4xl lg:text-5xl font-serif text-[#111827] mb-2">
                    {giftData.recipientName}
                  </h1>
                  <p className="text-lg text-[#6B7280]">You have a special message.</p>
                </motion.div>
              </motion.div>

              {/* Current Message */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDay}
                  className="relative bg-gradient-to-br from-white to-[#FAF8F6] rounded-3xl p-10 shadow-sm border border-[#E5E7EB] mb-8"
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -30 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="relative bg-[#FAF8F6] rounded-2xl p-8 mb-6 border border-[#E5E7EB]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="absolute top-2 left-2 text-3xl text-[#FF7AA2]/20">"</div>
                      <div className="absolute bottom-2 right-2 text-3xl text-[#FF7AA2]/20 rotate-180">"</div>
                      <p className="text-[#111827] leading-relaxed text-lg whitespace-pre-line px-6">
                        {getCurrentMessage()}
                      </p>
                    </motion.div>
                    
                    <motion.div
                      className="flex items-center justify-center gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <img src={flowerLogoOutlineSrc} alt="" className="w-6 h-6 object-contain" />
                      <p className="text-[#6B7280] text-sm">With love from {giftData.senderName}</p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Music Player */}
              {giftData.music && (
                <motion.div
                  className="flex items-center justify-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E7EB] flex items-center gap-4">
                    <Button
                      onClick={handlePlayPause}
                      variant="ghost"
                      size="sm"
                      className="w-12 h-12 p-0 hover:bg-[#FF7AA2]/10 rounded-full"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-[#FF7AA2]" />
                      ) : (
                        <Play className="w-6 h-6 text-[#FF7AA2] ml-0.5" />
                      )}
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-[#FF7AA2] rounded-full"
                          style={{ height: isPlaying ? '16px' : '8px' }}
                          animate={isPlaying ? {
                            scaleY: [1, 1.8, 1],
                          } : {}}
                          transition={isPlaying ? {
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          } : {}}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}


            </div>
          </motion.div>

          {/* Progress Section & Message History */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5E7EB]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#6B7280]">Gift Progress</span>
              <div className="flex items-center gap-4">
                <span className="text-[#111827] font-medium">
                  {currentDay} / {giftData.duration} days
                </span>
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  size="sm"
                  className="text-[#6B7280] hover:text-[#111827] border-[#E5E7EB] hover:border-[#FF7AA2]"
                >
                  <History className="w-4 h-4 mr-2" />
                  {showHistory ? 'Hide' : 'Show'} History
                </Button>
              </div>
            </div>
            
            <div className="w-full bg-[#E5E7EB] rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentDay / giftData.duration) * 100}%` }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </div>
            
            <motion.p 
              className="text-center text-lg text-[#6B7280] mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {currentDay < giftData.duration 
                ? `${giftData.duration - currentDay} more days await you`
                : 'Your beautiful journey is complete'
              }
            </motion.p>

            {/* Message History */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border-t border-[#8B7355]/10 pt-6">
                    <h4 className="text-lg font-semibold text-[#111827] mb-4">Message History</h4>
                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                      {Array.from({ length: currentDay }, (_, i) => i + 1).reverse().map((day) => (
                        <motion.button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`p-3 rounded-lg text-left transition-colors ${
                            selectedDay === day
                              ? 'bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white'
                              : 'bg-[#F8F9FA] hover:bg-[#FAF8F6] text-[#111827]'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: (currentDay - day) * 0.05 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Day {day}</span>
                            {day === currentDay && (
                              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                Latest
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-1 opacity-75 truncate">
                            {messages[day - 1]?.replace(/^"/, '')?.substring(0, 60)}...
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-8 bg-white mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2">
            <img src={flowerLogoOutlineSrc} alt="Bloomy" className="w-5 h-5 object-contain" />
            <span className="text-[#6B7280] font-medium">Bloomy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}