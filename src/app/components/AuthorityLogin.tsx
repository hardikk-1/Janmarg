import { useState } from 'react';
import { Shield, Lock, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { setCurrentUser } from '@/utils/storage';
import { toast } from 'sonner';

interface AuthorityLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export default function AuthorityLogin({ onLoginSuccess, onBack }: AuthorityLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Demo credentials
      if (email === 'officer@janmarg.gov' && password === 'admin123') {
        setCurrentUser({
          id: 'auth1',
          name: 'Municipal Officer',
          email: 'officer@janmarg.gov',
          role: 'authority',
          trustScore: 100,
        });
        toast.success('Login successful!');
        onLoginSuccess();
      } else if (email === 'demo' && password === 'demo') {
        // Quick demo access
        setCurrentUser({
          id: 'auth1',
          name: 'Municipal Officer',
          email: 'officer@janmarg.gov',
          role: 'authority',
          trustScore: 100,
        });
        toast.success('Login successful!');
        onLoginSuccess();
      } else {
        toast.error('Invalid credentials. Use: officer@janmarg.gov / admin123');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 text-white hover:bg-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Authority Login</h1>
            <p className="text-gray-600">
              Secure access for government officials
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@janmarg.gov"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-700 font-mono">
              Email: officer@janmarg.gov<br />
              Password: admin123
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Or use: demo / demo for quick access
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>This is a secure government portal</p>
            <p>Unauthorized access is prohibited</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
