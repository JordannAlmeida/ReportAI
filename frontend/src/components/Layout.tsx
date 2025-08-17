import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

export default function Layout() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      name: 'Generate Report',
      path: '/generate',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      name: 'Report Manager',
      path: '/reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${isNavOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col fixed h-full z-30`}>
        {/* Sidebar Header */}
        <div className={`p-4 border-b border-gray-200 flex items-center ${isNavOpen ? 'justify-between' : 'justify-center'}`}>
          <div className={`${isNavOpen ? 'block' : 'hidden'} transition-opacity duration-300`}>
            <h2 className="text-xl font-bold text-gray-800">Report AI</h2>
          </div>
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ${isNavOpen ? 'rotate-0' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center rounded-lg transition-all duration-200 ease-in-out
                hover:bg-orange hover:text-white hover:shadow-md hover:scale-105
                ${location.pathname === item.path 
                  ? 'bg-orange text-white shadow-md' 
                  : 'text-gray-700 hover:bg-orange hover:text-white'
                }
                ${isNavOpen ? 'p-3' : 'p-3 justify-center'}
                group
              `}
              style={{
                animationDelay: `${index * 100}ms`
              }}
              title={!isNavOpen ? item.name : undefined}
            >
              <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </div>
              <span className={`
                ml-3 font-medium transition-all duration-300
                ${isNavOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}
              `}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t border-gray-200 ${!isNavOpen ? 'text-center' : ''}`}>
          <div className={`${isNavOpen ? 'block' : 'hidden'} transition-opacity duration-300`}>
            <p className="text-sm text-gray-500">AI-powered reporting</p>
          </div>
          {!isNavOpen && (
            <div className="flex justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-20'}`}>
        <Outlet />
      </div>

      {/* Add keyframes animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(60px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </div>
  );
}