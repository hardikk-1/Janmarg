import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, Search, Filter, Plus, TrendingUp, Heart, 
  FileText, BarChart3, Brain, Activity, LogOut, User, Settings, Award 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReportIssue from './ReportIssue';
import IssueCard from './IssueCard';
import IssueDetails from './IssueDetails';
import AnalyticsDashboard from './AnalyticsDashboard';
import AIInsightsDashboard from './AIInsightsDashboard';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import NGOList from './NGOList';
import { getIssues, getCurrentUser, setCurrentUser, addEventListener, syncPendingReports } from '@/utils/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import { indianStates, type IndianState, type Issue } from '@/utils/types';

interface CitizenPortalProps {
  onBackToHome: () => void;
}

export default function CitizenPortal({ onBackToHome }: CitizenPortalProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<'list' | 'report' | 'details' | 'ai-dashboard' | 'analytics' | 'ngos'>('list');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'urgent'>('recent');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    loadIssues();
    syncPendingReports();
    
    // Create a demo citizen user if none exists
    const user = getCurrentUser();
    if (!user) {
      const newUser = {
        id: 'demo-citizen',
        name: 'Rakesh',
        email: 'rakesh@janmarg.gov.in',
        role: 'citizen' as const,
        trustScore: 85,
        reportsSubmitted: 5,
      };
      setCurrentUser(newUser);
      setCurrentUserState(newUser);
    } else {
      setCurrentUserState(user);
    }
  }, []);

  const loadIssues = () => {
    const allIssues = getIssues();
    setIssues(allIssues);
  };

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setView('details');
  };

  const handleReportSuccess = () => {
    loadIssues();
    setView('list');
  };

  const handleIssueUpdate = () => {
    loadIssues();
    if (selectedIssue) {
      const updated = getIssues().find(i => i.id === selectedIssue.id);
      if (updated) {
        setSelectedIssue(updated);
      }
    }
  };

  // Filter and sort issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesState = stateFilter === 'all' || issue.location.state === stateFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesState;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.createdAt - a.createdAt;
    } else if (sortBy === 'popular') {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else if (sortBy === 'urgent') {
      const urgencyA = a.aiInsights?.urgencyScore || 0;
      const urgencyB = b.aiInsights?.urgencyScore || 0;
      return urgencyB - urgencyA;
    }
    return 0;
  });

  // Analytics data
  const categoryData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace('-', ' '), value }));

  const stateData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.location.state] = (acc[issue.location.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, issues: value }))
    .sort((a, b) => b.issues - a.issues)
    .slice(0, 10);

  const aiInsightsData = [
    { name: 'Low Risk', value: issues.filter(i => i.aiInsights?.riskAssessment === 'low').length },
    { name: 'Medium Risk', value: issues.filter(i => i.aiInsights?.riskAssessment === 'medium').length },
    { name: 'High Risk', value: issues.filter(i => i.aiInsights?.riskAssessment === 'high').length },
    { name: 'Critical Risk', value: issues.filter(i => i.aiInsights?.riskAssessment === 'critical').length },
  ];

  const statusTrendData = [
    { status: 'Submitted', count: issues.filter(i => i.status === 'submitted').length },
    { status: 'Bidding', count: issues.filter(i => i.status === 'bidding').length },
    { status: 'Assigned', count: issues.filter(i => i.status === 'assigned').length },
    { status: 'In Progress', count: issues.filter(i => i.status === 'in-progress').length },
    { status: 'Resolved', count: issues.filter(i => i.status === 'resolved').length },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  const avgSentiment = issues.reduce((sum, i) => sum + (i.aiInsights?.sentimentScore || 50), 0) / (issues.length || 1);
  const avgCommunityImpact = issues.reduce((sum, i) => sum + (i.aiInsights?.communityImpact || 0), 0) / (issues.length || 1);
  const avgEnvironmentalImpact = issues.reduce((sum, i) => sum + (i.aiInsights?.environmentalImpact || 0), 0) / (issues.length || 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  JANMARG
                </h1>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Citizen Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              {view === 'list' && (
                <Button 
                  variant="outline" 
                  onClick={() => setView('ai-dashboard')}
                  className="gap-2"
                >
                  <Brain className="h-4 w-4" />
                  AI Dashboard
                </Button>
              )}
              
              {/* User Profile */}
              {currentUser && (
                <div className="relative">
                  <div className="flex items-center gap-3 border-l pl-4 border-gray-200 dark:border-gray-700">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {currentUser.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          Trust Score: {currentUser.trustScore}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="focus:outline-none"
                    >
                      <Avatar className="h-10 w-10 border-2 border-orange-500 cursor-pointer hover:border-orange-600 transition-colors">
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-green-500 text-white font-bold">
                          {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </div>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                          <Avatar className="h-16 w-16 border-2 border-orange-500">
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-green-500 text-white font-bold text-xl">
                              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{currentUser.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                            <Badge className="mt-2 bg-gradient-to-r from-orange-500 to-green-600 text-white border-0">
                              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trust Score</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentUser.trustScore}</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reports Submitted</span>
                            </div>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">{currentUser.reportsSubmitted || 0}</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">User ID</span>
                            </div>
                            <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{currentUser.id}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            onClick={() => setShowProfileDropdown(false)}
                            variant="outline"
                            className="w-full"
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              
              <Button variant="ghost" onClick={onBackToHome} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'list' && (
          <>
            {/* Action Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Civic Issues</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse and report issues in your community
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setView('ngos')} 
                  size="lg"
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate to NGO
                </Button>
                <Button onClick={() => setView('report')} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Report Issue
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Kerala">Kerala</SelectItem>
                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="Telangana">Telangana</SelectItem>
                    <SelectItem value="Bihar">Bihar</SelectItem>
                    <SelectItem value="Odisha">Odisha</SelectItem>
                    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="Assam">Assam</SelectItem>
                    <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                    <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                    <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                    <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                    <SelectItem value="Goa">Goa</SelectItem>
                    <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="Puducherry">Puducherry</SelectItem>
                    <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="roads">Roads</SelectItem>
                    <SelectItem value="water">Water Supply</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                    <SelectItem value="street-lights">Street Lights</SelectItem>
                    <SelectItem value="drainage">Drainage</SelectItem>
                    <SelectItem value="public-transport">Public Transport</SelectItem>
                    <SelectItem value="parks">Parks</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="bidding">Bidding</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="urgent">Most Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant={showAnalytics ? "default" : "outline"}
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  {showAnalytics ? 'Hide' : 'Show'} AI Analytics
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{issues.length}</div>
                <div className="text-sm text-gray-600">Total Issues</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {issues.filter(i => i.status === 'resolved').length}
                </div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">
                  {issues.filter(i => i.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-orange-600">
                  {issues.filter(i => i.aiInsights && i.aiInsights.urgencyScore > 70).length}
                </div>
                <div className="text-sm text-gray-600">Urgent</div>
              </div>
            </div>

            {/* AI Analytics Dashboard */}
            {showAnalytics && (
              <div className="mb-6 space-y-6">
                {/* AI Insights Overview */}
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Avg Sentiment Score</div>
                      <div className="text-2xl font-bold text-purple-600">{avgSentiment.toFixed(1)}/100</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        {avgSentiment < 40 ? (
                          <><AlertTriangle className="h-3 w-3" /> Negative</>
                        ) : avgSentiment < 60 ? (
                          <><Meh className="h-3 w-3" /> Neutral</>
                        ) : (
                          <><ThumbsUp className="h-3 w-3" /> Positive</>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Community Impact</div>
                      <div className="text-2xl font-bold text-blue-600">{avgCommunityImpact.toFixed(1)}/100</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        {avgCommunityImpact > 70 ? (
                          <><Flame className="h-3 w-3" /> High</>
                        ) : avgCommunityImpact > 40 ? (
                          <><BarChart className="h-3 w-3" /> Medium</>
                        ) : (
                          <><TrendingDown className="h-3 w-3" /> Low</>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Environmental Impact</div>
                      <div className="text-2xl font-bold text-green-600">{avgEnvironmentalImpact.toFixed(1)}/100</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        {avgEnvironmentalImpact > 70 ? (
                          <><Leaf className="h-3 w-3" /> High Priority</>
                        ) : avgEnvironmentalImpact > 40 ? (
                          <><Leaf className="h-3 w-3" /> Medium</>
                        ) : (
                          <><Leaf className="h-3 w-3" /> Low</>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Issues by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Risk Assessment */}
                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">AI Risk Assessment</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={aiInsightsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Status Distribution */}
                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statusTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Top States */}
                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Top 10 States by Issues</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stateData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="issues" fill="#ec4899" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                {/* ML Predictions */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Machine Learning Predictions</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="text-xs text-gray-600 mb-1">Estimated Cost (Total)</div>
                      <div className="text-xl font-bold text-blue-600">
                        ₹{(issues.reduce((sum, i) => sum + (i.aiInsights?.estimatedCost || 0), 0) / 100000).toFixed(1)}L
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                      <div className="text-xs text-gray-600 mb-1">Avg Resolution Time</div>
                      <div className="text-xl font-bold text-green-600">
                        {(issues.reduce((sum, i) => sum + (i.aiInsights?.estimatedDuration || 0), 0) / issues.length).toFixed(0)} days
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                      <div className="text-xs text-gray-600 mb-1">High Priority Issues</div>
                      <div className="text-xl font-bold text-orange-600">
                        {issues.filter(i => (i.aiInsights?.urgencyScore || 0) > 70).length}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="text-xs text-gray-600 mb-1">Duplicate Detection</div>
                      <div className="text-xl font-bold text-purple-600">
                        {issues.filter(i => (i.aiInsights?.duplicateScore || 0) > 70).length}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Issues Grid */}
            {sortedIssues.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or be the first to report an issue!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onClick={() => handleViewDetails(issue)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {view === 'report' && (
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setView('list')} 
              className="mb-4"
            >
              ← Back to Issues
            </Button>
            <ReportIssue onSubmitSuccess={handleReportSuccess} allIssues={issues} />
          </div>
        )}

        {view === 'details' && selectedIssue && (
          <IssueDetails 
            issue={selectedIssue}
            onBack={() => setView('list')}
            onUpdate={handleIssueUpdate}
          />
        )}

        {view === 'ai-dashboard' && (
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setView('list')} 
              className="mb-4"
            >
              ← Back to Issues
            </Button>
            <AIInsightsDashboard issues={issues} />
          </div>
        )}

        {view === 'analytics' && (
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setView('list')} 
              className="mb-4"
            >
              ← Back to Issues
            </Button>
            <AnalyticsDashboard issues={issues} />
          </div>
        )}

        {view === 'ngos' && (
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setView('list')} 
              className="mb-4"
            >
              ← Back to Issues
            </Button>
            <NGOList />
          </div>
        )}
      </div>
    </div>
  );
}