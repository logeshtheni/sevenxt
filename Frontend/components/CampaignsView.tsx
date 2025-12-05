
import React, { useState } from 'react';
import { 
  Tag, Zap, Image as ImageIcon, Megaphone, Plus, 
  Calendar, Search, MoreVertical, Edit3, Trash2, 
  TrendingUp, MousePointer, Eye, DollarSign, Filter, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';

// --- Mock Data ---

const MOCK_PROMOS = [
  { id: 'CPN-001', code: 'WELCOME20', type: 'Percentage', value: '20%', target: 'B2C', usage: '450/1000', status: 'Active', expiry: '2024-12-31' },
  { id: 'CPN-002', code: 'BULK500', type: 'Fixed', value: '₹500', target: 'B2B', usage: '12/50', status: 'Active', expiry: '2024-06-30' },
  { id: 'CPN-003', code: 'SUMMER10', type: 'Percentage', value: '10%', target: 'All', usage: '890/Unlimited', status: 'Expired', expiry: '2024-04-30' },
  { id: 'CPN-004', code: 'CORP_DISC', type: 'Percentage', value: '15%', target: 'B2B', usage: '45/100', status: 'Scheduled', expiry: '2024-08-01' },
];

const MOCK_FLASH_DEALS = [
  { id: 'FL-01', product: 'Sony WH-1000XM5', originalPrice: 24000, dealPrice: 19999, discount: '17%', endsIn: '04h 30m', status: 'Live', target: 'B2C' },
  { id: 'FL-02', product: 'Samsung 4K Monitor Bulk', originalPrice: 18000, dealPrice: 15500, discount: '14%', endsIn: '2 Days', status: 'Scheduled', target: 'B2B' },
  { id: 'FL-03', product: 'Mechanical Keyboards', originalPrice: 4500, dealPrice: 2999, discount: '33%', endsIn: 'Ended', status: 'Expired', target: 'All' },
];

const MOCK_BANNERS = [
  { id: 'BN-01', name: 'Summer Sale Hero', position: 'Home - Hero Slider', type: 'Image', status: 'Active', views: '12.5k', clicks: '450' },
  { id: 'BN-02', name: 'B2B Registration Popup', position: 'Global - Popup', type: 'Modal', status: 'Active', views: '3.2k', clicks: '120' },
  { id: 'BN-03', name: 'Electronics Category Top', position: 'Category - Header', type: 'Image', status: 'Inactive', views: '0', clicks: '0' },
];

const MOCK_AD_CAMPAIGNS = [
  { id: 'AD-01', name: 'Google Search - Electronics', platform: 'Google Ads', budget: 50000, spend: 34500, clicks: 2400, cpc: 14.3, roas: 4.5, status: 'Active' },
  { id: 'AD-02', name: 'Insta Retargeting', platform: 'Instagram', budget: 20000, spend: 18900, clicks: 890, cpc: 21.2, roas: 2.8, status: 'Active' },
  { id: 'AD-03', name: 'LinkedIn B2B Lead Gen', platform: 'LinkedIn', budget: 100000, spend: 12000, clicks: 150, cpc: 80.0, roas: 1.5, status: 'Paused' },
];

const PERFORMANCE_DATA = [
  { name: 'Mon', clicks: 400, conversions: 24 },
  { name: 'Tue', clicks: 300, conversions: 13 },
  { name: 'Wed', clicks: 550, conversions: 38 },
  { name: 'Thu', clicks: 450, conversions: 29 },
  { name: 'Fri', clicks: 600, conversions: 42 },
  { name: 'Sat', clicks: 800, conversions: 55 },
  { name: 'Sun', clicks: 750, conversions: 48 },
];

// --- Components ---

export const CampaignsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Promos');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Lists State
  const [promos, setPromos] = useState(MOCK_PROMOS);
  const [deals, setDeals] = useState(MOCK_FLASH_DEALS);

  // Modal States
  const [showPromoModal, setShowPromoModal] = useState(false);
  
  // Forms
  const [newPromo, setNewPromo] = useState({ code: '', type: 'Percentage', value: '', target: 'All', expiry: '' });

  const handleAddPromo = () => {
    if (newPromo.code && newPromo.value) {
      setPromos([...promos, {
        id: `CPN-${Date.now()}`,
        code: newPromo.code,
        type: newPromo.type,
        value: newPromo.value,
        target: newPromo.target,
        usage: '0/1000',
        status: 'Active',
        expiry: newPromo.expiry || 'N/A'
      }]);
      setShowPromoModal(false);
      setNewPromo({ code: '', type: 'Percentage', value: '', target: 'All', expiry: '' });
    }
  };

  const TABS = [
      { id: 'Promos', label: 'Coupons & Promos', icon: <Tag size={18} /> },
      { id: 'Flash Deals', label: 'Flash Deals', icon: <Zap size={18} /> },
      { id: 'Banners', label: 'Site Banners', icon: <ImageIcon size={18} /> },
      { id: 'Ad Campaigns', label: 'Ad Performance', icon: <Megaphone size={18} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">Campaigns & Promotions</h1>
            <p className="text-gray-500 text-sm">Manage discounts, flash sales, and advertising performance.</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 pt-2">
            <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                    group whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                    ${activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                >
                <span className={`${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {tab.icon}
                </span>
                {tab.label}
                </button>
            ))}
            </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2">
                
                {/* --- PROMOS TAB --- */}
                {activeTab === 'Promos' && (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search coupons..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <button 
                                onClick={() => setShowPromoModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm"
                            >
                                <Plus size={16} /> Create Coupon
                            </button>
                         </div>

                         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4">Value</th>
                                        <th className="px-6 py-4">Target</th>
                                        <th className="px-6 py-4">Usage</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {promos.filter(p => p.code.toLowerCase().includes(searchTerm.toLowerCase())).map(promo => (
                                        <tr key={promo.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono font-bold text-indigo-600">{promo.code}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">{promo.value}</span>
                                                <span className="text-gray-500 text-xs ml-1">({promo.type})</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{promo.target}</td>
                                            <td className="px-6 py-4 text-gray-600">{promo.usage}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    promo.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                                    promo.status === 'Expired' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {promo.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                )}

                {/* --- FLASH DEALS TAB --- */}
                {activeTab === 'Flash Deals' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map(deal => (
                            <div key={deal.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                                    <Zap size={48} className="text-gray-300" />
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm animate-pulse">
                                        Ends in {deal.endsIn}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 line-clamp-1" title={deal.product}>{deal.product}</h3>
                                    </div>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-2xl font-bold text-indigo-600">₹{deal.dealPrice.toLocaleString()}</span>
                                        <span className="text-sm text-gray-400 line-through mb-1">₹{deal.originalPrice.toLocaleString()}</span>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded mb-1">-{deal.discount}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                            <Tag size={12} /> {deal.target} Only
                                        </span>
                                        <button className="text-sm font-medium text-indigo-600 hover:underline">Edit Deal</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button 
                            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center h-full min-h-[250px] text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-all gap-2"
                        >
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <Plus size={24} className="text-indigo-600" />
                            </div>
                            <span className="font-medium">Create Flash Deal</span>
                        </button>
                    </div>
                )}

                {/* --- BANNERS TAB --- */}
                {activeTab === 'Banners' && (
                    <div className="space-y-6">
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                             {MOCK_BANNERS.map(banner => (
                                 <div key={banner.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                     <div className="h-32 bg-gray-100 flex items-center justify-center border-b border-gray-100">
                                         <ImageIcon size={32} className="text-gray-300" />
                                     </div>
                                     <div className="p-4">
                                         <div className="flex justify-between items-start mb-1">
                                             <h3 className="font-bold text-gray-900">{banner.name}</h3>
                                             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${banner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                 {banner.status}
                                             </span>
                                         </div>
                                         <p className="text-xs text-gray-500 mb-4">{banner.position}</p>
                                         <div className="flex gap-4 text-sm">
                                             <div>
                                                 <p className="text-gray-400 text-xs">Views</p>
                                                 <p className="font-bold text-gray-900">{banner.views}</p>
                                             </div>
                                             <div>
                                                 <p className="text-gray-400 text-xs">Clicks</p>
                                                 <p className="font-bold text-gray-900">{banner.clicks}</p>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                )}

                {/* --- AD CAMPAIGNS TAB --- */}
                {activeTab === 'Ad Campaigns' && (
                    <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {MOCK_AD_CAMPAIGNS.map(ad => (
                                 <div key={ad.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                     <div className="flex justify-between items-start mb-4">
                                         <div>
                                             <h3 className="font-bold text-gray-900 text-sm">{ad.name}</h3>
                                             <p className="text-xs text-gray-500">{ad.platform}</p>
                                         </div>
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                             {ad.status}
                                         </span>
                                     </div>
                                     <div className="grid grid-cols-2 gap-4 mb-4">
                                         <div>
                                             <p className="text-xs text-gray-400">Spend / Budget</p>
                                             <p className="font-bold text-gray-900 text-sm">₹{ad.spend.toLocaleString()} <span className="text-gray-400 font-normal">/ ₹{ad.budget.toLocaleString()}</span></p>
                                         </div>
                                         <div>
                                             <p className="text-xs text-gray-400">ROAS</p>
                                             <p className={`font-bold text-sm ${ad.roas > 3 ? 'text-green-600' : 'text-yellow-600'}`}>{ad.roas}x</p>
                                         </div>
                                     </div>
                                     <div className="w-full bg-gray-100 rounded-full h-1.5">
                                         <div 
                                            className="bg-indigo-600 h-1.5 rounded-full" 
                                            style={{width: `${(ad.spend/ad.budget)*100}%`}}
                                         />
                                     </div>
                                 </div>
                             ))}
                         </div>

                         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                             <h3 className="font-bold text-gray-900 mb-4">Performance Trend (Last 7 Days)</h3>
                             <div className="h-[300px]">
                                 <ResponsiveContainer width="100%" height="100%">
                                     <LineChart data={PERFORMANCE_DATA}>
                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                         <Tooltip />
                                         <Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={3} dot={{r:4}} name="Clicks" />
                                         <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} dot={{r:4}} name="Conversions" />
                                     </LineChart>
                                 </ResponsiveContainer>
                             </div>
                         </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- MODALS --- */}
        {showPromoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900">Create New Coupon</h3>
                        <button onClick={() => setShowPromoModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg uppercase"
                                placeholder="e.g. SALE50"
                                value={newPromo.code}
                                onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    value={newPromo.type}
                                    onChange={e => setNewPromo({...newPromo, type: e.target.value})}
                                >
                                    <option>Percentage</option>
                                    <option>Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="e.g. 20%"
                                    value={newPromo.value}
                                    onChange={e => setNewPromo({...newPromo, value: e.target.value})}
                                />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                            <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                value={newPromo.target}
                                onChange={e => setNewPromo({...newPromo, target: e.target.value})}
                            >
                                <option>All</option>
                                <option>B2B</option>
                                <option>B2C</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleAddPromo}
                            className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Create Coupon
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
