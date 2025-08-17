import React from 'react';

export default function Home() {
  return (
    <div className="flex items-center justify-center p-8 min-h-screen">
      <div className="max-w-2xl text-center">
        <div 
          className="animate-pulse"
          style={{
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-orange to-orange-light bg-clip-text text-transparent">
            Welcome to Report AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your data into intelligent, comprehensive reports with the power of artificial intelligence
          </p>
        </div>
        
        <div 
          className="opacity-0"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.3s forwards'
          }}
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Get Started</h3>
            <p className="text-gray-600">
              Use the navigation sidebar to generate new reports or manage your existing ones. 
              Our AI will help you create detailed, professional reports from your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
