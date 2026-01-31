import { useState, useEffect } from 'react';
import { 
  Target, LayoutDashboard, FileText, AlertCircle, 
  TrendingUp, Clock, CheckCircle, MapPin, LogOut,
  BarChart3, Brain
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import IssueQueue from './IssueQueue';
import AnalyticsDashboard from './AnalyticsDashboard';
import AIInsightsDashboard from './AIInsightsDashboard';
import LanguageSelector from './LanguageSelector';
import QuickStatsWidget from './QuickStatsWidget';
import { indianStates, type IndianState, type Issue } from '@/utils/types';
import { getIssues, getCurrentUser, setCurrentUser, addEventListener } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthorityDashboardProps {
  onLogout: () => void;
}

export default function AuthorityDashboard({ onLogout }: AuthorityDashboardProps) {
  const { t } = useLanguage();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedState, setSelectedState] = useState<IndianState | 'All States'>('All States');
  const [currentUserState, setCurrentUserState] = useState(getCurrentUser());

  useEffect(() => {
    loadIssues();
    
    // Create demo authority user if none exists
    const user = getCurrentUser();
    if (!user || user.role !== 'authority') {
      const newUser = {
        id: 'demo-authority',
        name: 'Municipal Officer',
        email: 'officer@janmarg.gov.in',
        role: 'authority' as const,
        trustScore: 100,
      };
      setCurrentUser(newUser);
      setCurrentUserState(newUser);
    } else {
      setCurrentUserState(user);
    }
    
    // Real-time updates
    const unsubscribeIssue = addEventListener('issue_created', loadIssues);
    const unsubscribeBid = addEventListener('bid_created', loadIssues);
    
    return () => {
      unsubscribeIssue();
      unsubscribeBid();
    };
  }, []);

  const loadIssues = () => {
    const allIssues = getIssues();
    setIssues(allIssues);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onLogout();
  };

  // Filter issues by state
  const filteredIssues = selectedState === 'All States'
    ? issues
    : issues.filter(issue => issue.location.state === selectedState);

  const stats = {
    total: filteredIssues.length,
    pending: filteredIssues.filter(i => i.status === 'submitted').length,
    bidding: filteredIssues.filter(i => i.status === 'bidding').length,
    inProgress: filteredIssues.filter(i => i.status === 'in-progress' || i.status === 'assigned').length,
    resolved: filteredIssues.filter(i => i.status === 'resolved').length,
    urgent: filteredIssues.filter(i => i.aiInsights && i.aiInsights.urgencyScore > 70).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-gray-800 to-green-600 dark:from-orange-400 dark:via-gray-200 dark:to-green-400 bg-clip-text text-transparent">
                    JANMARG
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Authority Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {/* State Filter */}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Select value={selectedState} onValueChange={(value) => setSelectedState(value as IndianState | 'All States')}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    <SelectItem value="All States">🇮🇳 All States</SelectItem>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Profile */}
              {currentUserState && (
                <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {currentUserState.name}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700">
                      Authority
                    </Badge>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-pink-500">
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-bold">
                      {currentUserState.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              <Button variant="ghost" onClick={handleLogout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-6 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Issues</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-orange-600 dark:text-orange-400 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <Target className="h-3 w-3" /> Bidding
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.bidding}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600 dark:text-purple-400 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-600 dark:text-yellow-400 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Urgent
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.urgent}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="queue" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Issue Queue
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-6">
            {/* Quick Stats Widget */}
            <QuickStatsWidget issues={filteredIssues} />
            
            <IssueQueue issues={filteredIssues} onUpdate={loadIssues} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard issues={filteredIssues} />
          </TabsContent>

          <TabsContent value="ai-insights">
            <AIInsightsDashboard issues={filteredIssues} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}