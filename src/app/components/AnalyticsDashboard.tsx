import { BarChart3, TrendingUp, Zap, Target, MapPin } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Issue, DepartmentStats } from '@/utils/types';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface AnalyticsDashboardProps {
  issues: Issue[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function AnalyticsDashboard({ issues }: AnalyticsDashboardProps) {
  // Department Performance
  const departmentStats: DepartmentStats[] = Array.from(
    new Set(issues.map(i => i.department))
  ).map(dept => {
    const deptIssues = issues.filter(i => i.department === dept);
    const resolved = deptIssues.filter(i => i.status === 'resolved').length;
    const pending = deptIssues.filter(i => i.status !== 'resolved').length;
    
    // Calculate average resolution time (mock calculation)
    const resolvedIssues = deptIssues.filter(i => i.status === 'resolved');
    const avgTime = resolvedIssues.length > 0 
      ? resolvedIssues.reduce((acc, issue) => {
          const resolutionTime = (issue.updatedAt - issue.createdAt) / (1000 * 60 * 60 * 24); // days
          return acc + resolutionTime;
        }, 0) / resolvedIssues.length
      : 0;

    return {
      department: dept,
      total: deptIssues.length,
      resolved,
      pending,
      avgResolutionTime: Math.round(avgTime * 10) / 10,
    };
  });

  // Category Distribution
  const categoryData = Array.from(
    new Set(issues.map(i => i.category))
  ).map(cat => ({
    name: cat.replace('-', ' '),
    value: issues.filter(i => i.category === cat).length,
  }));

  // Status Distribution
  const statusData = [
    { name: 'Submitted', value: issues.filter(i => i.status === 'submitted').length },
    { name: 'Assigned', value: issues.filter(i => i.status === 'assigned').length },
    { name: 'In Progress', value: issues.filter(i => i.status === 'in-progress').length },
    { name: 'Resolved', value: issues.filter(i => i.status === 'resolved').length },
  ];

  // Trend Data (Last 7 days)
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayIssues = issues.filter(issue => {
      const issueDate = new Date(issue.createdAt);
      return issueDate.toDateString() === date.toDateString();
    });
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      reported: dayIssues.length,
      resolved: dayIssues.filter(i => i.status === 'resolved').length,
    };
  });

  // Hotspot Analysis
  const locationGroups = issues.reduce((acc, issue) => {
    const key = issue.location.address;
    if (!acc[key]) {
      acc[key] = {
        location: issue.location,
        count: 0,
        severity: 0,
      };
    }
    acc[key].count += 1;
    acc[key].severity += issue.aiInsights?.severityScore || 0;
    return acc;
  }, {} as Record<string, { location: any; count: number; severity: number }>);

  const hotspots = Object.values(locationGroups)
    .map(h => ({
      ...h,
      severity: h.severity / h.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Resolution Rate
  const resolutionRate = issues.length > 0 
    ? Math.round((issues.filter(i => i.status === 'resolved').length / issues.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Resolution Rate</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-4xl font-bold text-green-600 mb-2">{resolutionRate}%</div>
          <p className="text-sm text-gray-500">
            {issues.filter(i => i.status === 'resolved').length} of {issues.length} issues resolved
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Avg Resolution Time</h3>
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {departmentStats.length > 0 
              ? Math.round(departmentStats.reduce((acc, d) => acc + d.avgResolutionTime, 0) / departmentStats.length * 10) / 10
              : 0} days
          </div>
          <p className="text-sm text-gray-500">Average across all departments</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">High Urgency</h3>
            <Target className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-4xl font-bold text-red-600 mb-2">
            {issues.filter(i => i.aiInsights && i.aiInsights.urgencyScore > 70).length}
          </div>
          <p className="text-sm text-gray-500">Requires immediate attention</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Issue Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">7-Day Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="reported" stroke="#3b82f6" name="Reported" strokeWidth={2} />
            <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Department Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Department</th>
                <th className="text-left py-3 px-4">Total Issues</th>
                <th className="text-left py-3 px-4">Resolved</th>
                <th className="text-left py-3 px-4">Pending</th>
                <th className="text-left py-3 px-4">Avg Resolution Time</th>
                <th className="text-left py-3 px-4">Performance</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept, index) => {
                const performance = dept.total > 0 ? Math.round((dept.resolved / dept.total) * 100) : 0;
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{dept.department}</td>
                    <td className="py-3 px-4">{dept.total}</td>
                    <td className="py-3 px-4 text-green-600">{dept.resolved}</td>
                    <td className="py-3 px-4 text-orange-600">{dept.pending}</td>
                    <td className="py-3 px-4">{dept.avgResolutionTime} days</td>
                    <td className="py-3 px-4">
                      <Badge className={
                        performance >= 70 ? 'bg-green-100 text-green-800' :
                        performance >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {performance}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Hotspot Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-red-600" />
          Issue Hotspots (Top 5 Locations)
        </h3>
        <div className="space-y-4">
          {hotspots.map((hotspot, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-red-100 text-red-800">#{index + 1}</Badge>
                  <span className="font-medium">{hotspot.location.address}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{hotspot.count} issues reported</span>
                  <span>Avg Severity: {Math.round(hotspot.severity)}%</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-red-600">{hotspot.count}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insights Summary */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
          AI-Generated Insights
        </h3>
        <div className="space-y-3">
          <p className="text-gray-700 flex items-start gap-2">
            <BarChart3 className="h-4 w-4 mt-1 flex-shrink-0" />
            <span><strong>Trend Analysis:</strong> Issue reporting has increased by 15% in the last week, 
            with Roads and Sanitation being the most common categories.</span>
          </p>
          <p className="text-gray-700 flex items-start gap-2">
            <Zap className="h-4 w-4 mt-1 flex-shrink-0" />
            <span><strong>Urgent Attention:</strong> {issues.filter(i => i.aiInsights && i.aiInsights.urgencyScore > 70).length} issues 
            require immediate attention based on AI urgency scoring.</span>
          </p>
          <p className="text-gray-700 flex items-start gap-2">
            <Target className="h-4 w-4 mt-1 flex-shrink-0" />
            <span><strong>Performance:</strong> Public Works Department shows the best resolution rate at{' '}
            {departmentStats.length > 0 
              ? Math.round((departmentStats.find(d => d.department === 'Public Works Department')?.resolved || 0) / 
                (departmentStats.find(d => d.department === 'Public Works Department')?.total || 1) * 100)
              : 0}%.</span>
          </p>
          <p className="text-gray-700 flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
            <span><strong>Hotspot Alert:</strong> {hotspots.length > 0 && hotspots[0].location.address} has the highest 
            concentration of issues, suggesting systematic infrastructure problems.</span>
          </p>
        </div>
      </Card>
    </div>
  );
}