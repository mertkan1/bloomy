import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Heart, ChevronLeft, ChevronRight, RefreshCw, SkipForward, Check, CheckCheck, Coins, Edit2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MessageReviewPageProps {
  purchaseData: any;
  onBackToSuccess: () => void;
  onCompleteReview: () => void;
}

export default function MessageReviewPage({ purchaseData, onBackToSuccess, onCompleteReview }: MessageReviewPageProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [approvedMessages, setApprovedMessages] = useState<Set<number>>(new Set());
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isEditingManually, setIsEditingManually] = useState(false);
  const [manualEditText, setManualEditText] = useState('');
  const [tokens, setTokens] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);

  // Generate initial messages and set up tokens based on purchase data
  useState(() => {
    const totalMessages = parseInt(purchaseData?.plan || '30');
    const themes = purchaseData?.giftData?.selectedThemes || [];
    const recipientName = purchaseData?.giftData?.recipientName || 'Friend';
    const senderName = purchaseData?.giftData?.senderName || 'Your Secret Admirer';
    
    // Set token limits based on plan
    const planTokens = purchaseData?.plan === '365' ? 1000 : 100;
    setMaxTokens(planTokens);
    setTokens(planTokens);
    
    const generateMessage = (day: number) => {
      const messageTemplates = {
        romantik: [
          `My dearest ${recipientName}, with each passing day, my heart grows fonder of you. This flower blooms as my love does - endlessly and beautifully.`,
          `Beloved ${recipientName}, you are the sunshine that makes my world brighter. Every moment with you is a treasure I hold close to my heart.`,
          `My love, like this eternal flower, my feelings for you will never fade. You are my everything, today and always.`,
          `Sweet ${recipientName}, in a world full of temporary things, you are my constant. My love for you grows stronger with each passing day.`,
          `Darling, you have captured my heart completely. This flower is but a small token of the endless love I have for you.`
        ],
        motivasyon: [
          `Dear ${recipientName}, remember that every challenge you face is just another opportunity to show your incredible strength. You've got this!`,
          `Champion ${recipientName}, your potential is limitless. Today is another chance to move closer to your dreams. Keep pushing forward!`,
          `Warrior ${recipientName}, you have overcome so much already. Whatever today brings, you have the strength to handle it with grace.`,
          `Dear achiever, ${recipientName}, success isn't just about the destination - it's about who you become along the way. You're becoming amazing!`,
          `Superstar ${recipientName}, believe in yourself as much as I believe in you. You have everything it takes to make your dreams reality.`
        ],
        espirili: [
          `Hey ${recipientName}! Life's too short for boring flowers, so here's a digital one that won't need watering (you're welcome!). Hope this brings a smile to your beautiful face today!`,
          `${recipientName}, if flowers had personalities, this one would definitely be the class clown. Just like you, it knows how to brighten everyone's day!`,
          `Surprise ${recipientName}! Your daily dose of digital beauty has arrived. No allergies, no wilting, just pure awesomeness delivered straight to your screen!`,
          `Hey there ${recipientName}! This flower called and asked to be sent to the most amazing person I know. Guess who that is? (Hint: it's you!)`,
          `${recipientName}, roses are red, violets are blue, digital flowers are awesome, and so are you! (I know, I know, I should quit my day job and become a poet!)`
        ],
        default: [
          `Dear ${recipientName}, I hope this message finds you well. I wanted to send you a little something to brighten your day and let you know I'm thinking of you.`,
          `Hello beautiful ${recipientName}! Another day, another reason to smile. Remember that you bring so much joy to those around you.`,
          `Good morning ${recipientName}! As this flower continues to bloom, so does my appreciation for having you in my life. You make every day brighter.`,
          `Hey ${recipientName}, just a gentle reminder that you are stronger than you think and more loved than you know. Keep shining your beautiful light!`,
          `Dear ${recipientName}, life has a way of showing us beauty in unexpected moments. I hope today brings you one of those special moments to cherish.`
        ]
      };

      const selectedTheme = themes.length > 0 ? themes[Math.floor(Math.random() * themes.length)] : 'default';
      const templateArray = messageTemplates[selectedTheme as keyof typeof messageTemplates] || messageTemplates.default;
      const template = templateArray[day % templateArray.length];
      
      return `${template}\n\nWith love,\n${senderName}`;
    };

    const generatedMessages = Array.from({ length: totalMessages }, (_, i) => generateMessage(i));
    setMessages(generatedMessages);
  });

  const totalMessages = messages.length;

  // Security function to validate manual input
  const validateManualInput = (text: string): { isValid: boolean; error?: string } => {
    // Check for URLs and links
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.(com|org|net|edu|gov|mil|int|io|co|me|tv|app)[^\s]*)/gi;
    if (urlPattern.test(text)) {
      return { isValid: false, error: 'Links and URLs are not allowed for security reasons.' };
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/gi,
      /<script/gi,
      /onclick=/gi,
      /onload=/gi,
      /href=/gi,
      /src=/gi
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return { isValid: false, error: 'Suspicious content detected. Please use only safe text.' };
      }
    }
    
    // Character limit check
    if (text.length > 1000) {
      return { isValid: false, error: 'Message is too long. Please keep it under 1000 characters.' };
    }
    
    return { isValid: true };
  };

  const handleRegenerateMessage = async () => {
    if (tokens <= 0) {
      toast.error('No tokens remaining! Please use manual editing.');
      return;
    }
    
    setIsRegenerating(true);
    
    // Deduct token
    setTokens(tokens - 1);
    
    // Simulate AI regeneration delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMessages = [...messages];
    const themes = purchaseData?.giftData?.selectedThemes || [];
    const recipientName = purchaseData?.giftData?.recipientName || 'Friend';
    const senderName = purchaseData?.giftData?.senderName || 'Your Secret Admirer';
    
    // Generate a new message for current index
    const newMessageOptions = [
      `Dear ${recipientName}, today brings new possibilities and fresh hope. May this flower remind you that beautiful things are always blooming in your life.`,
      `Hello ${recipientName}, every sunrise is a reminder that life offers us another chance to create something beautiful. You inspire me every day.`,
      `${recipientName}, in the garden of life, you are the most precious bloom. Your kindness and grace make the world a more beautiful place.`,
      `My dear ${recipientName}, like this digital flower that never wilts, my appreciation for you only grows stronger with time.`,
      `${recipientName}, may this message be a gentle reminder that you are cherished, valued, and deeply loved. Have a wonderful day!`
    ];
    
    newMessages[currentMessage] = newMessageOptions[Math.floor(Math.random() * newMessageOptions.length)] + `\n\nWith love,\n${senderName}`;
    setMessages(newMessages);
    setIsRegenerating(false);
    
    toast.success(`Message regenerated! ${tokens - 1} tokens remaining.`);
  };

  const handleStartManualEdit = () => {
    setManualEditText(messages[currentMessage]);
    setIsEditingManually(true);
  };

  const handleSaveManualEdit = () => {
    const validation = validateManualInput(manualEditText);
    
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }
    
    const newMessages = [...messages];
    newMessages[currentMessage] = manualEditText;
    setMessages(newMessages);
    setIsEditingManually(false);
    setManualEditText('');
    
    toast.success('Message updated successfully!');
  };

  const handleCancelManualEdit = () => {
    setIsEditingManually(false);
    setManualEditText('');
  };

  const handleSkipMessage = () => {
    setApprovedMessages(prev => new Set([...prev, currentMessage]));
    if (currentMessage < totalMessages - 1) {
      setCurrentMessage(currentMessage + 1);
    }
  };

  const handleApproveAndNext = () => {
    setApprovedMessages(prev => new Set([...prev, currentMessage]));
    if (currentMessage < totalMessages - 1) {
      setCurrentMessage(currentMessage + 1);
    }
  };

  const handleApproveAll = () => {
    const allMessageIndexes = Array.from({ length: totalMessages }, (_, i) => i);
    setApprovedMessages(new Set(allMessageIndexes));
    onCompleteReview();
  };

  const goToPrevious = () => {
    if (currentMessage > 0) {
      setCurrentMessage(currentMessage - 1);
    }
  };

  const goToNext = () => {
    if (currentMessage < totalMessages - 1) {
      setCurrentMessage(currentMessage + 1);
    }
  };

  const isCurrentApproved = approvedMessages.has(currentMessage);
  const allApproved = approvedMessages.size === totalMessages;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="px-6 lg:px-8 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">FloroDay</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Home</a>
            <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Send a Floro</a>
            <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">My Floros</a>
            <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Profile</a>
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full"></div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-[#111827] mb-4">
              Review Your Messages
            </h1>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Approve or edit the AI-generated messages for your {totalMessages}-day Floro.
            </p>
          </motion.div>

          {/* Message Navigation */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Header with Navigation and Token Counter */}
            <div className="p-8 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-[#111827]">
                    Message {currentMessage + 1} of {totalMessages}
                  </h2>
                  {isCurrentApproved && (
                    <div className="flex items-center gap-2 bg-[#10B981] text-white px-3 py-1 rounded-full text-sm">
                      <Check className="w-4 h-4" />
                      Approved
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={goToPrevious}
                    disabled={currentMessage === 0}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={goToNext}
                    disabled={currentMessage === totalMessages - 1}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Token Counter */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-xl">
                <Coins className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-[#92400E] font-medium">
                  AI Regeneration Tokens: {tokens} / {maxTokens}
                </span>
                {tokens === 0 && (
                  <div className="flex items-center gap-2 ml-auto">
                    <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                    <span className="text-[#DC2626] text-sm font-medium">Manual editing only</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMessage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Message Display or Edit Mode */}
                  {isEditingManually ? (
                    <Card className="p-8 bg-gradient-to-br from-[#F8F9FA] to-[#E5E7EB] border-0 mb-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Edit2 className="w-5 h-5 text-[#3B82F6]" />
                          <span className="font-medium text-[#111827]">Manual Edit Mode</span>
                        </div>
                        
                        <Textarea
                          value={manualEditText}
                          onChange={(e) => setManualEditText(e.target.value)}
                          className="min-h-[200px] text-lg leading-relaxed"
                          placeholder="Enter your custom message..."
                        />
                        
                        <div className="text-sm text-[#6B7280]">
                          <strong>Security Notice:</strong> Links, URLs, and scripts are not allowed for security reasons.
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={handleSaveManualEdit}
                            className="bg-[#10B981] text-white hover:bg-[#059669]"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            onClick={handleCancelManualEdit}
                            variant="outline"
                            className="border-[#6B7280] text-[#6B7280] hover:bg-[#6B7280] hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-8 bg-gradient-to-br from-[#F8F9FA] to-[#E5E7EB] border-0 mb-8">
                      <div className="whitespace-pre-line text-[#374151] leading-relaxed text-lg">
                        {messages[currentMessage] || 'Loading message...'}
                      </div>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  {!isEditingManually && (
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button
                        onClick={handleRegenerateMessage}
                        disabled={isRegenerating || tokens <= 0}
                        variant="outline"
                        className={`transition-colors ${
                          tokens <= 0 
                            ? 'border-[#9CA3AF] text-[#9CA3AF] cursor-not-allowed' 
                            : 'border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                        }`}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                        {isRegenerating ? 'Regenerating...' : `Regenerate with AI (${tokens} tokens)`}
                      </Button>
                      
                      <Button
                        onClick={handleStartManualEdit}
                        variant="outline"
                        className="border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Manually
                      </Button>
                      
                      <Button
                        onClick={handleSkipMessage}
                        variant="outline"
                        className="border-[#6B7280] text-[#6B7280] hover:bg-[#6B7280] hover:text-white transition-colors"
                      >
                        <SkipForward className="w-4 h-4 mr-2" />
                        Skip
                      </Button>
                      
                      <Button
                        onClick={handleApproveAndNext}
                        className="bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve & Next
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#6B7280]">Progress</span>
              <span className="text-[#111827] font-medium">
                {approvedMessages.size} / {totalMessages} approved
              </span>
            </div>
            
            <div className="w-full bg-[#E5E7EB] rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(approvedMessages.size / totalMessages) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Bulk Actions */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-[#6B7280] mb-6">
              You can also approve all remaining messages at once.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={onBackToSuccess}
                variant="outline"
                className="border-[#6B7280] text-[#6B7280] hover:bg-[#6B7280] hover:text-white transition-colors"
              >
                Back to Gift
              </Button>
              
              <Button
                onClick={handleApproveAll}
                className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Approve All
              </Button>
            </div>

            {allApproved && (
              <motion.div
                className="mt-8 p-6 bg-[#10B981] text-white rounded-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <CheckCheck className="w-6 h-6" />
                  <span className="text-lg font-medium">
                    All messages have been approved! Your gift is ready to be sent.
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-8 bg-white border-t border-[#E5E7EB] mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-md flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#6B7280] font-medium">FloroDay</span>
          </div>
          <p className="text-sm text-[#9CA3AF]">
            Review and perfect your messages before they're sent
          </p>
        </div>
      </footer>
    </div>
  );
}