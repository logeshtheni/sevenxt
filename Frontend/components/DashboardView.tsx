import React, { useState, useMemo } from 'react';
import { 
  Users, ShoppingCart, DollarSign, RefreshCcw, 
  Truck, AlertTriangle, TrendingUp, CheckCircle2, ArrowRight
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell
} from 'recharts';
import { MOCK_PRODUCTS } from '../constants';

// --- MOCK DATA SETS FOR DIFFERENT TIMEFRAMES ---

const DASHBOARD_DATA = {
  Today: {
    revenue: { value: '₹45,230', trend: 'up', percent: '+12%', subtext: 'vs yesterday' },
    orders: { value: '124', trend: 'up', percent: '+5%', subtext: 'vs yesterday' },
    users: { value: '45', trend: 'up', percent: '+8%', subtext: 'new signups' },
    refunds: { value: '2', trend: 'down', percent: '-50%', subtext: 'vs yesterday' },
    chart: [
      { name: '8 AM', B2B: 4000, B2C: 2400 },
      { name: '10 AM', B2B: 3000, B2C: 1398 },
      { name: '12 PM', B2B: 2000, B2C: 9800 },
      { name: '2 PM', B2B: 2780, B2C: 3908 },
      { name: '4 PM', B2B: 1890, B2C: 4800 },
      { name: '6 PM', B2B: 2390, B2C: 3800 },
      { name: '8 PM', B2B: 3490, B2C: 4300 },
    ],
    porter: [
      { name: 'On Time', value: 95, color: '#10B981' },
      { name: 'Late', value: 5, color: '#EF4444' },
    ],
    bestSellers: [
        { id: 1, name: 'Wireless Mouse M2', category: 'Accessories', sales: 42, revenue: '₹18,900', growth: '+5%' },
        { id: 2, name: 'USB-C Cable', category: 'Accessories', sales: 38, revenue: '₹11,400', growth: '+2%' },
    ]
  },
  Weekly: {
    revenue: { value: '₹5,68,900', trend: 'up', percent: '+8%', subtext: 'vs last week' },
    orders: { value: '1,245', trend: 'up', percent: '+14%', subtext: 'vs last week' },
    users: { value: '340', trend: 'up', percent: '+12%', subtext: 'new signups' },
    refunds: { value: '15', trend: 'down', percent: '-10%', subtext: 'vs last week' },
    chart: [
      { name: 'Mon', B2B: 12000, B2C: 8400 },
      { name: 'Tue', B2B: 15000, B2C: 9300 },
      { name: 'Wed', B2B: 18000, B2C: 12800 },
      { name: 'Thu', B2B: 16780, B2C: 10908 },
      { name: 'Fri', B2B: 21890, B2C: 14800 },
      { name: 'Sat', B2B: 24390, B2C: 18800 },
      { name: 'Sun', B2B: 19490, B2C: 15300 },
    ],
    porter: [
        { name: 'On Time', value: 88, color: '#10B981' },
        { name: 'Late', value: 12, color: '#EF4444' },
    ],
    bestSellers: [
        { id: 1, name: 'Gaming Laptop Ryzen 7', category: 'Computers', sales: 24, revenue: '₹21,59,976', growth: '+15%' },
        { id: 2, name: '5G Smartphone 256GB', category: 'Mobile', sales: 45, revenue: '₹29,24,955', growth: '+8%' },
        { id: 3, name: 'Smart Home Security Camera', category: 'Smart Home', sales: 89, revenue: '₹2,22,411', growth: '+12%' },
    ]
  },
  Monthly: {
    revenue: { value: '₹25,68,900', trend: 'up', percent: '+15%', subtext: 'vs last month' },
    orders: { value: '8,456', trend: 'up', percent: '+23%', subtext: 'vs last month' },
    users: { value: '1,240', trend: 'up', percent: '+18%', subtext: 'new signups' },
    refunds: { value: '45', trend: 'down', percent: '-3%', subtext: 'vs last month' },
    chart: [
      { name: 'Week 1', B2B: 45000, B2C: 24000 },
      { name: 'Week 2', B2B: 52000, B2C: 28000 },
      { name: 'Week 3', B2B: 48000, B2C: 32000 },
      { name: 'Week 4', B2B: 61000, B2C: 45000 },
    ],
    porter: [
        { name: 'On Time', value: 82, color: '#10B981' },
        { name: 'Late', value: 18, color: '#EF4444' },
    ],
    bestSellers: [
        { id: 1, name: 'Ultra HD 4K Smart TV 55"', category: 'Electronics', sales: 142, revenue: '₹63,90,000', growth: '+12%' },
        { id: 2, name: 'Gaming Laptop Ryzen 7', category: 'Computers', sales: 89, revenue: '₹80,09,911', growth: '+8%' },
        { id: 3, name: '5G Smartphone 256GB', category: 'Mobile', sales: 234, revenue: '₹1,52,09,766', growth: '+24%' },
        { id: 4, name: 'Smart Home Security Camera', category: 'Smart Home', sales: 450, revenue: '₹11,24,550', growth: '+5%' },
    ]
  },
  All: {
    revenue: { value: '₹1,82,45,000', trend: 'up', percent: '+45%', subtext: 'Total Lifetime' },
    orders: { value: '89,231', trend: 'up', percent: '+67%', subtext: 'Total Lifetime' },
    users: { value: '46,912', trend: 'up', percent: '+12%', subtext: 'Total Users' },
    refunds: { value: '1,203', trend: 'up', percent: '+2%', subtext: 'Total Lifetime' },
    chart: [
      { name: 'Jan', B2B: 4000, B2C: 2400 },
      { name: 'Feb', B2B: 3000, B2C: 1398 },
      { name: 'Mar', B2B: 2000, B2C: 9800 },
      { name: 'Apr', B2B: 2780, B2C: 3908 },
      { name: 'May', B2B: 1890, B2C: 4800 },
      { name: 'Jun', B2B: 2390, B2C: 3800 },
      { name: 'Jul', B2B: 3490, B2C: 4300 },
    ],
    porter: [
        { name: 'On Time', value: 85, color: '#10B981' },
        { name: 'Late', value: 15, color: '#EF4444' },
    ],
    bestSellers: [
        { id: 1, name: 'Ultra HD 4K Smart TV 55"', category: 'Electronics', sales: 1420, revenue: '₹6,39,00,000', growth: '+120%' },
        { id: 2, name: '5G Smartphone 256GB', category: 'Mobile', sales: 2340, revenue: '₹15,20,97,660', growth: '+240%' },
    ]
  }
};

