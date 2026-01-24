import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AdminTransactionsCommissionPageProps {
  adminRole: 'super-admin' | 'admin';
}

export function AdminTransactionsCommissionPage({ adminRole }: AdminTransactionsCommissionPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Transactions & Commission</h1>
        <p className="text-gray-400 mt-1">Manage transactions and commission tracking</p>
      </div>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-gray-400">
          Transactions and commission management functionality coming soon.
        </CardContent>
      </Card>
    </div>
  );
}