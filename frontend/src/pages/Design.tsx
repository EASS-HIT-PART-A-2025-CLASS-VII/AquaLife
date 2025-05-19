import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AquariumService } from '../services/aquariumService';
import { FishService } from '../services/fishService';
import { AquaLayoutCreate } from '../types/aquarium';

const Design: React.FC = () => {
  const { user } = useAuth();
  const [layout, setLayout] = useState<AquaLayoutCreate>({
    owner_email: user?.email ?? '',
    tank_name: '',
    tank_length: 0,
    tank_width: 0,
    tank_height: 0,
    water_type: 'freshwater',
    fish_data: [],
    comments: '',
  });
  const [fishCatalog, setFishCatalog] = useState<any[]>([]);
  const [openFishDialog, setOpenFishDialog] = useState(false);
  const [layouts, setLayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFishCatalog();
    loadUserLayouts();
  }, [user?.email]);

  const loadFishCatalog = async () => {
    try {
      const fish = await FishService.getAllFish();
      setFishCatalog(fish);
    } catch (error) {
      console.error('Error loading fish catalog:', error);
    }
  };

  const loadUserLayouts = async () => {
    if (!user?.email) return;
    try {
      const userLayouts = await AquariumService.getLayoutsByOwner(user.email);
      setLayouts(userLayouts);
    } catch (error) {
      console.error('Error loading user layouts:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLayout(prev => ({
      ...prev,
      [name]: name.includes('tank_') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await AquariumService.createLayout(layout);
      await loadUserLayouts();
      setLayout({
        owner_email: user?.email ?? '',
        tank_name: '',
        tank_length: 0,
        tank_width: 0,
        tank_height: 0,
        water_type: 'freshwater',
        fish_data: [],
        comments: '',
      });
    } catch (error) {
      console.error('Error creating layout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Design Your Aquarium
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Design Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Create New Layout
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tank-name" className="block text-sm font-medium text-gray-700 mb-1">
                Tank Name
              </label>
              <input
                id="tank-name"
                type="text"
                name="tank_name"
                value={layout.tank_name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="tank-length" className="block text-sm font-medium text-gray-700 mb-1">
                  Length (cm)
                </label>
                <input
                  id="tank-length"
                  type="number"
                  name="tank_length"
                  value={layout.tank_length}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="tank-width" className="block text-sm font-medium text-gray-700 mb-1">
                  Width (cm)
                </label>
                <input
                  id="tank-width"
                  type="number"
                  name="tank_width"
                  value={layout.tank_width}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="tank-height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  id="tank-height"
                  type="number"
                  name="tank_height"
                  value={layout.tank_height}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="water-type" className="block text-sm font-medium text-gray-700 mb-1">
                Water Type
              </label>
              <select
                id="water-type"
                name="water_type"
                value={layout.water_type}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="freshwater">Freshwater</option>
                <option value="saltwater">Saltwater</option>
              </select>
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                value={layout.comments}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Layout'}
            </button>
          </form>
        </div>

        {/* Layout History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Your Layouts
          </h2>
          <div className="space-y-4">
            {layouts.map((layout) => (
              <div key={layout.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {layout.tank_name}
                </h3>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-2">
                  <p>Length: {layout.tank_length}cm</p>
                  <p>Width: {layout.tank_width}cm</p>
                  <p>Height: {layout.tank_height}cm</p>
                </div>
                <p className="text-sm text-gray-500">
                  Water Type: {layout.water_type}
                </p>
                {layout.comments && (
                  <p className="text-sm mt-2">
                    Comments: {layout.comments}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fish Selection Dialog */}
      {openFishDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              Select Fish
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {fishCatalog.map((fish) => (
                <button
                  key={fish.id}
                  type="button"
                  onClick={() => {
                    setOpenFishDialog(false);
                  }}
                  className="border rounded-lg p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <h4 className="font-medium">{fish.name}</h4>
                  <p className="text-sm text-gray-500">{fish.species}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpenFishDialog(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Design; 