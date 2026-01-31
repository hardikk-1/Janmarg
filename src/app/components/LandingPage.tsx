import { MapPin, TrendingUp, Shield, Users, Award, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
  onAuthorityLogin: () => void;
}

export default function LandingPage({ onGetStarted, onAuthorityLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">JanMarg</h1>
          </div>
          <Button onClick={onAuthorityLogin} variant="outline">
            Authority Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Voice for a Better City
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Report civic issues, track their resolution, and help build a more responsive government
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onGetStarted} size="lg" className="text-lg px-8 py-6">
              Report an Issue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={onGetStarted} size="lg" variant="outline" className="text-lg px-8 py-6">
              Browse Issues
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">The Challenge</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Citizens struggle to report civic issues effectively, and governments lack real-time visibility 
              into community problems. This leads to delayed responses, duplicate efforts, and citizen frustration.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How JanMarg Helps</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MapPin className="h-12 w-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Location-Based Reporting</h4>
              <p className="text-gray-600">
                Report issues with precise map locations and visual evidence for faster resolution
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">AI-Powered Intelligence</h4>
              <p className="text-gray-600">
                Automatic duplicate detection, smart categorization, and urgency assessment
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Bell className="h-12 w-12 text-orange-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Real-Time Tracking</h4>
              <p className="text-gray-600">
                Track your report from submission to resolution with live status updates
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Community Engagement</h4>
              <p className="text-gray-600">
                Upvote important issues and engage in constructive discussions
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Transparent & Secure</h4>
              <p className="text-gray-600">
                Public activity timelines ensure accountability and build citizen trust
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 text-yellow-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Trust Score System</h4>
              <p className="text-gray-600">
                Build your credibility as a genuine contributor to your community
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,247</div>
              <div className="text-blue-100">Issues Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">892</div>
              <div className="text-blue-100">Issues Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">72%</div>
              <div className="text-blue-100">Resolution Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,432</div>
              <div className="text-blue-100">Active Citizens</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Join the Movement for Better Governance
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're a citizen wanting to report an issue or a government official 
            committed to responsive governance, JanMarg is your platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onGetStarted} size="lg" className="text-lg px-8 py-6">
              Get Started as Citizen
            </Button>
            <Button onClick={onAuthorityLogin} size="lg" variant="secondary" className="text-lg px-8 py-6">
              Authority Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="h-6 w-6" />
            <span className="text-xl font-semibold">JanMarg</span>
          </div>
          <p className="text-gray-400">
            Empowering citizens and enabling responsive governance through technology
          </p>
          <p className="text-gray-500 mt-4 text-sm">
            © 2026 JanMarg. Built for the people, by the people.
          </p>
        </div>
      </footer>
    </div>
  );
}
