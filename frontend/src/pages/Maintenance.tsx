import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AquariumService } from '../services/aquariumService';
import { TankMaintenanceService } from '../services/tankMaintenanceService';
import { TankMaintenance } from '../types/tankMaintenance';
import { 
  WrenchScrewdriverIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { calculateTankVolumeGallons, convertCmToInchesForDisplay } from '../utils/tankCalculations';

interface TankMaintenanceCreate {
  layout_id: number;
  owner_email: string;
  maintenance_date: Date;
  maintenance_type: string;
  description: string;
  notes: string;
  completed: number;
}

interface AquariumLayout {
  id: number;
  tank_name: string;
  owner_email: string;
  tank_length: number;
  tank_width: number;
  tank_height: number;
  water_type: string;
  created_at: string;
}

interface MaintenanceProps {
  readonly onStatsUpdate: () => void;
}

export function Maintenance({ onStatsUpdate }: MaintenanceProps) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [layouts, setLayouts] = useState<AquariumLayout[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<number | null>(null);
  const [maintenance, setMaintenance] = useState<TankMaintenance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TankMaintenanceCreate>>({
    maintenance_type: 'Water Change',
    description: '',
    notes: '',
    maintenance_date: new Date(),
    completed: 0
  });

  useEffect(() => {
    if (user?.email) {
      loadLayouts();
    }
  }, [user?.email]);

  useEffect(() => {
    if (selectedLayoutId) {
      loadMaintenance();
    }
  }, [selectedLayoutId]);

  const loadLayouts = async () => {
    try {
      console.log('Loading layouts for user:', user?.email);
      const userLayouts = await AquariumService.getLayoutsByOwner(user?.email ?? '');
      console.log('Loaded layouts:', userLayouts);
      setLayouts(userLayouts);
      if (userLayouts.length > 0 && !selectedLayoutId) {
        setSelectedLayoutId(userLayouts[0].id);
      }
    } catch (error) {
      console.error('Error loading layouts:', error);
    }
  };

  const loadMaintenance = async () => {
    if (!selectedLayoutId) return;
    
    setIsLoading(true);
    try {
      const maintenanceData = await TankMaintenanceService.getByLayout(selectedLayoutId);
      setMaintenance(maintenanceData);
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!selectedLayoutId || !user?.email) return;

    try {
      const newMaintenance: TankMaintenanceCreate = {
        layout_id: selectedLayoutId,
        owner_email: user.email,
        maintenance_date: formData.maintenance_date ?? new Date(),
        maintenance_type: formData.maintenance_type ?? 'Water Change',
        description: formData.description ?? '',
        notes: formData.notes ?? '',
        completed: formData.completed ?? 0
      };

      await TankMaintenanceService.create(newMaintenance);
      setShowCreateForm(false);
      setFormData({
        maintenance_type: 'Water Change',
        description: '',
        notes: '',
        maintenance_date: new Date(),
        completed: 0
      });
      // Add small delay to ensure transaction is committed
      setTimeout(() => {
        loadMaintenance();
      }, 100);
      onStatsUpdate();
    } catch (error) {
      console.error('Error creating maintenance entry:', error);
      alert('Failed to create maintenance entry');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!user?.email) return;

    try {
      const updateData: TankMaintenanceCreate = {
        layout_id: selectedLayoutId!,
        owner_email: user.email,
        maintenance_date: formData.maintenance_date ?? new Date(),
        maintenance_type: formData.maintenance_type ?? 'Water Change',
        description: formData.description ?? '',
        notes: formData.notes ?? '',
        completed: formData.completed ?? 0
      };

      await TankMaintenanceService.update(id, updateData);
      setEditingId(null);
      loadMaintenance();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating maintenance entry:', error);
      alert('Failed to update maintenance entry');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this maintenance entry?')) return;

    try {
      await TankMaintenanceService.delete(id, user?.email ?? '');
      setTimeout(() => {
        loadMaintenance();
      }, 100);
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting maintenance entry:', error);
      alert('Failed to delete maintenance entry');
    }
  };

  const handleDeleteLayout = async (layoutId: number) => {
    if (!confirm('Are you sure you want to delete this entire tank layout? This will permanently delete the tank and ALL its maintenance records.')) return;

    try {
      await AquariumService.deleteLayout(layoutId);
      
      // Refresh all data and reset state
      setSelectedLayoutId(null); // Clear selection since layout is deleted
      setMaintenance([]); // Clear maintenance list
      await loadLayouts(); // Refresh layouts list
      onStatsUpdate(); // Update dashboard stats
      
      alert('Tank layout deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting tank layout:', error);
      
      // Check if it's a foreign key constraint error
      if (error.message && (error.message.includes('foreign key') || error.message.includes('referenced'))) {
        alert('Ah! Cannot delete layout before deleting maintenance, delete Tank maintenance first');
      } else {
        alert('Failed to delete tank layout: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const startEdit = (maintenanceItem: TankMaintenance) => {
    setEditingId(maintenanceItem.id);
    setFormData({
      maintenance_type: maintenanceItem.maintenance_type,
      description: maintenanceItem.description ?? '',
      notes: maintenanceItem.notes ?? '',
      maintenance_date: new Date(maintenanceItem.maintenance_date),
      completed: maintenanceItem.completed
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      maintenance_type: 'Water Change',
      description: '',
      notes: '',
      maintenance_date: new Date(),
      completed: 0
    });
  };

  const toggleCompleted = async (maintenanceItem: TankMaintenance) => {
    if (!user?.email) return;

    try {
      const updateData: TankMaintenanceCreate = {
        layout_id: maintenanceItem.layout_id,
        owner_email: user.email,
        maintenance_date: new Date(maintenanceItem.maintenance_date),
        maintenance_type: maintenanceItem.maintenance_type,
        description: maintenanceItem.description ?? '',
        notes: maintenanceItem.notes ?? '',
        completed: maintenanceItem.completed === 1 ? 0 : 1
      };

      await TankMaintenanceService.update(maintenanceItem.id, updateData);
      loadMaintenance();
      onStatsUpdate();
    } catch (error) {
      console.error('Error toggling maintenance status:', error);
    }
  };

  const selectedLayout = layouts.find(l => l.id === selectedLayoutId);

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div className={`rounded-lg shadow p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
          <WrenchScrewdriverIcon className="h-6 w-6 mr-2 text-gray-700 dark:text-gray-300" />
          Tank Maintenance
        </h2>
        
        {/* Tank Selection Dropdown */}
        <div className="mb-6">
          <label htmlFor="tank-select" className={`block text-base font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'} mb-2`}>
            Select Tank
          </label>
          <select
            id="tank-select"
            value={selectedLayoutId || ''}
            onChange={(e) => setSelectedLayoutId(Number(e.target.value))}
            className={`block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
          >
            {layouts.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.tank_name}
              </option>
            ))}
          </select>
        </div>

        {/* Tank Properties */}
        {selectedLayout && (
          <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>{selectedLayout.tank_name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-black'} font-medium`}>
                <span className="font-semibold">Dimensions:</span> {(() => {
                  const dimensions = convertCmToInchesForDisplay(selectedLayout.tank_length, selectedLayout.tank_width, selectedLayout.tank_height);
                  return `${dimensions.length}" × ${dimensions.width}" × ${dimensions.height}"`;
                })()}
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-black'} font-medium`}>
                <span className="font-semibold">Volume:</span> {calculateTankVolumeGallons(selectedLayout.tank_length, selectedLayout.tank_width, selectedLayout.tank_height)} gallons
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-black'} font-medium`}>
                <span className="font-semibold">Water Type:</span> {selectedLayout.water_type}
              </div>
            </div>
          </div>
        )}

        {/* Add Maintenance Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            }`}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Maintenance
        </button>

        {/* Maintenance History */}
        <div className="mt-8">
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Maintenance History</h3>
          <div className="space-y-4">
            {maintenance.map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-lg border transition-all duration-200
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${item.completed === 1 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {item.maintenance_type}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>
                        {new Date(item.maintenance_date).toLocaleDateString()} {new Date(item.maintenance_date).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                      <span className="font-medium">Description:</span>
                      <span>{item.description}</span>
                      {item.notes && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium">Notes:</span>
                          <span>{item.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleCompleted(item)}
                      className={`p-2 rounded-full transition-colors
                        ${item.completed === 1
                          ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30'
                          : 'text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700'
                        }`}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Add Maintenance Record</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="maintenance_type" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'} mb-1`}>
                  Type
                </label>
                <select
                  id="maintenance_type"
                  value={formData.maintenance_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                >
                  <option value="Water Change">Water Change</option>
                  <option value="Filter Maintenance">Filter Maintenance</option>
                  <option value="Water Testing">Water Testing</option>
                  <option value="Feeding">Feeding</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="maintenance_date" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'} mb-1`}>
                  Date
                </label>
                <input
                  type="datetime-local"
                  id="maintenance_date"
                  value={formData.maintenance_date?.toISOString().slice(0, 16) ?? ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, maintenance_date: new Date(e.target.value) }))}
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="description" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'} mb-1`}>
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="notes" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'} mb-1`}>
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium
                    ${isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 