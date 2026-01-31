import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Home, Search, Filter, TrendingUp, DollarSign, Clock, 
  Award, Briefcase, MapPin, Eye, Send, CheckCircle, XCircle,
  BarChart3, Target, Brain, LogOut
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import { Issue, Bid, User, IndianState } from '@/utils/types';
import { getIssues, getCurrentUser, setCurrentUser, addBid, addEventListener } from '@/utils/storage';
import { getRecommendedBidAmount } from '@/utils/enhancedAI';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import AIInsightsDashboard from './AIInsightsDashboard';

interface CollaboratorPortalProps {
  onBackToHome: () => void;
}

const indianStates: IndianState[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export default function CollaboratorPortal({ onBackToHome }: CollaboratorPortalProps) {
  const { t } = useLanguage();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedState, setSelectedState] = useState<IndianState | 'All States'>('All States');
  const [currentUserState, setCurrentUserState] = useState(getCurrentUser());

  useEffect(() => {
    loadIssues();
    
    // Create demo collaborator if needed
    const user = getCurrentUser();
    if (!user || user.role !== 'collaborator') {
      const newUser = {
        id: 'collab1',
        name: 'BuildPro Solutions',
        email: 'contact@buildpro.com',
        role: 'collaborator' as const,
        company: 'BuildPro Solutions Pvt Ltd',
        rating: 4.7,
        completedProjects: 127,
        phone: '+91-9876543210',
      };
      setCurrentUser(newUser);
      setCurrentUserState(newUser);
    } else {
      setCurrentUserState(user);
    }
    
    // Real-time updates
    const unsubscribeIssue = addEventListener('issue_created', loadIssues);
    const unsubscribeBid = addEventListener('bid_updated', loadIssues);
    
    return () => {
      unsubscribeIssue();
      unsubscribeBid();
    };
  }, []);

  const loadIssues = () => {
    const allIssues = getIssues();
    setIssues(allIssues);
  };

  const openBiddingDialog = (issue: Issue) => {
    setSelectedIssue(issue);
    const recommended = getRecommendedBidAmount(issue);
    setBidAmount(String(recommended.recommended));
    setBidDuration(String(issue.aiInsights?.estimatedDuration || 7));
    setIsBidDialogOpen(true);
  };

  const submitBid = () => {
    if (!selectedIssue || !currentUserState) return;

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      issueId: selectedIssue.id,
      collaboratorId: currentUserState.id,
      collaboratorName: currentUserState.name,
      company: currentUserState.company || 'Independent',
      amount: Number(bidAmount),
      duration: Number(bidDuration),
      proposal: bidProposal,
      timestamp: Date.now(),
      status: 'pending',
      rating: currentUserState.rating || 4.0,
      completedProjects: currentUserState.completedProjects || 0,
    };

    addBid(newBid);
    loadIssues();
    setIsBidDialogOpen(false);
    setBidProposal('');
    toast.success('Bid submitted successfully!');
  };

  const availableIssues = issues.filter(issue => 
    (categoryFilter === 'all' || issue.category === categoryFilter) &&
    (selectedState === 'All States' || issue.location.state === selectedState) &&
    (searchQuery === '' || issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     issue.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const myBids = issues.filter(issue => 
    issue.bids?.some(bid => bid.collaboratorId === currentUserState?.id)
  ).map(issue => ({
    issue,
    bid: issue.bids!.find(bid => bid.collaboratorId === currentUserState?.id)!
  }));

  const wonProjects = issues.filter(issue => 
    issue.assignedContractor && issue.status === 'in-progress'
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Briefcase className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-gray-800 to-green-600 dark:from-orange-400 dark:via-gray-200 dark:to-green-400 bg-clip-text text-transparent">
                  JANMARG
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentUserState?.company || 'Contractor Portal'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSelector />
              <Button variant="outline" onClick={onBackToHome}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Projects</p>
                <p className="text-3xl font-bold">{currentUserState?.completedProjects || 0}</p>
              </div>
              <Award className="h-10 w-10 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Active Bids</p>
                <p className="text-3xl font-bold">{myBids.length}</p>
              </div>
              <Target className="h-10 w-10 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Rating</p>
                <p className="text-3xl font-bold">{currentUserState?.rating || 4.0}/5</p>
              </div>
              <TrendingUp className="h-10 w-10 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Available</p>
                <p className="text-3xl font-bold">{availableIssues.length}</p>
              </div>
              <Briefcase className="h-10 w-10 opacity-50" />
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="available">Available Projects</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
          </TabsList>

          {/* Available Projects */}
          <TabsContent value="available" className="space-y-6">
            {/* Filters */}
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                  </SelectContent>
                </Select>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All States">All States</SelectItem>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {availableIssues.map((issue) => {
                const recommended = getRecommendedBidAmount(issue);
                const existingBids = issue.bids?.length || 0;

                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {issue.category.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {existingBids} bids
                        </Badge>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{issue.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{issue.description}</p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          {issue.location.address}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Estimated: ₹{recommended.recommended.toLocaleString()}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-2" />
                          Duration: {issue.aiInsights?.estimatedDuration || 7} days
                        </div>
                      </div>

                      {issue.aiInsights && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Priority</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {issue.aiInsights.urgencyScore}%
                            </span>
                          </div>
                          <Progress value={issue.aiInsights.urgencyScore} className="h-2" />
                        </div>
                      )}

                      <Button
                        onClick={() => openBiddingDialog(issue)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Place Bid
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {availableIssues.length === 0 && (
              <Card className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects available</h3>
                <p className="text-gray-500">Check back later for new opportunities</p>
              </Card>
            )}
          </TabsContent>

          {/* My Bids */}
          <TabsContent value="bids" className="space-y-6">
            <div className="space-y-4">
              {myBids.map(({ issue, bid }) => (
                <Card key={bid.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{issue.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Bid: ₹{bid.amount.toLocaleString()}</span>
                        <span>Duration: {bid.duration} days</span>
                        <span>{formatDistanceToNow(bid.timestamp, { addSuffix: true })}</span>
                      </div>
                    </div>
                    <Badge className={
                      bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {bid.status === 'accepted' ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Accepted</>
                      ) : bid.status === 'rejected' ? (
                        <><XCircle className="h-3 w-3 mr-1" /> Rejected</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Pending</>
                      )}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{bid.proposal}</p>
                </Card>
              ))}

              {myBids.length === 0 && (
                <Card className="p-12 text-center">
                  <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active bids</h3>
                  <p className="text-gray-500">Start bidding on available projects</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* In Progress */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {wonProjects.map((issue) => (
                <Card key={issue.id} className="p-6">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-4">
                    IN PROGRESS
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{issue.title}</h3>
                  <div className="mb-4">
                    <Progress value={65} className="mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">65% Complete</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Started: {formatDistanceToNow(issue.createdAt, { addSuffix: true })}</span>
                    <Button variant="outline" size="sm" onClick={() => openBiddingDialog(issue)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bidding Dialog */}
      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Place Your Bid</DialogTitle>
            <DialogDescription>
              Submit your proposal and bid amount for this project
            </DialogDescription>
          </DialogHeader>

          {selectedIssue && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{selectedIssue.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedIssue.description}</p>
              </div>

              {selectedIssue.aiInsights && (
                <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                  <h4 className="font-medium mb-2 text-sm text-purple-900 dark:text-purple-200">AI Recommendation</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Estimated Cost</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{selectedIssue.aiInsights.estimatedCost?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Estimated Duration</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedIssue.aiInsights.estimatedDuration} days
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Bid Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={bidDuration}
                    onChange={(e) => setBidDuration(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="proposal">Proposal</Label>
                <Textarea
                  id="proposal"
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                  placeholder="Describe your approach and why you're the best fit for this project..."
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBidDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitBid} className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Send className="h-4 w-4 mr-2" />
              Submit Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}