const Card = ({ title, value, trend, icon: Icon, iconBg, trendValue, subtext }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${iconBg} text-white shadow-sm`}>
            <Icon size={20} />
        </div>
    </div>
    <div className="mt-auto">
        <div className="flex items-center justify-between">
            <p className={`text-xs font-semibold flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend === 'up' ? '↗' : '↘'} {trendValue}
                <span className="text-gray-400 font-normal ml-1">{subtext}</span>
            </p>
        </div>
    </div>
  </div>
);

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState<'Today' | 'Weekly' | 'Monthly' | 'All'>('Monthly');

  // Get current data based on selected time range
  const currentData = useMemo(() => DASHBOARD_DATA[timeRange], [timeRange]);

  // Filter for Stock Alerts (Independent of time range, represents current state)
  const lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock < 30).sort((a, b) => a.stock - b.stock);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500 mt-1">Overview of your store's performance and logistics.</p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {(['Today', 'Weekly', 'Monthly', 'All'] as const).map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setTimeRange(tab)}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        timeRange === tab 
                        ? 'bg-gray-900 text-white shadow' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {tab}
                </button>
            ))}
          </div>
      </div>

      {/* 1. KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
            title="Total Revenue"
            value={currentData.revenue.value}
            trend={currentData.revenue.trend}
            trendValue={currentData.revenue.percent}
            subtext={currentData.revenue.subtext}
            icon={DollarSign}
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <Card 
            title="Total Orders"
            value={currentData.orders.value}
            trend={currentData.orders.trend}
            trendValue={currentData.orders.percent}
            subtext={currentData.orders.subtext}
            icon={ShoppingCart}
            iconBg="bg-gradient-to-br from-violet-500 to-violet-600"
        />
         <Card 
            title="Total Users"
            value={currentData.users.value}
            trend={currentData.users.trend}
            trendValue={currentData.users.percent}
            subtext={currentData.users.subtext}
            icon={Users}
            iconBg="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <Card 
            title="Pending Refunds"
            value={currentData.refunds.value}
            trend={currentData.refunds.trend}
            trendValue={currentData.refunds.percent}
            subtext={currentData.refunds.subtext}
            icon={RefreshCcw}
            iconBg="bg-gradient-to-br from-rose-500 to-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* 2. B2B vs B2C Analytics */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">B2B vs B2C Analytics</h3>
                    <p className="text-sm text-gray-500">Revenue comparison ({timeRange})</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> B2B
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span> B2C
                    </div>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData.chart} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorB2B" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorB2C" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area type="monotone" dataKey="B2B" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorB2B)" />
                        <Area type="monotone" dataKey="B2C" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorB2C)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* 3. Porter Delivery Stats */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-4">
                 <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Truck className="text-blue-600" size={20} />
                    Delivery Stats
                 </h3>
                 <p className="text-sm text-gray-500">Same-day delivery metrics ({timeRange})</p>
            </div>

            {/* Key Logistics Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">Active Riders</p>
                    <p className="text-xl font-bold text-gray-900">14</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-medium">Avg Time</p>
                    <p className="text-xl font-bold text-gray-900">42m</p>
                </div>
            </div>

            <div className="flex-1 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={currentData.porter}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {currentData.porter.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="text-center">
                         <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">On Time</p>
                         <p className="text-2xl font-bold text-gray-900">{currentData.porter[0].value}%</p>
                     </div>
                 </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-2 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> On Time
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Delayed
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 4. Stock Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={20} />
                        Stock Alerts
                    </h3>
                    <p className="text-sm text-gray-500">Low stock and out-of-stock items</p>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                    {lowStockProducts.length} Issues
                </span>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3 text-center">Stock Level</th>
                            <th className="px-6 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {lowStockProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{product.name}</div>
                                    <div className="text-xs text-gray-500">{product.category}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-mono font-medium text-gray-700">{product.stock}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {product.stock === 0 ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                            Out of Stock
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                            Low Stock
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                         {lowStockProducts.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                                    All stock levels are healthy!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <button 
                  onClick={() => onNavigate('PRODUCTS')}
                  className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center gap-1"
                >
                    View Full Inventory <ArrowRight size={14} />
                </button>
            </div>
          </div>

          {/* 5. Best Selling Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="text-purple-600" size={20} />
                    Best Selling Products
                </h3>
                <p className="text-sm text-gray-500">Top performers by revenue ({timeRange})</p>
            </div>
             <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Product Name</th>
                            <th className="px-6 py-3 text-center">Sales</th>
                            <th className="px-6 py-3 text-right">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentData.bestSellers.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600 border border-gray-200">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            <div className="text-xs text-green-600 flex items-center gap-0.5">
                                                <TrendingUp size={10} /> {product.growth} growth
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-gray-600">
                                    {product.sales}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                    {product.revenue}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <button 
                  onClick={() => onNavigate('FINANCE')}
                  className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center gap-1"
                >
                    View Sales Reports <ArrowRight size={14} />
                </button>
            </div>
          </div>
      </div>
    </div>
  );
};