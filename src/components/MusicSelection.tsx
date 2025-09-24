import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, ArrowLeft, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface MusicSelectionProps {
  giftData: any;
  onSelectMusic: (musicData: any) => void;
  onSkipMusic: () => void;
  onBack: () => void;
}

interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  duration: string;
  preview: string; // Mock preview URL
  mood: string;
}

const musicCategories = {
  romantic: [
    {
      id: 'romantic-1',
      name: 'Eternal Love',
      artist: 'Florence Symphony',
      duration: '3:45',
      preview: '/audio/romantic-1.mp3',
      mood: 'Deeply romantic and passionate'
    },
    {
      id: 'romantic-2', 
      name: 'Gentle Hearts',
      artist: 'Sofia Chamber',
      duration: '4:12',
      preview: '/audio/romantic-2.mp3',
      mood: 'Soft and tender love'
    },
    {
      id: 'romantic-3',
      name: 'Dancing Moonlight',
      artist: 'Luna Orchestra',
      duration: '3:28',
      preview: '/audio/romantic-3.mp3',
      mood: 'Dreamy and enchanting'
    },
    {
      id: 'romantic-4',
      name: 'Forever Yours',
      artist: 'Vienna Strings',
      duration: '4:05',
      preview: '/audio/romantic-4.mp3',
      mood: 'Timeless devotion'
    }
  ],
  peaceful: [
    {
      id: 'peaceful-1',
      name: 'Morning Dew',
      artist: 'Nature\'s Voice',
      duration: '5:15',
      preview: '/audio/peaceful-1.mp3',
      mood: 'Calm and refreshing'
    },
    {
      id: 'peaceful-2',
      name: 'Zen Garden',
      artist: 'Meditation Collective',
      duration: '6:30',
      preview: '/audio/peaceful-2.mp3',
      mood: 'Deeply relaxing'
    },
    {
      id: 'peaceful-3',
      name: 'Ocean Breeze',
      artist: 'Coastal Harmony',
      duration: '4:45',
      preview: '/audio/peaceful-3.mp3',
      mood: 'Serene and flowing'
    },
    {
      id: 'peaceful-4',
      name: 'Silent Stars',
      artist: 'Night Symphony',
      duration: '7:12',
      preview: '/audio/peaceful-4.mp3',
      mood: 'Tranquil evening'
    }
  ],
  uplifting: [
    {
      id: 'uplifting-1',
      name: 'New Dawn',
      artist: 'Sunrise Ensemble',
      duration: '3:30',
      preview: '/audio/uplifting-1.mp3',
      mood: 'Fresh beginnings'
    },
    {
      id: 'uplifting-2',
      name: 'Soaring Heights',
      artist: 'Sky Orchestra',
      duration: '4:18',
      preview: '/audio/uplifting-2.mp3',
      mood: 'Inspiring and hopeful'
    },
    {
      id: 'uplifting-3',
      name: 'Bright Tomorrow',
      artist: 'Future Harmony',
      duration: '3:55',
      preview: '/audio/uplifting-3.mp3',
      mood: 'Optimistic energy'
    },
    {
      id: 'uplifting-4',
      name: 'Victory Song',
      artist: 'Triumph Collective',
      duration: '4:42',
      preview: '/audio/uplifting-4.mp3',
      mood: 'Celebratory spirit'
    }
  ],
  classical: [
    {
      id: 'classical-1',
      name: 'Spring Waltz',
      artist: 'Baroque Masters',
      duration: '5:45',
      preview: '/audio/classical-1.mp3',
      mood: 'Elegant and refined'
    },
    {
      id: 'classical-2',
      name: 'Midnight Sonata',
      artist: 'Chamber Virtuosi',
      duration: '6:15',
      preview: '/audio/classical-2.mp3',
      mood: 'Sophisticated beauty'
    },
    {
      id: 'classical-3',
      name: 'Garden Symphony',
      artist: 'Royal Philharmonic',
      duration: '7:30',
      preview: '/audio/classical-3.mp3',
      mood: 'Majestic and timeless'
    },
    {
      id: 'classical-4',
      name: 'Ethereal Prelude',
      artist: 'Concert Orchestra',
      duration: '4:55',
      preview: '/audio/classical-4.mp3',
      mood: 'Graceful and pure'
    }
  ]
};

