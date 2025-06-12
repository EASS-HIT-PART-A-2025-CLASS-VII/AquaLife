import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AquariumService } from '../services/aquariumService';
import { FishService } from '../services/fishService';
import { Fish } from '../types/fish';
import { AquaLayout } from '../types/aquarium';
import { BeakerIcon, SparklesIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { calculateTankVolumeGallons, convertCmToInchesForDisplay } from '../utils/tankCalculations';

interface TankDimensions {
  length: number;
  width: number;
  height: number;
  waterType: 'freshwater' | 'saltwater';
  tankName: string;
  unit: 'cm' | 'inch';
}

interface FishData {
  name: string;
  quantity: number;
}

export function Design() {
  const { user } = useAuth();
  const [tankDimensions, setTankDimensions] = useState<TankDimensions>({
    length: 36,
    width: 18,
    height: 24,
    waterType: 'freshwater',
    tankName: '',
    unit: 'inch'
  });
  const [selectedFish, setSelectedFish] = useState<FishData[]>([]);
  const [showTank, setShowTank] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string>('');
  const [isLoadingFish, setIsLoadingFish] = useState(false);
  const [availableFish, setAvailableFish] = useState<Fish[]>([]);
  const [savedLayouts, setSavedLayouts] = useState<AquaLayout[]>([]);
  const [showSavedLayouts, setShowSavedLayouts] = useState(false);

  const fetchFish = async () => {
    setIsLoadingFish(true);
    try {
      const fishData = await FishService.getFishByWaterType(tankDimensions.waterType);
      setAvailableFish(fishData);
    } catch (error) {
      console.error('Error loading fish:', error);
      setAvailableFish([]);
    } finally {
      setIsLoadingFish(false);
    }
  };

  useEffect(() => {
    fetchFish();
    if (user?.email) {
      loadSavedLayouts();
    }
  }, [tankDimensions.waterType, user?.email]);

  const handleDimensionChange = (field: keyof TankDimensions, value: string | number) => {
    setTankDimensions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFish = (fish: Fish) => {
    setSelectedFish(prev => {
      const existing = prev.find(f => f.name === fish.name);
      if (existing) {
        return prev.map(f => 
          f.name === fish.name 
            ? { ...f, quantity: f.quantity + 1 }
            : f
        );
      }
      return [...prev, { name: fish.name, quantity: 1 }];
    });
  };

  const removeFish = (fishName: string) => {
    setSelectedFish(prev => prev.filter(f => f.name !== fishName));
  };

  const updateFishQuantity = (fishName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFish(fishName);
      return;
    }
    setSelectedFish(prev => 
      prev.map(f => 
        f.name === fishName 
          ? { ...f, quantity }
          : f
      )
    );
  };

  const generateTank = () => {
    if (tankDimensions.tankName.trim() === '') {
      alert('Please enter a tank name');
      return;
    }
    setShowTank(true);
  };

  const saveTankDesign = async () => {
    if (!user?.email || selectedFish.length === 0) {
      alert('Please add some fish to your tank before saving');
      return;
    }

    try {
      // Convert dimensions to cm if needed (preserve decimal precision)
      const lengthInCm = tankDimensions.unit === 'inch' ? tankDimensions.length * 2.54 : tankDimensions.length;
      const widthInCm = tankDimensions.unit === 'inch' ? tankDimensions.width * 2.54 : tankDimensions.width;
      const heightInCm = tankDimensions.unit === 'inch' ? tankDimensions.height * 2.54 : tankDimensions.height;

      const layoutData = {
        owner_email: user.email,
        tank_name: tankDimensions.tankName,
        tank_length: lengthInCm,
        tank_width: widthInCm,
        tank_height: heightInCm,
        water_type: tankDimensions.waterType,
        fish_data: selectedFish,
        comments: `Tank volume: ${calculateVolume()}${tankDimensions.unit === 'inch' ? ' gallons' : 'L'}`
      };

      await AquariumService.createLayout(layoutData);
      await loadSavedLayouts(); // Refresh the saved layouts list
      alert('Tank design saved successfully!');
    } catch (error) {
      console.error('Error saving tank design:', error);
      alert('Failed to save tank design');
    }
  };

  const evaluateWithAI = async () => {
    if (selectedFish.length === 0) {
      alert('Please add some fish before evaluation');
      return;
    }

    setIsEvaluating(true);
    try {
      // Send dimensions in original unit to AI service
      const layoutData = {
        owner_email: user?.email ?? '',
        tank_name: tankDimensions.tankName || 'My Aquarium',
        tank_length: Math.round(tankDimensions.length),
        tank_width: Math.round(tankDimensions.width),
        tank_height: Math.round(tankDimensions.height),
        water_type: tankDimensions.waterType,
        fish_data: selectedFish,
        comments: tankDimensions.tankName ? `AI evaluation for ${tankDimensions.tankName}` : 'AI evaluation request',
        unit: tankDimensions.unit  // Pass the unit to AI service
      };

      console.log('Sending AI evaluation request:', layoutData);

      const response = await fetch('/ai/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(layoutData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('AI evaluation response:', result);
        
        // The AI service returns 'response' field according to AIResponse model
        const aiEvaluation = result.response || result.evaluation || result.message || 'Evaluation completed successfully!';
        setEvaluationResult(aiEvaluation);
      } else {
        const errorText = await response.text();
        console.error('AI evaluation error - Status:', response.status);
        console.error('AI evaluation error - Response:', errorText);
        setEvaluationResult(`AI evaluation failed (${response.status}): ${errorText || 'Service unavailable'}`);
      }
    } catch (error) {
      console.error('Error evaluating tank:', error);
      setEvaluationResult('Failed to evaluate tank design.');
    }
    setIsEvaluating(false);
  };

  // Tank volume calculation with unit conversion
  const calculateVolume = () => {
    const { length, width, height, unit } = tankDimensions;
    if (unit === 'inch') {
      // Convert to gallons (231 cubic inches = 1 gallon)
      const volumeInCubicInches = length * width * height;
      const gallons = volumeInCubicInches / 231;
      return gallons.toFixed(1);
    } else {
      // Calculate in liters (cm³ / 1000)
      const volumeInLiters = (length * width * height) / 1000;
      return volumeInLiters.toFixed(1);
    }
  };

  const loadSavedLayouts = async () => {
    if (!user?.email) return;
    try {
      const layouts = await AquariumService.getLayoutsByOwner(user.email);
      setSavedLayouts(layouts);
    } catch (error) {
      console.error('Error loading saved layouts:', error);
    }
  };

  const deleteSavedLayout = async (layoutId: number) => {
    if (!confirm('Are you sure you want to delete this layout?')) return;
    
    try {
      await AquariumService.deleteLayout(layoutId);
      await loadSavedLayouts(); // Refresh the list
      alert('Layout deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting layout:', error);
      
      // Check if it's a foreign key constraint error
      if (error.message && (error.message.includes('foreign key') || error.message.includes('referenced'))) {
        alert('Ah! Cannot delete layout before deleting maintenance, delete Tank maintenance first');
      } else {
        alert('Failed to delete layout: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const loadLayout = (layout: AquaLayout) => {
    // Convert from cm back to current unit
    const lengthInUnit = tankDimensions.unit === 'inch' ? layout.tank_length / 2.54 : layout.tank_length;
    const widthInUnit = tankDimensions.unit === 'inch' ? layout.tank_width / 2.54 : layout.tank_width;
    const heightInUnit = tankDimensions.unit === 'inch' ? layout.tank_height / 2.54 : layout.tank_height;

    setTankDimensions({
      ...tankDimensions,
      length: Math.round(lengthInUnit),
      width: Math.round(widthInUnit),
      height: Math.round(heightInUnit),
      tankName: layout.tank_name,
      waterType: layout.water_type as 'freshwater' | 'saltwater'
    });
    
    setSelectedFish(layout.fish_data);
    setShowTank(true);
    setShowSavedLayouts(false);
  };

  const formatAIResponse = (response: string) => {
    // Split response into sections and format them better
    const sections = response.split(/\*\*|\n\n/).filter(section => section.trim() !== '');
    
    return (
      <div className="space-y-4">
        {sections.map((section, index) => {
          const trimmed = section.trim();
          if (!trimmed) return null;
          
          // Headers (like "1. Tank Volume:", "2. Bioload vs. Capacity:")
          if (trimmed.match(/^\d+\.\s+[\w\s]+:$/)) {
            return (
              <div key={index} className="font-semibold text-lg text-blue-900 border-b border-blue-200 pb-1">
                {trimmed}
              </div>
            );
          }
          
          // Recommendations section
          if (trimmed.includes('Recommendations:')) {
            return (
              <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Recommendations:</h4>
                <div className="text-green-700 text-sm space-y-1">
                  {trimmed.split('*').filter(item => item.trim()).map((rec, i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>{rec.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          // Overall rating
          if (trimmed.match(/Overall Rating.*\d+\/10/i)) {
            const rating = trimmed.match(/(\d+)\/10/)?.[1];
            const ratingNum = rating ? parseInt(rating) : 0;
            const color = ratingNum >= 8 ? 'green' : ratingNum >= 6 ? 'yellow' : 'red';
            
            return (
              <div key={index} className={`bg-${color}-50 p-3 rounded-lg border border-${color}-200`}>
                <div className={`font-semibold text-${color}-800`}>{trimmed}</div>
              </div>
            );
          }
          
          // Regular content
          return (
            <div key={index} className="text-gray-700 leading-relaxed">
              {trimmed}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Saved Layouts Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Aquarium Designer</h2>
        <button
          onClick={() => setShowSavedLayouts(!showSavedLayouts)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors font-medium flex items-center"
        >
          <EyeIcon className="h-5 w-5 mr-2" />
          {showSavedLayouts ? 'Hide' : 'View'} Saved Layouts ({savedLayouts.length})
        </button>
      </div>

      {/* Saved Layouts Panel */}
      {showSavedLayouts && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Saved Layouts</h3>
          {savedLayouts.length === 0 ? (
            <p className="text-gray-600">No saved layouts yet. Create and save your first aquarium design!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedLayouts.map(layout => {
                const volume = calculateTankVolumeGallons(layout.tank_length, layout.tank_width, layout.tank_height);
                const dimensions = convertCmToInchesForDisplay(layout.tank_length, layout.tank_width, layout.tank_height);
                const totalFish = layout.fish_data.reduce((sum: number, fish: any) => sum + fish.quantity, 0);
                
                return (
                  <div key={layout.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{layout.tank_name}</h4>
                      <button
                        onClick={() => deleteSavedLayout(layout.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete layout"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Size: {dimensions.length}×{dimensions.width}×{dimensions.height}" ({volume} gal)</p>
                      <p>Water: {layout.water_type}</p>
                      <p>Fish: {totalFish} total</p>
                      <p className="text-xs text-gray-500">Created: {new Date(layout.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => loadLayout(layout)}
                      className="mt-3 w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                    >
                      Load Layout
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tank Configuration */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Tank Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="tank-name" className="block text-sm font-medium text-gray-700 mb-2">
              Tank Name
            </label>
            <input
              type="text"
              id="tank-name"
              value={tankDimensions.tankName}
              onChange={(e) => handleDimensionChange('tankName', e.target.value)}
              placeholder="Enter tank name"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <select
              id="unit"
              value={tankDimensions.unit}
              onChange={(e) => handleDimensionChange('unit', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="inch" className="bg-white text-gray-900">Inches</option>
              <option value="cm" className="bg-white text-gray-900">Centimeters</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
              Length ({tankDimensions.unit})
            </label>
            <input
              type="number"
              id="length"
              value={tankDimensions.length}
              onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
              Width ({tankDimensions.unit})
            </label>
            <input
              type="number"
              id="width"
              value={tankDimensions.width}
              onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
              Height ({tankDimensions.unit})
            </label>
            <input
              type="number"
              id="height"
              value={tankDimensions.height}
              onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          
          <div>
            <label htmlFor="water-type" className="block text-sm font-medium text-gray-700 mb-2">
              Water Type
            </label>
            <select
              id="water-type"
              value={tankDimensions.waterType}
              onChange={(e) => handleDimensionChange('waterType', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="freshwater" className="bg-white text-gray-900">Freshwater</option>
              <option value="saltwater" className="bg-white text-gray-900">Saltwater</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={generateTank}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium"
            >
              Generate Tank
            </button>
          </div>
        </div>

        {/* Tank Info - Only show after tank is generated */}
        {showTank && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700">
              <span className="font-medium">Tank Volume:</span> {calculateVolume()}{tankDimensions.unit === 'inch' ? ' gallons' : 'L'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Water Type:</span> {tankDimensions.waterType}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Selected Fish:</span> {selectedFish.reduce((total, fish) => total + fish.quantity, 0)}
            </p>
          </div>
        )}
      </div>

      {/* Tank Visualization */}
      {showTank && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Tank Preview</h3>
          
          {/* Professional Aquarium Container */}
          <div className="relative mx-auto" style={{ maxWidth: '800px', height: '500px' }}>
            {/* Aquarium Glass Container */}
            <div className="relative w-full h-full bg-gradient-to-b from-cyan-100 via-blue-200 to-blue-600 rounded-lg overflow-hidden border-8 border-gray-800 shadow-2xl">
              
              {/* Glass Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Water Shimmer Effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent animate-pulse"></div>
              </div>
              
              {/* Aquarium Floor */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-yellow-800 via-yellow-700 to-yellow-600"></div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-900 to-amber-800 opacity-80"></div>
              
              {/* Aquarium Decorations */}
              <div className="absolute bottom-16 left-8 w-16 h-20 bg-gradient-to-t from-green-800 to-green-600 rounded-t-full opacity-80 transform rotate-12"></div>
              <div className="absolute bottom-16 left-20 w-12 h-16 bg-gradient-to-t from-green-700 to-green-500 rounded-t-full opacity-70 transform -rotate-6"></div>
              <div className="absolute bottom-16 right-12 w-20 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full opacity-60"></div>
              <div className="absolute bottom-16 right-32 w-14 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full opacity-50"></div>
              
              {/* Bubbles */}
              <div className="absolute bottom-20 left-12">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
              </div>
              <div className="absolute bottom-32 left-16">
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
              </div>
              <div className="absolute bottom-28 left-10">
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
              </div>
              
              {/* Swimming Fish */}
              {selectedFish.map((fishType, fishIndex) => 
                Array.from({ length: fishType.quantity }, (_, i) => {
                  const fishId = `${fishType.name}-${i}`;
                  const animationDelay = (fishIndex * 2 + i * 0.5) + 's';
                  const swimDuration = (8 + Math.random() * 4) + 's';
                  const verticalOffset = 20 + (fishIndex * 15 + i * 10) % 50;
                  
                  return (
                    <div
                      key={fishId}
                      className="absolute swimming-fish"
                      style={{
                        top: `${verticalOffset}%`,
                        left: '-60px',
                        animationDelay,
                        animationDuration: swimDuration,
                      }}
                    >
                      <div className="relative w-12 h-8 transform hover:scale-110 transition-transform">
                        {/* Fish Image */}
                        <img
                          src={(() => {
                            const fish = availableFish.find(f => f.name === fishType.name);
                            return fish?.image_url 
                              ? `http://localhost:8000${fish.image_url}` 
                              : `data:image/svg+xml;base64,${btoa(`
                                <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <ellipse cx="30" cy="16" rx="18" ry="8" fill="${tankDimensions.waterType === 'saltwater' ? '#FF6B6B' : '#4ECDC4'}"/>
                                  <path d="M12 16 L2 10 L2 22 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF6B6B' : '#4ECDC4'}"/>
                                  <circle cx="35" cy="12" r="2" fill="white"/>
                                  <circle cx="36" cy="12" r="1" fill="black"/>
                                  <path d="M30 8 L40 4 L42 8 L40 10 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}"/>
                                  <path d="M30 24 L40 28 L42 24 L40 22 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}"/>
                                </svg>
                              `)}`;
                          })()}
                          alt={fishType.name}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml;base64,${btoa(`
                              <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="30" cy="16" rx="18" ry="8" fill="${tankDimensions.waterType === 'saltwater' ? '#FF6B6B' : '#4ECDC4'}"/>
                                <path d="M12 16 L2 10 L2 22 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF6B6B' : '#4ECDC4'}"/>
                                <circle cx="35" cy="12" r="2" fill="white"/>
                                <circle cx="36" cy="12" r="1" fill="black"/>
                                <path d="M30 8 L40 4 L42 8 L40 10 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}"/>
                                <path d="M30 24 L40 28 L42 24 L40 22 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}"/>
                              </svg>
                            `)}`;
                          }}
                        />
                        
                        {/* Fish name tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {fishType.name}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Water Surface Effect */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-cyan-200/50 to-transparent"></div>
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              
              {/* Glass Reflection */}
              <div className="absolute top-4 left-4 w-16 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-lg transform -skew-x-12"></div>
              
              {/* Tank Info Overlay */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                <div className="text-xs space-y-1">
                  <div>Volume: {calculateVolume()}{tankDimensions.unit === 'inch' ? ' gal' : 'L'}</div>
                  <div>Fish: {selectedFish.reduce((total, fish) => total + fish.quantity, 0)}</div>
                  <div className="capitalize">{tankDimensions.waterType}</div>
                </div>
              </div>
            </div>
            
            {/* Aquarium Stand */}
            <div className="absolute -bottom-4 left-8 right-8 h-8 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-b-lg shadow-lg"></div>
            <div className="absolute -bottom-6 left-12 right-12 h-4 bg-gray-800 rounded-b-lg"></div>
          </div>
          
          {/* Selected Fish Summary */}
          {selectedFish.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-semibold text-gray-800">Selected Fish:</h4>
              {selectedFish.map(fish => (
                <div key={fish.name} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-gray-800">{fish.name}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateFishQuantity(fish.name, fish.quantity - 1)}
                      className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="text-gray-800 font-medium w-8 text-center">{fish.quantity}</span>
                    <button
                      onClick={() => updateFishQuantity(fish.name, fish.quantity + 1)}
                      className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFish(fish.name)}
                      className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={evaluateWithAI}
              disabled={isEvaluating || selectedFish.length === 0}
              className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors font-medium"
            >
              {isEvaluating ? (
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <SparklesIcon className="h-5 w-5 mr-2" />
              )}
              {isEvaluating ? 'Evaluating...' : 'AI Evaluation'}
            </button>
            
            <button
              onClick={saveTankDesign}
              disabled={selectedFish.length === 0}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors font-medium"
            >
              Save Design
            </button>
          </div>
          
          {/* AI Evaluation Result */}
          {evaluationResult && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-xl text-blue-900 mb-4 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2" />
                AI Aquarium Evaluation
              </h4>
              {formatAIResponse(evaluationResult)}
            </div>
          )}
        </div>
      )}

      {/* Fish Catalog */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Fish Catalog ({availableFish.length} species available)
        </h3>
        
          {isLoadingFish ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading fish catalog...</p>
            </div>
          ) : availableFish.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No fish available for {tankDimensions.waterType} tanks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableFish.map(fish => (
                <button
                  key={fish.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => addFish(fish)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      addFish(fish);
                    }
                  }}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img
                      src={fish.image_url ? `http://localhost:8000${fish.image_url}` : `https://via.placeholder.com/200x128/3b82f6/ffffff?text=${encodeURIComponent(fish.name)}`}
                      alt={fish.name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Use a fish emoji SVG as fallback
                        target.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="200" height="128" viewBox="0 0 200 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="200" height="128" fill="#3b82f6"/>
                            <text x="100" y="50" font-family="Arial" font-size="36" fill="white" text-anchor="middle">🐠</text>
                            <text x="100" y="80" font-family="Arial" font-size="12" fill="white" text-anchor="middle">${fish.name}</text>
                            <text x="100" y="100" font-family="Arial" font-size="10" fill="white" text-anchor="middle">${fish.water_type}</text>
                          </svg>
                        `)}`;
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-800">{fish.name}</h4>
                    <span className="mt-2 block w-full px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors">
                      Add to Tank
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
      </div>
    </div>
  );
} 