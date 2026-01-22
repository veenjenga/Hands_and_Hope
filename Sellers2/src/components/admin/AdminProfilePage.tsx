import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Profile</h1>
        <p className="text-gray-400 mt-1">Manage your administrator account</p>
      </div>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-gray-400">
          Admin profile management page - Coming soon
        </CardContent>
      </Card>
    </div>
  );
}
