import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';

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

interface CraftGiftProps {
  flower: Flower;
  onBack: () => void;
  onSendGift: (giftData: any) => void;
}

const messageThemes = [
  { id: 'espirili', label: 'Espirili', description: 'Witty and playful messages', instruction: 'Espirili bir dil kullan.' },
  { id: 'z-kusagi', label: 'Z Kuşağı', description: 'Modern and trendy expressions', instruction: 'Z kuşağına uygun modern bir dil kullan.' },
  { id: 'geleneksel', label: 'Geleneksel', description: 'Classic and timeless words', instruction: 'Geleneksel ve zamansız bir dil kullan.' },
  { id: 'romantik', label: 'Romantik', description: 'Romantic and passionate', instruction: 'Romantik ve tutkulu bir dil kullan.' },
  { id: 'edebi', label: 'Edebi', description: 'Literary and poetic', instruction: 'Edebi ve şiirsel bir dil kullan.' },
  { id: 'samimi', label: 'Samimi', description: 'Warm and intimate', instruction: 'Samimi ve sıcak bir dil kullan.' },
  { id: 'rahat', label: 'Rahat', description: 'Casual and relaxed', instruction: 'Rahat ve günlük bir dil kullan.' },
  { id: 'mesafeli', label: 'Mesafeli', description: 'Professional and respectful', instruction: 'Mesafeli ve saygılı bir dil kullan.' },
  { id: 'cesaret-verici', label: 'Cesaret verici', description: 'Encouraging and motivational', instruction: 'Cesaret verici bir dil kullan.' },
  { id: 'motivasyon', label: 'Motivasyon', description: 'Inspiring and uplifting', instruction: 'Motive edici ve ilham verici bir dil kullan.' }
];

