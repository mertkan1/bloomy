import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, ArrowLeft, RotateCcw } from 'lucide-react';

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

interface SelectFlowerProps {
  onBack: () => void;
  onSelectFlower: (flower: Flower) => void;
}

const flowers = {
  romantic: [
    {
      id: 'elegant-bouquet',
      name: 'Elegant Bouquet',
      description: 'A sophisticated arrangement that captures eternal love',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1698849071904-090feee32e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZmxvd2VyJTIwYXJyYW5nZW1lbnQlMjBib3VxdWV0fGVufDF8fHx8MTc1ODM5NjUwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      isLimited: true,
      stock: 8,
      totalStock: 50
    },
    {
      id: 'crimson-rose',
      name: 'Crimson Rose',
      description: 'Symbolizes love',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1660585468452-514ed1977f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjcmltc29uJTIwcm9zZSUyMGZsb3dlcnxlbnwxfHx8fDE3NTc4NzgyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'pink-passion',
      name: 'Pink Passion',
      description: 'Gentle romance and affection',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1616256637735-ce3d74829b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VyJTIwbW90aXZhdGlvbnxlbnwxfHx8fDE3NTc4NzgyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ],
  motivation: [
    {
      id: 'sunrise-energy',
      name: 'Sunrise Energy',
      description: 'Ignites inspiration and drive',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1616256637735-ce3d74829b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VyJTIwbW90aXZhdGlvbnxlbnwxfHx8fDE3NTc4NzgyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'golden-strength',
      name: 'Golden Strength',
      description: 'Empowers with confidence',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1662339846435-4143254cd54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBmcmllbmRzaGlwJTIweWVsbG93fGVufDF8fHx8MTc1Nzg3ODIyOXww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ],
  friendship: [
    {
      id: 'sunny-friendship',
      name: 'Sunny Friendship',
      description: 'Celebrates true companionship',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1662339846435-4143254cd54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBmcmllbmRzaGlwJTIweWVsbG93fGVufDF8fHx8MTc1Nzg3ODIyOXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'cheerful-daisy',
      name: 'Cheerful Daisy',
      description: 'Brings joy and laughter',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1616256637735-ce3d74829b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VyJTIwbW90aXZhdGlvbnxlbnwxfHx8fDE3NTc4NzgyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ],
  celebration: [
    {
      id: 'festive-bouquet',
      name: 'Festive Bouquet',
      description: 'Perfect for special occasions',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1559720738-78a58d915d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhlcmVhbCUyMHdoaXRlJTIwZmxvd2VyJTIwYmxvb218ZW58MXx8fHwxNTc4NzgyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'party-bloom',
      name: 'Party Bloom',
      description: 'Celebrates life\'s moments',
      price: 27.99,
      image: 'https://images.unsplash.com/photo-1660585468452-514ed1977f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjcmltc29uJTIwcm9zZSUyMGZsb3dlcnxlbnwxfHx8fDE3NTc4NzgyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ]
};

export default function SelectFlower({ onBack, onSelectFlower }: SelectFlowerProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof flowers>('romantic');
  const [currentStandardIndex, setCurrentStandardIndex] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState({ limited: false, standard: false });

  const categories = [
    { id: 'romantic', label: 'Romantic' },
    { id: 'motivation', label: 'Motivation' },
    { id: 'friendship', label: 'Friendship' },
    { id: 'celebration', label: 'Celebration' }
  ];

  const currentFlowers = flowers[activeCategory];
  const limitedFlower = currentFlowers.find(f => f.isLimited) || currentFlowers[0];
  const standardFlowers = currentFlowers.filter(f => !f.isLimited);
  const currentStandardFlower = standardFlowers[currentStandardIndex % standardFlowers.length];

  // Auto-rotate standard flowers every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStandardIndex(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [standardFlowers.length]);

  const handleRefresh = () => {
    setCurrentStandardIndex(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#FF7AA2]" />
          <span className="text-2xl font-semibold text-[#111827]">Bloomy</span>
        </div>
        
        <nav className="flex items-center gap-8">
          <button 
            onClick={onBack}
            className="text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            Home
          </button>
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
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#111827] mb-4">Select a Flower</h1>
            <p className="text-lg text-[#6B7280]">
              Select an exclusive digital flower and let our AI craft the perfect message.
            </p>
          </div>

          {/* Category Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 bg-white p-2 rounded-3xl shadow-sm">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id as keyof typeof flowers);
                    setCurrentStandardIndex(0);
                  }}
                  className={`px-6 py-3 rounded-2xl transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white shadow-md'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flower Selection Grid */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Limited Edition - Left Side (3 columns) */}
            <div className="lg:col-span-3">
              <div className="relative">
                <Badge className="absolute top-4 left-4 bg-[#FCD34D] text-[#92400E] z-10 px-3 py-1 rounded-full">
                  LIMITED EDITION
                </Badge>
                
                <div 
                  className="relative bg-gradient-to-br from-gray-100 to-gray-300 rounded-3xl overflow-hidden cursor-pointer group aspect-[4/3] shadow-xl"
                  onClick={() => onSelectFlower(limitedFlower)}
                  onMouseEnter={() => setIsVideoPlaying(prev => ({ ...prev, limited: true }))}
                  onMouseLeave={() => setIsVideoPlaying(prev => ({ ...prev, limited: false }))}
                >
                  <ImageWithFallback
                    src={limitedFlower.image}
                    alt={limitedFlower.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Video play indicator */}
                  {isVideoPlaying.limited && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[12px] border-l-[#111827] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{limitedFlower.name}</h3>
                    {limitedFlower.stock && limitedFlower.totalStock && (
                      <p className="text-sm mb-2 opacity-90">
                        {limitedFlower.stock} / {limitedFlower.totalStock} LEFT
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm opacity-90">{limitedFlower.description}</p>
                      <span className="text-2xl font-bold">${limitedFlower.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Flowers - Right Side (2 columns) */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div 
                  className="relative bg-gradient-to-br from-gray-100 to-gray-300 rounded-3xl overflow-hidden cursor-pointer group aspect-[4/3] shadow-lg"
                  onClick={() => onSelectFlower(currentStandardFlower)}
                  onMouseEnter={() => setIsVideoPlaying(prev => ({ ...prev, standard: true }))}
                  onMouseLeave={() => setIsVideoPlaying(prev => ({ ...prev, standard: false }))}
                >
                  <ImageWithFallback
                    src={currentStandardFlower.image}
                    alt={currentStandardFlower.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Video play indicator */}
                  {isVideoPlaying.standard && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[10px] border-l-[#111827] border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{currentStandardFlower.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm opacity-90">{currentStandardFlower.description}</p>
                      <span className="text-lg font-bold">${currentStandardFlower.price}</span>
                    </div>
                  </div>

                  {/* Progress bar for auto-rotation */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full animate-pulse"
                        style={{ 
                          animation: 'progress 10s linear infinite',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleRefresh}
                    className="w-16 h-16 bg-[#111827] text-white rounded-full flex items-center justify-center hover:bg-[#374151] transition-colors duration-300 shadow-lg"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}