import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { AquariumService } from '../services/aquariumService';
import { TankMaintenanceService } from '../services/tankMaintenanceService';
import { TankMaintenance } from '../types/tankMaintenance';
import { Design } from './Design';
import { Maintenance } from './Maintenance';

type TabType = 'overview' | 'design' | 'maintenance';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
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

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'design', name: 'Design', icon: BeakerIcon },
    { id: 'maintenance', name: 'Maintenance', icon: WrenchScrewdriverIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'design':
        return <Design key={activeTab} />;
      case 'maintenance':
        return <Maintenance key={activeTab} onStatsUpdate={loadStats} />;
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{user?.first_name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium text-gray-900">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <BeakerIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalAquariums}</h3>
                  </div>
                  <p className="text-gray-600">Total Aquariums</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <WrenchScrewdriverIcon className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalMaintenance}</h3>
                  </div>
                  <p className="text-gray-600">Total Maintenance Tasks</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <PlusIcon className="h-6 w-6 text-orange-600 mr-2" />
                    <h3 className="text-2xl font-bold text-gray-800">{stats.pendingMaintenance}</h3>
                  </div>
                  <p className="text-gray-600">Pending Tasks</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Floating Sidebar */}
      <div className="fixed left-4 top-4 bottom-4 w-64 bg-white rounded-lg shadow-lg border z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">AquaLife</h1>
          
          {/* Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.first_name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{user?.first_name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h1>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 