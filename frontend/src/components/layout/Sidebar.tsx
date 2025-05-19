import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SwatchIcon as DesignIcon,
  BeakerIcon as TankIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const location = useLocation();

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
    <div className="w-60 h-screen bg-white border-r border-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4">
        AquaLife Dashboard
      </h2>
      <nav>
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.text}
            className={`flex items-center px-4 py-2 text-gray-700 rounded-lg mb-2 transition-colors duration-200 ${
              location.pathname === item.path 
                ? 'bg-blue-50 text-blue-600' 
                : 'hover:bg-gray-50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 