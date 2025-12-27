
import React, { useState } from 'react';
import { Package, Search, ExternalLink, Truck, MapPin, Calendar } from 'lucide-react';
import { MOCK_OUTSTATION_SHIPMENTS } from '../constants';

const TABS = [
  { id: 'all', label: 'All Shipments', icon: <Package size={18} /> },
  { id: 'partners', label: 'Courier Partner', icon: <Search size={18} /> },
];

export const DeliveryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShipments = MOCK_OUTSTATION_SHIPMENTS.filter(d => 
    d.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 -m-4 sm:-m-6 lg:-m-8 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Delivery (Outstation)</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage long-distance shipments exclusively via Delhivery.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 shrink-0">
        <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                ${activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <span className={activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {activeTab === 'all' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search Order ID or Customer..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none text-sm text-gray-900 bg-white"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-black border border-gray-300 rounded-lg text-white font-medium text-white hover:bg-gray-800">
                                Filter Status
                            </button>
                            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm">
                                Export Report
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Destination</th>
                                    <th className="px-6 py-4">Courier Partner</th>
                                    <th className="px-6 py-4">Tracking ID</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Est. Delivery</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredShipments.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-blue-600">{item.orderId}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.customerName}
                                            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${item.type === 'B2B' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} className="text-gray-400" />
                                                {item.city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-red-50 rounded text-xs font-bold text-red-700 border border-red-100">
                                                {item.partner}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-600 flex items-center gap-2">
                                            {item.trackingId !== 'pending' ? item.trackingId : <span className="text-gray-400 italic">Generating...</span>}
                                            {item.trackingId !== 'pending' && <a href="#" className="text-blue-400 hover:text-blue-600"><ExternalLink size={12}/></a>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                item.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                                item.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                            <div className="flex items-center justify-end gap-1">
                                                <Calendar size={14} className="text-gray-400" />
                                                {item.estimatedDate}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredShipments.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No shipments found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'partners' && (
                <div className="flex justify-center items-start pt-10">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg flex flex-col items-center text-center max-w-md w-full">
                        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6">
                            <Truck size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Delhivery</h3>
                        <p className="text-gray-500 mb-6">Exclusive Logistics Partner for Pan-India Operations</p>
                        
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm font-medium text-gray-600">Service Status</span>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" /> Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm font-medium text-gray-600">API Connection</span>
                                <span className="text-xs font-bold text-gray-900">Connected</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm font-medium text-gray-600">Account Type</span>
                                <span className="text-xs font-bold text-gray-900">Enterprise</span>
                            </div>
                        </div>

                        <button className="mt-8 w-full py-2.5 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors text-sm">
                            Manage Configuration
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
