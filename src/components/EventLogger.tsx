import React, { useState } from 'react';
import { 
  FileText, 
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface LogEvent {
  id: string;
  timestamp: string;
  type: 'detection' | 'alert' | 'signal_change' | 'route_clear' | 'system';
  severity: 'info' | 'warning' | 'error' | 'critical';
  vehicleType?: string;
  location: string;
  description: string;
  duration?: number;
  status: 'completed' | 'ongoing' | 'failed';
  responseTime?: number;
}

export function EventLogger() {
  const [events] = useState<LogEvent[]>([
    {
      id: 'EVT001',
      timestamp: '2024-01-15T14:23:45Z',
      type: 'detection',
      severity: 'info',
      vehicleType: 'Ambulance',
      location: 'Main St & 5th Ave',
      description: 'Emergency vehicle detected with 94% confidence',
      status: 'completed',
      responseTime: 1.2
    },
    {
      id: 'EVT002',
      timestamp: '2024-01-15T14:23:47Z',
      type: 'alert',
      severity: 'warning',
      vehicleType: 'Ambulance',
      location: 'Main St & 5th Ave',
      description: 'Emergency alert sent to 8 police units within 5km radius',
      status: 'completed',
      responseTime: 2.1
    },
    {
      id: 'EVT003',
      timestamp: '2024-01-15T14:23:52Z',
      type: 'signal_change',
      severity: 'info',
      location: 'Main St & 5th Ave',
      description: 'Traffic signal preempted to green for emergency corridor',
      duration: 120,
      status: 'ongoing',
      responseTime: 5.8
    },
    {
      id: 'EVT004',
      timestamp: '2024-01-15T14:18:32Z',
      type: 'detection',
      severity: 'info',
      vehicleType: 'Fire Truck',
      location: 'Broadway & Oak St',
      description: 'Fire truck detected with audio confirmation (siren)',
      status: 'completed',
      responseTime: 0.9
    },
    {
      id: 'EVT005',
      timestamp: '2024-01-15T14:18:35Z',
      type: 'route_clear',
      severity: 'info',
      vehicleType: 'Fire Truck',
      location: 'Broadway & Oak St',
      description: 'Green corridor established for fire truck route',
      duration: 180,
      status: 'completed',
      responseTime: 3.2
    },
    {
      id: 'EVT006',
      timestamp: '2024-01-15T14:15:21Z',
      type: 'system',
      severity: 'warning',
      location: 'Camera Feed CAM003',
      description: 'Camera feed offline - switching to backup detection',
      status: 'ongoing'
    },
    {
      id: 'EVT007',
      timestamp: '2024-01-15T14:12:45Z',
      type: 'alert',
      severity: 'error',
      vehicleType: 'Police',
      location: 'Park Ave & 1st St',
      description: 'Alert delivery failed to unit Charlie-3',
      status: 'failed',
      responseTime: 8.5
    },
    {
      id: 'EVT008',
      timestamp: '2024-01-15T14:08:12Z',
      type: 'signal_change',
      severity: 'critical',
      location: 'Center St & Pine Ave',
      description: 'Traffic signal controller unresponsive',
      status: 'failed'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.vehicleType && event.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'detection': return AlertTriangle;
      case 'alert': return FileText;
      case 'signal_change': return Clock;
      case 'route_clear': return CheckCircle;
      case 'system': return XCircle;
      default: return FileText;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Severity', 'Vehicle Type', 'Location', 'Description', 'Status', 'Response Time (s)'].join(','),
      ...filteredEvents.map(event => [
        event.timestamp,
        event.type,
        event.severity,
        event.vehicleType || '',
        event.location,
        `"${event.description}"`,
        event.status,
        event.responseTime || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emergency_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Logger</h2>
        <p className="text-gray-600">Comprehensive logging and audit trail for all emergency traffic events</p>
      </div>

      {/* Controls and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="detection">Detection</option>
              <option value="alert">Alert</option>
              <option value="signal_change">Signal Change</option>
              <option value="route_clear">Route Clear</option>
              <option value="system">System</option>
            </select>
            
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
            
            <button
              onClick={exportLogs}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="h-4 w-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{filteredEvents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredEvents.filter(e => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ongoing</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredEvents.filter(e => e.status === 'ongoing').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredEvents.filter(e => e.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Log Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Event Log</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(event.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <EventIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{event.type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {event.description}
                      {event.vehicleType && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                          {event.vehicleType}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.responseTime ? `${event.responseTime}s` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}