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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
          <WrenchScrewdriverIcon className="h-6 w-6 mr-2 text-gray-700" />
          Tank Maintenance
        </h2>
        
        {layouts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <WrenchScrewdriverIcon className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-semibold text-yellow-800">No Tank Layouts Found</h3>
                <p className="text-yellow-700 text-sm">
                  You need to create a tank layout first. Go to the <strong>Design</strong> tab to create your first aquarium layout.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <select
                value={selectedLayoutId ?? ''}
                onChange={(e) => setSelectedLayoutId(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a tank</option>
                {layouts.map((layout) => (
                  <option key={layout.id} value={layout.id}>
                    {layout.tank_name} ({layout.water_type})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCreateForm(true)}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Maintenance
              </button>
            </div>

            {selectedLayout && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedLayout.tank_name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Dimensions:</span>{' '}
                    {(() => {
                      const dimensions = convertCmToInchesForDisplay(selectedLayout.tank_length, selectedLayout.tank_width, selectedLayout.tank_height);
                      return `${dimensions.length}" × ${dimensions.width}" × ${dimensions.height}"`;
                    })()}
                  </div>
                  <div>
                    <span className="text-gray-500">Volume:</span>{' '}
                    {`${calculateTankVolumeGallons(selectedLayout.tank_length, selectedLayout.tank_width, selectedLayout.tank_height)} gallons`}
                  </div>
                  <div>
                    <span className="text-gray-500">Water Type:</span>{' '}
                    {selectedLayout.water_type}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Maintenance List */}
      {selectedLayoutId && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Maintenance History</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : maintenance.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No maintenance records found</div>
            ) : (
              maintenance.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50">
                  {editingId === item.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="maintenance_type" className="block text-sm font-medium text-gray-700">
                            Type
                          </label>
                          <select
                            id="maintenance_type"
                            value={formData.maintenance_type}
                            onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="Water Change">Water Change</option>
                            <option value="Filter Maintenance">Filter Maintenance</option>
                            <option value="Water Testing">Water Testing</option>
                            <option value="Feeding">Feeding</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="maintenance_date" className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <input
                            type="datetime-local"
                            id="maintenance_date"
                            value={formData.maintenance_date?.toISOString().slice(0, 16) ?? ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, maintenance_date: new Date(e.target.value) }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <input
                          type="text"
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.completed === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.completed === 1 ? 'Completed' : 'Pending'}
                          </span>
                          <span className="ml-2 text-sm font-medium text-gray-900">{item.maintenance_type}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {new Date(item.maintenance_date).toLocaleString()}
                        </div>
                        {item.description && (
                          <div className="mt-1 text-sm text-gray-700">{item.description}</div>
                        )}
                        {item.notes && (
                          <div className="mt-2 text-sm text-gray-600">{item.notes}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCompleted(item)}
                          className={`p-2 rounded-full ${
                            item.completed === 1
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-yellow-600 hover:bg-yellow-100'
                          }`}
                        >
                          {item.completed === 1 ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            <XMarkIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(item)}
                          className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Maintenance Record</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="create_maintenance_type" className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    id="create_maintenance_type"
                    value={formData.maintenance_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Water Change">Water Change</option>
                    <option value="Filter Maintenance">Filter Maintenance</option>
                    <option value="Water Testing">Water Testing</option>
                    <option value="Feeding">Feeding</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="create_maintenance_date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    id="create_maintenance_date"
                    value={formData.maintenance_date?.toISOString().slice(0, 16) ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maintenance_date: new Date(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="create_description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="create_description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="create_notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="create_notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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