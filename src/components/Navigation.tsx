import React from 'react';
import { LayoutDashboard, Camera, TrafficCone as Traffic, AlertTriangle, Map, FileText, Shield } from 'lucide-react';

type TabType = 'dashboard' | 'detection' | 'traffic' | 'alerts' | 'map' | 'events';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detection', label: 'Vehicle Detection', icon: Camera },
    { id: 'traffic', label: 'Traffic Control', icon: Traffic },
    { id: 'alerts', label: 'Alert System', icon: AlertTriangle },
    { id: 'map', label: 'Route Map', icon: Map },
    { id: 'events', label: 'Event Logger', icon: FileText },
  ] as const;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Emergency Traffic Control</h1>
              <p className="text-sm text-gray-500">AI-Powered Clearance System</p>
            </div>
          </div>
          
          <nav className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as TabType)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}