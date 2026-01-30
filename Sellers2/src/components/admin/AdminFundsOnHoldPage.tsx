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
// TODO: Implement admin API calls

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
  const [funds, setFunds] = useState([]);
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
      // TODO: Implement get funds on hold API call
      const fundsData = { data: { funds: [] } };
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
      // TODO: Implement update fund hold status API call
      console.log('Updating fund status:', fundId, status, notes);
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
        <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700">
          <Download className="h-4 w-4" />
          Export Funds
        </button>
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
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
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
                <button className="px-3 py-1 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700 text-sm">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                
                {fund.status === 'held' && (
                  <>
                    <div>
                      <button 
                        onClick={() => {
                          const notes = prompt('Enter release notes:');
                          if (notes !== null) {
                            handleUpdateFundStatus(fund.id, 'released', notes);
                          }
                        }}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2 text-sm"
                      >
                        <DollarSign className="h-4 w-4" />
                        Release Funds
                      </button>
                    </div>
                    
                    <div>
                      <button 
                        onClick={() => {
                          const notes = prompt('Enter extension reason:');
                          if (notes !== null) {
                            handleUpdateFundStatus(fund.id, 'extended', notes);
                          }
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 text-sm"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Extend Hold
                      </button>
                    </div>
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