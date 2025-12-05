
import React, { useState, useEffect } from 'react';
import { 
  Eye, Mail, Bell, Lock, FileText, Save, Upload, RefreshCw, 
  CheckCircle, AlertTriangle, Server, Smartphone, Shield
} from 'lucide-react';
import { MOCK_ACTIVITY_LOGS } from '../constants';

interface SettingsViewProps {
  activeView?: string;
}

type TabId = 'set-branding' | 'set-gateway' | 'set-notifications' | 'set-security' | 'set-audit';

const TABS = [
  { id: 'set-branding', label: 'App Branding', icon: <Eye size={18} /> },
  { id: 'set-gateway', label: 'Email/SMS Gateway', icon: <Mail size={18} /> },
  { id: 'set-notifications', label: 'Notification Triggers', icon: <Bell size={18} /> },
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
      case 'set-gateway': return <GatewaySettings />;
      case 'set-notifications': return <NotificationSettings />;
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

       {/* SMS API Section */}
       <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Smartphone size={20} className="text-blue-500" />
                SMS API Gateway
            </h2>
            <p className="text-sm text-gray-500 mt-1">Configure third-party SMS providers.</p>
          </div>
          <div className="space-y-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900">
                      <option>Twilio</option>
                      <option>AWS SNS</option>
                      <option>Msg91</option>
                      <option>Custom Webhook</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key / SID</label>
                  <input type="text" defaultValue="AC8f832j2390jf023jd023jd2" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auth Token</label>
                  <input type="password" defaultValue="••••••••••••••••••••••••" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900" />
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
  const TRIGGERS = [
      { name: 'New Order Placed', desc: 'When a customer successfully completes checkout.', email: true, sms: false, push: true },
      { name: 'Refund Requested', desc: 'When a customer submits a return form.', email: true, sms: false, push: true },
      { name: 'Low Stock Alert', desc: 'When product inventory dips below threshold.', email: true, sms: true, push: false },
      { name: 'New User Registration', desc: 'When a new B2B/B2C account is created.', email: false, sms: false, push: true },
      { name: 'Delivery Status Update', desc: 'When Porter status changes to "Out for Delivery".', email: true, sms: true, push: true },
  ];

  return (
    <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 pb-0 mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Bell size={20} className="text-amber-500" />
                    Auto Alerts & Triggers
                </h2>
                <p className="text-sm text-gray-500 mt-1">Configure which channels to use for system events.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Event Trigger</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">Email</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">SMS</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">In-App</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {TRIGGERS.map((t, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{t.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <input type="checkbox" defaultChecked={t.email} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <input type="checkbox" defaultChecked={t.sms} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <input type="checkbox" defaultChecked={t.push} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="flex justify-end pt-2">
            <button 
              onClick={() => alert("Triggers updated successfully!")}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold shadow-sm hover:bg-gray-800 transition-all flex items-center gap-2"
            >
                <Save size={18} />
                Update Triggers
            </button>
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
                            <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label className="toggle-label block overflow-hidden h-5 rounded-full bg-indigo-600 cursor-pointer"></label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                         <span className="text-sm font-medium text-gray-700">Require Number</span>
                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
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
                    <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
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
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                        log.status === 'SUCCESS' ? 'bg-green-100 text-green-800 border border-green-200' :
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
