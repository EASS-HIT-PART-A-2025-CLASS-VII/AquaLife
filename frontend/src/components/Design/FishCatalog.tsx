import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Fish {
  id: number;
  name: string;
  water_type: string;
  image_url?: string;
}

interface FishCatalogProps {
  availableFish: Fish[];
  isLoadingFish: boolean;
  tankWaterType: 'freshwater' | 'saltwater';
  onAddFish: (fish: Fish) => void;
}

export const FishCatalog: React.FC<FishCatalogProps> = ({ 
  availableFish, 
  isLoadingFish, 
  tankWaterType, 
  onAddFish 
}) => {
  const { isDarkMode } = useTheme();

  const createFallbackImageSrc = (fish: Fish): string => {
    const svgContent = [
      '<svg width="200" height="128" viewBox="0 0 200 128" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<rect width="200" height="128" fill="#3b82f6"/>',
      '<text x="100" y="50" font-family="Arial" font-size="36" fill="white" text-anchor="middle">🐠</text>',
      `<text x="100" y="80" font-family="Arial" font-size="12" fill="white" text-anchor="middle">${fish.name}</text>`,
      `<text x="100" y="100" font-family="Arial" font-size="10" fill="white" text-anchor="middle">${fish.water_type}</text>`,
      '</svg>'
    ].join('');
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  };

  const getImageSrc = (fish: Fish): string => {
    if (fish.image_url) {
      return `http://localhost:8000${fish.image_url}`;
    }
    return `https://via.placeholder.com/200x128/3b82f6/ffffff?text=${encodeURIComponent(fish.name)}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, fish: Fish) => {
    const target = e.target as HTMLImageElement;
    target.src = createFallbackImageSrc(fish);
  };

  const renderContent = () => {
    if (isLoadingFish) {
      return (
        <div className="text-center py-8">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading fish catalog...</p>
        </div>
      );
    }

    if (availableFish.length === 0) {
      return (
        <div className="text-center py-8">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            No fish available for {tankWaterType} tanks.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableFish.map(fish => (
          <button
            key={fish.id}
            className={`border rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}
            onClick={() => onAddFish(fish)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAddFish(fish);
              }
            }}
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
              <img
                src={getImageSrc(fish)}
                alt={fish.name}
                className="w-full h-32 object-cover"
                onError={(e) => handleImageError(e, fish)}
              />
            </div>
            <div className="p-3">
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {fish.name}
              </h4>
              <span className="mt-2 block w-full px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors">
                Add to Tank
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}; 