import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { AlertTriangle, Eye, Download, Search, Filter, DollarSign, Calendar, Clock, TrendingUp, Percent } from 'lucide-react';
import adminApi from '../../services/adminApi';

interface AdminTransactionsCommissionPageProps {
  adminRole: 'super-admin' | 'admin';
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'sale' | 'purchase' | 'withdrawal' | 'commission';
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  product?: string;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
}

interface CommissionStats {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  totalTransactions: number;
  avgCommissionRate: number;
}

export function AdminTransactionsCommissionPage({ adminRole }: AdminTransactionsCommissionPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    loadTransactions();
    loadCommissionStats();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('type', 'all');
      params.append('timeframe', timeRange);
      
      const transactionsData = await adminApi.getTransactions({ timeframe: timeRange });
      setTransactions(transactionsData.transactions || []);
    } catch (err: any) {
      console.error('Error loading transactions:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadCommissionStats = async () => {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll calculate from the transactions
      const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
      const totalCommission = transactions.reduce((sum, t) => sum + t.commissionAmount, 0);
      
      setStats({
        totalRevenue,
        totalCommission,
        netRevenue: totalRevenue - totalCommission,
        totalTransactions: transactions.length,
        avgCommissionRate: transactions.length ? transactions.reduce((sum, t) => sum + t.commissionRate, 0) / transactions.length : 0
      });
    } catch (err: any) {
      console.error('Error loading commission stats:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Transactions & Commission</h1>
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Transactions & Commission</h1>
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Transactions & Commission</h1>
        <p className="text-gray-400 mt-1">Manage transactions and commission tracking</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Total Revenue</p>
                <h2 className="text-2xl font-bold text-white mt-2">${stats?.totalRevenue.toFixed(2) || '0.00'}</h2>
              </div>
              <DollarSign className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Total Commission</p>
                <h2 className="text-2xl font-bold text-white mt-2">${stats?.totalCommission.toFixed(2) || '0.00'}</h2>
              </div>
              <Percent className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Net Revenue</p>
                <h2 className="text-2xl font-bold text-white mt-2">${stats?.netRevenue.toFixed(2) || '0.00'}</h2>
              </div>
              <TrendingUp className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-100">Total Transactions</p>
                <h2 className="text-2xl font-bold text-white mt-2">{stats?.totalTransactions || 0}</h2>
              </div>
              <TrendingUp className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-600 to-pink-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-100">Avg. Commission Rate</p>
                <h2 className="text-2xl font-bold text-white mt-2">{(stats?.avgCommissionRate || 0).toFixed(2)}%</h2>
              </div>
              <Percent className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2 border-gray-600 text-gray-300">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Product</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Commission</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-gray-700 hover:bg-gray-700/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">{transaction.userName}</p>
                            <p className="text-sm text-gray-400">{transaction.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.type === 'sale' ? 'default' :
                            transaction.type === 'purchase' ? 'secondary' :
                            transaction.type === 'withdrawal' ? 'outline' : 'destructive'
                          }>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-300">{transaction.product || 'N/A'}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-green-400">${transaction.amount.toFixed(2)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-orange-400">${transaction.commissionAmount.toFixed(2)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-400">{transaction.date}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-gray-400 text-center">
              <Percent className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p>Commission management and rate adjustment functionality coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-gray-400 text-center">
              <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p>Detailed commission reports and analytics coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}