import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Heart, MapPin, Mail, Phone, Award, TrendingUp, Users } from 'lucide-react';
import { NGO } from '@/utils/types';
import { getNGOs, saveNGOs, addEventListener } from '@/utils/storage';
import { mockNGOs } from '@/utils/mockData';
import DonateModal from './DonateModal';

export default function NGOList() {
  const [ngos, setNGOs] = useState<NGO[]>([]);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  useEffect(() => {
    loadNGOs();
    
    // Listen for donation updates
    const unsubscribe = addEventListener('donation_created', loadNGOs);
    return () => unsubscribe();
  }, []);

  const loadNGOs = () => {
    let storedNGOs = getNGOs();
    
    // Initialize with mock data if empty
    if (storedNGOs.length === 0) {
      saveNGOs(mockNGOs);
      storedNGOs = mockNGOs;
    }
    
    setNGOs(storedNGOs);
  };

  const handleDonate = (ngo: NGO) => {
    setSelectedNGO(ngo);
    setDonateModalOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngos.map((ngo) => (
          <Card key={ngo.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{ngo.name}</h3>
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {ngo.category}
                </Badge>
              </div>
              <Heart className="h-6 w-6 text-red-500" />
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {ngo.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Donations</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{ngo.totalDonations.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Donors</p>
                <p className="text-lg font-bold text-blue-600 flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {ngo.donorCount}
                </p>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="space-y-2 mb-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span>{ngo.location}, {ngo.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="truncate">{ngo.email}</span>
              </div>
            </div>

            {/* Donate Button */}
            <Button
              onClick={() => handleDonate(ngo)}
              className="w-full bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-bold"
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate Now
            </Button>
          </Card>
        ))}
      </div>

      {/* Donate Modal */}
      {selectedNGO && (
        <DonateModal
          ngo={selectedNGO}
          open={donateModalOpen}
          onClose={() => {
            setDonateModalOpen(false);
            setSelectedNGO(null);
          }}
        />
      )}
    </div>
  );
}
