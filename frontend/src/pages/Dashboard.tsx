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
import { useTheme } from '../contexts/ThemeContext';
import { AquariumService } from '../services/aquariumService';
import { TankMaintenanceService } from '../services/tankMaintenanceService';
import { TankMaintenance } from '../types/tankMaintenance';
import { Design } from './Design';
import { Maintenance } from './Maintenance';

type TabType = 'overview' | 'design' | 'maintenance';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
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
            <div className={`rounded-2xl backdrop-blur-xl shadow-2xl border p-6 
              ${isDarkMode 
                ? 'bg-white/10 border-white/20 shadow-gray-900/30' 
                : 'bg-white/40 border-gray-200/50 shadow-gray-200/30'
              }`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`flex items-center p-4 rounded-xl backdrop-blur-md border
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
                  } transition-all duration-300`}>
                  <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.first_name}</p>
                  </div>
                </div>
                <div className={`flex items-center p-4 rounded-xl backdrop-blur-md border
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
                  } transition-all duration-300`}>
                  <EnvelopeIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.email}</p>
                  </div>
                </div>
                <div className={`flex items-center p-4 rounded-xl backdrop-blur-md border
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
                  } transition-all duration-300`}>
                  <ShieldCheckIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Role</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`rounded-2xl backdrop-blur-xl shadow-2xl border p-6 
              ${isDarkMode 
                ? 'bg-white/10 border-white/20 shadow-gray-900/30' 
                : 'bg-white/40 border-gray-200/50 shadow-gray-200/30'
              }`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Quick Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`rounded-xl p-4 backdrop-blur-md border
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
                  } transition-all duration-300`}>
                  <div className="flex items-center mb-2">
                    <BeakerIcon className="h-6 w-6 text-blue-500 mr-2" />
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalAquariums}</h3>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Aquariums</p>
                </div>
                <div className={`rounded-xl p-4 backdrop-blur-md border
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
                  } transition-all duration-300`}>
                  <div className="flex items-center mb-2">
                    <WrenchScrewdriverIcon className="h-6 w-6 text-green-500 mr-2" />
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalMaintenance}</h3>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Maintenance Tasks</p>
                </div>
                <div className={`rounded-xl p-4 backdrop-blur-md border
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
                  } transition-all duration-300`}>
                  <div className="flex items-center mb-2">
                    <PlusIcon className="h-6 w-6 text-orange-500 mr-2" />
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.pendingMaintenance}</h3>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending Tasks</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Background Gradient Layer */}
      <div className={`fixed inset-0 transition-colors duration-200 
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' 
          : 'bg-gradient-to-br from-gray-100 via-blue-50/50 to-purple-50/50'
        }`}
      />

      {/* Floating Sidebar */}
      <div className={`fixed left-4 top-4 bottom-4 w-64 rounded-lg shadow-2xl border backdrop-blur-xl z-20 
        ${isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/10' 
          : 'bg-white/40 border-gray-200/50 hover:bg-white/60'
        } transition-all duration-300`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>AquaLife</h1>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-yellow-600/80 hover:bg-yellow-600 text-white' 
                  : 'bg-gray-700/80 hover:bg-gray-700 text-white'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 hover:scale-[1.02] hover:translate-x-1 ${
                    activeTab === item.id
                      ? isDarkMode 
                        ? 'bg-blue-900/30 text-blue-300 border border-blue-600/50 backdrop-blur-md' 
                        : 'bg-blue-100/80 text-blue-700 border border-blue-200/50 backdrop-blur-md'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-sm'
                        : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 backdrop-blur-sm'
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
        <div className={`absolute bottom-0 left-0 right-0 p-6 border-t backdrop-blur-md
          ${isDarkMode 
            ? 'border-white/10 bg-white/5' 
            : 'border-gray-200/50 bg-white/40'
          }`}>
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-500/80 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.first_name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user?.first_name}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className={`w-full px-4 py-2 text-sm border rounded-md transition-all duration-300 hover:scale-[1.02] ${
              isDarkMode
                ? 'text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                : 'text-gray-700 hover:text-gray-900 border-gray-200/50 hover:bg-white/60'
            }`}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-6 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="mb-6">
              <h1 className={`text-3xl font-bold capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Dashboard Overview
              </h1>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 