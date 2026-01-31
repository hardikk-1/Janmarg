import { MapPin, ThumbsUp, ThumbsDown, MessageCircle, Clock, AlertCircle, Brain, TrendingUp, Leaf } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Issue } from '@/utils/types';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  roads: 'bg-orange-100 text-orange-800',
  water: 'bg-blue-100 text-blue-800',
  electricity: 'bg-yellow-100 text-yellow-800',
  sanitation: 'bg-green-100 text-green-800',
  'street-lights': 'bg-purple-100 text-purple-800',
  drainage: 'bg-cyan-100 text-cyan-800',
  'public-transport': 'bg-pink-100 text-pink-800',
  parks: 'bg-lime-100 text-lime-800',
  other: 'bg-gray-100 text-gray-800',
};

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  bidding: 'bg-orange-100 text-orange-800',
  assigned: 'bg-purple-100 text-purple-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const categoryLabels: Record<string, string> = {
  roads: 'Roads',
  water: 'Water Supply',
  electricity: 'Electricity',
  sanitation: 'Sanitation',
  'street-lights': 'Street Lights',
  drainage: 'Drainage',
  'public-transport': 'Public Transport',
  parks: 'Parks & Recreation',
  other: 'Other',
};

const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  bidding: 'Bidding Open',
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export default function IssueCard({ issue, onClick }: IssueCardProps) {
  const urgencyScore = issue.aiInsights?.urgencyScore || 0;
  const showUrgent = urgencyScore > 70;
  const riskLevel = issue.aiInsights?.riskAssessment;
  const communityImpact = issue.aiInsights?.communityImpact || 0;
  const environmentalImpact = issue.aiInsights?.environmentalImpact || 0;

  const riskColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {issue.imageUrl && (
        <div className="relative">
          <img 
            src={issue.imageUrl} 
            alt={issue.title}
            className="w-full h-48 object-cover"
          />
          {riskLevel && (
            <div className="absolute top-2 right-2">
              <Badge className={riskColors[riskLevel]}>
                {riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={categoryColors[issue.category]}>
                {categoryLabels[issue.category]}
              </Badge>
              <Badge className={statusColors[issue.status]}>
                {statusLabels[issue.status]}
              </Badge>
              {showUrgent && (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Urgent
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {issue.title}
            </h3>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {issue.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{issue.location.address}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{issue.upvotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="h-4 w-4" />
              <span>{issue.downvotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{issue.comments.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(issue.createdAt, { addSuffix: true })}</span>
          </div>
        </div>

        {/* AI Insights Bar */}
        {issue.aiInsights && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Brain className="h-3 w-3 text-purple-600" />
              <span className="font-medium text-purple-600">AI Insights</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-blue-500" />
                <span className="text-gray-600">Impact: {communityImpact.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Leaf className="h-3 w-3 text-green-500" />
                <span className="text-gray-600">Env: {environmentalImpact.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                <span className="text-gray-600">Urgency: {urgencyScore.toFixed(0)}%</span>
              </div>
            </div>
            {issue.aiInsights.estimatedCost && (
              <div className="mt-2 text-xs text-gray-500">
                Est. Cost: <span className="font-semibold text-blue-600">₹{(issue.aiInsights.estimatedCost / 1000).toFixed(0)}K</span>
                {issue.aiInsights.estimatedDuration && (
                  <span className="ml-2">• Duration: <span className="font-semibold text-green-600">{issue.aiInsights.estimatedDuration} days</span></span>
                )}
              </div>
            )}
          </div>
        )}

        {!issue.isAnonymous && (
          <div className="mt-3 pt-3 border-t text-sm text-gray-500">
            Reported by <span className="font-medium">{issue.userName}</span>
            {issue.location.state && (
              <span className="ml-2 text-xs">• {issue.location.state}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
