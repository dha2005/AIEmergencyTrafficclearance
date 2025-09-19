import React, { useState, useEffect } from 'react';
import { TrafficCone as Traffic, Play, Square, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

interface TrafficSignal {
  id: string;
  location: string;
  currentState: 'red' | 'yellow' | 'green';
  mode: 'normal' | 'emergency' | 'preemption';
  timeRemaining: number;
  isConnected: boolean;
}

interface EmergencyCorridor {
  id: string;
  vehicleType: string;
  route: string[];
  activatedAt: string;
  status: 'active' | 'clearing' | 'completed';
  estimatedClearance: number;
}

export function TrafficControl() {
  const [signals, setSignals] = useState<TrafficSignal[]>([
    { id: 'SIG001', location: 'Main St & 5th Ave', currentState: 'green', mode: 'emergency', timeRemaining: 45, isConnected: true },
    { id: 'SIG002', location: 'Main St & 4th Ave', currentState: 'green', mode: 'emergency', timeRemaining: 38, isConnected: true },
    { id: 'SIG003', location: 'Main St & 3rd Ave', currentState: 'yellow', mode: 'preemption', timeRemaining: 12, isConnected: true },
    { id: 'SIG004', location: 'Broadway & Oak St', currentState: 'red', mode: 'normal', timeRemaining: 67, isConnected: false },
    { id: 'SIG005', location: 'Park Ave & 1st St', currentState: 'green', mode: 'normal', timeRemaining: 23, isConnected: true },
    { id: 'SIG006', location: 'Center St & Pine Ave', currentState: 'red', mode: 'normal', timeRemaining: 89, isConnected: true },
  ]);

  const [corridors, setCorridors] = useState<EmergencyCorridor[]>([
    {
      id: 'COR001',
      vehicleType: 'Ambulance',
      route: ['Main St & 5th Ave', 'Main St & 4th Ave', 'Main St & 3rd Ave'],
      activatedAt: '14:23:45',
      status: 'active',
      estimatedClearance: 120
    },
    {
      id: 'COR002',
      vehicleType: 'Fire Truck',
      route: ['Broadway & Oak St', 'Broadway & Pine St'],
      activatedAt: '14:18:32',
      status: 'clearing',
      estimatedClearance: 45
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(signal => ({
        ...signal,
        timeRemaining: Math.max(0, signal.timeRemaining - 1),
        currentState: signal.timeRemaining <= 1 ? 
          (signal.currentState === 'red' ? 'green' : 
           signal.currentState === 'green' ? 'yellow' : 'red') : 
          signal.currentState
      })));

      setCorridors(prev => prev.map(corridor => ({
        ...corridor,
        estimatedClearance: Math.max(0, corridor.estimatedClearance - 1)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEmergencyOverride = (signalId: string) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, mode: 'emergency', currentState: 'green', timeRemaining: 120 }
        : signal
    ));
  };

  const handleNormalMode = (signalId: string) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, mode: 'normal', timeRemaining: 60 }
        : signal
    ));
  };

  const createGreenCorridor = () => {
    const routeSignals = ['SIG001', 'SIG002', 'SIG003'];
    setSignals(prev => prev.map(signal => 
      routeSignals.includes(signal.id)
        ? { ...signal, mode: 'emergency', currentState: 'green', timeRemaining: 180 }
        : signal
    ));

    const newCorridor: EmergencyCorridor = {
      id: `COR${Date.now()}`,
      vehicleType: 'Emergency Vehicle',
      route: routeSignals.map(id => signals.find(s => s.id === id)?.location || ''),
      activatedAt: new Date().toLocaleTimeString(),
      status: 'active',
      estimatedClearance: 180
    };

    setCorridors(prev => [newCorridor, ...prev]);
  };

  const getSignalColor = (state: string) => {
    switch (state) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'preemption': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Traffic Signal Control</h2>
        <p className="text-gray-600">Intelligent traffic signal management for emergency vehicle priority</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Controls</h3>
          <button
            onClick={createGreenCorridor}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Create Emergency Corridor
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Connected Signals</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {signals.filter(s => s.isConnected).length}
            </p>
            <p className="text-sm text-gray-600">of {signals.length} total</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-gray-900">Emergency Mode</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {signals.filter(s => s.mode === 'emergency').length}
            </p>
            <p className="text-sm text-gray-600">active overrides</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Avg Response</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">8.3s</p>
            <p className="text-sm text-gray-600">signal change time</p>
          </div>
        </div>
      </div>

      {/* Active Emergency Corridors */}
      {corridors.filter(c => c.status === 'active' || c.status === 'clearing').length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Emergency Corridors</h3>
          <div className="space-y-4">
            {corridors.filter(c => c.status === 'active' || c.status === 'clearing').map((corridor) => (
              <div key={corridor.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <h4 className="font-medium text-gray-900">{corridor.vehicleType} - {corridor.id}</h4>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    corridor.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {corridor.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Route:</p>
                    <div className="space-y-1">
                      {corridor.route.map((location, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span>{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Activated: {corridor.activatedAt}</p>
                    <p className="text-sm text-gray-600">
                      Clearance ETA: {Math.floor(corridor.estimatedClearance / 60)}m {corridor.estimatedClearance % 60}s
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traffic Signals Grid */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Signal Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal) => (
            <div key={signal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{signal.id}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${getSignalColor(signal.currentState)}`}></div>
                  <div className={`w-2 h-2 rounded-full ${signal.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{signal.location}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModeColor(signal.mode)}`}>
                  {signal.mode}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.floor(signal.timeRemaining / 60)}:{(signal.timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEmergencyOverride(signal.id)}
                  disabled={signal.mode === 'emergency'}
                  className="flex-1 bg-red-600 text-white text-xs py-1 px-2 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  Emergency
                </button>
                <button
                  onClick={() => handleNormalMode(signal.id)}
                  disabled={signal.mode === 'normal'}
                  className="flex-1 bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  Normal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}