import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { AquariumService } from '../services/aquariumService';
import { TankMaintenanceService } from '../services/tankMaintenanceService';
import { TankMaintenance } from '../types/tankMaintenance';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalAquariums: 0,
    totalMaintenance: 0,
    pendingMaintenance: 0
  });

  useEffect(() => {
    if (user?.email) {
      loadStats();
    }
  }, [user?.email]);

  const loadStats = async () => {
    try {
      const [layouts, maintenance] = await Promise.all([
        AquariumService.getLayoutsByOwner(user?.email ?? ''),
        TankMaintenanceService.getByOwner(user?.email ?? '') as Promise<TankMaintenance[]>
      ]);

      setStats({
        totalAquariums: layouts.length,
        totalMaintenance: maintenance.length,
        pendingMaintenance: maintenance.filter((m: TankMaintenance) => m.completed === 0).length
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Info Card */}
        <div className="md:col-span-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              User Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <UserIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user?.first_name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <BeakerIcon className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold">{stats.totalAquariums}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Total Aquariums
                </p>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold">{stats.totalMaintenance}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Total Maintenance Tasks
                </p>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <PlusIcon className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold">{stats.pendingMaintenance}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Pending Tasks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 