export default function CraftGift({ flower, onBack, onSendGift }: CraftGiftProps) {
  const [formData, setFormData] = useState({
    recipientName: '',
    senderName: '',
    message: 'My message, '
  });
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeToggle = (themeId: string) => {
    const theme = messageThemes.find(t => t.id === themeId);
    if (!theme) return;

    setSelectedThemes(prev => {
      let newThemes;
      if (prev.includes(themeId)) {
        newThemes = prev.filter(id => id !== themeId);
        // Remove the instruction from message
        const currentMessage = formData.message;
        const instructionToRemove = ` ${theme.instruction}`;
        const updatedMessage = currentMessage.replace(instructionToRemove, '');
        setFormData(prevData => ({ ...prevData, message: updatedMessage }));
      } else if (prev.length < 3) {
        newThemes = [...prev, themeId];
        // Add the instruction to message
        const currentMessage = formData.message;
        const updatedMessage = `${currentMessage} ${theme.instruction}`;
        setFormData(prevData => ({ ...prevData, message: updatedMessage }));
      } else {
        return prev;
      }
      return newThemes;
    });
  };

  const handleSendGift = () => {
    const giftData = {
      ...formData,
      selectedThemes,
      flower,
      timestamp: new Date().toISOString()
    };
    onSendGift(giftData);
  };

  const isFormValid = formData.recipientName && formData.senderName && formData.message.trim().length > 'My message, '.length;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#FF7AA2]" />
          <span className="text-2xl font-semibold text-[#111827]">Bloomy</span>
        </div>
        
        <nav className="flex items-center gap-8">
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Send a Gift</a>
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Occasions</a>
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">About</a>
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Log in</a>
          <Button 
            onClick={onBack}
            className="bg-[#111827] text-white rounded-2xl px-6 py-2 hover:bg-[#374151] transition-all duration-300"
          >
            Send a Gift
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-[#111827]">Craft Your Gift</h1>
                <p className="text-lg text-[#6B7280]">
                  Personalize your digital floral arrangement with a special message theme.
                </p>
              </div>

              <div className="space-y-6">
                {/* Recipient's Name */}
                <div className="space-y-2">
                  <Label htmlFor="recipient-name" className="text-[#111827]">
                    Recipient's Name
                  </Label>
                  <Input
                    id="recipient-name"
                    placeholder="e.g. Jane Doe"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    className="bg-white border-[#E5E7EB] rounded-xl px-4 py-3 focus:border-[#FF7AA2] focus:ring-[#FF7AA2] transition-colors"
                  />
                </div>



                {/* Your Name */}
                <div className="space-y-2">
                  <Label htmlFor="sender-name" className="text-[#111827]">
                    Your Name
                  </Label>
                  <Input
                    id="sender-name"
                    placeholder="e.g. John Smith"
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="bg-white border-[#E5E7EB] rounded-xl px-4 py-3 focus:border-[#FF7AA2] focus:ring-[#FF7AA2] transition-colors"
                  />
                </div>

                {/* Message Text Area */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="message" className="text-[#111827]">Your Message</Label>
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Enhanced by AI themes</span>
                    </div>
                  </div>
                  
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="bg-white border-[#E5E7EB] rounded-xl px-4 py-3 focus:border-[#FF7AA2] focus:ring-[#FF7AA2] transition-colors min-h-[120px] resize-none"
                    placeholder="My message, write your personal message here..."
                  />
                </div>

                {/* AI Message Enhancement Tags */}
                <div className="space-y-3">
                  <p className="text-sm text-[#6B7280]">Select up to 3 themes to enhance your message with AI:</p>
                  <div className="flex flex-wrap gap-2">
                    {messageThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeToggle(theme.id)}
                        disabled={!selectedThemes.includes(theme.id) && selectedThemes.length >= 3}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedThemes.includes(theme.id)
                            ? 'bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white shadow-md'
                            : selectedThemes.length >= 3
                            ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                            : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#FF7AA2] hover:text-[#FF7AA2]'
                        }`}
                      >
                        + {theme.label}
                      </button>
                    ))}
                  </div>
                  {selectedThemes.length > 0 && (
                    <p className="text-xs text-[#6B7280] italic">
                      Selected themes will be automatically added to your message to guide AI personalization.
                    </p>
                  )}
                </div>

                {/* Prepare Gift Button */}
                <Button
                  onClick={handleSendGift}
                  disabled={!isFormValid}
                  className={`w-full py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                    isFormValid 
                      ? 'bg-[#111827] text-white hover:bg-[#374151] hover:shadow-lg transform hover:scale-[1.02]'
                      : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                >
                  Prepare Gift
                </Button>
              </div>
            </div>

            {/* Right Side - Flower Preview */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                {/* Flower Video/Image */}
                <div 
                  className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-6"
                  style={{ aspectRatio: '1350/1080' }}
                >
                  <ImageWithFallback
                    src={flower.image}
                    alt={flower.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center group cursor-pointer hover:bg-black/20 transition-colors">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-l-[12px] border-l-[#111827] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>

                  {/* Limited Edition Badge */}
                  {flower.isLimited && (
                    <div className="absolute top-4 right-4 bg-[#FCD34D] text-[#92400E] px-3 py-1 rounded-full text-sm font-medium">
                      LIMITED EDITION
                    </div>
                  )}
                </div>

                {/* Flower Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#111827] mb-2">{flower.name}</h3>
                    <p className="text-[#6B7280] leading-relaxed">{flower.description}</p>
                  </div>

                  {flower.isLimited && flower.stock && flower.totalStock && (
                    <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#92400E]">Limited Availability</span>
                        <span className="text-sm font-bold text-[#92400E]">
                          {flower.stock} / {flower.totalStock} LEFT
                        </span>
                      </div>
                      <div className="w-full bg-[#FCD34D]/30 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(flower.stock / flower.totalStock) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                    <span className="text-2xl font-bold text-[#111827]">${flower.price}</span>
                    <button 
                      onClick={onBack}
                      className="text-[#FF7AA2] hover:text-[#FF9E66] transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Change Flower
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}