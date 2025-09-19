import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Detection } from './components/Detection';
import { TrafficControl } from './components/TrafficControl';
import { AlertSystem } from './components/AlertSystem';
import { MapView } from './components/MapView';
import { EventLogger } from './components/EventLogger';

type TabType = 'dashboard' | 'detection' | 'traffic' | 'alerts' | 'map' | 'events';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'detection':
        return <Detection />;
      case 'traffic':
        return <TrafficControl />;
      case 'alerts':
        return <AlertSystem />;
      case 'map':
        return <MapView />;
      case 'events':
        return <EventLogger />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;