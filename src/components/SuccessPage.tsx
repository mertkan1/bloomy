import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Heart, Download, Copy, Share, CheckCircle, QrCode, Edit3 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SuccessPageProps {
  purchaseData: any;
  giftId: string;
  onEditMessages: () => void;
  onViewGift: (giftId?: string) => void;
}

export default function SuccessPage({ purchaseData, giftId, onEditMessages, onViewGift }: SuccessPageProps) {
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

  // Generate the real gift link using the actual gift ID
  const giftLink = `https://bloomy.com/gift/${giftId}`;

  const generateQRCode = (text: string): string => {
    // Simple QR code generator using canvas
    const canvas = document.createElement('canvas');
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Create QR-like pattern based on text
    const modules = 25;
    const moduleSize = size / modules;
    ctx.fillStyle = '#000000';
    
    // Generate pattern based on text hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Create deterministic pattern
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        const seed = hash + row * modules + col;
        if (seed % 3 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Add corner squares (typical QR code feature)
    const cornerSize = moduleSize * 7;
    
    // Top-left corner
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(moduleSize, moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(2 * moduleSize, 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);
    
    // Top-right corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(size - cornerSize + moduleSize, moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - cornerSize + 2 * moduleSize, 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);
    
    // Bottom-left corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(moduleSize, size - cornerSize + moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(2 * moduleSize, size - cornerSize + 2 * moduleSize, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);
    
    return canvas.toDataURL('image/png');
  };

  const handleDownloadQR = () => {
    setQrCodeGenerated(true);
    
    setTimeout(() => {
      const qrDataUrl = generateQRCode(giftLink);
      
      // Convert data URL to blob and download
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `Bloomy-Gift-${giftId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('QR Code downloaded successfully!');
    }, 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(giftLink);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'A Special Digital Flower Gift',
        text: 'I\'ve sent you a beautiful digital flower with personalized messages!',
        url: giftLink,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#FF7AA2]" />
          <span className="text-2xl font-semibold text-[#111827]">Bloomy</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Home</a>
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Send a Gift</a>
          <a href="#" className="text-[#FF7AA2] hover:text-[#FF9E66] transition-colors font-medium">My Flowers</a>
          <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">About</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-6 py-2 hover:shadow-lg transition-all duration-300"
          >
            Send Flowers
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Animation */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold text-[#111827] mb-4">
              Your gift has been sent!
            </h1>
            <p className="text-lg text-[#6B7280]">
              Your beautiful digital flower is on its way to {purchaseData?.recipientEmail || 'Emily Carter'}.
            </p>
          </motion.div>

          {/* Share Section */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                  Share Your Creation
                </h2>
                <p className="text-[#6B7280]">
                  Let others enjoy your beautiful digital flower.
                </p>
              </div>
              

            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code Section */}
              <Card className="p-6 bg-gradient-to-br from-[#FAF8F6] to-[#F0F0F0] border-0">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {qrCodeGenerated ? (
                      <div className="grid grid-cols-8 gap-1">
                        {[...Array(64)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 ${
                              Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <QrCode className="w-16 h-16 text-[#6B7280]" />
                    )}
                  </div>
                  
                  <Button
                    onClick={handleDownloadQR}
                    className="w-full bg-white text-[#FF7AA2] hover:bg-[#F9FAFB] border border-[#FF7AA2] rounded-xl mb-2"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  
                  <Button
                    onClick={() => onViewGift(giftId)}
                    variant="outline"
                    className="w-full text-sm border-[#FF7AA2] text-[#FF7AA2] hover:bg-[#FF7AA2] hover:text-white rounded-xl"
                  >
                    View Gift Page
                  </Button>
                </div>
              </Card>

              {/* Share Options */}
              <div className="space-y-4">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full py-4 border-[#D1D5DB] hover:border-[#FF7AA2] hover:bg-[#FDF2F8] transition-colors rounded-xl"
                >
                  <Copy className="w-5 h-5 mr-3" />
                  Copy Link
                </Button>
                
                <Button
                  onClick={handleShare}
                  className="w-full bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white py-4 hover:shadow-lg transition-all duration-300 rounded-xl"
                >
                  <Share className="w-5 h-5 mr-3" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Message Preview Section */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-[#111827] text-center mb-8">
              Message Preview
            </h3>
            
            <div className="max-w-2xl mx-auto">
              <Card className="p-8 bg-gradient-to-br from-[#F8F9FA] to-[#E5E7EB] border-0">
                <div className="text-center space-y-6">
                  {/* Sample Message */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-[#111827]">Day 1 Message</h4>
                    <p className="text-[#374151] leading-relaxed italic">
                      "To the one who makes my world bloom, may this digital flower remind you of my love, 
                      growing stronger with each passing day. You are my sunshine."
                    </p>
                  </div>
                  
                  {/* Message Stats */}
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#D1D5DB]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#111827] mb-1">
                        {purchaseData?.plan || '30'}
                      </div>
                      <div className="text-sm text-[#6B7280]">Total Messages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#111827] mb-1">
                        {purchaseData?.giftData?.selectedThemes?.length || '3'}
                      </div>
                      <div className="text-sm text-[#6B7280]">AI Themes</div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button
                    onClick={onEditMessages}
                    variant="outline"
                    className="w-full border-[#FF7AA2] text-[#FF7AA2] hover:bg-[#FF7AA2] hover:text-white transition-colors rounded-xl"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Review & Edit All Messages
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Gift Details */}
          <motion.div
            className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-[#E5E7EB]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h3 className="text-xl font-bold text-[#111827] mb-6">Gift Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[#6B7280] block">Flower:</span>
                  <span className="font-medium text-[#111827]">
                    {purchaseData?.flower?.name || 'Digital Rose Bouquet'}
                  </span>
                </div>
                
                <div>
                  <span className="text-[#6B7280] block">Duration:</span>
                  <span className="font-medium text-[#111827]">
                    {purchaseData?.plan || '30'} days
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[#6B7280] block">Recipient:</span>
                  <span className="font-medium text-[#111827]">
                    {purchaseData?.recipientEmail || 'emily.carter@example.com'}
                  </span>
                </div>
                
                <div>
                  <span className="text-[#6B7280] block">Starts:</span>
                  <span className="font-medium text-[#111827]">
                    {purchaseData?.deliveryDate || 'Tomorrow'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-8 bg-white border-t border-[#E5E7EB] mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-[#FF7AA2]" />
            <span className="text-[#6B7280] font-medium">Bloomy</span>
          </div>
          <p className="text-sm text-[#9CA3AF]">
            Your gift has been created and will be delivered as scheduled
          </p>
        </div>
      </footer>
    </div>
  );
}