import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface TankDimensions {
  length: number;
  width: number;
  height: number;
  waterType: 'freshwater' | 'saltwater';
  tankName: string;
  unit: 'cm' | 'inch';
}

interface TankConfigurationProps {
  tankDimensions: TankDimensions;
  onDimensionChange: (field: keyof TankDimensions, value: string | number) => void;
  onGenerateTank: () => void;
  calculateVolume: () => string;
  selectedFishCount: number;
  showTank: boolean;
}

export const TankConfiguration: React.FC<TankConfigurationProps> = ({ 
  tankDimensions, 
  onDimensionChange, 
  onGenerateTank, 
  calculateVolume, 
  selectedFishCount, 
  showTank 
}) => {
  const { isDarkMode } = useTheme();

  const getInputClassName = () => {
    return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
        : 'bg-white border-gray-300 text-gray-900'
    }`;
  };

  const getSelectClassName = () => {
    return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-white' 
        : 'bg-white border-gray-300 text-gray-900'
    }`;
  };

  const getLabelClassName = () => {
    return `block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`;
  };

  const getOptionClassName = () => {
    return isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';
  };

  const renderNameAndUnitInputs = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div>
        <label htmlFor="tank-name" className={getLabelClassName()}>
          Tank Name
        </label>
        <input
          type="text"
          id="tank-name"
          value={tankDimensions.tankName}
          onChange={(e) => onDimensionChange('tankName', e.target.value)}
          placeholder="Enter tank name"
          className={getInputClassName()}
        />
      </div>
      
      <div>
        <label htmlFor="unit" className={getLabelClassName()}>
          Unit
        </label>
        <select
          id="unit"
          value={tankDimensions.unit}
          onChange={(e) => onDimensionChange('unit', e.target.value)}
          className={getSelectClassName()}
        >
          <option value="inch" className={getOptionClassName()}>Inches</option>
          <option value="cm" className={getOptionClassName()}>Centimeters</option>
        </select>
      </div>
    </div>
  );

  const renderDimensionInputs = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label htmlFor="length" className={getLabelClassName()}>
          Length ({tankDimensions.unit})
        </label>
        <input
          type="number"
          id="length"
          value={tankDimensions.length}
          onChange={(e) => onDimensionChange('length', parseFloat(e.target.value) || 0)}
          className={getInputClassName()}
        />
      </div>
      
      <div>
        <label htmlFor="width" className={getLabelClassName()}>
          Width ({tankDimensions.unit})
        </label>
        <input
          type="number"
          id="width"
          value={tankDimensions.width}
          onChange={(e) => onDimensionChange('width', parseFloat(e.target.value) || 0)}
          className={getInputClassName()}
        />
      </div>
      
      <div>
        <label htmlFor="height" className={getLabelClassName()}>
          Height ({tankDimensions.unit})
        </label>
        <input
          type="number"
          id="height"
          value={tankDimensions.height}
          onChange={(e) => onDimensionChange('height', parseFloat(e.target.value) || 0)}
          className={getInputClassName()}
        />
      </div>
      
      <div>
        <label htmlFor="water-type" className={getLabelClassName()}>
          Water Type
        </label>
        <select
          id="water-type"
          value={tankDimensions.waterType}
          onChange={(e) => onDimensionChange('waterType', e.target.value)}
          className={getSelectClassName()}
        >
          <option value="freshwater" className={getOptionClassName()}>Freshwater</option>
          <option value="saltwater" className={getOptionClassName()}>Saltwater</option>
        </select>
      </div>
      
      <div className="flex items-end">
        <button
          onClick={onGenerateTank}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium"
        >
          Generate Tank
        </button>
      </div>
    </div>
  );

  const renderTankInfo = () => {
    if (!showTank) return null;

    return (
      <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
        <p className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
          <span className="font-medium">Tank Volume:</span> {calculateVolume()}{tankDimensions.unit === 'inch' ? ' gallons' : 'L'}
        </p>
        <p className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
          <span className="font-medium">Water Type:</span> {tankDimensions.waterType}
        </p>
        <p className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
          <span className="font-medium">Selected Fish:</span> {selectedFishCount}
        </p>
      </div>
    );
  };

  return (
    <div className={`rounded-lg shadow border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Tank Configuration
      </h3>
      
      {renderNameAndUnitInputs()}
      {renderDimensionInputs()}
      {renderTankInfo()}
    </div>
  );
}; 