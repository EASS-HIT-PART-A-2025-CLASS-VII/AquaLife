import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AquariumService } from '../services/aquariumService';
import { TankMaintenanceService } from '../services/tankMaintenanceService';
import { TankMaintenance, TankMaintenanceCreate } from '../types/tankMaintenance';
import { 
  WrenchScrewdriverIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { calculateTankVolumeGallons, convertCmToInchesForDisplay } from '../utils/tankCalculations';

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
  onStatsUpdate: () => void;
}

export function Maintenance({ onStatsUpdate }: MaintenanceProps) {
  const { user } = useAuth();
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
    maintenance_date: new Date().toISOString().split('T')[0] + 'T10:00',
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
        maintenance_date: new Date(formData.maintenance_date!),
        maintenance_type: formData.maintenance_type!,
        description: formData.description || '',
        notes: formData.notes || '',
        completed: formData.completed || 0
      };

      await TankMaintenanceService.create(newMaintenance);
      setShowCreateForm(false);
      setFormData({
        maintenance_type: 'Water Change',
        description: '',
        notes: '',
        maintenance_date: new Date().toISOString().split('T')[0] + 'T10:00',
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
        maintenance_date: new Date(formData.maintenance_date!),
        maintenance_type: formData.maintenance_type!,
        description: formData.description || '',
        notes: formData.notes || '',
        completed: formData.completed || 0
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
      description: maintenanceItem.description || '',
      notes: maintenanceItem.notes || '',
      maintenance_date: new Date(maintenanceItem.maintenance_date).toISOString().slice(0, 16),
      completed: maintenanceItem.completed
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      maintenance_type: 'Water Change',
      description: '',
      notes: '',
      maintenance_date: new Date().toISOString().split('T')[0] + 'T10:00',
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
        description: maintenanceItem.description || '',
        notes: maintenanceItem.notes || '',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Aquarium Layout ({layouts.length} available)
              </label>
              <select
                value={selectedLayoutId || ''}
                onChange={(e) => setSelectedLayoutId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Choose a layout...</option>
                {layouts.map((layout) => {
                  const dimensions = convertCmToInchesForDisplay(layout.tank_length, layout.tank_width, layout.tank_height);
                  const volume = calculateTankVolumeGallons(layout.tank_length, layout.tank_width, layout.tank_height);
                  return (
                    <option key={layout.id} value={layout.id}>
                      {layout.tank_name} ({dimensions.length}×{dimensions.width}×{dimensions.height}" / {volume} gal)
                    </option>
                  );
                })}
              </select>
            </div>
          
          {selectedLayout && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-blue-900">{selectedLayout.tank_name}</h3>
                  <p className="text-sm text-blue-700">
                    {(() => {
                      const dimensions = convertCmToInchesForDisplay(selectedLayout.tank_length, selectedLayout.tank_width, selectedLayout.tank_height);
                      return `${dimensions.length}×${dimensions.width}×${dimensions.height}" • ${selectedLayout.water_type}`;
                    })()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Volume: {calculateTankVolumeGallons(selectedLayout.tank_length, selectedLayout.tank_width, selectedLayout.tank_height)} gallons
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLayout(selectedLayout.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center gap-1"
                  title="Delete entire tank layout"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete Tank
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {selectedLayoutId && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Maintenance Entry
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Create Maintenance Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Type
              </label>
              <select
                value={formData.maintenance_type}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="Water Change">Water Change</option>
                <option value="Filter Cleaning">Filter Cleaning</option>
                <option value="Feeding">Feeding</option>
                <option value="Tank Cleaning">Tank Cleaning</option>
                <option value="Water Testing">Water Testing</option>
                <option value="Equipment Check">Equipment Check</option>
                <option value="Plant Maintenance">Plant Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.maintenance_date}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenance_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Brief description of maintenance"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.completed}
                onChange={(e) => setFormData(prev => ({ ...prev, completed: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value={0}>Pending</option>
                <option value={1}>Completed</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Additional notes or observations"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Entry
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Maintenance Table */}
      {selectedLayoutId && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Maintenance History 
            {!isLoading && <span className="text-sm font-normal text-gray-500">({maintenance.length} entries)</span>}
          </h3>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading maintenance data...</p>
            </div>
          ) : maintenance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <WrenchScrewdriverIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No maintenance entries found for this aquarium.</p>
              <p className="text-sm">Click "Add Maintenance Entry" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-gray-900 font-semibold">Date</th>
                    <th className="text-left p-3 text-gray-900 font-semibold">Type</th>
                    <th className="text-left p-3 text-gray-900 font-semibold">Description</th>
                    <th className="text-left p-3 text-gray-900 font-semibold">Status</th>
                    <th className="text-left p-3 text-gray-900 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenance.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      {editingId === item.id ? (
                        <>
                          <td className="p-3">
                            <input
                              type="datetime-local"
                              value={formData.maintenance_date}
                              onChange={(e) => setFormData(prev => ({ ...prev, maintenance_date: e.target.value }))}
                              className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={formData.maintenance_type}
                              onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                              className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                            >
                              <option value="Water Change">Water Change</option>
                              <option value="Filter Cleaning">Filter Cleaning</option>
                              <option value="Feeding">Feeding</option>
                              <option value="Tank Cleaning">Tank Cleaning</option>
                              <option value="Water Testing">Water Testing</option>
                              <option value="Equipment Check">Equipment Check</option>
                              <option value="Plant Maintenance">Plant Maintenance</option>
                              <option value="Other">Other</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={formData.completed}
                              onChange={(e) => setFormData(prev => ({ ...prev, completed: Number(e.target.value) }))}
                              className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                            >
                              <option value={0}>Pending</option>
                              <option value={1}>Completed</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleUpdate(item.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1 text-gray-600 hover:text-gray-800"
                                title="Cancel"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-sm text-gray-900">
                            {new Date(item.maintenance_date).toLocaleDateString()} {new Date(item.maintenance_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {item.maintenance_type}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-900">{item.description || '-'}</td>
                          <td className="p-3">
                            <button
                              onClick={() => toggleCompleted(item)}
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.completed === 1
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {item.completed === 1 ? 'Completed' : 'Pending'}
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEdit(item)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 