import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Users,
  Car,
  MapPin
} from 'lucide-react';

interface DashboardStats {
  activeEmergencies: number;
  averageResponseTime: number;
  alertsSent: number;
  clearedIntersections: number;
  vehiclesDetected: number;
  policeUnitsAlerted: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeEmergencies: 3,
    averageResponseTime: 45,
    alertsSent: 127,
    clearedIntersections: 8,
    vehiclesDetected: 12,
    policeUnitsAlerted: 23
  });

  const [recentEvents, setRecentEvents] = useState([
    { id: 1, type: 'Ambulance', location: 'Main St & 5th Ave', time: '2 min ago', status: 'Active' },
    { id: 2, type: 'Fire Truck', location: 'Broadway & Oak St', time: '5 min ago', status: 'Cleared' },
    { id: 3, type: 'Police', location: 'Park Ave & 1st St', time: '8 min ago', status: 'Active' },
    { id: 4, type: 'Ambulance', location: 'Center St & Pine Ave', time: '12 min ago', status: 'Active' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeEmergencies: Math.max(0, prev.activeEmergencies + (Math.random() > 0.7 ? 1 : -1)),
        averageResponseTime: Math.max(20, prev.averageResponseTime + (Math.random() - 0.5) * 10),
        alertsSent: prev.alertsSent + Math.floor(Math.random() * 3),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Active Emergencies',
      value: stats.activeEmergencies,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+2 from last hour'
    },
    {
      title: 'Avg Response Time',
      value: `${stats.averageResponseTime.toFixed(0)}s`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '-5s from yesterday'
    },
    {
      title: 'Alerts Sent Today',
      value: stats.alertsSent,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15% from yesterday'
    },
    {
      title: 'Intersections Cleared',
      value: stats.clearedIntersections,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'Real-time count'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">System Dashboard</h2>
        <p className="text-gray-600">Real-time monitoring of emergency traffic clearance operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Status and Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">AI Detection System</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">Traffic Signal Network</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">Alert Dispatch System</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Camera Feed (Sector 4)</span>
              </div>
              <span className="text-sm text-yellow-600 font-medium">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Emergency Events</h3>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Car className={`h-5 w-5 ${
                    event.type === 'Ambulance' ? 'text-red-600' :
                    event.type === 'Fire Truck' ? 'text-orange-600' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{event.type}</p>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === 'Active' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {event.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.vehiclesDetected}</span>
            </div>
            <p className="text-sm text-gray-600">Emergency Vehicles Detected</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.policeUnitsAlerted}</span>
            </div>
            <p className="text-sm text-gray-600">Police Units Alerted</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">97.3%</span>
            </div>
            <p className="text-sm text-gray-600">System Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}