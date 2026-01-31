import { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Card } from '@/app/components/ui/card';
import { IndianState, Location } from '@/utils/types';
import { useLanguage } from '@/contexts/LanguageContext';

const indianStates: IndianState[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

interface LocationSelectorProps {
  location: Location;
  setLocation: (location: Location) => void;
}

export default function LocationSelector({ location, setLocation }: LocationSelectorProps) {
  const { t } = useLanguage();
  const [locationType, setLocationType] = useState<'auto' | 'manual'>('manual');
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualData, setManualData] = useState({
    address: location?.address || '',
    city: location?.city || '',
    state: location?.state || ('' as IndianState),
    pincode: location?.pincode || '',
  });

  const detectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding (mocked for demo)
          // In production, use Google Maps API or similar
          try {
            const location: Location = {
              lat: latitude,
              lng: longitude,
              address: `Auto-detected location`,
              city: 'New Delhi', // Would come from reverse geocoding
              state: 'Delhi',
              pincode: '110001', // Would come from reverse geocoding
            };
            
            setManualData({
              address: location.address,
              city: location.city,
              state: location.state,
              pincode: location.pincode,
            });
            
            setLocation(location);
            setIsDetecting(false);
          } catch (error) {
            console.error('Error getting address:', error);
            setIsDetecting(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsDetecting(false);
          alert('Unable to detect location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsDetecting(false);
    }
  };

  const handleManualSubmit = () => {
    if (manualData.address && manualData.city && manualData.state && manualData.pincode) {
      const location: Location = {
        lat: 28.6139, // Default coordinates - would be geocoded from address
        lng: 77.2090,
        address: manualData.address,
        city: manualData.city,
        state: manualData.state,
        pincode: manualData.pincode,
      };
      setLocation(location);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={locationType === 'auto' ? 'default' : 'outline'}
          onClick={() => setLocationType('auto')}
          className="flex-1"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Auto Detect
        </Button>
        <Button
          type="button"
          variant={locationType === 'manual' ? 'default' : 'outline'}
          onClick={() => setLocationType('manual')}
          className="flex-1"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Manual Entry
        </Button>
      </div>

      {locationType === 'auto' ? (
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <Navigation className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Auto-detect Your Location
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Click the button below to automatically detect your current location
            </p>
            <Button
              type="button"
              onClick={detectLocation}
              disabled={isDetecting}
              className="w-full"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Detect My Location
                </>
              )}
            </Button>
            {manualData.address && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg text-left">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">{manualData.city}, {manualData.state}</p>
                    <p className="text-gray-600 dark:text-gray-300">{manualData.pincode}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">{t('citizen.location')} / Address</Label>
            <Input
              id="address"
              placeholder="Enter full address"
              value={manualData.address}
              onChange={(e) => {
                setManualData({ ...manualData, address: e.target.value });
                handleManualSubmit();
              }}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City / Area</Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={manualData.city}
                onChange={(e) => {
                  setManualData({ ...manualData, city: e.target.value });
                  handleManualSubmit();
                }}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="pincode">PIN Code</Label>
              <Input
                id="pincode"
                placeholder="Enter PIN code"
                value={manualData.pincode}
                maxLength={6}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setManualData({ ...manualData, pincode: value });
                  handleManualSubmit();
                }}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="state">{t('citizen.state')}</Label>
            <Select
              value={manualData.state}
              onValueChange={(value) => {
                setManualData({ ...manualData, state: value as IndianState });
                handleManualSubmit();
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('citizen.selectState')} />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {manualData.address && manualData.city && manualData.state && manualData.pincode && (
            <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Location Set
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {manualData.address}, {manualData.city}, {manualData.state} - {manualData.pincode}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}