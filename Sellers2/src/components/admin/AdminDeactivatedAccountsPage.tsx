import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function AdminDeactivatedAccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Deactivated Accounts</h1>
        <p className="text-gray-400 mt-1">Manage deactivated user accounts</p>
      </div>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-gray-400">
          Deactivated accounts management functionality coming soon.
        </CardContent>
      </Card>
    </div>
  );
}