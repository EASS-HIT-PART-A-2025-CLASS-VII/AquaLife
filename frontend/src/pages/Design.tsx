import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AquariumService } from '../services/aquariumService';
import { FishService } from '../services/fishService';
import { Fish } from '../types/fish';
import { AquaLayout } from '../types/aquarium';
import { BeakerIcon, SparklesIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { calculateTankVolumeGallons, convertCmToInchesForDisplay } from '../utils/tankCalculations';
import { AIEvaluationResult, TankConfiguration, FishCatalog } from '../components/Design';

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
  const { isDarkMode, toggleDarkMode } = useTheme();
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

  // Helper function to process fish images and remove white backgrounds
  const processedImages = useRef<Map<string, string>>(new Map());
  
  const processImageToRemoveBackground = useCallback((imageSrc: string, fishName: string): Promise<string> => {
    return new Promise((resolve) => {
      // Check if already processed
      if (processedImages.current.has(fishName)) {
        resolve(processedImages.current.get(fishName)!);
        return;
      }
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        ctx.drawImage(img, 0, 0);
        
        try {
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Remove white/light backgrounds
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Check if pixel is white-ish (background)
            const brightness = (r + g + b) / 3;
            if (brightness > 200 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30) {
              data[i + 3] = 0; // Make transparent
            }
          }
          
          // Put processed data back
          ctx.putImageData(imageData, 0, 0);
          
          const processedSrc = canvas.toDataURL('image/png');
          processedImages.current.set(fishName, processedSrc);
          resolve(processedSrc);
        } catch (error) {
          // If CORS or other error, return original
          resolve(imageSrc);
        }
      };
      
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  }, []);

  // State for processed images
  const [fishImageSources, setFishImageSources] = useState<Map<string, string>>(new Map());

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

  const clearAllData = () => {
    setSelectedFish([]);
    setEvaluationResult('');
    setShowTank(false);
    setFishImageSources(new Map());
    processedImages.current.clear();
  };

  // formatAIResponse function moved to AIEvaluationResult component

  return (
    <div className={`space-y-6 min-h-screen p-6 transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header with Saved Layouts Toggle */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Aquarium Designer</h2>
        <div className="flex space-x-3">
          {/* Saved Layouts Toggle */}
          <button
            onClick={() => setShowSavedLayouts(!showSavedLayouts)}
            className={`px-4 py-2 rounded-md transition-colors font-medium flex items-center ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            {showSavedLayouts ? 'Hide' : 'View'} Saved Layouts ({savedLayouts.length})
          </button>
        </div>
      </div>

      {/* Saved Layouts Panel */}
      {showSavedLayouts && (
        <div className={`rounded-lg shadow border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Saved Layouts</h3>
          {savedLayouts.length === 0 ? (
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No saved layouts yet. Create and save your first aquarium design!</p>
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
      <TankConfiguration
        tankDimensions={tankDimensions}
        onDimensionChange={handleDimensionChange}
        onGenerateTank={generateTank}
        calculateVolume={calculateVolume}
        selectedFishCount={selectedFish.reduce((total, fish) => total + fish.quantity, 0)}
        showTank={showTank}
      />

      {/* Tank Visualization */}
      {showTank && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Tank Preview</h3>
          
          {/* Realistic Aquarium Container */}
          <div className="relative mx-auto" style={{ maxWidth: '900px', height: '500px' }}>
            {/* Main Aquarium with Realistic Water Gradient */}
            <div 
              className="realistic-aquarium w-full h-full relative"
              id="aquarium-container"
            >
              
              {/* Glass Effect Overlays */}
              <div className="absolute inset-0 aquarium-glass-effect"></div>
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-cyan-200/30 to-transparent water-surface"></div>
              
              {/* Caustics (Light patterns on bottom) */}
              <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
                <div className="caustics-effect w-full h-full bg-gradient-radial from-yellow-200 via-transparent to-transparent"></div>
              </div>
              
              {/* Aquarium Decorations - Plants */}
              <div className="absolute bottom-0 left-8 w-12 h-16 bg-gradient-to-t from-green-800 via-green-600 to-green-500 rounded-t-full opacity-90 transform rotate-12"></div>
              <div className="absolute bottom-0 left-16 w-8 h-12 bg-gradient-to-t from-green-700 to-green-500 rounded-t-full opacity-80 transform -rotate-6"></div>
              <div className="absolute bottom-0 right-12 w-10 h-14 bg-gradient-to-t from-green-800 to-green-400 rounded-t-full opacity-85 transform rotate-8"></div>
              
              {/* Rocks */}
              <div className="absolute bottom-0 right-24 w-16 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full opacity-70"></div>
              <div className="absolute bottom-0 left-32 w-12 h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full opacity-60"></div>
              
              {/* Enhanced Bubbles */}
              <div className="absolute bottom-4 left-12">
                <div className="aquarium-bubble w-2 h-2" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
              </div>
              <div className="absolute bottom-8 left-16">
                <div className="aquarium-bubble w-1 h-1" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
              </div>
              <div className="absolute bottom-6 left-10">
                <div className="aquarium-bubble w-1.5 h-1.5" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
              </div>
              <div className="absolute bottom-12 right-16">
                <div className="aquarium-bubble w-1 h-1" style={{ animationDelay: '0.5s', animationDuration: '5s' }}></div>
              </div>
              
              {/* Swimming Fish with Realistic Animation */}
              {selectedFish.map((fishType, fishIndex) => 
                Array.from({ length: fishType.quantity }, (_, i) => {
                  const fishId = `${fishType.name}-${i}`;
                  
                  // Randomized animation timing (10-30 seconds like the example)
                  const animationDuration = (10 + Math.random() * 20) + 's';
                  
                  // Randomized depth positioning (15-82% from top)
                  const randomDepth = 15 + Math.random() * 67;
                  
                  // Some fish are bottom dwellers, mid-water, or surface fish
                  let depthClass = '';
                  let finalDepth = randomDepth;
                  
                  // Assign fish types based on their index (simple categorization)
                  if (fishIndex % 3 === 0) {
                    depthClass = 'bottom-dweller';
                    finalDepth = 85 + Math.random() * 10; // Bottom 85-95%
                  } else if (fishIndex % 3 === 1) {
                    depthClass = 'mid-water'; 
                    finalDepth = 35 + Math.random() * 30; // Middle 35-65%
                  } else {
                    depthClass = 'surface-fish';
                    finalDepth = 15 + Math.random() * 20; // Top 15-35%
                  }
                  
                  return (
                    <div
                      key={fishId}
                      className={`absolute swimming-fish ${depthClass} svg-fish`}
                      style={{
                        top: `${finalDepth}%`,
                        left: '0px',
                        animationDuration,
                        animationDelay: `${fishIndex * 1.5 + i * 0.8}s`,
                        zIndex: Math.floor(10 - finalDepth / 10), // Deeper fish behind surface fish
                        '--fish-hue': `${fishIndex * 40}deg`,
                      } as React.CSSProperties}
                    >
                      <div className="relative w-20 h-16 transform hover:scale-125 transition-all duration-300">
                        {/* Colorful Fish Emoji/SVG */}
                        <img
                          src={(() => {
                            // Always use the colorful SVG fish - they look great!
                            return `data:image/svg+xml;base64,${btoa(`
                              <svg width="80" height="56" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <!-- Fish Body -->
                                <ellipse cx="45" cy="28" rx="30" ry="16" fill="${tankDimensions.waterType === 'saltwater' ? '#FF6B6B' : '#4ECDC4'}" opacity="0.9"/>
                                
                                <!-- Fish Body Gradient -->
                                <ellipse cx="45" cy="28" rx="28" ry="14" fill="url(#fishGradient${fishIndex})"/>
                                
                                <!-- Fish Tail -->
                                <path d="M15 28 L3 12 L8 28 L3 44 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF6B6B' : '#4ECDC4'}" opacity="0.8"/>
                                
                                <!-- Dorsal Fin -->
                                <path d="M35 12 L50 6 L65 12 L58 18 L42 18 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}" opacity="0.7"/>
                                
                                <!-- Ventral Fin -->
                                <path d="M35 44 L50 50 L65 44 L58 38 L42 38 Z" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}" opacity="0.7"/>
                                
                                <!-- Pectoral Fins -->
                                <ellipse cx="40" cy="21" rx="8" ry="4" fill="${tankDimensions.waterType === 'saltwater' ? '#FFB3B3' : '#7FFFFF'}" opacity="0.6" transform="rotate(-30 40 21)"/>
                                <ellipse cx="40" cy="35" rx="8" ry="4" fill="${tankDimensions.waterType === 'saltwater' ? '#FFB3B3' : '#7FFFFF'}" opacity="0.6" transform="rotate(30 40 35)"/>
                                
                                <!-- Fish Eye -->
                                <circle cx="60" cy="22" r="5" fill="white" opacity="0.9"/>
                                <circle cx="61" cy="22" r="3.5" fill="black"/>
                                <circle cx="63" cy="20" r="1.5" fill="white" opacity="0.8"/>
                                
                                <!-- Fish Mouth -->
                                <ellipse cx="72" cy="28" rx="4" ry="2" fill="${tankDimensions.waterType === 'saltwater' ? '#FF9999' : '#66FFFF'}" opacity="0.6"/>
                                
                                <!-- Body Stripes/Pattern -->
                                <ellipse cx="50" cy="25" rx="5" ry="1.5" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}" opacity="0.4"/>
                                <ellipse cx="43" cy="28" rx="4" ry="1.5" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}" opacity="0.4"/>
                                <ellipse cx="50" cy="31" rx="5" ry="1.5" fill="${tankDimensions.waterType === 'saltwater' ? '#FF8E8E' : '#6EEAEA'}" opacity="0.4"/>
                                
                                <!-- Gradients -->
                                <defs>
                                  <linearGradient id="fishGradient${fishIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:${tankDimensions.waterType === 'saltwater' ? '#FFB3B3' : '#7FFFFF'};stop-opacity:1" />
                                    <stop offset="50%" style="stop-color:${tankDimensions.waterType === 'saltwater' ? '#FF6B6B' : '#4ECDC4'};stop-opacity:0.8" />
                                    <stop offset="100%" style="stop-color:${tankDimensions.waterType === 'saltwater' ? '#FF4444' : '#2ECC71'};stop-opacity:0.9" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            `)}`;
                          })()}
                          alt={fishType.name}
                          className="w-full h-full object-contain filter drop-shadow-lg"
                          style={{
                            filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) hue-rotate(${fishIndex * 30}deg)`,
                            imageRendering: 'crisp-edges',
                            transform: 'scaleX(-1)' // Flip horizontally so fish swim forward
                          }}
                        />
                        
                        {/* Enhanced Fish Tooltip */}
                        <div className="fish-tooltip absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-20">
                          <div className="font-semibold">{fishType.name}</div>
                          <div className="text-xs opacity-80">{depthClass.replace('-', ' ')}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Water Surface Reflection */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              
              {/* Advanced Glass Reflection */}
              <div className="glass-shine absolute top-8 left-8 w-20 h-40 bg-gradient-to-br from-white/30 to-transparent rounded-lg transform -skew-x-12"></div>
              
              {/* Tank Info Overlay - Enhanced */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-4 py-3 rounded-xl backdrop-blur-md border border-white/20">
                <div className="text-sm space-y-1">
                  <div className="font-semibold">📊 {calculateVolume()}{tankDimensions.unit === 'inch' ? ' gal' : 'L'}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-300">🐠</span>
                    <span>{selectedFish.reduce((total, fish) => total + fish.quantity, 0)} fish</span>
                  </div>
                  <div className="capitalize text-xs opacity-80">
                    {tankDimensions.waterType === 'saltwater' ? '🌊 Salt Water' : '💧 Fresh Water'}
                  </div>
                </div>
              </div>
              
              {/* Water Temperature Indicator */}
              <div className="absolute bottom-4 right-4 bg-green-500/80 text-white px-3 py-2 rounded-lg backdrop-blur-sm border border-green-400/30">
                <div className="text-xs flex items-center gap-1">
                  <span>🌡️</span>
                  <span>{tankDimensions.waterType === 'saltwater' ? '26°C' : '24°C'}</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Aquarium Stand */}
            <div className="absolute -bottom-6 left-4 right-4 h-10 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-b-xl shadow-2xl"></div>
            <div className="absolute -bottom-8 left-8 right-8 h-6 bg-gray-900 rounded-b-lg"></div>
          </div>
          
          {/* Selected Fish Summary */}
          {selectedFish.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-semibold text-gray-800">Fish Population:</h4>
              {selectedFish.map(fish => (
                <div key={fish.name} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🐠</span>
                    <span className="text-gray-800 font-medium">{fish.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateFishQuantity(fish.name, fish.quantity - 1)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="text-gray-800 font-bold text-lg w-12 text-center bg-gray-200 py-1 rounded">{fish.quantity}</span>
                    <button
                      onClick={() => updateFishQuantity(fish.name, fish.quantity + 1)}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFish(fish.name)}
                      className="ml-3 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
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
              className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors font-medium"
            >
              <BeakerIcon className="h-5 w-5 mr-2" />
              Save Design
            </button>
            
            <button
              onClick={clearAllData}
              disabled={selectedFish.length === 0 && !showTank && !evaluationResult}
              className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors font-medium"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clear All
            </button>
          </div>
          
        </div>
      )}

      {/* AI Evaluation Result - Moved outside tank container */}
      {evaluationResult && (
        <AIEvaluationResult evaluationResult={evaluationResult} />
      )}

      {/* Fish Catalog */}
      <FishCatalog
        availableFish={availableFish}
        isLoadingFish={isLoadingFish}
        tankWaterType={tankDimensions.waterType}
        onAddFish={addFish}
      />
    </div>
  );
} 