import React from 'react';
import { AquariumBackground } from '../components/AquariumBackground';
import { LoginForm } from '../components/LoginForm';
import { Logo } from '../components/Logo';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Fish tank animated background */}
      <AquariumBackground />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6">
          <Logo />
        </header>
        
        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12">
            {/* Hero section */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Design Your Perfect Aquatic World
              </h1>
              <p className="text-xl text-white/80">
                Create, design, and manage your dream aquarium from scratch with AquaLife's powerful tools.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
                  <svg className="w-5 h-5 text-marine-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Easy to use interface</span>
                </div>
                <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
                  <svg className="w-5 h-5 text-marine-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Realistic simulations</span>
                </div>
                <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
                  <svg className="w-5 h-5 text-marine-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Fish compatibility</span>
                </div>
              </div>
            </div>
            
            {/* Login form */}
            <div className="lg:w-1/2">
              <LoginForm />
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="relative p-6 text-center">
          <p className="text-white/60 text-sm">
            © 2025 AquaLife - Aquarium Design & Management Tool
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