export default function MusicSelection({ giftData, onSelectMusic, onSkipMusic, onBack }: MusicSelectionProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof musicCategories>('romantic');
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = [
    { id: 'romantic', label: 'Romantic', icon: '💕', description: 'Love and passion' },
    { id: 'peaceful', label: 'Peaceful', icon: '🌿', description: 'Calm and serene' },
    { id: 'uplifting', label: 'Uplifting', icon: '☀️', description: 'Joy and energy' },
    { id: 'classical', label: 'Classical', icon: '🎼', description: 'Timeless elegance' }
  ];

  const currentTracks = musicCategories[activeCategory];

  useEffect(() => {
    // Cleanup audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPreview = (track: MusicTrack) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playingTrack === track.id && isPlaying) {
      // Stop playing
      setIsPlaying(false);
      setPlayingTrack(null);
    } else {
      // Start playing (simulate with timer for demo)
      setPlayingTrack(track.id);
      setIsPlaying(true);
      
      // Simulate 30-second preview
      setTimeout(() => {
        setIsPlaying(false);
        setPlayingTrack(null);
      }, 30000);
    }
  };

  const handleSelectTrack = (track: MusicTrack) => {
    setSelectedTrack(track);
  };

  const handleConfirmSelection = () => {
    if (selectedTrack) {
      onSelectMusic({
        track: selectedTrack,
        category: activeCategory
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#FF7AA2]" />
          <span className="text-2xl font-semibold text-[#111827]">Bloomy</span>
        </div>
        
        <nav className="flex items-center gap-8">
          <button 
            onClick={onBack}
            className="text-[#6B7280] hover:text-[#111827] transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-[#FF7AA2]" />
              <h1 className="text-5xl font-bold text-[#111827]">Add a Final Touch</h1>
              <Sparkles className="w-8 h-8 text-[#FF9E66]" />
            </div>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Enhance your beautiful flower gift with the perfect musical accompaniment. 
              Choose from our curated collection of melodies to create an unforgettable experience.
            </p>
          </motion.div>

          {/* Category Selection */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-3 bg-white p-3 rounded-3xl shadow-lg">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id as keyof typeof musicCategories);
                    setSelectedTrack(null);
                    setPlayingTrack(null);
                    setIsPlaying(false);
                  }}
                  className={`px-6 py-4 rounded-2xl transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white shadow-md'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="font-medium">{category.label}</div>
                    <div className="text-xs opacity-80">{category.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Music Tracks Grid */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {currentTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    selectedTrack?.id === track.id 
                      ? 'border-[#FF7AA2] bg-gradient-to-r from-[#FF7AA2]/5 to-[#FF9E66]/5' 
                      : 'border-transparent hover:border-[#FF7AA2]/20'
                  }`}
                  onClick={() => handleSelectTrack(track)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#111827] mb-1">{track.name}</h3>
                      <p className="text-[#6B7280] mb-2">{track.artist}</p>
                      <p className="text-sm text-[#9CA3AF] italic mb-3">{track.mood}</p>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <span>{track.duration}</span>
                        {selectedTrack?.id === track.id && (
                          <span className="text-[#FF7AA2] font-medium">✓ Selected</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPreview(track);
                        }}
                        variant="outline"
                        size="sm"
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          playingTrack === track.id && isPlaying
                            ? 'border-[#FF7AA2] bg-[#FF7AA2] text-white'
                            : 'border-[#E5E7EB] hover:border-[#FF7AA2] hover:text-[#FF7AA2]'
                        }`}
                      >
                        {playingTrack === track.id && isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </Button>
                      
                      {playingTrack === track.id && isPlaying && (
                        <div className="flex items-center gap-2 text-[#FF7AA2]">
                          <Volume2 className="w-4 h-4" />
                          <div className="w-16 h-1 bg-[#FF7AA2]/20 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#FF7AA2] rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 30, ease: 'linear' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={onSkipMusic}
              variant="outline"
              className="px-8 py-3 text-[#6B7280] border-[#E5E7EB] hover:border-[#6B7280] hover:text-[#111827] rounded-xl"
            >
              Continue Without Music
            </Button>
            
            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedTrack}
              className={`px-8 py-3 rounded-xl transition-all duration-300 ${
                selectedTrack
                  ? 'bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white hover:shadow-lg'
                  : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
              }`}
            >
              {selectedTrack ? `Add "${selectedTrack.name}" to Gift` : 'Select a Track First'}
            </Button>
          </motion.div>

          {/* Preview Info */}
          {playingTrack && isPlaying && (
            <motion.div 
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-6 py-4 rounded-2xl shadow-xl border border-[#E5E7EB]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center gap-3 text-sm">
                <Volume2 className="w-4 h-4 text-[#FF7AA2]" />
                <span className="text-[#6B7280]">Playing 30-second preview</span>
                <Button
                  onClick={() => {
                    setIsPlaying(false);
                    setPlayingTrack(null);
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-[#6B7280] hover:text-[#111827] p-1"
                >
                  <VolumeX className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}