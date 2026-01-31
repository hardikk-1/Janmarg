import { useState } from 'react';
import { 
  ArrowLeft, MapPin, ThumbsUp, ThumbsDown, MessageCircle, Clock, 
  AlertCircle, TrendingUp, Building2, User, Award, CheckCircle 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/separator';
import { Issue, Comment } from '@/utils/types';
import { updateIssue, getCurrentUser } from '@/utils/storage';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

interface IssueDetailsProps {
  issue: Issue;
  onBack: () => void;
  onUpdate: () => void;
}

const statusSteps = ['submitted', 'assigned', 'in-progress', 'resolved'];
const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
};

const categoryLabels: Record<string, string> = {
  roads: 'Roads & Pavements',
  water: 'Water Supply',
  electricity: 'Electricity',
  sanitation: 'Sanitation & Waste',
  'street-lights': 'Street Lights',
  drainage: 'Drainage & Sewage',
  'public-transport': 'Public Transport',
  parks: 'Parks & Recreation',
  other: 'Other',
};

export default function IssueDetails({ issue, onBack, onUpdate }: IssueDetailsProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const currentUser = getCurrentUser();

  const hasVoted = currentUser && issue.votedBy.includes(currentUser.id);
  const currentStepIndex = statusSteps.indexOf(issue.status);
  const progressPercentage = ((currentStepIndex + 1) / statusSteps.length) * 100;

  const handleVote = (type: 'up' | 'down') => {
    if (!currentUser) {
      toast.error('Please login to vote');
      return;
    }

    if (hasVoted) {
      toast.warning('You have already voted on this issue');
      return;
    }

    const updates: Partial<Issue> = {
      upvotes: type === 'up' ? issue.upvotes + 1 : issue.upvotes,
      downvotes: type === 'down' ? issue.downvotes + 1 : issue.downvotes,
      votedBy: [...issue.votedBy, currentUser.id],
    };

    updateIssue(issue.id, updates);
    toast.success('Vote recorded');
    onUpdate();
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }

    setIsSubmittingComment(true);

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      issueId: issue.id,
      userId: currentUser.id,
      userName: currentUser.name,
      text: commentText.trim(),
      timestamp: Date.now(),
      isOfficial: currentUser.role === 'authority',
    };

    const updates: Partial<Issue> = {
      comments: [...issue.comments, newComment],
    };

    updateIssue(issue.id, updates);
    setCommentText('');
    setIsSubmittingComment(false);
    toast.success('Comment added');
    onUpdate();
  };

  const urgencyScore = issue.aiInsights?.urgencyScore || 0;
  const severityScore = issue.aiInsights?.severityScore || 0;
  const duplicateScore = issue.aiInsights?.duplicateScore || 0;

  return (
    <div className="max-w-5xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Issues
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-3">{issue.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{categoryLabels[issue.category]}</Badge>
                  <Badge variant="outline">{statusLabels[issue.status]}</Badge>
                  {urgencyScore > 70 && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      High Urgency
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {issue.imageUrl && (
              <img 
                src={issue.imageUrl} 
                alt={issue.title}
                className="w-full h-96 object-cover rounded-lg mb-4"
              />
            )}

            <p className="text-gray-700 whitespace-pre-wrap mb-4">
              {issue.description}
            </p>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{issue.location.address}</span>
            </div>

            <Separator className="my-4" />

            {/* Status Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Status Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="mb-4" />
              <div className="grid grid-cols-4 gap-2">
                {statusSteps.map((step, index) => (
                  <div 
                    key={step}
                    className={`text-center text-xs ${
                      index <= currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {statusLabels[step]}
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement */}
            <div className="flex items-center space-x-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote('up')}
                disabled={hasVoted}
                className="flex items-center space-x-2"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{issue.upvotes}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote('down')}
                disabled={hasVoted}
                className="flex items-center space-x-2"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{issue.downvotes}</span>
              </Button>
              <div className="flex items-center space-x-2 text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span>{issue.comments.length} comments</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 ml-auto">
                <Clock className="h-4 w-4" />
                <span>{formatDistanceToNow(issue.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Comments ({issue.comments.length})</h3>
            
            {/* Add Comment */}
            <div className="mb-6">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add your comment..."
                rows={3}
                className="mb-2"
              />
              <Button 
                onClick={handleAddComment}
                disabled={isSubmittingComment || !commentText.trim()}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Post Comment
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {issue.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet</p>
              ) : (
                issue.comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`p-4 rounded-lg ${
                      comment.isOfficial ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{comment.userName}</span>
                        {comment.isOfficial && (
                          <Badge className="bg-blue-600 text-white">Official</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {issue.timeline.map((event, index) => (
                <div key={event.id} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    {index < issue.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 flex-1 mt-1" />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(event.timestamp, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Reporter
            </h3>
            <div className="space-y-2">
              <p className="font-medium">{issue.userName}</p>
              {!issue.isAnonymous && (
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-1 text-yellow-500" />
                  Trust Score: 85/100
                </div>
              )}
            </div>
          </Card>

          {/* Department */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Department
            </h3>
            <p className="text-gray-700">{issue.department}</p>
          </Card>

          {/* Assigned Contractor */}
          {issue.assignedContractor && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Assigned To
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{issue.assignedContractor.name}</p>
                <p className="text-sm text-gray-600">{issue.assignedContractor.phone}</p>
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>Rating: {issue.assignedContractor.rating}/5.0</span>
                </div>
              </div>
            </Card>
          )}

          {/* AI Insights */}
          {issue.aiInsights && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                AI Insights
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Urgency</span>
                    <span className="text-sm font-medium">{urgencyScore}%</span>
                  </div>
                  <Progress value={urgencyScore} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Severity</span>
                    <span className="text-sm font-medium">{severityScore}%</span>
                  </div>
                  <Progress value={severityScore} className="h-2" />
                </div>
                {duplicateScore > 0.5 && (
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs font-medium text-amber-800 mb-1">
                      Potential Duplicate Detected
                    </p>
                    <p className="text-xs text-amber-700">
                      {Math.round(duplicateScore * 100)}% similarity with existing issues
                    </p>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-600">
                    {issue.aiInsights.autoGenSummary}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
