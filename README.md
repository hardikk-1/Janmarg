# JanMarg - Civic Tech Platform

## Overview
JanMarg is a comprehensive civic-tech platform that connects citizens with government authorities to report and resolve civic issues efficiently.

## Features Implemented

### 1. **Citizen Portal**
- **Report Issues**: Submit civic issues with title, description, category, location, and optional image
- **Anonymous Reporting**: Option to report issues without revealing identity
- **Offline-First**: Simulated offline mode that stores reports locally and syncs when online
- **Browse Issues**: View all reported issues with filtering and sorting
- **Live Status Tracking**: Track issue progress from Submitted → Assigned → In Progress → Resolved
- **Community Engagement**: Upvote/downvote issues and add comments
- **Issue Details**: Comprehensive view with timeline, comments, and AI insights

### 2. **AI-Powered Intelligence**
- **Duplicate Detection**: Analyzes text, category, and location similarity
- **Smart Classification**: Auto-categorizes issues based on keywords
- **Urgency Scoring**: AI calculates urgency (0-100) based on keywords and community engagement
- **Severity Assessment**: Evaluates issue severity based on description and context
- **Department Routing**: Automatically assigns issues to the appropriate department
- **AI-Generated Summaries**: Creates concise summaries for officials

### 3. **Authority Dashboard**
- **Secure Login**: Role-based authentication for government officials
- **Real-Time Issue Queue**: View all issues with advanced filtering
  - Filter by department, status, urgency
  - Search functionality
  - AI insights for each issue
- **Issue Management**: 
  - Update issue status
  - Assign contractors
  - Add official comments
  - View full issue timeline
- **Contractor Assignment**: Assign pre-vetted contractors with ratings

### 4. **Analytics & Insights**
- **Resolution Rate**: Overall performance metrics
- **Department Performance**: Track efficiency by department
- **Trend Analysis**: 7-day reporting and resolution trends
- **Category Distribution**: Visual breakdown of issue types
- **Status Distribution**: Current state of all issues
- **Hotspot Analysis**: Identifies locations with recurring problems
- **AI-Generated Insights**: Automatic analysis and recommendations

### 5. **Trust & Transparency**
- **Public Timeline**: Every action is logged and visible
- **Trust Score**: Citizens build credibility through participation (85/100 demo score)
- **Official Comments**: Marked with "Official" badge
- **Contractor Transparency**: View assigned contractors and their ratings

## Demo Credentials

### Authority Login
- **Email**: `officer@janmarg.gov`
- **Password**: `admin123`

Or quick access:
- **Email**: `demo`
- **Password**: `demo`

## Sample Data
The platform includes 8 pre-populated issues covering:
- Roads (potholes, broken pavements)
- Water supply (leaks, shortages)
- Electricity (power outages)
- Sanitation (garbage overflow)
- Street lights (non-functional lights)
- Drainage (blocked drains, flooding)
- Public transport (damaged shelters)

## User Flows

### Citizen Flow
1. Land on homepage → Click "Report an Issue"
2. Fill in issue details (title, description, category, location)
3. Optionally upload image
4. Choose anonymous reporting if desired
5. Submit report
6. View in issue list with real-time status
7. Engage with comments and votes

### Authority Flow
1. Click "Authority Login"
2. Login with credentials
3. View dashboard with statistics
4. Navigate to Issue Queue
5. Filter/search for issues
6. Click "Manage" on an issue
7. Update status and assign contractor
8. Add action notes
9. View analytics for insights

## Technical Implementation
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Local storage with localStorage API
- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Components**: Custom component library (shadcn/ui style)
- **Date Handling**: date-fns
- **Notifications**: Sonner (toast notifications)

## AI Simulation Logic
All AI features are implemented with realistic algorithms:
- **Duplicate Detection**: Calculates similarity based on title (60%), description (40%), category match (30%), and location proximity (20%)
- **Classification**: Keyword matching against predefined category dictionaries
- **Urgency**: Base score + keyword boost + category weight + community engagement
- **Severity**: Base score + severe keywords + description length + image presence

## Storage Structure
All data is stored in localStorage with keys:
- `janmarg_issues`: All reported issues
- `janmarg_users`: User accounts
- `janmarg_current_user`: Active session
- `janmarg_pending_reports`: Offline queue

## Future Enhancements (Not Implemented)
- Real map integration (currently using mock locations)
- Real-time notifications
- Mobile app version
- WhatsApp/SMS integration
- Multi-language support
- Backend API integration
- Real authentication system
- File upload to cloud storage
- Advanced ML models for duplicate detection
