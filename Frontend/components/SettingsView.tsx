
import React, { useState, useEffect } from 'react';
import {
  Eye, Mail, Bell, Lock, FileText, Save, Upload, RefreshCw,
  CheckCircle, AlertTriangle, Shield, Package
} from 'lucide-react';
import { MOCK_ACTIVITY_LOGS } from '../constants';

interface SettingsViewProps {
  activeView?: string;
}

type TabId = 'set-branding' | 'set-notifications' | 'set-stock-alerts' | 'set-security' | 'set-audit';

const TABS = [
  { id: 'set-branding', label: 'App Branding', icon: <Eye size={18} /> },
  { id: 'set-notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'set-stock-alerts', label: 'Stock Alerts', icon: <Package size={18} /> },
  { id: 'set-security', label: 'Security Settings', icon: <Lock size={18} /> },
  { id: 'set-audit', label: 'Audit Logs', icon: <FileText size={18} /> },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ activeView }) => {
  const [activeTab, setActiveTab] = useState<TabId>('set-branding');

  // Sync activeTab with prop activeView if it matches one of our tabs
  useEffect(() => {
    if (activeView && TABS.some(t => t.id === activeView)) {
      setActiveTab(activeView as TabId);
    } else if (activeView === 'settings') {
      setActiveTab('set-branding');
    }
  }, [activeView]);

  const renderContent = () => {
    switch (activeTab) {
      case 'set-branding': return <BrandingSettings />;
      case 'set-notifications': return <NotificationSettings />;
      case 'set-stock-alerts': return <StockAlertSettings />;
      case 'set-security': return <SecuritySettings />;
      case 'set-audit': return <AuditLogsSettings />;
      default: return <BrandingSettings />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage application branding, integrations, and security protocols.</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-8 shrink-0">
        <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`
                group whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <span className={activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area with Animation */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for Each Section ---

const BrandingSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Eye size={20} className="text-pink-500" />
            Logo & Identity
          </h2>
          <p className="text-sm text-gray-500 mt-1">Customize the look and feel of the dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
            <input type="text" defaultValue="Nexus Commerce Dashboard" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow text-gray-900" />
            <p className="text-xs text-gray-500 mt-1">Displayed in browser title and emails.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
            <input type="email" defaultValue="support@nexus.com" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow text-gray-900" />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-3">App Logo</label>
            <div className="flex items-center gap-6">
              <div
                onClick={() => alert("Upload dialog opened")}
                className="w-24 h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Upload size={24} className="text-gray-400" />
              </div>
              <div>
                <button
                  onClick={() => alert("Upload dialog opened")}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Upload New
                </button>
                <p className="text-xs text-gray-500 mt-2">Recommended size: 512x512px. PNG or SVG.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <RefreshCw size={20} className="text-pink-500" />
            Theme Customization
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
              <input type="color" defaultValue="#4f46e5" className="h-8 w-8 rounded border-0 cursor-pointer bg-transparent" />
              <span className="text-sm font-mono text-gray-600">#4f46e5</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
            <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
              <input type="color" defaultValue="#0f172a" className="h-8 w-8 rounded border-0 cursor-pointer bg-transparent" />
              <span className="text-sm font-mono text-gray-600">#0f172a</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
            <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
              <input type="color" defaultValue="#f43f5e" className="h-8 w-8 rounded border-0 cursor-pointer bg-transparent" />
              <span className="text-sm font-mono text-gray-600">#f43f5e</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => alert("Branding settings saved!")}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold shadow-sm hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Save size={18} />
          Save Branding
        </button>
      </div>
    </div>
  );
};

const GatewaySettings = () => {
  return (
    <div className="space-y-6">
      {/* SMTP Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Server size={20} className="text-blue-500" />
            SMTP Configuration
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Connection Status:</span>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              <CheckCircle size={10} /> Connected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
            <input type="text" defaultValue="smtp.gmail.com" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
            <input type="text" defaultValue="587" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
            <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900">
              <option>TLS</option>
              <option>SSL</option>
              <option>None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input type="text" defaultValue="notifications@nexus.com" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" defaultValue="••••••••••••" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900" />
          </div>
        </div>
      </div>



      <div className="flex justify-end pt-2">
        <button
          onClick={() => alert("Gateway settings saved!")}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold shadow-sm hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Save size={18} />
          Save Configurations
        </button>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch today's notifications (orders, refunds, exchanges)
      const response = await fetch('http://localhost:8001/api/v1/notifications/today');

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package size={16} className="text-blue-600" />;
      case 'refund':
        return <AlertTriangle size={16} className="text-orange-600" />;
      case 'exchange':
        return <RefreshCw size={16} className="text-purple-600" />;
      case 'delivery':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'refund':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'exchange':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivery':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell size={20} className="text-amber-500" />
              Today's Notifications
            </h2>
            <p className="text-sm text-gray-500 mt-1">Recent orders, refunds, and exchanges from today</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              {notifications.filter(n => n.status === 'unread').length} Unread
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Notification</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No notifications for today
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr key={notification.id} className={`hover:bg-gray-50 transition-colors ${notification.status === 'unread' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getNotificationBadgeColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{notification.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {notification.status === 'unread' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
                          New
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                          Read
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield size={20} className="text-red-500" />
            Password Policy
          </h2>
          <p className="text-sm text-gray-500 mt-1">Define complexity requirements for user passwords.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
            <input type="number" defaultValue="8" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (Days)</label>
            <input type="number" defaultValue="90" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900" />
          </div>
          <div className="col-span-full space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Require Special Character</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                <label className="toggle-label block overflow-hidden h-5 rounded-full bg-indigo-600 cursor-pointer"></label>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Require Number</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                <label className="toggle-label block overflow-hidden h-5 rounded-full bg-indigo-600 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={20} className="text-red-500" />
          Two-Factor Authentication (2FA)
        </h2>
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
          <AlertTriangle size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900">Enforce 2FA for Staff</p>
            <p className="text-xs text-blue-700 mt-1">Turning this on will force all ADMIN and MANAGER roles to setup 2FA on next login.</p>
          </div>
          <div className="ml-auto relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
            <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditLogsSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-gray-500" />
              Admin Activity Tracker
            </h2>
            <p className="text-sm text-gray-500 mt-1">Track sensitive actions performed by staff.</p>
          </div>
          <button
            onClick={() => alert("Audit logs exported to CSV")}
            className="px-4 py-2 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {MOCK_ACTIVITY_LOGS.slice(0, 8).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {log.user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {log.action}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-800 border border-green-200' :
                      log.status === 'FAILURE' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StockAlertSettings = () => {
  const [settings, setSettings] = useState({
    low_stock_threshold: 10,
    enable_email_alerts: true,
    enable_dashboard_alerts: true,
    alert_email: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchLowStockProducts();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/v1/settings/stock-alerts');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch('/api/v1/settings/low-stock-products');
      const data = await response.json();
      setLowStockProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/v1/settings/stock-alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        alert('✅ Stock alert settings saved successfully!');
        fetchLowStockProducts();
      }
    } catch (error: any) {
      alert(`❌ Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package size={20} className="text-orange-500" />
            Stock Alert Configuration
          </h2>
          <p className="text-sm text-gray-500 mt-1">Set threshold and notification preferences for low stock alerts</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
            <div className="flex items-center gap-3">
              <input type="number" min="0" value={settings.low_stock_threshold} onChange={(e) => setSettings({ ...settings, low_stock_threshold: parseInt(e.target.value) || 0 })} className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900" />
              <span className="text-sm text-gray-600">Alert when stock falls below this number</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Products with stock ≤ {settings.low_stock_threshold} units will trigger alerts</p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input type="checkbox" id="email-alerts" checked={settings.enable_email_alerts} onChange={(e) => setSettings({ ...settings, enable_email_alerts: e.target.checked })} className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
            <div className="flex-1">
              <label htmlFor="email-alerts" className="block text-sm font-medium text-gray-700 cursor-pointer">
                <div className="flex items-center gap-2"><Mail size={16} />Enable Email Alerts</div>
              </label>
              <p className="text-xs text-gray-500 mt-1">Send email notifications when products are low in stock</p>
              {settings.enable_email_alerts && (
                <div className="mt-3">
                  <input type="email" placeholder="admin@example.com" value={settings.alert_email || ''} onChange={(e) => setSettings({ ...settings, alert_email: e.target.value })} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-gray-900" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input type="checkbox" id="dashboard-alerts" checked={settings.enable_dashboard_alerts} onChange={(e) => setSettings({ ...settings, enable_dashboard_alerts: e.target.checked })} className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
            <div className="flex-1">
              <label htmlFor="dashboard-alerts" className="block text-sm font-medium text-gray-700 cursor-pointer">
                <div className="flex items-center gap-2"><Bell size={16} />Show Dashboard Alerts</div>
              </label>
              <p className="text-xs text-gray-500 mt-1">Display low stock warnings on the dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-900 mb-2">{lowStockProducts.length} Product{lowStockProducts.length !== 1 ? 's' : ''} Low in Stock</h3>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <span className="text-orange-800">{product.name} ({product.sku})</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{product.stock} units</span>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (<p className="text-xs text-orange-600 mt-2">+ {lowStockProducts.length - 5} more products</p>)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold shadow-sm hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? (<><RefreshCw size={18} className="animate-spin" />Saving...</>) : (<><Save size={18} />Save Stock Alert Settings</>)}
        </button>
      </div>
    </div>
  );
};
