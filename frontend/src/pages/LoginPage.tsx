import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { AquariumBackground } from '../components/AquariumBackground';

export const LoginPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-marine">
      {/* Aquarium Background */}
      <div className="fixed inset-0 z-0">
        <AquariumBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
          {/* Hero Section */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to AquaLife</h1>
            <p className="text-lg mb-8 text-white/90">
              Your all-in-one aquarium management solution. Design, monitor, and maintain your perfect underwater ecosystem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-marine-light/30 backdrop-blur-sm p-4 rounded-lg border-2 border-white/50 shadow-lg">
                <h3 className="font-bold mb-2 text-white text-lg">Smart Design</h3>
                <p className="text-sm text-white/90">Create the perfect layout for your aquarium</p>
              </div>
              <div className="bg-marine-light/30 backdrop-blur-sm p-4 rounded-lg border-2 border-white/50 shadow-lg">
                <h3 className="font-bold mb-2 text-white text-lg">Fish Compatibility</h3>
                <p className="text-sm text-white/90">Ensure your fish live in harmony</p>
              </div>
              <div className="bg-marine-light/30 backdrop-blur-sm p-4 rounded-lg border-2 border-white/50 shadow-lg">
                <h3 className="font-bold mb-2 text-white text-lg">AI Assistance</h3>
                <p className="text-sm text-white/90">Use AI to build the perfect tank!</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
      <footer className="relative z-10 text-center text-white/70 py-4">
        <p>&copy; 2025 AquaLife. All rights reserved.</p>
      </footer>
    </div>
  );
};
