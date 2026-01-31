export type IssueStatus = 'submitted' | 'bidding' | 'assigned' | 'in-progress' | 'resolved' | 'closed';

export type IssueCategory = 
  | 'roads' 
  | 'water' 
  | 'electricity' 
  | 'sanitation' 
  | 'street-lights' 
  | 'drainage' 
  | 'public-transport'
  | 'parks'
  | 'healthcare'
  | 'education'
  | 'other';

export type UserRole = 'citizen' | 'authority' | 'collaborator' | 'ngo' | 'anonymous';

export type IndianState = 
  | 'Andhra Pradesh'
  | 'Arunachal Pradesh'
  | 'Assam'
  | 'Bihar'
  | 'Chhattisgarh'
  | 'Goa'
  | 'Gujarat'
  | 'Haryana'
  | 'Himachal Pradesh'
  | 'Jharkhand'
  | 'Karnataka'
  | 'Kerala'
  | 'Madhya Pradesh'
  | 'Maharashtra'
  | 'Manipur'
  | 'Meghalaya'
  | 'Mizoram'
  | 'Nagaland'
  | 'Odisha'
  | 'Punjab'
  | 'Rajasthan'
  | 'Sikkim'
  | 'Tamil Nadu'
  | 'Telangana'
  | 'Tripura'
  | 'Uttar Pradesh'
  | 'Uttarakhand'
  | 'West Bengal'
  | 'Delhi'
  | 'Jammu and Kashmir'
  | 'Ladakh'
  | 'Puducherry'
  | 'Chandigarh'
  | 'All States';

export const indianStates: IndianState[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
];

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: IndianState;
  pincode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  trustScore?: number;
  reportsSubmitted?: number;
  avatar?: string;
  phone?: string;
  company?: string; // For collaborators
  rating?: number; // For collaborators
  completedProjects?: number; // For collaborators
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  isOfficial?: boolean;
  userRole?: UserRole;
}

export interface TimelineEvent {
  id: string;
  issueId: string;
  type: 'created' | 'assigned' | 'status_change' | 'comment' | 'closed' | 'bidding_opened' | 'bid_accepted';
  description: string;
  timestamp: number;
  userId?: string;
  userName?: string;
}

export interface Contractor {
  id: string;
  name: string;
  department: string;
  phone: string;
  rating: number;
  company: string;
  completedProjects: number;
  avatar?: string;
}

export interface Bid {
  id: string;
  issueId: string;
  collaboratorId: string;
  collaboratorName: string;
  company: string;
  amount: number;
  duration: number;
  proposal: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
  rating?: number;
  completedProjects?: number;
}

export interface NGO {
  id: string;
  name: string;
  description: string;
  category: string;
  contact: string;
  email: string;
  logo?: string;
  location: string;
  state: IndianState;
  registrationNumber: string;
  totalDonations: number;
  donorCount: number;
}

export interface Donation {
  id: string;
  ngoId: string;
  ngoName: string;
  donorId: string;
  donorName: string;
  donorType: 'citizen' | 'authority';
  amount: number;
  message?: string;
  timestamp: number;
  status: 'demo_successful';
}

export interface NGORequest {
  id: string;
  ngoId: string;
  ngoName: string;
  issueId: string;
  issueTitle: string;
  issueCategory: IssueCategory;
  issueLocation: Location;
  requestMessage: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: number;
  reviewNotes?: string;
}

export interface AIInsights {
  duplicateScore: number;
  duplicateIssueIds?: string[];
  predictedCategory: IssueCategory;
  urgencyScore: number;
  severityScore: number;
  suggestedDepartment: string;
  autoGenSummary: string;
  estimatedCost?: number;
  estimatedDuration?: number;
  similarIssuesCount?: number;
  sentimentScore?: number; // Positive/negative sentiment
  communityImpact?: number; // 0-100 based on area density
  environmentalImpact?: number; // 0-100
  predictedResolutionDate?: number;
  riskAssessment?: 'low' | 'medium' | 'high' | 'critical';
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: Location;
  status: IssueStatus;
  imageUrl?: string;
  userId: string;
  userName: string;
  isAnonymous: boolean;
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  comments: Comment[];
  timeline: TimelineEvent[];
  aiInsights?: AIInsights;
  assignedContractor?: Contractor;
  bids?: Bid[];
  createdAt: number;
  updatedAt: number;
  department: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  viewCount?: number;
}

export interface DepartmentStats {
  department: string;
  total: number;
  resolved: number;
  avgResolutionTime: number;
  pending: number;
}

export interface HotspotData {
  location: Location;
  count: number;
  severity: number;
}

export interface StateStats {
  state: IndianState;
  totalIssues: number;
  resolvedIssues: number;
  activeIssues: number;
  avgResolutionTime: number;
}