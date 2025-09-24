import { Button } from './ui/button';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';

interface GiftCompleteProps {
  onBack: () => void;
}

export default function GiftComplete({ onBack }: GiftCompleteProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F6] via-[#F8F9FA] to-[#E5F3FF]">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#FF7AA2]" />
          <span className="text-2xl font-semibold text-[#111827]">FloroDay</span>
        </div>
        
        <Button 
          onClick={onBack}
          variant="ghost"
          className="text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </header>

      {/* Main Content */}
      <div className="px-8 py-16 flex flex-col items-center justify-center text-center space-y-8">
        {/* Logo/Icon */}
        <div className="w-32 h-32 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center shadow-2xl">
          <Heart className="w-16 h-16 text-white" />
        </div>

        {/* Success Message */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827]">
            Gift Successfully Created!
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            Your personalized digital flower gift has been prepared and is ready to be shared. 
            The recipient will receive a beautiful experience with daily AI-generated messages.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-4 py-8">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
            <Sparkles className="w-5 h-5 text-[#FF7AA2]" />
            <span className="text-sm text-[#6B7280]">AI-Powered Messages</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
            <Heart className="w-5 h-5 text-[#FF9E66]" />
            <span className="text-sm text-[#6B7280]">Limited Edition</span>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-lg">
          <h3 className="text-xl font-semibold text-[#111827] mb-4">
            Gift Preview Coming Soon
          </h3>
          <p className="text-[#6B7280] mb-6">
            We're working on the gift preview and sharing interface. 
            Your gift data has been saved and the full experience will be available shortly.
          </p>
          
          <Button 
            onClick={onBack}
            className="w-full bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl py-3 hover:shadow-lg transition-all duration-300"
          >
            Create Another Gift
          </Button>
        </div>
      </div>
    </div>
  );
}