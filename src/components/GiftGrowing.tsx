import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import exampleImage from 'figma:asset/3b9a464b502f633d9892beda9bae7d77744045aa.png';

interface GiftGrowingProps {
  onComplete: () => void;
}

export default function GiftGrowing({ onComplete }: GiftGrowingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Auto-complete after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + (100 / 30); // 30 steps over 3 seconds
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8DDD4' }}>
      <div className="text-center">
        {/* Flower Animation */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 0.8,
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Simple Flower SVG - Similar to the image */}
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120" 
            className="mx-auto text-[#8B7355] drop-shadow-sm"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            {/* Stem */}
            <motion.path
              d="M60 100 L60 45"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              strokeLinecap="round"
            />
            
            {/* Flower head */}
            <motion.path
              d="M45 35 C45 25, 55 20, 60 30 C65 20, 75 25, 75 35 C75 25, 80 35, 70 40 C80 45, 75 55, 65 50 C70 60, 60 55, 60 45 C60 55, 50 60, 55 50 C45 55, 40 45, 50 40 C40 35, 45 25, 45 35 Z"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Small leaf */}
            <motion.path
              d="M45 65 C40 70, 45 75, 50 70"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Text Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-2"
        >
          <motion.h1 
            className="text-3xl font-semibold text-[#6B5B47] tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            YOUR FLOWERS
          </motion.h1>
          
          <motion.p 
            className="text-4xl text-[#8B7355] font-serif italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            Bloomy
          </motion.p>
        </motion.div>

        {/* Subtle progress indicator */}
        <motion.div
          className="mt-16 w-32 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <div className="h-0.5 bg-[#8B7355]/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#8B7355] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#8B7355]/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}