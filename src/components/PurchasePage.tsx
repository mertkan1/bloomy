import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Check, Calendar, Mail, ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PurchasePageProps {
  giftData: any;
  onBack: () => void;
  onProceedToPayment: (purchaseData: any) => void;
}

export default function PurchasePage({ giftData, onBack, onProceedToPayment }: PurchasePageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'30' | '365'>('30');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [deliveryYear, setDeliveryYear] = useState('');
  const [deliveryMonth, setDeliveryMonth] = useState('');
  const [deliveryDay, setDeliveryDay] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const plans = [
    {
      id: '30',
      days: 30,
      price: 19,
      features: [
        'AI-generated messages for 30 days',
        'One digital flower',
        'Does not auto-renew'
      ]
    },
    {
      id: '365',
      days: 365,
      price: 49,
      features: [
        'AI-generated messages for 365 days',
        'One digital flower',
        'Does not auto-renew',
        'Priority support'
      ]
    }
  ];

  const handleProceed = () => {
    if (!recipientEmail || !deliveryYear || !deliveryMonth || !deliveryDay) {
      toast.error('Please fill in all required fields');
      return;
    }

    setShowPaymentForm(true);
  };

  // Generate years (current year + next 2 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i);
  
  // Generate months
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Generate days based on selected month and year
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return [];
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { value: day.toString().padStart(2, '0'), label: day.toString() };
    });
  };

  const availableDays = getDaysInMonth(deliveryYear, deliveryMonth);

  // Validate date is not in the past
  const isValidDate = () => {
    if (!deliveryYear || !deliveryMonth || !deliveryDay) return true;
    const selectedDate = new Date(parseInt(deliveryYear), parseInt(deliveryMonth) - 1, parseInt(deliveryDay));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  // Get delivery date string
  const getDeliveryDateString = () => {
    if (!deliveryYear || !deliveryMonth || !deliveryDay) return '';
    return `${deliveryYear}-${deliveryMonth}-${deliveryDay}`;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast.error('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);
    
    try {
      const purchaseData = {
        giftData: {
          ...giftData,
          recipientEmail,
          deliveryDate: getDeliveryDateString(),
          recipientName: giftData?.recipientName || 'Friend',
          senderName: giftData?.senderName || 'Your Secret Admirer'
        },
        plan: selectedPlan,
        price: plans.find(p => p.id === selectedPlan)?.price,
      };

      console.log('Demo mode: Simulating payment with data:', purchaseData);

      // Simulate payment processing
      toast.success('Processing payment...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate demo gift ID
      const giftId = `demo_gift_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const paymentIntentId = `demo_pi_${Date.now()}`;
      
      console.log('Demo payment successful. Gift created:', giftId);
      toast.success('Payment successful! Creating your gift...');

      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Gift created successfully!');
      
      // Proceed to success page
      onProceedToPayment({
        ...purchaseData,
        paymentIntentId,
        giftId
      });

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get today's date components for validation
  const today = new Date();
  const currentMonthForValidation = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentDayForValidation = today.getDate().toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="px-6 lg:px-8 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">Bloomy</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Home</a>
            <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">About</a>
            <a href="#" className="text-[#6B7280] hover:text-[#111827] transition-colors">Contact</a>
            <button className="text-[#6B7280] hover:text-[#111827] transition-colors">Log in</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-8 text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-[#111827] mb-4">
              Complete Your Purchase
            </h1>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Choose a message duration for your digital flower. This is a one-time purchase.
            </p>
          </motion.div>

          {/* Plan Selection */}
          <motion.div
            className="grid md:grid-cols-2 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-8 cursor-pointer transition-all duration-300 border-2 ${
                  selectedPlan === plan.id
                    ? 'border-[#FF7AA2] bg-gradient-to-br from-[#FDF2F8] to-white shadow-xl'
                    : 'border-[#E5E7EB] bg-white hover:border-[#FF9E66]/50 hover:shadow-lg'
                }`}
                onClick={() => setSelectedPlan(plan.id as '30' | '365')}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#111827] mb-2">
                      {plan.days} Days
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#111827]">
                        ${plan.price}
                      </span>
                      <span className="text-[#6B7280]">one-time</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[#374151]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button
                      className={`w-full py-3 rounded-xl transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? 'bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white shadow-lg'
                          : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                      }`}
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select Duration'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Form Fields */}
          <motion.div
            className="space-y-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Recipient Email */}
            <div className="space-y-3">
              <Label htmlFor="recipientEmail" className="text-[#374151] font-medium">
                Recipient's Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  id="recipientEmail"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter recipient's email"
                  className="pl-12 py-4 text-lg border-[#D1D5DB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2] bg-white"
                  required
                />
              </div>
            </div>

            {/* Delivery Date */}
            <div className="space-y-3">
              <Label className="text-[#374151] font-medium">
                Delivery Date
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {/* Year */}
                <div className="space-y-2">
                  <Label className="text-sm text-[#6B7280]">Year</Label>
                  <Select value={deliveryYear} onValueChange={setDeliveryYear}>
                    <SelectTrigger className="py-4 text-lg border-[#D1D5DB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2] bg-white">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Month */}
                <div className="space-y-2">
                  <Label className="text-sm text-[#6B7280]">Month</Label>
                  <Select value={deliveryMonth} onValueChange={setDeliveryMonth}>
                    <SelectTrigger className="py-4 text-lg border-[#D1D5DB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2] bg-white">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Day */}
                <div className="space-y-2">
                  <Label className="text-sm text-[#6B7280]">Day</Label>
                  <Select 
                    value={deliveryDay} 
                    onValueChange={setDeliveryDay}
                    disabled={!deliveryYear || !deliveryMonth}
                  >
                    <SelectTrigger className="py-4 text-lg border-[#D1D5DB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2] bg-white">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDays.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6B7280]" />
                <p className="text-sm text-[#6B7280]">
                  {getDeliveryDateString() ? (
                    isValidDate() ? (
                      `Selected: ${getDeliveryDateString()}`
                    ) : (
                      <span className="text-red-500">Please select today or a future date</span>
                    )
                  ) : (
                    'Select delivery date from dropdowns above'
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Form or CTA Button */}
          {!showPaymentForm ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={handleProceed}
                className="w-full md:w-auto min-w-[300px] bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white rounded-2xl px-12 py-4 text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Proceed to Payment
              </Button>
              
              <p className="text-sm text-[#6B7280] mt-4">
                Secure checkout powered by Stripe
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5E7EB]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Secure Payment</h3>
              </div>

              <div className="space-y-6">
                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardholderName" className="text-[#374151] font-medium">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardholderName"
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className="py-3 border-[#D1D5DB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2]"
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-[#374151] font-medium">
                    Card Number
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <Input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 1234 1234 1234"
                      maxLength={19}
                      className="pl-12 py-3 border-[#D1D5DB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2]"
                    />
                  </div>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-[#374151] font-medium">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="py-3 border-[#D1D5DB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-[#374151] font-medium">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="py-3 border-[#D1D5DB] rounded-xl focus:border-[#FF7AA2] focus:ring-[#FF7AA2]"
                    />
                  </div>
                </div>

                {/* Payment Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => setShowPaymentForm(false)}
                    variant="outline"
                    className="flex-1 py-3 rounded-xl border-[#D1D5DB] text-[#6B7280] hover:bg-[#F3F4F6]"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-[#FF7AA2] to-[#FF9E66] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    {isProcessing ? 'Processing...' : `Pay ${plans.find(p => p.id === selectedPlan)?.price}`}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-[#6B7280]">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Order Summary */}
          <motion.div
            className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-[#E5E7EB]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-xl font-bold text-[#111827] mb-6">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Digital Flower:</span>
                <span className="font-medium text-[#111827]">
                  {giftData?.flower?.name || 'Selected Flower'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Message Duration:</span>
                <span className="font-medium text-[#111827]">
                  {selectedPlan} days
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Recipient:</span>
                <span className="font-medium text-[#111827]">
                  {recipientEmail || 'Not specified'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Delivery Date:</span>
                <span className="font-medium text-[#111827]">
                  {getDeliveryDateString() || 'Not specified'}
                </span>
              </div>
              
              <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#111827]">Total:</span>
                  <span className="text-2xl font-bold text-[#111827]">
                    ${plans.find(p => p.id === selectedPlan)?.price}
                  </span>
                </div>
              </div>
            </div>
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
            Creating beautiful digital memories that last forever
          </p>
        </div>
      </footer>
    </div>
  );
}