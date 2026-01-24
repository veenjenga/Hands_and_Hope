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
import adminApi from '../../services/adminApi';

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
      const reportsData = await adminApi.getReports(filters.status === 'all' ? 'all' : filters.status);
      setReports(reportsData.reports || []);
    } catch (err: any) {
      console.error('Error loading reports:', err);
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: string, resolutionNotes: string) => {
    try {
      await adminApi.updateReportStatus(reportId, status, resolutionNotes);
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
        <Button variant="outline" className="gap-2 border-gray-600 text-gray-300">
          <Download className="h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
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
            <Button variant="outline" className="gap-2 border-gray-600 text-gray-300">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
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
                <Button size="sm" variant="outline" className="gap-2 border-gray-600 text-gray-300">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
                
                {report.status === 'pending' && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="default" className="gap-2 bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4" />
                          Mark Resolved
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Resolve Report</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Mark this report as resolved and add resolution notes
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Resolution Notes</Label>
                            <Textarea 
                              id={`resolve-${report._id}`}
                              placeholder="Explain how this report was resolved..."
                              className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
                            />
                          </div>
                          <Button 
                            onClick={() => {
                              const textarea = document.getElementById(`resolve-${report._id}`) as HTMLTextAreaElement;
                              handleUpdateReportStatus(report._id, 'resolved', textarea.value);
                            }}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Confirm Resolution
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="gap-2">
                          <XCircle className="h-4 w-4" />
                          Escalate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Escalate Report</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Escalate this report to higher authorities
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Escalation Reason</Label>
                            <Textarea 
                              id={`escalate-${report._id}`}
                              placeholder="Explain why this report needs escalation..."
                              className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
                            />
                          </div>
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              const textarea = document.getElementById(`escalate-${report._id}`) as HTMLTextAreaElement;
                              handleUpdateReportStatus(report._id, 'escalated', textarea.value);
                            }}
                          >
                            Confirm Escalation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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