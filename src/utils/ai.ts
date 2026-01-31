import { Issue, IssueCategory, AIInsights } from './types';

// Calculate similarity between two strings (0-1)
const textSimilarity = (text1: string, text2: string): number => {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const common = words1.filter(w => words2.includes(w)).length;
  return common / Math.max(words1.length, words2.length);
};

// Calculate distance between two locations (simplified)
const locationDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// AI Duplicate Detection
export const detectDuplicates = (newIssue: Issue, existingIssues: Issue[]): { score: number; duplicateIds: string[] } => {
  const duplicates: { id: string; score: number }[] = [];

  existingIssues.forEach(existing => {
    if (existing.id === newIssue.id) return;

    // Check category match
    const categoryMatch = existing.category === newIssue.category ? 0.3 : 0;

    // Check text similarity
    const titleSim = textSimilarity(newIssue.title, existing.title);
    const descSim = textSimilarity(newIssue.description, existing.description);
    const textScore = (titleSim * 0.6 + descSim * 0.4) * 0.5;

    // Check location proximity (within 500m)
    const distance = locationDistance(
      newIssue.location.lat,
      newIssue.location.lng,
      existing.location.lat,
      existing.location.lng
    );
    const locationScore = distance < 0.5 ? 0.2 : 0;

    const totalScore = categoryMatch + textScore + locationScore;

    if (totalScore > 0.5) {
      duplicates.push({ id: existing.id, score: totalScore });
    }
  });

  duplicates.sort((a, b) => b.score - a.score);
  const topDuplicates = duplicates.slice(0, 3);

  return {
    score: topDuplicates.length > 0 ? topDuplicates[0].score : 0,
    duplicateIds: topDuplicates.map(d => d.id),
  };
};

// AI Category Classification
const categoryKeywords: Record<IssueCategory, string[]> = {
  roads: ['road', 'pothole', 'street', 'highway', 'pavement', 'asphalt', 'crack', 'damage'],
  water: ['water', 'leak', 'pipe', 'supply', 'tap', 'burst', 'shortage'],
  electricity: ['power', 'electricity', 'outage', 'electric', 'transformer', 'wire', 'blackout'],
  sanitation: ['garbage', 'trash', 'waste', 'dirty', 'cleanup', 'sanitation', 'dump'],
  'street-lights': ['light', 'lamp', 'streetlight', 'lighting', 'dark', 'bulb'],
  drainage: ['drain', 'sewer', 'overflow', 'clog', 'blockage', 'flooding', 'stagnant'],
  'public-transport': ['bus', 'transport', 'metro', 'train', 'station', 'stop'],
  parks: ['park', 'garden', 'playground', 'recreation', 'green', 'space'],
  healthcare: ['hospital', 'clinic', 'health', 'medical', 'doctor', 'ambulance', 'emergency'],
  education: ['school', 'college', 'education', 'teacher', 'student', 'library', 'classroom'],
  other: [],
};

export const classifyIssue = (title: string, description: string): IssueCategory => {
  const text = `${title} ${description}`.toLowerCase();
  const scores: Record<IssueCategory, number> = {
    roads: 0,
    water: 0,
    electricity: 0,
    sanitation: 0,
    'street-lights': 0,
    drainage: 0,
    'public-transport': 0,
    parks: 0,
    healthcare: 0,
    education: 0,
    other: 0,
  };

  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scores[category as IssueCategory] += 1;
      }
    });
  });

  const bestCategory = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] as IssueCategory;
  return bestCategory === 'other' && scores.other === 0 ? 'other' : bestCategory;
};

// AI Urgency Scoring (0-100)
export const calculateUrgency = (issue: Issue): number => {
  let urgency = 30; // Base urgency

  // Keywords indicating high urgency
  const urgentKeywords = ['dangerous', 'urgent', 'emergency', 'critical', 'hazard', 'risk', 'immediate'];
  const text = `${issue.title} ${issue.description}`.toLowerCase();
  urgentKeywords.forEach(keyword => {
    if (text.includes(keyword)) urgency += 15;
  });

  // Category-based urgency
  const categoryUrgency: Record<IssueCategory, number> = {
    'electricity': 20,
    'water': 15,
    'drainage': 15,
    'roads': 10,
    'street-lights': 5,
    'sanitation': 10,
    'public-transport': 5,
    'parks': 3,
    'healthcare': 25,
    'education': 8,
    'other': 5,
  };
  urgency += categoryUrgency[issue.category];

  // Community engagement boost
  if (issue.upvotes > 10) urgency += 15;
  if (issue.upvotes > 5) urgency += 10;

  return Math.min(urgency, 100);
};

// AI Severity Scoring (0-100)
export const calculateSeverity = (issue: Issue): number => {
  let severity = 40; // Base severity

  const severeKeywords = ['burst', 'collapse', 'accident', 'injury', 'death', 'major', 'severe'];
  const text = `${issue.title} ${issue.description}`.toLowerCase();
  severeKeywords.forEach(keyword => {
    if (text.includes(keyword)) severity += 15;
  });

  // Description length indicates detail/severity
  if (issue.description.length > 200) severity += 10;

  // Has image
  if (issue.imageUrl) severity += 5;

  return Math.min(severity, 100);
};

// Department routing
const categoryToDepartment: Record<IssueCategory, string> = {
  roads: 'Public Works Department',
  water: 'Water Supply Department',
  electricity: 'Electricity Board',
  sanitation: 'Sanitation Department',
  'street-lights': 'Municipal Services',
  drainage: 'Drainage Department',
  'public-transport': 'Transport Authority',
  parks: 'Parks & Recreation',
  healthcare: 'Health Department',
  education: 'Education Department',
  other: 'General Administration',
};

export const routeToDepartment = (category: IssueCategory): string => {
  return categoryToDepartment[category];
};

// Generate AI summary
export const generateSummary = (issue: Issue): string => {
  const categoryLabels: Record<IssueCategory, string> = {
    roads: 'road infrastructure',
    water: 'water supply',
    electricity: 'electrical infrastructure',
    sanitation: 'waste management',
    'street-lights': 'street lighting',
    drainage: 'drainage system',
    'public-transport': 'public transportation',
    parks: 'parks and recreation',
    healthcare: 'healthcare services',
    education: 'educational facilities',
    other: 'civic infrastructure',
  };

  const urgency = calculateUrgency(issue);
  const urgencyLabel = urgency > 70 ? 'High' : urgency > 40 ? 'Medium' : 'Low';

  return `${urgencyLabel} priority ${categoryLabels[issue.category]} issue reported in ${issue.location.address}. Issue has received ${issue.upvotes} community upvotes and ${issue.comments.length} comments.`;
};

// Import enhanced AI features
import { generateEnhancedAIInsights as enhanceInsights } from './enhancedAI';

// Generate complete AI insights
export const generateAIInsights = (issue: Issue, allIssues: Issue[]): AIInsights => {
  const duplicateResult = detectDuplicates(issue, allIssues);
  const predictedCategory = classifyIssue(issue.title, issue.description);
  
  const baseInsights: AIInsights = {
    duplicateScore: duplicateResult.score,
    duplicateIssueIds: duplicateResult.duplicateIds,
    predictedCategory,
    urgencyScore: calculateUrgency(issue),
    severityScore: calculateSeverity(issue),
    suggestedDepartment: routeToDepartment(issue.category),
    autoGenSummary: generateSummary(issue),
  };

  // Enhance with advanced AI features
  return enhanceInsights(issue, allIssues, baseInsights);
};
