import { Issue, AIInsights } from './types';

// Sentiment analysis based on description keywords
export const analyzeSentiment = (text: string): number => {
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'broken', 'dangerous', 'urgent', 'emergency', 'critical'];
  const positiveWords = ['good', 'better', 'improved', 'fixed', 'resolved'];
  
  const lowerText = text.toLowerCase();
  let score = 50; // Neutral
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 5;
  });
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 5;
  });
  
  return Math.max(0, Math.min(100, score));
};

// Calculate community impact based on upvotes and area
export const calculateCommunityImpact = (issue: Issue): number => {
  let impact = 40; // Base impact
  
  // Upvotes impact
  impact += Math.min(issue.upvotes * 2, 30);
  
  // Comments indicate community engagement
  impact += Math.min(issue.comments.length * 1.5, 15);
  
  // View count
  impact += Math.min((issue.viewCount || 0) * 0.1, 15);
  
  return Math.min(impact, 100);
};

// Environmental impact assessment
export const calculateEnvironmentalImpact = (issue: Issue): number => {
  const highImpactCategories = ['sanitation', 'drainage', 'water', 'parks'];
  const mediumImpactCategories = ['roads', 'street-lights'];
  
  let impact = 20;
  
  if (highImpactCategories.includes(issue.category)) {
    impact += 50;
  } else if (mediumImpactCategories.includes(issue.category)) {
    impact += 30;
  } else {
    impact += 10;
  }
  
  // Check for environmental keywords
  const envKeywords = ['pollution', 'waste', 'toxic', 'contamination', 'environment', 'green', 'clean'];
  const text = `${issue.title} ${issue.description}`.toLowerCase();
  
  envKeywords.forEach(keyword => {
    if (text.includes(keyword)) impact += 5;
  });
  
  return Math.min(impact, 100);
};

// Estimate cost based on category and severity
export const estimateCost = (issue: Issue): number => {
  const baseCosts: Record<string, number> = {
    'roads': 50000,
    'water': 30000,
    'electricity': 25000,
    'sanitation': 15000,
    'street-lights': 8000,
    'drainage': 40000,
    'public-transport': 35000,
    'parks': 20000,
    'healthcare': 100000,
    'education': 75000,
    'other': 10000,
  };
  
  let cost = baseCosts[issue.category] || 10000;
  
  // Adjust based on severity
  const severity = issue.aiInsights?.severityScore || 50;
  cost *= (severity / 50);
  
  // Round to nearest 1000
  return Math.round(cost / 1000) * 1000;
};

// Estimate duration in days
export const estimateDuration = (issue: Issue): number => {
  const baseDurations: Record<string, number> = {
    'roads': 14,
    'water': 7,
    'electricity': 5,
    'sanitation': 3,
    'street-lights': 2,
    'drainage': 10,
    'public-transport': 20,
    'parks': 15,
    'healthcare': 30,
    'education': 45,
    'other': 7,
  };
  
  let duration = baseDurations[issue.category] || 7;
  
  // Adjust based on severity
  const severity = issue.aiInsights?.severityScore || 50;
  if (severity > 75) duration *= 0.7; // Rush critical issues
  
  return Math.ceil(duration);
};

// Predict resolution date
export const predictResolutionDate = (issue: Issue): number => {
  const now = Date.now();
  const duration = estimateDuration(issue);
  
  // Add processing time
  const processingDays = issue.status === 'submitted' ? 2 : 0;
  const totalDays = duration + processingDays;
  
  return now + (totalDays * 24 * 60 * 60 * 1000);
};

// Risk assessment
export const assessRisk = (issue: Issue): 'low' | 'medium' | 'high' | 'critical' => {
  const urgency = issue.aiInsights?.urgencyScore || 0;
  const severity = issue.aiInsights?.severityScore || 0;
  const combined = (urgency + severity) / 2;
  
  if (combined >= 80) return 'critical';
  if (combined >= 60) return 'high';
  if (combined >= 40) return 'medium';
  return 'low';
};

// Count similar issues in area
export const countSimilarIssues = (issue: Issue, allIssues: Issue[]): number => {
  return allIssues.filter(i => 
    i.id !== issue.id &&
    i.category === issue.category &&
    i.location.city === issue.location.city &&
    i.status !== 'resolved' &&
    i.status !== 'closed'
  ).length;
};

// Generate enhanced AI insights
export const generateEnhancedAIInsights = (
  issue: Issue, 
  allIssues: Issue[],
  baseInsights: AIInsights
): AIInsights => {
  return {
    ...baseInsights,
    estimatedCost: estimateCost(issue),
    estimatedDuration: estimateDuration(issue),
    similarIssuesCount: countSimilarIssues(issue, allIssues),
    sentimentScore: analyzeSentiment(`${issue.title} ${issue.description}`),
    communityImpact: calculateCommunityImpact(issue),
    environmentalImpact: calculateEnvironmentalImpact(issue),
    predictedResolutionDate: predictResolutionDate(issue),
    riskAssessment: assessRisk(issue),
  };
};

// AI-powered priority calculation
export const calculatePriority = (issue: Issue): 'low' | 'medium' | 'high' | 'critical' => {
  const urgency = issue.aiInsights?.urgencyScore || 0;
  const severity = issue.aiInsights?.severityScore || 0;
  const community = issue.aiInsights?.communityImpact || 0;
  
  // Weighted calculation
  const score = (urgency * 0.4) + (severity * 0.4) + (community * 0.2);
  
  if (score >= 75) return 'critical';
  if (score >= 55) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
};

// AI recommendation for bidding
export const getRecommendedBidAmount = (issue: Issue): { min: number; max: number; recommended: number } => {
  const estimated = estimateCost(issue);
  
  return {
    min: Math.floor(estimated * 0.8),
    max: Math.ceil(estimated * 1.2),
    recommended: estimated,
  };
};
