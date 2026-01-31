import { Issue, User, Bid, NGO, Donation, NGORequest } from './types';

const STORAGE_KEYS = {
  ISSUES: 'janmarg_issues',
  USERS: 'janmarg_users',
  CURRENT_USER: 'janmarg_current_user',
  PENDING_REPORTS: 'janmarg_pending_reports',
  BIDS: 'janmarg_bids',
  NGOS: 'janmarg_ngos',
  DONATIONS: 'janmarg_donations',
  NGO_REQUESTS: 'janmarg_ngo_requests',
};

// Event system for real-time updates
type StorageEventType = 'issue_created' | 'issue_updated' | 'bid_created' | 'bid_updated' | 'donation_created';
type StorageEventListener = (data: any) => void;

const eventListeners: Record<StorageEventType, StorageEventListener[]> = {
  issue_created: [],
  issue_updated: [],
  bid_created: [],
  bid_updated: [],
  donation_created: [],
};

export const addEventListener = (event: StorageEventType, listener: StorageEventListener) => {
  eventListeners[event].push(listener);
  return () => {
    const index = eventListeners[event].indexOf(listener);
    if (index > -1) {
      eventListeners[event].splice(index, 1);
    }
  };
};

const emitEvent = (event: StorageEventType, data: any) => {
  eventListeners[event].forEach(listener => listener(data));
  // Also emit a storage event for cross-tab communication
  window.dispatchEvent(new CustomEvent('janmarg-storage', { 
    detail: { event, data } 
  }));
};

// Issues
export const getIssues = (): Issue[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ISSUES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveIssues = (issues: Issue[]): void => {
  localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
};

export const addIssue = (issue: Issue): void => {
  const issues = getIssues();
  issues.unshift(issue);
  saveIssues(issues);
  emitEvent('issue_created', issue);
};

export const updateIssue = (issueId: string, updates: Partial<Issue>): void => {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === issueId);
  if (index !== -1) {
    issues[index] = { ...issues[index], ...updates, updatedAt: Date.now() };
    saveIssues(issues);
    emitEvent('issue_updated', issues[index]);
  }
};

export const getIssueById = (id: string): Issue | undefined => {
  return getIssues().find(issue => issue.id === id);
};

// Bids
export const getBids = (): Bid[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BIDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveBids = (bids: Bid[]): void => {
  localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
};

export const addBid = (bid: Bid): void => {
  const bids = getBids();
  bids.push(bid);
  saveBids(bids);
  
  // Also add bid to the issue
  const issue = getIssueById(bid.issueId);
  if (issue) {
    const updatedBids = issue.bids || [];
    updatedBids.push(bid);
    updateIssue(bid.issueId, { 
      bids: updatedBids,
      status: 'bidding'
    });
  }
  
  emitEvent('bid_created', bid);
};

export const updateBid = (bidId: string, updates: Partial<Bid>): void => {
  const bids = getBids();
  const index = bids.findIndex(b => b.id === bidId);
  if (index !== -1) {
    bids[index] = { ...bids[index], ...updates };
    saveBids(bids);
    
    // Also update the bid in the issue
    const issue = getIssueById(bids[index].issueId);
    if (issue && issue.bids) {
      const issueBidIndex = issue.bids.findIndex(b => b.id === bidId);
      if (issueBidIndex !== -1) {
        issue.bids[issueBidIndex] = { ...issue.bids[issueBidIndex], ...updates };
        updateIssue(issue.id, { bids: issue.bids });
      }
    }
    
    emitEvent('bid_updated', bids[index]);
  }
};

export const getBidsByIssueId = (issueId: string): Bid[] => {
  return getBids().filter(bid => bid.issueId === issueId);
};

export const getBidsByCollaboratorId = (collaboratorId: string): Bid[] => {
  return getBids().filter(bid => bid.collaboratorId === collaboratorId);
};

export const acceptBid = (bidId: string): void => {
  const bid = getBids().find(b => b.id === bidId);
  if (bid) {
    // Update bid status
    updateBid(bidId, { status: 'accepted' });
    
    // Reject all other bids for this issue
    const issueBids = getBidsByIssueId(bid.issueId);
    issueBids.forEach(b => {
      if (b.id !== bidId && b.status === 'pending') {
        updateBid(b.id, { status: 'rejected' });
      }
    });
    
    // Update issue with assigned contractor
    const issue = getIssueById(bid.issueId);
    if (issue) {
      updateIssue(bid.issueId, {
        status: 'assigned',
        assignedContractor: {
          id: bid.collaboratorId,
          name: bid.collaboratorName,
          company: bid.company,
          rating: bid.rating,
          completedProjects: bid.completedProjects,
          department: issue.department,
          phone: '',
        }
      });
    }
  }
};

// Users
export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(user => user.id === id);
};

// Current user (session)
export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Pending reports (offline mode)
export const getPendingReports = (): Issue[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_REPORTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addPendingReport = (issue: Issue): void => {
  const pending = getPendingReports();
  pending.push(issue);
  localStorage.setItem(STORAGE_KEYS.PENDING_REPORTS, JSON.stringify(pending));
};

export const clearPendingReports = (): void => {
  localStorage.removeItem(STORAGE_KEYS.PENDING_REPORTS);
};

export const syncPendingReports = (): void => {
  const pending = getPendingReports();
  if (pending.length > 0) {
    const issues = getIssues();
    issues.unshift(...pending);
    saveIssues(issues);
    clearPendingReports();
  }
};

// NGOs
export const getNGOs = (): NGO[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NGOS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveNGOs = (ngos: NGO[]): void => {
  localStorage.setItem(STORAGE_KEYS.NGOS, JSON.stringify(ngos));
};

export const getNGOById = (id: string): NGO | null => {
  const ngos = getNGOs();
  return ngos.find(n => n.id === id) || null;
};

export const updateNGO = (ngo: NGO): void => {
  const ngos = getNGOs();
  const index = ngos.findIndex(n => n.id === ngo.id);
  if (index !== -1) {
    ngos[index] = ngo;
    saveNGOs(ngos);
  }
};

// Donations
export const getDonations = (): Donation[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveDonations = (donations: Donation[]): void => {
  localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
};

export const addDonation = (donation: Donation): void => {
  const donations = getDonations();
  donations.push(donation);
  saveDonations(donations);
  emitEvent('donation_created', donation);
};

export const getDonationsByNGO = (ngoId: string): Donation[] => {
  return getDonations().filter(d => d.ngoId === ngoId);
};

export const getDonationsByDonor = (donorId: string): Donation[] => {
  return getDonations().filter(d => d.donorId === donorId);
};

// NGO Requests
export const getNGORequests = (): NGORequest[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NGO_REQUESTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveNGORequests = (requests: NGORequest[]): void => {
  localStorage.setItem(STORAGE_KEYS.NGO_REQUESTS, JSON.stringify(requests));
};

export const addNGORequest = (request: NGORequest): void => {
  const requests = getNGORequests();
  requests.push(request);
  saveNGORequests(requests);
};

export const updateNGORequest = (requestId: string, updates: Partial<NGORequest>): void => {
  const requests = getNGORequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    saveNGORequests(requests);
  }
};

export const getNGORequestsByNGOId = (ngoId: string): NGORequest[] => {
  return getNGORequests().filter(r => r.ngoId === ngoId);
};

export const getNGORequestsByIssueId = (issueId: string): NGORequest[] => {
  return getNGORequests().filter(r => r.issueId === issueId);
};