import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../contexts/AuthContext';
import { TankMaintenanceService } from '../services/tankMaintenanceService';
import { AquariumService } from '../services/aquariumService';
import { TankMaintenanceCreate, TankMaintenance } from '../types/tankMaintenance';

interface AquariumLayout {
  id: number;
  tank_name: string;
  owner_email: string;
  created_at: string;
  updated_at: string;
}

const Tank: React.FC = () => {
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState<TankMaintenanceCreate>({
    layout_id: 0,
    owner_email: user?.email ?? '',
    maintenance_date: new Date(),
    maintenance_type: '',
    description: '',
    notes: '',
    completed: 0,
  });
  const [layouts, setLayouts] = useState<AquariumLayout[]>([]);
  const [maintenanceEntries, setMaintenanceEntries] = useState<TankMaintenance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadUserLayouts();
      loadMaintenanceEntries();
    }
  }, [user?.email]);

  const loadUserLayouts = async () => {
    try {
      const userLayouts = await AquariumService.getLayoutsByOwner(user?.email ?? '');
      setLayouts(userLayouts);
    } catch (error) {
      console.error('Error loading user layouts:', error);
    }
  };

  const loadMaintenanceEntries = async () => {
    try {
      const entries = await TankMaintenanceService.getByOwner(user?.email ?? '');
      setMaintenanceEntries(entries);
    } catch (error) {
      console.error('Error loading maintenance entries:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMaintenance((prev: TankMaintenanceCreate) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaintenance((prev: TankMaintenanceCreate) => ({
      ...prev,
      layout_id: Number(e.target.value)
    }));
  };

  const handleMaintenanceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaintenance((prev: TankMaintenanceCreate) => ({
      ...prev,
      maintenance_type: e.target.value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setMaintenance((prev: TankMaintenanceCreate) => ({
        ...prev,
        maintenance_date: date
      }));
    }
  };

  const handleSaveMaintenance = async () => {
    try {
      setLoading(true);
      await TankMaintenanceService.create(maintenance);
      await loadMaintenanceEntries();
      setMaintenance({
        layout_id: 0,
        owner_email: user?.email ?? '',
        maintenance_date: new Date(),
        maintenance_type: '',
        description: '',
        notes: '',
        completed: 0,
      });
    } catch (error) {
      console.error('Error saving maintenance entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Tank Maintenance
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Add Maintenance Entry
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="layout-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Aquarium
              </label>
              <select
                id="layout-select"
                value={maintenance.layout_id}
                onChange={handleLayoutChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an aquarium</option>
                {layouts.map((layout) => (
                  <option key={layout.id} value={layout.id}>
                    {layout.tank_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="maintenance-type" className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Type
              </label>
              <select
                id="maintenance-type"
                value={maintenance.maintenance_type}
                onChange={handleMaintenanceTypeChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="Water Change">Water Change</option>
                <option value="Filter Cleaning">Filter Cleaning</option>
                <option value="Feeding">Feeding</option>
                <option value="Water Testing">Water Testing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="maintenance-date" className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Date
              </label>
              <DatePicker
                id="maintenance-date"
                selected={maintenance.maintenance_date}
                onChange={handleDateChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="MMMM d, yyyy h:mm aa"
                showTimeSelect
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={maintenance.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={maintenance.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSaveMaintenance}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Maintenance Entry'}
            </button>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Maintenance History
          </h2>
          <div className="space-y-4">
            {maintenanceEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {entry.maintenance_type}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Date: {new Date(entry.maintenance_date).toLocaleString()}
                </p>
                <p className="text-sm mb-2">
                  Description: {entry.description}
                </p>
                {entry.notes && (
                  <p className="text-sm mb-2">
                    Notes: {entry.notes}
                  </p>
                )}
                <p className="text-sm">
                  Status: {entry.completed ? 'Completed' : 'Pending'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tank; 