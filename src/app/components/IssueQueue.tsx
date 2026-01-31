import { useState } from 'react';
import { 
  Search, Filter, MapPin, Clock, AlertCircle, CheckCircle, 
  User, Building2, Eye, Users, TrendingUp, DollarSign, Star, Award, Briefcase, XCircle
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/separator';
import { Issue, IssueStatus, TimelineEvent } from '@/utils/types';
import { updateIssue, acceptBid, getBidsByIssueId, updateBid } from '@/utils/storage';
import { mockContractors } from '@/utils/mockData';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface IssueQueueProps {
  issues: Issue[];
  onUpdate: () => void;
}

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  bidding: 'bg-purple-100 text-purple-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
};

const categoryLabels: Record<string, string> = {
  roads: 'Roads',
  water: 'Water Supply',
  electricity: 'Electricity',
  sanitation: 'Sanitation',
  'street-lights': 'Street Lights',
  drainage: 'Drainage',
  'public-transport': 'Public Transport',
  parks: 'Parks',
  other: 'Other',
};

export default function IssueQueue({ issues, onUpdate }: IssueQueueProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<IssueStatus>('submitted');
  const [selectedContractor, setSelectedContractor] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [bids, setBids] = useState<any[]>([]);

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || issue.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    
    let matchesUrgency = true;
    if (urgencyFilter !== 'all') {
      const urgency = issue.aiInsights?.urgencyScore || 0;
      if (urgencyFilter === 'high') matchesUrgency = urgency > 70;
      else if (urgencyFilter === 'medium') matchesUrgency = urgency >= 40 && urgency <= 70;
      else if (urgencyFilter === 'low') matchesUrgency = urgency < 40;
    }

    return matchesSearch && matchesDepartment && matchesStatus && matchesUrgency;
  });

  // Sort by urgency
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const urgencyA = a.aiInsights?.urgencyScore || 0;
    const urgencyB = b.aiInsights?.urgencyScore || 0;
    return urgencyB - urgencyA;
  });

  const handleOpenIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setSelectedContractor(issue.assignedContractor?.id || '');
    setIsDialogOpen(true);
    
    // Load bids for this issue
    const issueBids = getBidsByIssueId(issue.id);
    setBids(issueBids);
  };

  const handleUpdateIssue = () => {
    if (!selectedIssue) return;

    const updates: Partial<Issue> = {
      status: newStatus,
    };

    // Add contractor if selected
    if (selectedContractor) {
      const contractor = mockContractors.find(c => c.id === selectedContractor);
      if (contractor) {
        updates.assignedContractor = contractor;
      }
    }

    // Add timeline event
    const timelineEvent: TimelineEvent = {
      id: `timeline-${Date.now()}`,
      issueId: selectedIssue.id,
      type: 'status_change',
      description: actionNote || `Status changed to ${newStatus}`,
      timestamp: Date.now(),
      userId: 'auth1',
      userName: 'Municipal Officer',
    };

    updates.timeline = [...selectedIssue.timeline, timelineEvent];

    updateIssue(selectedIssue.id, updates);
    toast.success('Issue updated successfully');
    setIsDialogOpen(false);
    setActionNote('');
    onUpdate();
  };

  const departments = Array.from(new Set(issues.map(i => i.department)));

  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
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

          <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Urgencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgencies</SelectItem>
              <SelectItem value="high">High Urgency</SelectItem>
              <SelectItem value="medium">Medium Urgency</SelectItem>
              <SelectItem value="low">Low Urgency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {sortedIssues.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </Card>
        ) : (
          sortedIssues.map((issue) => {
            const urgency = issue.aiInsights?.urgencyScore || 0;
            const severity = issue.aiInsights?.severityScore || 0;

            return (
              <Card key={issue.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className={statusColors[issue.status]}>
                        {issue.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{categoryLabels[issue.category]}</Badge>
                      {urgency > 70 && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          High Urgency
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{issue.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {issue.location.address}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-2" />
                          {issue.department}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          Reported by {issue.userName}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {issue.assignedContractor && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Assigned to {issue.assignedContractor.name}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {issue.upvotes} upvotes, {issue.comments.length} comments
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    {issue.aiInsights && (
                      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-purple-50 rounded-lg">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Urgency Score
                            </span>
                            <span className="text-xs font-medium">{urgency}%</span>
                          </div>
                          <Progress value={urgency} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Severity Score
                            </span>
                            <span className="text-xs font-medium">{severity}%</span>
                          </div>
                          <Progress value={severity} className="h-2" />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button onClick={() => handleOpenIssue(issue)} className="ml-4">
                    <Eye className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Issue Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Issue</DialogTitle>
            <DialogDescription>
              Update status and assign contractors for: {selectedIssue?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedIssue && (
            <div className="space-y-6 py-4">
              {/* Current Status */}
              <div>
                <Label>Current Status</Label>
                <div className="mt-2">
                  <Badge className={statusColors[selectedIssue.status]}>
                    {selectedIssue.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={newStatus} onValueChange={(value: IssueStatus) => setNewStatus(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="bidding">Bidding</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assign Contractor */}
              <div>
                <Label htmlFor="contractor">Assign Contractor</Label>
                <Select value={selectedContractor} onValueChange={setSelectedContractor}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select contractor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockContractors
                      .filter(c => c.department === selectedIssue.department)
                      .map(contractor => (
                        <SelectItem key={contractor.id} value={contractor.id}>
                          {contractor.name} (Rating: {contractor.rating}/5)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Note */}
              <div>
                <Label htmlFor="note">Action Note (Optional)</Label>
                <Textarea
                  id="note"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Add a note about this action..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              {/* AI Summary */}
              {selectedIssue.aiInsights && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm">AI-Generated Summary</h4>
                  <p className="text-sm text-gray-700">{selectedIssue.aiInsights.autoGenSummary}</p>
                </div>
              )}

              {/* Bids Section */}
              {bids.length > 0 && (
                <div className="space-y-3">
                  <Separator />
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    Contractor Bids ({bids.length})
                  </h4>
                  <div className="space-y-3">
                    {bids.map(bid => (
                      <Card key={bid.id} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-semibold text-gray-900">{bid.collaboratorName}</h5>
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                {bid.rating}/5
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{bid.company}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Award className="h-4 w-4 mr-1" />
                                {bid.completedProjects} projects
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {bid.duration} days
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 flex items-center">
                              <DollarSign className="h-5 w-5" />
                              {bid.amount.toLocaleString()}
                            </div>
                            <Badge className={
                              bid.status === 'accepted' ? 'bg-green-100 text-green-800 mt-2' :
                              bid.status === 'rejected' ? 'bg-red-100 text-red-800 mt-2' :
                              'bg-yellow-100 text-yellow-800 mt-2'
                            }>
                              {bid.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        {bid.proposal && (
                          <div className="mt-3 p-3 bg-white rounded border border-purple-100">
                            <p className="text-sm text-gray-700 leading-relaxed">{bid.proposal}</p>
                          </div>
                        )}
                        
                        {bid.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                acceptBid(bid.id);
                                toast.success('Bid accepted! Contractor has been notified.');
                                setTimeout(() => {
                                  setIsDialogOpen(false);
                                  onUpdate();
                                }, 1000);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept Bid
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => {
                                updateBid(bid.id, { status: 'rejected' });
                                toast.info('Bid rejected');
                                setTimeout(() => onUpdate(), 500);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateIssue}>
              Update Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}