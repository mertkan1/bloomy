import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Eye, QrCode, Send, Settings, LogOut, Calendar, Gift, Loader2, User } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import exampleImage from 'figma:asset/969996e8b243f236bb6f845a9c42171cf3e03bb0.png';
import flowerLogo from 'figma:asset/b2dfc7a842334267c53e217f862d55a3f4d30a90.png';
import flowerLogoGradient from 'figma:asset/47650059587febef5d2ffcbe8595697331a8c807.png';
import flowerLogoOutline from 'figma:asset/7f2e338b7c49e282790a86d9a96a4f9a2abdd1f2.png';

interface MyFlowersProps {
  userEmail?: string;
  onLogout: () => void;
  onViewGift: (giftId: string) => void;
  onHome: () => void;
  onSendGift: () => void;
  user?: any;
}

interface GiftItem {
  id: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  plan: '30' | '365';
  purchaseDate: string;
  expiryDate: string;
  flower: {
    id: string;
    name: string;
    image: string;
  };
  status: 'active' | 'expired';
  deliveryDate: string;
}

export default function MyFlowers({ userEmail, onLogout, onViewGift, onHome, onSendGift, user }: MyFlowersProps) {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [hasMore, setHasMore] = useState(false);

  // Mock data - In real app, fetch from backend
  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data with realistic content
      const mockGifts: GiftItem[] = [
        {
          id: '1',
          recipientName: 'Sophia Clark',
          recipientEmail: 'sophia.clark@email.com',
          senderName: 'You',
          plan: '30',
          purchaseDate: '2024-06-20',
          expiryDate: '2024-07-20',
          deliveryDate: '2024-06-20',
          flower: {
            id: 'rose-1',
            name: 'Elegant Rose',
            image: 'https://images.unsplash.com/photo-1518709414141-c2fe10a5b63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcm9zZSUyMGZsb3dlcnxlbnwxfHx8fDE3NTc4Nzc0ODN8MA&ixlib=rb-4.1.0&q=80&w=400'
          },
          status: 'active'
        },
        {
          id: '2',
          recipientName: 'Ethan Bennett',
          recipientEmail: 'ethan.bennett@email.com',
          senderName: 'You',
          plan: '365',
          purchaseDate: '2023-12-15',
          expiryDate: '2024-12-15',
          deliveryDate: '2023-12-15',
          flower: {
            id: 'sunflower-1',
            name: 'Bright Sunflower',
            image: 'https://images.unsplash.com/photo-1597848212624-e6dcb7c60a7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBmbG93ZXJ8ZW58MXx8fHwxNzU3ODc3NDgzfDA&ixlib=rb-4.1.0&q=80&w=400'
          },
          status: 'active'
        },
        {
          id: '3',
          recipientName: 'Olivia Hayes',
          recipientEmail: 'olivia.hayes@email.com',
          senderName: 'You',
          plan: '30',
          purchaseDate: '2024-07-05',
          expiryDate: '2024-08-05',
          deliveryDate: '2024-07-05',
          flower: {
            id: 'tulip-1',
            name: 'Spring Tulip',
            image: 'https://images.unsplash.com/photo-1615061142027-6d2e9c1f04a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWxpcCUyMGZsb3dlcnxlbnwxfHx8fDE3NTc4Nzc0ODN8MA&ixlib=rb-4.1.0&q=80&w=400'
          },
          status: 'expired'
        },
        {
          id: '4',
          recipientName: 'Liam Carter',
          recipientEmail: 'liam.carter@email.com',
          senderName: 'You',
          plan: '365',
          purchaseDate: '2023-11-22',
          expiryDate: '2024-11-22',
          deliveryDate: '2023-11-22',
          flower: {
            id: 'lily-1',
            name: 'Pure Lily',
            image: 'https://images.unsplash.com/photo-1518623380023-0c95b4448c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWx5JTIwZmxvd2VyfGVufDF8fHx8MTc1Nzg3NzQ4M3ww&ixlib=rb-4.1.0&q=80&w=400'
          },
          status: 'active'
        },
        {
          id: '5',
          recipientName: 'Ava Mitchell',
          recipientEmail: 'ava.mitchell@email.com',
          senderName: 'You',
          plan: '30',
          purchaseDate: '2024-08-10',
          expiryDate: '2024-09-10',
          deliveryDate: '2024-08-10',
          flower: {
            id: 'orchid-1',
            name: 'Exotic Orchid',
            image: 'https://images.unsplash.com/photo-1609079067011-c95e7b5be9e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoaWQlMjBmbG93ZXJ8ZW58MXx8fHwxNzU3ODc3NDgzfDA&ixlib=rb-4.1.0&q=80&w=400'
          },
          status: 'expired'
        }
      ];

      setGifts(mockGifts);
      setHasMore(true);
    } catch (error) {
      console.error('Error loading gifts:', error);
      toast.error('Failed to load your flowers');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreGifts = async () => {
    setLoadingMore(true);
    try {
      // Simulate loading more
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('All flowers loaded');
      setHasMore(false);
    } catch (error) {
      toast.error('Failed to load more flowers');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleResend = async (gift: GiftItem) => {
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Gift resent to ${gift.recipientName}`);
    } catch (error) {
      toast.error('Failed to resend gift');
    }
  };

  const handleQRCode = (gift: GiftItem) => {
    // In real app, generate and show QR code modal
    toast.success('QR code copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const activeGifts = gifts.filter(gift => gift.status === 'active');
  const expiredGifts = gifts.filter(gift => gift.status === 'expired');

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="px-6 lg:px-8 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-lg flex items-center justify-center">
              <img src={flowerLogoOutline} alt="Bloomy" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">Bloomy</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={onHome}
              className="text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Home
            </button>
            <button 
              onClick={onSendGift}
              className="text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Send a Gift
            </button>
            <span className="text-[#FF7AA2] font-medium">My Flowers</span>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={onSendGift}
              size="sm"
              className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-xl px-4 py-2 hover:shadow-lg transition-all duration-300"
            >
              <Gift className="w-4 h-4 mr-2" />
              Send Gift
            </Button>
            
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[#6B7280] cursor-pointer hover:text-[#111827] transition-colors" />
              
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <div className="w-full h-full bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </Avatar>
                
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  size="sm"
                  className="text-[#6B7280] hover:text-[#111827] transition-colors p-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-[#111827] mb-2">My Flowers</h1>
            <p className="text-lg text-[#6B7280]">
              Manage your digital flower gifts and track their journey
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#FF7AA2]" />
                <span className="text-lg text-[#6B7280]">Loading your flowers...</span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-white border border-[#E5E7EB] rounded-xl p-1">
                  <TabsTrigger 
                    value="active" 
                    className="px-6 py-3 rounded-lg data-[state=active]:bg-[#FF7AA2] data-[state=active]:text-white transition-all duration-300"
                  >
                    Active Gifts ({activeGifts.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="expired" 
                    className="px-6 py-3 rounded-lg data-[state=active]:bg-[#6B7280] data-[state=active]:text-white transition-all duration-300"
                  >
                    Expired Gifts ({expiredGifts.length})
                  </TabsTrigger>
                </TabsList>

                {/* Active Gifts Tab */}
                <TabsContent value="active" className="space-y-6">
                  {activeGifts.length === 0 ? (
                    <Card className="p-12 text-center border-0 shadow-sm">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-full flex items-center justify-center">
                          <Gift className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#111827] mb-2">No active gifts yet</h3>
                          <p className="text-[#6B7280] mb-6">Start creating beautiful digital flower gifts for your loved ones</p>
                          <Button
                            onClick={onSendGift}
                            className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-xl px-6 py-3"
                          >
                            Send Your First Gift
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {/* Header Row */}
                      <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-[#6B7280] border-b border-[#E5E7EB]">
                        <div className="col-span-4">Recipient</div>
                        <div className="col-span-2">Plan</div>
                        <div className="col-span-3">Expires on</div>
                        <div className="col-span-3">Actions</div>
                      </div>

                      {/* Gift Rows */}
                      {activeGifts.map((gift, index) => (
                        <motion.div
                          key={gift.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              {/* Recipient */}
                              <div className="col-span-4 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] flex-shrink-0">
                                  <ImageWithFallback
                                    src={gift.flower.image}
                                    alt={gift.flower.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-[#111827]">{gift.recipientName}</p>
                                  <p className="text-sm text-[#6B7280]">{gift.recipientEmail}</p>
                                </div>
                              </div>

                              {/* Plan */}
                              <div className="col-span-2">
                                <Badge className={`${getStatusColor('active')} font-medium`}>
                                  {gift.plan} Days
                                </Badge>
                              </div>

                              {/* Expires */}
                              <div className="col-span-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                  <span className="text-sm text-[#111827]">
                                    {formatDate(gift.expiryDate)}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="col-span-3 flex items-center gap-2">
                                <Button
                                  onClick={() => onViewGift(gift.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-[#6B7280] hover:text-[#111827] border-[#E5E7EB] hover:border-[#FF7AA2] transition-colors"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                
                                <Button
                                  onClick={() => handleQRCode(gift)}
                                  variant="outline"
                                  size="sm"
                                  className="text-[#6B7280] hover:text-[#111827] border-[#E5E7EB] hover:border-[#FF7AA2] transition-colors"
                                >
                                  <QrCode className="w-4 h-4 mr-1" />
                                  QR Code
                                </Button>
                                
                                <Button
                                  onClick={() => handleResend(gift)}
                                  variant="outline"
                                  size="sm"
                                  className="text-[#6B7280] hover:text-[#111827] border-[#E5E7EB] hover:border-[#FF7AA2] transition-colors"
                                >
                                  <Send className="w-4 h-4 mr-1" />
                                  Resend
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Expired Gifts Tab */}
                <TabsContent value="expired" className="space-y-6">
                  {expiredGifts.length === 0 ? (
                    <Card className="p-12 text-center border-0 shadow-sm">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-[#6B7280] rounded-full flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#111827] mb-2">No expired gifts</h3>
                          <p className="text-[#6B7280]">Your gifts are still blooming beautifully</p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {/* Header Row */}
                      <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-[#6B7280] border-b border-[#E5E7EB]">
                        <div className="col-span-4">Recipient</div>
                        <div className="col-span-2">Plan</div>
                        <div className="col-span-3">Expired on</div>
                        <div className="col-span-3">Actions</div>
                      </div>

                      {/* Expired Gift Rows */}
                      {expiredGifts.map((gift, index) => (
                        <motion.div
                          key={gift.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="p-6 border-0 shadow-sm bg-[#F9FAFB] opacity-75">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              {/* Recipient */}
                              <div className="col-span-4 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] flex-shrink-0">
                                  <ImageWithFallback
                                    src={gift.flower.image}
                                    alt={gift.flower.name}
                                    className="w-full h-full object-cover grayscale"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-[#6B7280]">{gift.recipientName}</p>
                                  <p className="text-sm text-[#9CA3AF]">{gift.recipientEmail}</p>
                                </div>
                              </div>

                              {/* Plan */}
                              <div className="col-span-2">
                                <Badge className={`${getStatusColor('expired')} font-medium`}>
                                  {gift.plan} Days
                                </Badge>
                              </div>

                              {/* Expired */}
                              <div className="col-span-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                                  <span className="text-sm text-[#6B7280]">
                                    {formatDate(gift.expiryDate)}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="col-span-3 flex items-center gap-2">
                                <Button
                                  onClick={() => onViewGift(gift.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-[#9CA3AF] hover:text-[#6B7280] border-[#E5E7EB] transition-colors"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                
                                <Button
                                  onClick={() => onSendGift()}
                                  variant="outline"
                                  size="sm"
                                  className="text-[#FF7AA2] hover:text-[#FF9E66] border-[#FF7AA2] transition-colors"
                                >
                                  <Send className="w-4 h-4 mr-1" />
                                  Send New
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-8">
                  <Button
                    onClick={loadMoreGifts}
                    disabled={loadingMore}
                    className="bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-8 py-3 hover:shadow-lg transition-all duration-300"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading More...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-8 bg-white border-t border-[#E5E7EB] mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <span className="text-sm text-[#6B7280]">About</span>
              <span className="text-sm text-[#6B7280]">Contact</span>
              <span className="text-sm text-[#6B7280]">Privacy Policy</span>
              <span className="text-sm text-[#6B7280]">Terms of Service</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#9CA3AF]">© 2024 Bloomy. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}