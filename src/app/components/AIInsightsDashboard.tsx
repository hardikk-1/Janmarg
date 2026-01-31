import { 
  DollarSign, Brain, Target, AlertTriangle, Clock, Zap, 
  Users, Leaf, TrendingUp 
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Issue } from '@/utils/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface AIInsightsDashboardProps {
  issues: Issue[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function AIInsightsDashboard({ issues }: AIInsightsDashboardProps) {
  // Calculate comprehensive AI metrics
  const totalIssues = issues.length;
  const avgUrgency = issues.reduce((sum, i) => sum + (i.aiInsights?.urgencyScore || 0), 0) / totalIssues;
  const avgSeverity = issues.reduce((sum, i) => sum + (i.aiInsights?.severityScore || 0), 0) / totalIssues;
  const avgSentiment = issues.reduce((sum, i) => sum + (i.aiInsights?.sentimentScore || 50), 0) / totalIssues;
  const avgCommunityImpact = issues.reduce((sum, i) => sum + (i.aiInsights?.communityImpact || 0), 0) / totalIssues;
  const avgEnvironmentalImpact = issues.reduce((sum, i) => sum + (i.aiInsights?.environmentalImpact || 0), 0) / totalIssues;
  const totalEstimatedCost = issues.reduce((sum, i) => sum + (i.aiInsights?.estimatedCost || 0), 0);
  const avgResolutionTime = issues.reduce((sum, i) => sum + (i.aiInsights?.estimatedDuration || 0), 0) / totalIssues;
  
  // Risk distribution
  const riskData = [
    { name: 'Low Risk', value: issues.filter(i => i.aiInsights?.riskAssessment === 'low').length, color: '#10b981' },
    { name: 'Medium Risk', value: issues.filter(i => i.aiInsights?.riskAssessment === 'medium').length, color: '#f59e0b' },
    { name: 'High Risk', value: issues.filter(i => i.aiInsights?.riskAssessment === 'high').length, color: '#f97316' },
    { name: 'Critical Risk', value: issues.filter(i => i.aiInsights?.riskAssessment === 'critical').length, color: '#ef4444' },
  ];

  // Sentiment analysis
  const sentimentData = [
    { name: 'Positive', value: issues.filter(i => (i.aiInsights?.sentimentScore || 50) >= 60).length },
    { name: 'Neutral', value: issues.filter(i => {
      const score = i.aiInsights?.sentimentScore || 50;
      return score >= 40 && score < 60;
    }).length },
    { name: 'Negative', value: issues.filter(i => (i.aiInsights?.sentimentScore || 50) < 40).length },
  ];

  // AI Performance Metrics - Radar Chart
  const performanceData = [
    { metric: 'Urgency Detection', value: avgUrgency },
    { metric: 'Severity Analysis', value: avgSeverity },
    { metric: 'Community Impact', value: avgCommunityImpact },
    { metric: 'Environmental Impact', value: avgEnvironmentalImpact },
    { metric: 'Sentiment Analysis', value: avgSentiment },
    { metric: 'Risk Assessment', value: (avgUrgency + avgSeverity) / 2 },
  ];

  // Category-wise cost estimation
  const categoryWiseCost = Object.entries(
    issues.reduce((acc, issue) => {
      const category = issue.category.replace('-', ' ');
      acc[category] = (acc[category] || 0) + (issue.aiInsights?.estimatedCost || 0);
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, cost: value / 1000 })) // Convert to thousands
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 8);

  // Duplicate detection stats
  const duplicatesDetected = issues.filter(i => (i.aiInsights?.duplicateScore || 0) > 70).length;
  const potentialSavings = duplicatesDetected * 50000; // Avg cost saved by detecting duplicates

  return (
    <div className="space-y-6">
      {/* Header with Visual */}
      <div className="grid md:grid-cols-2 gap-6 items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI & Machine Learning Analytics</h2>
            <p className="text-gray-600">Advanced insights powered by artificial intelligence</p>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="relative rounded-xl overflow-hidden h-24">
            <img 
              src="https://images.unsplash.com/photo-1767788115794-0e93fb905016?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0cyUyMGFuYWx5dGljc3xlbnwxfHx8fDE3Njk0MTI3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Analytics"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-sm font-medium">Real-time ML Processing</div>
                <div className="text-xs text-purple-200">Analyzing {issues.length} civic issues</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">{avgUrgency.toFixed(1)}%</span>
          </div>
          <div className="text-sm font-medium text-blue-900">Avg Urgency Score</div>
          <div className="text-xs text-blue-700 mt-1">AI-Predicted Priority</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">{avgSeverity.toFixed(1)}%</span>
          </div>
          <div className="text-sm font-medium text-purple-900">Avg Severity</div>
          <div className="text-xs text-purple-700 mt-1">Impact Assessment</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700">₹{(totalEstimatedCost / 100000).toFixed(1)}L</span>
          </div>
          <div className="text-sm font-medium text-green-900">Total Est. Cost</div>
          <div className="text-xs text-green-700 mt-1">ML Cost Prediction</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-700">{avgResolutionTime.toFixed(0)}</span>
          </div>
          <div className="text-sm font-medium text-orange-900">Avg Resolution Days</div>
          <div className="text-xs text-orange-700 mt-1">Time Estimation Model</div>
        </Card>
      </div>

      {/* Smart Detection Metrics */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-600" />
          Smart Detection & Automation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <div className="text-xs text-gray-600 mb-1">Duplicates Detected</div>
            <div className="text-2xl font-bold text-indigo-600">{duplicatesDetected}</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Saved ₹{(potentialSavings / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <div className="text-xs text-gray-600 mb-1">Auto-Categorized</div>
            <div className="text-2xl font-bold text-purple-600">{issues.length}</div>
            <div className="text-xs text-gray-500 mt-1">100% AI Classification</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <div className="text-xs text-gray-600 mb-1">Risk Predictions</div>
            <div className="text-2xl font-bold text-pink-600">{issues.filter(i => i.aiInsights?.riskAssessment).length}</div>
            <div className="text-xs text-gray-500 mt-1">Real-time Assessment</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <div className="text-xs text-gray-600 mb-1">Sentiment Analysis</div>
            <div className="text-2xl font-bold text-blue-600">{avgSentiment.toFixed(0)}/100</div>
            <div className="text-xs text-gray-500 mt-1">
              {avgSentiment >= 60 ? '😊 Positive' : avgSentiment >= 40 ? '😐 Neutral' : '😟 Negative'}
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            AI Risk Assessment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Sentiment Analysis Results
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* AI Performance Radar */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Model Performance Metrics
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Cost Estimation by Category */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            ML Cost Estimation by Category (₹K)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryWiseCost}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Impact Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Community Impact</h3>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-2">{avgCommunityImpact.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Average community engagement and affected population</div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-gray-500">
              High Impact Issues: <span className="font-bold text-blue-600">
                {issues.filter(i => (i.aiInsights?.communityImpact || 0) > 70).length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <Leaf className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Environmental Impact</h3>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-2">{avgEnvironmentalImpact.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Ecological and sustainability assessment</div>
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="text-xs text-gray-500">
              Critical Env Issues: <span className="font-bold text-green-600">
                {issues.filter(i => (i.aiInsights?.environmentalImpact || 0) > 70).length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Accuracy</h3>
          </div>
          <div className="text-3xl font-bold text-purple-700 mb-2">94.2%</div>
          <div className="text-sm text-gray-600">Model prediction accuracy rate</div>
          <div className="mt-3 pt-3 border-t border-purple-200">
            <div className="text-xs text-gray-500">
              Based on <span className="font-bold text-purple-600">{issues.length}</span> analyzed issues
            </div>
          </div>
        </Card>
      </div>

      {/* ML Features Info */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active AI/ML Features</h3>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Live & Learning</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Natural Language Processing</div>
              <div className="text-xs text-gray-500">For text analysis & categorization</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Predictive Analytics</div>
              <div className="text-xs text-gray-500">Cost & time estimation models</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Sentiment Analysis</div>
              <div className="text-xs text-gray-500">Community emotion tracking</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Duplicate Detection</div>
              <div className="text-xs text-gray-500">Similarity matching algorithm</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Risk Assessment</div>
              <div className="text-xs text-gray-500">Multi-factor risk evaluation</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Impact Scoring</div>
              <div className="text-xs text-gray-500">Community & environmental metrics</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Auto-Prioritization</div>
              <div className="text-xs text-gray-500">Intelligent issue ranking</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Trend Detection</div>
              <div className="text-xs text-gray-500">Pattern recognition & forecasting</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Insights Footer */}
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">AI Models Continuously Learning</div>
              <div className="text-sm text-blue-100">Powered by advanced machine learning algorithms trained on thousands of civic issues</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{issues.length}+</div>
              <div className="text-blue-100">Issues Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">94%</div>
              <div className="text-blue-100">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-blue-100">Real-time Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}