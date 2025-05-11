import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-marine p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Button
            onClick={logout}
            className="bg-marine-light hover:bg-marine-light/80 text-white"
          >
            Logout
          </Button>
        </div>

        <Card className="bg-marine-light/30 border-2 border-marine-light/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Welcome, {user?.first_name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-white">
                <p className="font-semibold">Email: {user?.email}</p>
                <p className="font-semibold">Role: {user?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 