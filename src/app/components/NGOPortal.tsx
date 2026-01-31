import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LogOut, 
  Filter, 
  TrendingUp,
  FileText,
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Brain,
  Heart,
  DollarSign,
  MapPin,
  Activity,
  Calendar
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { toast } from 'sonner';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { getIssues, getNGORequestsByNGOId, addNGORequest } from '@/utils/storage';
import { indianStates, type IndianState, type Issue, type IssueCategory, type NGORequest } from '@/utils/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslatedIssue } from '@/utils/issueTranslations';

interface NGOPortalProps {
  ngoId: string;
  ngoName: string;
  onLogout: () => void;
}

const categories: { value: IssueCategory; label: string }[] = [
  { value: 'roads', label: 'Roads' },
  { value: 'water', label: 'Water Supply' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'street-lights', label: 'Street Lights' },
  { value: 'drainage', label: 'Drainage' },
  { value: 'public-transport', label: 'Public Transport' },
  { value: 'parks', label: 'Parks & Recreation' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

export default function NGOPortal({ ngoId, ngoName, onLogout }: NGOPortalProps) {
  const [view, setView] = useState<'issues' | 'requests' | 'analytics' | 'donations'>('issues');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [requests, setRequests] = useState<NGORequest[]>([]);
  const [selectedState, setSelectedState] = useState<IndianState | 'All States'>('All States');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [ngoId]);

  const loadData = () => {
    const allIssues = getIssues();
    setIssues(allIssues);
    const ngoRequests = getNGORequestsByNGOId(ngoId);
    setRequests(ngoRequests);
  };

  const unresolvedIssues = issues.filter(
    i => i.status !== 'resolved' && i.status !== 'closed'
  );

  const filteredIssues = unresolvedIssues.filter(issue => {
    const stateMatch = selectedState === 'All States' || issue.location.state === selectedState;
    const categoryMatch = selectedCategory === 'all' || issue.category === selectedCategory;
    return stateMatch && categoryMatch;
  });

  const handleRaiseRequest = () => {
    if (!selectedIssue) return;
    if (!requestMessage.trim()) {
      toast.error('Please enter a request message');
      return;
    }

    const newRequest: NGORequest = {
      id: `req-${Date.now()}`,
      ngoId,
      ngoName,
      issueId: selectedIssue.id,
      issueTitle: selectedIssue.title,
      issueCategory: selectedIssue.category,
      issueLocation: selectedIssue.location,
      requestMessage,
      timestamp: Date.now(),
      status: 'pending',
    };

    addNGORequest(newRequest);
    setRequests([...requests, newRequest]);
    setSelectedIssue(null);
    setRequestMessage('');
    toast.success('Request submitted successfully! Authority will review it.');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const { t, language } = useLanguage();

  // Helper function to get translated issue content
  const getIssueContent = (issue: Issue) => {
    const translated = getTranslatedIssue(issue.id, language);
    if (translated) {
      return {
        title: translated.title,
        description: translated.description,
      };
    }
    return {
      title: issue.title,
      description: issue.description,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-0">
                <div className="w-8 h-2 bg-orange-500 rounded"></div>
                <div className="w-8 h-2 bg-white rounded border border-gray-300"></div>
                <div className="w-8 h-2 bg-green-600 rounded"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-gray-800 to-green-600 bg-clip-text text-transparent">
                  JANMARG
                </h1>
                <p className="text-xs text-gray-600">{t('ngo.title')}: {ngoName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">{t('ngo.unresolvedIssues')}</p>
                <p className="text-3xl font-bold text-blue-700">{unresolvedIssues.length}</p>
              </div>
              <FileText className="h-10 w-10 text-blue-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">{t('ngo.pendingRequests')}</p>
                <p className="text-3xl font-bold text-yellow-700">{pendingRequests.length}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">{t('ngo.approvedRequests')}</p>
                <p className="text-3xl font-bold text-green-700">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">{t('ngo.rejectedRequests')}</p>
                <p className="text-3xl font-bold text-red-700">{rejectedRequests.length}</p>
              </div>
              <XCircle className="h-10 w-10 text-red-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={view === 'issues' ? 'default' : 'outline'}
            onClick={() => setView('issues')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {t('ngo.browseIssues')}
          </Button>
          <Button
            variant={view === 'requests' ? 'default' : 'outline'}
            onClick={() => setView('requests')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {t('ngo.myRequests')}
          </Button>
          <Button
            variant={view === 'analytics' ? 'default' : 'outline'}
            onClick={() => setView('analytics')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {t('ngo.analytics')}
          </Button>
          <Button
            variant={view === 'donations' ? 'default' : 'outline'}
            onClick={() => setView('donations')}
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            {t('ngo.donations')}
          </Button>
        </div>

        {/* Issues View */}
        {view === 'issues' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('ngo.filters')}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('citizen.state')}
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value as IndianState)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="All States">{t('ngo.allStates')}</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('citizen.category')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as IssueCategory | 'all')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">{t('ngo.allCategories')}</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{t(`categories.${cat.value}`)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Issues List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIssues.map(issue => {
                const issueContent = getIssueContent(issue);
                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <h4 className="font-semibold text-gray-900 mb-2">{issueContent.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {issueContent.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {t(`categories.${issue.category}`)}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {t(`citizen.${issue.status}`)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {issue.location.city}, {issue.location.state}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSelectedIssue(issue)}
                        className="w-full bg-gradient-to-r from-orange-500 to-green-600"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {t('ngo.raiseRequest')}
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredIssues.length === 0 && (
              <Card className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('ngo.noIssuesFound')}</h3>
                <p className="text-gray-500">{t('ngo.tryAdjustingFilters')}</p>
              </Card>
            )}
          </div>
        )}

        {/* Requests View */}
        {view === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('ngo.noRequestsYet')}</h3>
                <p className="text-gray-500">{t('ngo.startByRaising')}</p>
              </Card>
            ) : (
              requests.map(request => (
                <Card key={request.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{request.issueTitle}</h4>
                      <p className="text-sm text-gray-600 mt-1">{request.requestMessage}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {request.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {request.issueLocation.city}, {request.issueLocation.state}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(request.timestamp).toLocaleDateString()}</span>
                  </div>
                  {request.reviewNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-1">Authority Notes:</p>
                      <p className="text-xs text-gray-600">{request.reviewNotes}</p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">AI Analytics Dashboard</h3>
                <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  Demo Data
                </span>
              </div>

              {/* Category-wise Analytics */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-white">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Top Issue Categories</h4>
                  <div className="space-y-2">
                    {[
                      { category: 'Roads', count: 45, color: 'bg-red-500' },
                      { category: 'Water Supply', count: 38, color: 'bg-blue-500' },
                      { category: 'Street Lights', count: 32, color: 'bg-yellow-500' },
                      { category: 'Sanitation', count: 28, color: 'bg-green-500' },
                    ].map((item) => (
                      <div key={item.category} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                        <span className="text-xs text-gray-600 flex-1">{item.category}</span>
                        <span className="text-xs font-semibold text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 bg-white">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">State-wise Distribution</h4>
                  <div className="space-y-2">
                    {[
                      { state: 'Maharashtra', count: 52, color: 'bg-orange-500' },
                      { state: 'Karnataka', count: 47, color: 'bg-purple-500' },
                      { state: 'Delhi', count: 41, color: 'bg-pink-500' },
                      { state: 'Gujarat', count: 35, color: 'bg-indigo-500' },
                    ].map((item) => (
                      <div key={item.state} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                        <span className="text-xs text-gray-600 flex-1">{item.state}</span>
                        <span className="text-xs font-semibold text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 bg-white">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Urgency Levels</h4>
                  <div className="space-y-3">
                    {[
                      { level: 'Critical', percentage: 28, color: 'bg-red-500' },
                      { level: 'High', percentage: 35, color: 'bg-orange-500' },
                      { level: 'Medium', percentage: 25, color: 'bg-yellow-500' },
                      { level: 'Low', percentage: 12, color: 'bg-green-500' },
                    ].map((item) => (
                      <div key={item.level}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{item.level}</span>
                          <span className="text-xs font-semibold text-gray-900">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Trends */}
              <Card className="p-4 bg-white">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Unresolved Issue Trends (Last 6 Months)</h4>
                <div className="flex items-end justify-between h-40 gap-2">
                  {[65, 72, 58, 85, 78, 92].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t hover:opacity-80 transition-opacity cursor-pointer" style={{ height: `${height}%` }}></div>
                      <span className="text-xs text-gray-500 mt-2">M{index + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Insights */}
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">AI-Powered Insights</h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>• Road infrastructure issues have increased by 23% in the last quarter</li>
                      <li>• Water supply problems are most prevalent in Maharashtra and Karnataka</li>
                      <li>• Street lighting issues peak during monsoon season (July-September)</li>
                      <li>• Urban areas report 3.2x more civic issues than rural regions</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        )}

        {/* Donations View */}
        {view === 'donations' && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Donations Received</h3>
                <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Demo / Sample Data
                </span>
              </div>

              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="p-6 bg-white border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Donations</p>
                      <p className="text-3xl font-bold text-green-700">₹12.5L</p>
                      <p className="text-xs text-green-600 mt-1">+15% this month</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-green-500 opacity-50" />
                  </div>
                </Card>

                <Card className="p-6 bg-white border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Donors</p>
                      <p className="text-3xl font-bold text-blue-700">248</p>
                      <p className="text-xs text-blue-600 mt-1">35 new donors</p>
                    </div>
                    <Users className="h-10 w-10 text-blue-500 opacity-50" />
                  </div>
                </Card>

                <Card className="p-6 bg-white border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg. Donation</p>
                      <p className="text-3xl font-bold text-purple-700">₹5,040</p>
                      <p className="text-xs text-purple-600 mt-1">Per donor</p>
                    </div>
                    <Activity className="h-10 w-10 text-purple-500 opacity-50" />
                  </div>
                </Card>
              </div>

              {/* Recent Donations */}
              <Card className="p-6 bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Donations</h4>
                <div className="space-y-3">
                  {[
                    { donor: 'Anonymous Donor', amount: '₹25,000', date: 'Jan 28, 2026', purpose: 'Water Supply Projects' },
                    { donor: 'Rakesh', amount: '₹10,000', date: 'Jan 27, 2026', purpose: 'Road Infrastructure' },
                    { donor: 'Priya Sharma', amount: '₹15,000', date: 'Jan 26, 2026', purpose: 'General Fund' },
                    { donor: 'Tech Corp Foundation', amount: '₹50,000', date: 'Jan 25, 2026', purpose: 'Street Lighting Initiative' },
                    { donor: 'Anonymous Donor', amount: '₹8,000', date: 'Jan 24, 2026', purpose: 'Sanitation Projects' },
                    { donor: 'Amit Patel', amount: '₹12,000', date: 'Jan 23, 2026', purpose: 'Healthcare Support' },
                  ].map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{donation.donor}</p>
                          <p className="text-xs text-gray-500">{donation.purpose}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-700">{donation.amount}</p>
                        <p className="text-xs text-gray-500">{donation.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Donation Disclaimer */}
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Demo Data Notice</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This is sample demonstration data for judge evaluation. All donation amounts, donor names, and transactions shown are fictional and for demonstration purposes only.
                    </p>
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedIssue && (() => {
        const modalIssueContent = getIssueContent(selectedIssue);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t('ngo.raiseResolutionRequest')}
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('citizen.issueTitle')}
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900">{modalIssueContent.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{modalIssueContent.description}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {selectedIssue.location.city}, {selectedIssue.location.state}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('ngo.requestMessage')}
                    </label>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Explain how your NGO can help resolve this issue..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      rows={5}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleRaiseRequest}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-green-600"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t('ngo.submitRequest')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedIssue(null);
                      setRequestMessage('');
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}
    </div>
  );
}