import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { getNGOs } from '@/utils/storage';

interface NGOLoginProps {
  onLoginSuccess: (ngoId: string, ngoName: string) => void;
  onBack: () => void;
}

export default function NGOLogin({ onLoginSuccess, onBack }: NGOLoginProps) {
  const [selectedNGOId, setSelectedNGOId] = useState('');
  const ngos = getNGOs();

  const handleLogin = () => {
    if (!selectedNGOId) {
      toast.error('Please select an NGO to login');
      return;
    }

    const ngo = ngos.find(n => n.id === selectedNGOId);
    if (ngo) {
      toast.success(`Logged in as ${ngo.name}`);
      onLoginSuccess(ngo.id, ngo.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-orange-500 rounded"></div>
              <div className="w-2 h-8 bg-white rounded"></div>
              <div className="w-2 h-8 bg-green-600 rounded"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-gray-800 to-green-600 bg-clip-text text-transparent">
              JANMARG
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Login Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">NGO Login</h2>
                <p className="text-sm text-gray-600">Select your NGO to access the portal</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Select NGO
              </label>
              <select
                value={selectedNGOId}
                onChange={(e) => setSelectedNGOId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                style={{ color: '#111827' }}
              >
                <option value="" style={{ color: '#111827' }}>-- Select an NGO --</option>
                {ngos.map(ngo => (
                  <option key={ngo.id} value={ngo.id} style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                    {ngo.name} - {ngo.location}, {ngo.state}
                  </option>
                ))}
              </select>

              {selectedNGOId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-gradient-to-br from-orange-50 to-green-50 rounded-lg border border-orange-200"
                >
                  {(() => {
                    const ngo = ngos.find(n => n.id === selectedNGOId);
                    return ngo ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                        <p className="text-xs text-gray-600">{ngo.description}</p>
                        <p className="text-xs text-gray-500">
                          Category: {ngo.category} | Reg: {ngo.registrationNumber}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </motion.div>
              )}
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Login to NGO Portal
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 text-center">
                <strong>Demo Login:</strong> Select any NGO from the list to access the NGO Portal
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}