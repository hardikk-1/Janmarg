import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Issue } from '@/utils/types';

interface QuickStatsWidgetProps {
  issues: Issue[];
}

export default function QuickStatsWidget({ issues }: QuickStatsWidgetProps) {
  // Calculate statistics
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const pendingIssues = issues.filter(i => i.status === 'submitted').length;
  const biddingIssues = issues.filter(i => i.status === 'bidding').length;
  const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
  
  const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : '0';
  
  // Calculate average urgency
  const avgUrgency = issues.reduce((sum, i) => sum + (i.aiInsights?.urgencyScore || 0), 0) / totalIssues || 0;
  
  // Count high urgency issues
  const highUrgencyCount = issues.filter(i => (i.aiInsights?.urgencyScore || 0) > 70).length;
  
  // Calculate total bids
  const totalBids = issues.reduce((sum, i) => sum + (i.bids?.length || 0), 0);
  
  // Calculate average bid amount
  const allBids = issues.flatMap(i => i.bids || []);
  const avgBidAmount = allBids.length > 0 
    ? Math.round(allBids.reduce((sum, b) => sum + b.amount, 0) / allBids.length)
    : 0;
  
  // Get recent activity (last 24 hours)
  const oneDayAgo = Date.now() - 86400000;
  const recentIssues = issues.filter(i => i.createdAt > oneDayAgo).length;
  const recentBids = allBids.filter(b => b.timestamp > oneDayAgo).length;
  
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Quick Insights
        </h3>
        <Badge className="bg-purple-600 text-white">Live</Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Resolution Rate */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Resolution Rate</span>
            {parseFloat(resolutionRate) > 50 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-orange-600" />
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900">{resolutionRate}%</div>
          <p className="text-xs text-gray-500 mt-1">{resolvedIssues} of {totalIssues} resolved</p>
        </div>
        
        {/* High Priority */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">High Priority</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{highUrgencyCount}</div>
          <p className="text-xs text-gray-500 mt-1">Avg urgency: {avgUrgency.toFixed(0)}%</p>
        </div>
        
        {/* Active Bids */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Total Bids</span>
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{totalBids}</div>
          <p className="text-xs text-gray-500 mt-1">
            {biddingIssues} issue{biddingIssues !== 1 ? 's' : ''} in bidding
          </p>
        </div>
        
        {/* Avg Bid Amount */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Avg Bid Amount</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-green-600">
            ₹{avgBidAmount.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">{allBids.length} total bids</p>
        </div>
        
        {/* Recent Activity (24h) */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">New Issues (24h)</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{recentIssues}</div>
          <p className="text-xs text-gray-500 mt-1">New reports today</p>
        </div>
        
        {/* Recent Bids (24h) */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">New Bids (24h)</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{recentBids}</div>
          <p className="text-xs text-gray-500 mt-1">Bids submitted today</p>
        </div>
        
        {/* Pending Work */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Pending Work</span>
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{pendingIssues}</div>
          <p className="text-xs text-gray-500 mt-1">Awaiting assignment</p>
        </div>
        
        {/* In Progress */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">In Progress</span>
            <CheckCircle className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{inProgressIssues}</div>
          <p className="text-xs text-gray-500 mt-1">Active projects</p>
        </div>
      </div>
      
      {/* Quick Actions Summary */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {highUrgencyCount > 0 && (
              <span className="flex items-center text-red-600 font-medium">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {highUrgencyCount} high-priority issue{highUrgencyCount !== 1 ? 's' : ''} need{highUrgencyCount === 1 ? 's' : ''} immediate attention
              </span>
            )}
            {highUrgencyCount === 0 && biddingIssues > 0 && (
              <span className="flex items-center text-purple-600 font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                {biddingIssues} issue{biddingIssues !== 1 ? 's' : ''} awaiting bid approval
              </span>
            )}
            {highUrgencyCount === 0 && biddingIssues === 0 && pendingIssues > 0 && (
              <span className="flex items-center text-blue-600 font-medium">
                <Clock className="h-4 w-4 mr-1" />
                {pendingIssues} pending issue{pendingIssues !== 1 ? 's' : ''} need review
              </span>
            )}
            {highUrgencyCount === 0 && biddingIssues === 0 && pendingIssues === 0 && (
              <span className="flex items-center text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                All caught up! Great job! 🎉
              </span>
            )}
          </span>
        </div>
      </div>
    </Card>
  );
}
