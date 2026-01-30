import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AlertTriangle, Eye, CheckCircle, XCircle, Search, Filter, Download } from 'lucide-react';
// TODO: Implement admin API calls

export function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement get reports API call
      const reportsData = { data: { reports: [] } };
      setReports(reportsData.data.reports || []);
    } catch (err: any) {
      console.error('Error loading reports:', err);
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: string, resolutionNotes: string) => {
    try {
      // TODO: Implement update report status API call
      console.log('Updating report status:', reportId, status, resolutionNotes);
      alert(`Report ${status} successfully!`);
      loadReports(); // Reload reports
    } catch (err: any) {
      alert(`Error updating report status: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 mt-1">Manage user reports and complaints</p>
        </div>
        <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700">
          <Download className="h-4 w-4" />
          Export Reports
        </button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report._id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Report #{report._id?.substring(0, 8)}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Reported by: {report.reporterId?.name || report.reporterId}</p>
                  <p className="text-sm text-gray-400">Against: {report.reportedUserId?.name || report.reportedUserId}</p>
                </div>
                <div className="text-right">
                  <Badge variant={report.status === 'pending' ? 'default' : report.status === 'resolved' ? 'secondary' : 'outline'}>
                    {report.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-300">{report.reason}</p>
              </div>
              
              <div className="flex gap-3">
                <button className="px-3 py-1 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700 text-sm">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                
                {report.status === 'pending' && (
                  <>
                    <div>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Mark Resolved
                      </button>
                    </div>
                    
                    <div>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 text-sm">
                        <XCircle className="h-4 w-4" />
                        Escalate
                      </button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {reports.length === 0 && (
          <Card className="bg-gray-800 border-gray-700 p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white">No Reports Found</h3>
            <p className="text-gray-400 mt-2">No reports match your current filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}