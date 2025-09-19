import React, { useState } from 'react';
import { 
  Map, 
  Navigation, 
  MapPin,
  Clock,
  Route,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface EmergencyRoute {
  id: string;
  vehicleType: string;
  startLocation: string;
  destination: string;
  currentLocation: string;
  progress: number;
  eta: number;
  status: 'active' | 'completed';
}

interface TrafficData {
  intersection: string;
  congestionLevel: 'low' | 'medium' | 'high';
  signalStatus: 'normal' | 'preempted';
  estimatedDelay: number;
}

export function MapView() {
  const [activeRoutes, setActiveRoutes] = useState<EmergencyRoute[]>([
    {
      id: 'R001',
      vehicleType: 'Ambulance',
      startLocation: 'Main St & 8th Ave',
      destination: 'City General Hospital',
      currentLocation: 'Main St & 5th Ave',
      progress: 65,
      eta: 180,
      status: 'active'
    },
    {
      id: 'R002',
      vehicleType: 'Fire Truck',
      startLocation: 'Fire Station #3',
      destination: 'Broadway & Oak St',
      currentLocation: 'Broadway & Pine St',
      progress: 85,
      eta: 90,
      status: 'active'
    }
  ]);

  const [trafficData, setTrafficData] = useState<TrafficData[]>([
    { intersection: 'Main St & 5th Ave', congestionLevel: 'low', signalStatus: 'preempted', estimatedDelay: 0 },
    { intersection: 'Main St & 4th Ave', congestionLevel: 'medium', signalStatus: 'preempted', estimatedDelay: 15 },
    { intersection: 'Main St & 3rd Ave', congestionLevel: 'low', signalStatus: 'normal', estimatedDelay: 30 },
    { intersection: 'Broadway & Oak St', congestionLevel: 'high', signalStatus: 'preempted', estimatedDelay: 0 },
    { intersection: 'Park Ave & 1st St', congestionLevel: 'medium', signalStatus: 'normal', estimatedDelay: 45 },
  ]);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRouteStatusColor = (status: string) => {
    return status === 'active' ? 'text-blue-600 bg-blue-100' : 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Route Management & Traffic Map</h2>
        <p className="text-gray-600">Real-time visualization of emergency routes and traffic conditions</p>
      </div>

      {/* Map Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Map Controls</h3>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
              <Navigation className="h-4 w-4 inline mr-2" />
              Recalculate Routes
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium">
              <Map className="h-4 w-4 inline mr-2" />
              Satellite View
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Route className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Active Routes</span>
            </div>
            <p className="text-lg font-bold text-blue-600 mt-1">
              {activeRoutes.filter(r => r.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Cleared Paths</span>
            </div>
            <p className="text-lg font-bold text-green-600 mt-1">8</p>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-gray-900">High Congestion</span>
            </div>
            <p className="text-lg font-bold text-red-600 mt-1">
              {trafficData.filter(t => t.congestionLevel === 'high').length}
            </p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Avg ETA</span>
            </div>
            <p className="text-lg font-bold text-purple-600 mt-1">
              {Math.round(activeRoutes.reduce((acc, r) => acc + r.eta, 0) / activeRoutes.length / 60)}m
            </p>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-800 h-96 relative">
          {/* Simulated Map Interface */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900">
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-red-500"></div>
                  <span>Emergency Route</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-green-500"></div>
                  <span>Clear Path</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-yellow-500"></div>
                  <span>Moderate Traffic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Emergency Vehicle</span>
                </div>
              </div>
            </div>
            
            {/* Simulated Route Paths */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="route1" patternUnits="userSpaceOnUse" width="10" height="4">
                  <rect width="10" height="4" fill="#EF4444"/>
                </pattern>
                <pattern id="route2" patternUnits="userSpaceOnUse" width="10" height="4">
                  <rect width="10" height="4" fill="#F97316"/>
                </pattern>
              </defs>
              
              {/* Route 1 - Ambulance */}
              <path 
                d="M 50 300 Q 200 250 350 200 T 600 150" 
                stroke="url(#route1)" 
                strokeWidth="6" 
                fill="none"
                className="animate-pulse"
              />
              
              {/* Route 2 - Fire Truck */}
              <path 
                d="M 100 350 L 300 280 L 500 220" 
                stroke="url(#route2)" 
                strokeWidth="6" 
                fill="none"
                className="animate-pulse"
              />
              
              {/* Emergency Vehicles */}
              <circle cx="350" cy="200" r="8" fill="#3B82F6" className="animate-pulse">
                <title>Ambulance - Main St & 5th Ave</title>
              </circle>
              <circle cx="500" cy="220" r="8" fill="#DC2626" className="animate-pulse">
                <title>Fire Truck - Broadway & Pine St</title>
              </circle>
              
              {/* Traffic Signals */}
              <circle cx="250" cy="270" r="4" fill="#10B981" />
              <circle cx="400" cy="180" r="4" fill="#10B981" />
              <circle cx="150" cy="320" r="4" fill="#EF4444" />
            </svg>
            
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">Live Traffic Data</p>
              <p className="text-xs text-gray-600">Updated 30 seconds ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route Details and Traffic Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Emergency Routes */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Emergency Routes</h3>
          <div className="space-y-4">
            {activeRoutes.map((route) => (
              <div key={route.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-xl">
                      {route.vehicleType === 'Ambulance' ? '🚑' : 
                       route.vehicleType === 'Fire Truck' ? '🚒' : '🚓'}
                    </div>
                    <span className="font-medium text-gray-900">{route.vehicleType}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRouteStatusColor(route.status)}`}>
                    {route.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>From: {route.startLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>To: {route.destination}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Navigation className="h-3 w-3" />
                    <span>Current: {route.currentLocation}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{route.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${route.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>ETA: {Math.floor(route.eta / 60)}m {route.eta % 60}s</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Status */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Status by Intersection</h3>
          <div className="space-y-3">
            {trafficData.map((traffic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{traffic.intersection}</p>
                    <p className="text-sm text-gray-600">
                      Signal: {traffic.signalStatus === 'preempted' ? 'Emergency Override' : 'Normal Operation'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCongestionColor(traffic.congestionLevel)}`}>
                    {traffic.congestionLevel} traffic
                  </span>
                  {traffic.estimatedDelay > 0 && (
                    <p className="text-xs text-gray-500 mt-1">+{traffic.estimatedDelay}s delay</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}