import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { AlertTriangle, Eye, Download, Search, Filter, DollarSign, Calendar, Clock } from 'lucide-react';
import adminApi from '../../services/adminApi';

interface Fund {
  id: string;
  amount: number;
  userName: string;
  userEmail: string;
  status: 'held' | 'released' | 'extended';
  holdDate: string;
  reason: string;
  releaseDate?: string;
  notes: string;
}

export function AdminFundsOnHoldPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    loadFundsOnHold();
  }, []);

  const loadFundsOnHold = async () => {
    try {
      setLoading(true);
      setError(null);
      const fundsData = await adminApi.getFundsOnHold(filters.status === 'all' ? 'all' : filters.status);
      setFunds(fundsData.data?.funds || []);
    } catch (err: any) {
      console.error('Error loading funds on hold:', err);
      setError(err.message || 'Failed to load funds on hold');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFundStatus = async (fundId: string, status: string, notes: string) => {
    try {
      await adminApi.updateFundHoldStatus(fundId, status, notes);
      alert(`Fund ${status} successfully!`);
      loadFundsOnHold(); // Reload funds
    } catch (err: any) {
      console.error('Error updating fund status:', err);
      alert(`Error updating fund status: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Funds On Hold</h1>
          <p className="text-gray-400">Loading funds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Funds On Hold</h1>
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Funds On Hold</h1>
          <p className="text-gray-400 mt-1">Manage held funds and releases</p>
        </div>
        <Button variant="outline" className="gap-2 border-gray-600 text-gray-300">
          <Download className="h-4 w-4" />
          Export Funds
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search funds..."
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
                <SelectItem value="held">Held</SelectItem>
                <SelectItem value="released">Released</SelectItem>
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
        {funds
          .filter(fund => 
            filters.search === '' || 
            fund.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
            fund.userEmail.toLowerCase().includes(filters.search.toLowerCase())
          )
          .map((fund) => (
          <Card key={fund.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    ${fund.amount.toFixed(2)} - {fund.userName}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">{fund.userEmail}</p>
                </div>
                <div className="text-right">
                  <Badge variant={fund.status === 'held' ? 'default' : 'secondary'}>
                    {fund.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Hold Date: {fund.holdDate}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <Label className="text-gray-400">Reason for Hold</Label>
                  <p className="text-white mt-1">{fund.reason}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Expected Release</Label>
                  <p className="text-white mt-1">{fund.releaseDate || 'Pending review'}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <Label className="text-gray-400">Notes</Label>
                <p className="text-gray-300 mt-1">{fund.notes}</p>
              </div>
              
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="gap-2 border-gray-600 text-gray-300">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
                
                {fund.status === 'held' && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="default" className="gap-2 bg-green-600 hover:bg-green-700">
                          <DollarSign className="h-4 w-4" />
                          Release Funds
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Release Funds</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Confirm releasing these funds and add release notes
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Release Notes</Label>
                            <Textarea 
                              id={`release-${fund.id}`}
                              placeholder="Explain why these funds are being released..."
                              className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
                            />
                          </div>
                          <Button 
                            onClick={() => {
                              const textarea = document.getElementById(`release-${fund.id}`) as HTMLTextAreaElement;
                              handleUpdateFundStatus(fund.id, 'released', textarea.value);
                            }}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Confirm Release
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Extend Hold
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Extend Hold</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Extend the hold on these funds and add extension notes
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Extension Reason</Label>
                            <Textarea 
                              id={`extend-${fund.id}`}
                              placeholder="Explain why the hold is being extended..."
                              className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
                            />
                          </div>
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              const textarea = document.getElementById(`extend-${fund.id}`) as HTMLTextAreaElement;
                              handleUpdateFundStatus(fund.id, 'extended', textarea.value);
                            }}
                          >
                            Confirm Extension
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
        
        {funds.filter(fund => 
          filters.search === '' || 
          fund.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
          fund.userEmail.toLowerCase().includes(filters.search.toLowerCase())
        ).length === 0 && (
          <Card className="bg-gray-800 border-gray-700 p-12 text-center">
            <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white">No Funds on Hold</h3>
            <p className="text-gray-400 mt-2">No funds currently held</p>
          </Card>
        )}
      </div>
    </div>
  );
}