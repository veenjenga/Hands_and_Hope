import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Moderation</h1>
        <p className="text-gray-400 mt-1">Review user reports and moderation issues</p>
      </div>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-gray-400">
          Reports and moderation page - Coming soon
        </CardContent>
      </Card>
    </div>
  );
}
