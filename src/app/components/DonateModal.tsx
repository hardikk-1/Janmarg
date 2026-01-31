import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Heart, AlertCircle, CheckCircle2, MapPin, Mail, Phone, Award } from 'lucide-react';
import { NGO, Donation } from '@/utils/types';
import { addDonation, getCurrentUser, getNGOById, updateNGO, getNGOs, saveNGOs } from '@/utils/storage';
import { toast } from 'sonner';

interface DonateModalProps {
  ngo: NGO;
  open: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];

export default function DonateModal({ ngo, open, onClose }: DonateModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = getCurrentUser();
  const finalAmount = selectedAmount || parseInt(customAmount) || 0;

  const handleDonate = async () => {
    if (!currentUser) {
      toast.error('Please login to donate');
      return;
    }

    if (finalAmount < 10) {
      toast.error('Minimum donation amount is ₹10');
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const donation: Donation = {
      id: `donation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ngoId: ngo.id,
      ngoName: ngo.name,
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorType: currentUser.role === 'authority' ? 'authority' : 'citizen',
      amount: finalAmount,
      message: message || undefined,
      timestamp: Date.now(),
      status: 'demo_successful',
    };

    addDonation(donation);

    // Update NGO stats
    const ngos = getNGOs();
    const ngoIndex = ngos.findIndex(n => n.id === ngo.id);
    if (ngoIndex !== -1) {
      ngos[ngoIndex].totalDonations += finalAmount;
      ngos[ngoIndex].donorCount += 1;
      saveNGOs(ngos);
    }

    setIsProcessing(false);
    toast.success(`Demo payment of ₹${finalAmount.toLocaleString()} successful! 🎉`, {
      description: 'Thank you for supporting ' + ngo.name,
    });

    // Reset form and close
    setSelectedAmount(null);
    setCustomAmount('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-red-500" />
            <DialogTitle className="text-2xl">Support a Cause</DialogTitle>
          </div>
          <DialogDescription>
            Make a demo donation to support {ngo.name}
          </DialogDescription>
        </DialogHeader>

        {/* Demo Payment Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-900">Demo Donation Only</p>
            <p className="text-sm text-yellow-700">
              No real payment involved. This is a demonstration feature for testing purposes only.
            </p>
          </div>
        </div>

        {/* NGO Info */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{ngo.name}</h3>
          <p className="text-gray-700 mb-4">{ngo.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Category:</span> {ngo.category}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="font-medium">Location:</span> {ngo.location}, {ngo.state}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Email:</span> {ngo.email}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Phone:</span> {ngo.contact}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-purple-200">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Registration:</span> {ngo.registrationNumber}
            </p>
          </div>
        </div>

        {/* Donation Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Select Donation Amount
          </label>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? 'default' : 'outline'}
                className={`h-16 text-lg font-bold ${
                  selectedAmount === amount
                    ? 'bg-gradient-to-r from-orange-600 to-green-600 text-white'
                    : 'hover:border-orange-500'
                }`}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
              >
                ₹{amount.toLocaleString()}
              </Button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                ₹
              </span>
              <Input
                type="number"
                min="10"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="pl-8 h-12 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Optional Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a message (optional)
          </label>
          <Textarea
            placeholder="Write a message of support..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Summary */}
        {finalAmount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Demo Donation Amount:</span>
              <span className="text-2xl font-bold text-green-700">
                ₹{finalAmount.toLocaleString()}
              </span>
            </div>
            {currentUser && (
              <div className="mt-2 pt-2 border-t border-green-200">
                <p className="text-sm text-gray-600">
                  Donor: <span className="font-medium">{currentUser.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {currentUser.role === 'authority' ? 'Authority' : 'Citizen'}
                  </Badge>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDonate}
            disabled={finalAmount < 10 || isProcessing}
            className="flex-1 bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-bold"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete Demo Donation
              </>
            )}
          </Button>
        </div>

        {/* Footer Notice */}
        <p className="text-xs text-center text-gray-500 pt-2 border-t">
          🔒 This is a demo feature. No real money will be charged.
        </p>
      </DialogContent>
    </Dialog>
  );
}
