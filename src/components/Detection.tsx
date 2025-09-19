import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Volume2, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface DetectionFeed {
  id: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastDetection: string;
  detectionCount: number;
}

interface DetectedVehicle {
  id: string;
  type: 'ambulance' | 'fire_truck' | 'police';
  confidence: number;
  timestamp: string;
  location: string;
  sirenDetected: boolean;
}

export function Detection() {
  const [feeds, setFeeds] = useState<DetectionFeed[]>([
    { id: 'CAM001', location: 'Main St & 5th Ave', status: 'active', lastDetection: '2 min ago', detectionCount: 12 },
    { id: 'CAM002', location: 'Broadway & Oak St', status: 'active', lastDetection: '5 min ago', detectionCount: 8 },
    { id: 'CAM003', location: 'Park Ave & 1st St', status: 'inactive', lastDetection: '1 hour ago', detectionCount: 3 },
    { id: 'CAM004', location: 'Center St & Pine Ave', status: 'maintenance', lastDetection: '3 hours ago', detectionCount: 15 },
  ]);

  const [detectedVehicles, setDetectedVehicles] = useState<DetectedVehicle[]>([
    { id: '1', type: 'ambulance', confidence: 0.94, timestamp: '14:23:45', location: 'Main St & 5th Ave', sirenDetected: true },
    { id: '2', type: 'fire_truck', confidence: 0.89, timestamp: '14:18:32', location: 'Broadway & Oak St', sirenDetected: true },
    { id: '3', type: 'police', confidence: 0.92, timestamp: '14:15:21', location: 'Park Ave & 1st St', sirenDetected: false },
  ]);

  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new detections
      if (Math.random() > 0.7) {
        const vehicleTypes: ('ambulance' | 'fire_truck' | 'police')[] = ['ambulance', 'fire_truck', 'police'];
        const locations = ['Main St & 5th Ave', 'Broadway & Oak St', 'Park Ave & 1st St', 'Center St & Pine Ave'];
        
        const newDetection: DetectedVehicle = {
          id: Date.now().toString(),
          type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
          confidence: 0.80 + Math.random() * 0.19,
          timestamp: new Date().toLocaleTimeString(),
          location: locations[Math.floor(Math.random() * locations.length)],
          sirenDetected: Math.random() > 0.3
        };

        setDetectedVehicles(prev => [newDetection, ...prev.slice(0, 9)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getVehicleIcon = (type: string) => {
    const icons = {
      ambulance: '🚑',
      fire_truck: '🚒',
      police: '🚓'
    };
    return icons[type as keyof typeof icons] || '🚗';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Detection System</h2>
        <p className="text-gray-600">AI-powered emergency vehicle detection using computer vision and audio analysis</p>
      </div>

      {/* Detection Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Controls</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isProcessing ? 'Processing' : 'Stopped'}
              </span>
            </div>
            <button
              onClick={() => setIsProcessing(!isProcessing)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                isProcessing 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isProcessing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isProcessing ? 'Stop Detection' : 'Start Detection'}</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Camera className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Visual Detection</span>
            </div>
            <p className="text-sm text-gray-600">YOLOv8 model active</p>
            <p className="text-lg font-bold text-blue-600">94.2% Accuracy</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Audio Detection</span>
            </div>
            <p className="text-sm text-gray-600">Siren recognition active</p>
            <p className="text-lg font-bold text-purple-600">87.8% Accuracy</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Combined Score</span>
            </div>
            <p className="text-sm text-gray-600">Multi-modal fusion</p>
            <p className="text-lg font-bold text-green-600">96.7% Accuracy</p>
          </div>
        </div>
      </div>

      {/* Camera Feeds */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Camera Feeds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feeds.map((feed) => (
            <div key={feed.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{feed.id}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feed.status)}`}>
                  {feed.status}
                </span>
              </div>
              
              {/* Simulated video feed */}
              <div className="bg-gray-900 h-24 rounded-md mb-3 flex items-center justify-center">
                {feed.status === 'active' ? (
                  <div className="text-green-400 text-xs">● LIVE</div>
                ) : (
                  <div className="text-red-400 text-xs">● OFFLINE</div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-1">{feed.location}</p>
              <p className="text-xs text-gray-500">Last: {feed.lastDetection}</p>
              <p className="text-xs text-gray-500">Detections: {feed.detectionCount}</p>
              
              <button className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-1 px-2 rounded transition-colors">
                <Settings className="h-3 w-3 inline mr-1" />
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Detections */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Detections</h3>
        <div className="space-y-3">
          {detectedVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getVehicleIcon(vehicle.type)}</div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {vehicle.type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">{vehicle.location}</p>
                  <p className="text-xs text-gray-500">{vehicle.timestamp}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {(vehicle.confidence * 100).toFixed(1)}%
                  </span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                
                <div className="flex items-center space-x-1">
                  <Volume2 className={`h-3 w-3 ${vehicle.sirenDetected ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-xs text-gray-500">
                    {vehicle.sirenDetected ? 'Siren detected' : 'No siren'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}