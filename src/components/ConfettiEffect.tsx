import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
  intensity?: number;
  colors?: string[];
}

export default function ConfettiEffect({ 
  trigger, 
  duration = 3000, 
  intensity = 100,
  colors = ['#FF7AA2', '#FF9E66', '#FCD34D', '#F59E0B', '#60A5FA', '#A78BFA']
}: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      createConfetti();
      
      // Play celebration sound
      playSound();
      
      const timer = setTimeout(() => {
        setIsActive(false);
        setConfetti([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, isActive, duration]);

  const createConfetti = () => {
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < intensity; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 3 + 2
        }
      });
    }
    
    setConfetti(pieces);
  };

  const playSound = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create celebration sound sequence
      const playCelebrationTone = (frequency: number, duration: number, delay: number) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Play celebration sequence
      playCelebrationTone(523.25, 0.2, 0);    // C5
      playCelebrationTone(659.25, 0.2, 100);  // E5
      playCelebrationTone(783.99, 0.2, 200);  // G5
      playCelebrationTone(1046.50, 0.4, 300); // C6
      
    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              left: piece.x,
              top: piece.y,
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: piece.rotation,
              opacity: 1,
            }}
            animate={{
              x: piece.velocity.x * 100,
              y: window.innerHeight + 100,
              rotate: piece.rotation + 720,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: duration / 1000,
              ease: "easeOut",
              opacity: {
                times: [0, 0.7, 1],
                duration: duration / 1000,
              }
            }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
      
      {/* Sparkle effects */}
      <AnimatePresence>
        {isActive && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-2 h-2"
                style={{
                  left: Math.random() * window.innerWidth,
                  top: Math.random() * window.innerHeight * 0.6,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  delay: Math.random() * 0.5,
                  repeat: 2,
                }}
              >
                <div className="w-full h-full bg-gradient-to-r from-[#FFD93D] to-[#F59E0B] rounded-full" />
              </motion.div>
            ))}
            
            {/* Center burst effect */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{ duration: 1 }}
            >
              <div className="w-32 h-32 bg-gradient-radial from-white via-[#FF9E66] to-transparent rounded-full" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}