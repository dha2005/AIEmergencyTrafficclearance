import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'emergency' | 'warning' | 'info';
  vehicleType: string;
  location: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'acknowledged';
  recipients: number;
  acknowledgedBy: number;
}

interface PoliceUnit {
  id: string;
  callSign: string;
  location: string;
  distance: number;
  status: 'available' | 'busy' | 'responding';
  lastSeen: string;
}

export function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'ALT001',
      type: 'emergency',
      vehicleType: 'Ambulance',
      location: 'Main St & 5th Ave',
      timestamp: '14:23:45',
      status: 'acknowledged',
      recipients: 8,
      acknowledgedBy: 6
    },
    {
      id: 'ALT002',
      type: 'emergency',
      vehicleType: 'Fire Truck',
      location: 'Broadway & Oak St',
      timestamp: '14:18:32',
      status: 'delivered',
      recipients: 12,
      acknowledgedBy: 9
    },
    {
      id: 'ALT003',
      type: 'warning',
      vehicleType: 'Police',
      location: 'Park Ave & 1st St',
      timestamp: '14:15:21',
      status: 'sent',
      recipients: 5,
      acknowledgedBy: 2
    }
  ]);

  const [policeUnits, setPoliceUnits] = useState<PoliceUnit[]>([
    { id: 'U001', callSign: 'Alpha-1', location: 'Downtown', distance: 0.8, status: 'available', lastSeen: '2 min ago' },
    { id: 'U002', callSign: 'Bravo-2', location: 'Midtown', distance: 1.2, status: 'responding', lastSeen: '1 min ago' },
    { id: 'U003', callSign: 'Charlie-3', location: 'Eastside', distance: 2.1, status: 'available', lastSeen: '5 min ago' },
    { id: 'U004', callSign: 'Delta-4', location: 'Westside', distance: 1.8, status: 'busy', lastSeen: '3 min ago' },
    { id: 'U005', callSign: 'Echo-5', location: 'Northside', distance: 3.2, status: 'available', lastSeen: '1 min ago' },
    { id: 'U006', callSign: 'Foxtrot-6', location: 'Southside', distance: 2.7, status: 'available', lastSeen: '4 min ago' },
  ]);

  const [newAlertData, setNewAlertData] = useState({
    vehicleType: 'Ambulance',
    location: '',
    priority: 'high'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate alert status updates
      setAlerts(prev => prev.map(alert => {
        if (alert.status === 'sent' && Math.random() > 0.7) {
          return { ...alert, status: 'delivered', acknowledgedBy: alert.acknowledgedBy + 1 };
        }
        if (alert.status === 'delivered' && Math.random() > 0.8) {
          return { ...alert, status: 'acknowledged', acknowledgedBy: alert.acknowledgedBy + 1 };
        }
        return alert;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sendEmergencyAlert = () => {
    if (!newAlertData.location) return;

    const newAlert: Alert = {
      id: `ALT${Date.now()}`,
      type: 'emergency',
      vehicleType: newAlertData.vehicleType,
      location: newAlertData.location,
      timestamp: new Date().toLocaleTimeString(),
      status: 'sent',
      recipients: policeUnits.filter(u => u.distance <= 5 && u.status === 'available').length,
      acknowledgedBy: 0
    };

    setAlerts(prev => [newAlert, ...prev]);
    setNewAlertData({ vehicleType: 'Ambulance', location: '', priority: 'high' });
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUnitStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-red-100 text-red-800';
      case 'responding': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Emergency Alert System</h2>
        <p className="text-gray-600">Real-time alert dispatch to police units within 5km radius</p>
      </div>

      {/* Alert Creation */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Emergency Alert</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              value={newAlertData.vehicleType}
              onChange={(e) => setNewAlertData(prev => ({ ...prev, vehicleType: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Ambulance">Ambulance</option>
              <option value="Fire Truck">Fire Truck</option>
              <option value="Police">Police</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={newAlertData.location}
              onChange={(e) => setNewAlertData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter intersection or address"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={newAlertData.priority}
              onChange={(e) => setNewAlertData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <button
              onClick={sendEmergencyAlert}
              disabled={!newAlertData.location}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              <Send className="h-4 w-4 inline mr-2" />
              Send Alert
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alerts Sent Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">127</p>
            </div>
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Units</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {policeUnits.filter(u => u.status === 'available').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">32s</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Acknowledgment Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">94.7%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Alerts and Police Units */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 ${getAlertTypeColor(alert.type)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">{alert.vehicleType}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{alert.location}</span>
                  </p>
                  <p className="text-sm flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{alert.timestamp}</span>
                  </p>
                  <p className="text-sm flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{alert.acknowledgedBy}/{alert.recipients} acknowledged</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Police Units */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Police Units (Within 5km)</h3>
          <div className="space-y-3">
            {policeUnits.map((unit) => (
              <div key={unit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{unit.callSign.split('-')[1]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{unit.callSign}</p>
                    <p className="text-sm text-gray-600">{unit.location}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getUnitStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{unit.distance}km • {unit.lastSeen}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}