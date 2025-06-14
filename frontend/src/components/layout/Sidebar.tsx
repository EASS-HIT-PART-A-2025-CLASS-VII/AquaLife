import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SwatchIcon as DesignIcon,
  BeakerIcon as TankIcon,
  ArrowRightOnRectangleIcon as LogoutIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { logout } = useAuth();

  const menuItems = [
    {
      text: 'Design',
      icon: <DesignIcon className="h-6 w-6" />,
      path: '/design'
    },
    {
      text: 'Tank',
      icon: <TankIcon className="h-6 w-6" />,
      path: '/tank'
    }
  ];

  return (
    <div className={`w-60 h-screen ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-4 flex flex-col`}>
      <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        AquaLife Dashboard
      </h2>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.text}
            className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all duration-200 border
              ${location.pathname === item.path 
                ? isDarkMode
                  ? 'bg-blue-900/50 text-blue-300 border-blue-500'
                  : 'bg-blue-50 text-blue-600 border-blue-200'
                : isDarkMode
                  ? 'text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                  : 'text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.text}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={logout}
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 border w-full
          ${isDarkMode
            ? 'text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
            : 'text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
      >
        <LogoutIcon className="h-6 w-6 mr-3" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar; 