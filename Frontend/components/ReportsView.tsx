
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, Package, Users, Truck, DollarSign, Calendar, 
  Download, ArrowUpRight, Activity, FileText
} from 'lucide-react';

interface ReportsPageProps {
  activeView?: string;
}

type Timeframe = 'daily' | 'weekly' | 'monthly';

const TABS = [
  { id: 'rep-sales', label: 'Sales Reports', icon: <TrendingUp size={18} /> },
  { id: 'rep-products', label: 'Product Performance', icon: <Package size={18} /> },
  { id: 'rep-users', label: 'User Statistics', icon: <Users size={18} /> },
  { id: 'rep-delivery', label: 'Delivery Reports', icon: <Truck size={18} /> },
  { id: 'rep-financial', label: 'Financial Reports', icon: <DollarSign size={18} /> },
];

// --- MOCK DATA ---

// Sales Data
const DAILY_SALES_DATA = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const WEEKLY_SALES_DATA = [
  { name: 'Week 1', value: 24000 },
  { name: 'Week 2', value: 13980 },
  { name: 'Week 3', value: 38000 },
  { name: 'Week 4', value: 39080 },
];

const MONTHLY_SALES_DATA = [
  { name: 'Jan', value: 65000 },
  { name: 'Feb', value: 59000 },
  { name: 'Mar', value: 80000 },
  { name: 'Apr', value: 81000 },
  { name: 'May', value: 95000 },
  { name: 'Jun', value: 105000 },
];

// Product Data
const TOP_SKUS_DAILY = [
  { name: 'Wireless Mouse M2', sku: 'ACC-MSE-002', sales: 45, revenue: 1125 },
  { name: 'USB-C Cable', sku: 'CAB-USB-001', sales: 32, revenue: 480 },
  { name: 'Coffee Mug', sku: 'MER-MUG-001', sales: 28, revenue: 280 },
  { name: 'Notebook', sku: 'OFF-NB-005', sales: 25, revenue: 125 },
  { name: 'Pen Set', sku: 'OFF-PEN-002', sales: 20, revenue: 100 },
];

const TOP_SKUS_WEEKLY = [
  { name: 'Ergonomic Chair', sku: 'FUR-CHR-001', sales: 150, revenue: 37500 },
  { name: 'Wireless Mouse M2', sku: 'ACC-MSE-002', sales: 120, revenue: 3000 },
  { name: 'Mechanical Keyboard', sku: 'ACC-KEY-005', sales: 85, revenue: 10200 },
  { name: '24" Monitor', sku: 'MON-24-001', sales: 60, revenue: 12000 },
  { name: 'Desk Lamp', sku: 'FUR-LMP-003', sales: 55, revenue: 2750 },
];

const TOP_SKUS_MONTHLY = [
  { name: 'Wireless Mouse M2', sku: 'ACC-MSE-002', sales: 1200, revenue: 29900 },
  { name: 'Ergonomic Chair', sku: 'FUR-CHR-001', sales: 850, revenue: 212500 },
  { name: 'Mechanical Keyboard', sku: 'ACC-KEY-005', sales: 720, revenue: 86400 },
  { name: 'USB-C Hub', sku: 'ACC-HUB-003', sales: 650, revenue: 32500 },
  { name: '27" 4K Monitor', sku: 'MON-4K-009', sales: 420, revenue: 147000 },
];

// User Data
const USER_GROWTH_DAILY = [
  { name: 'Mon', active: 850, new: 45 },
  { name: 'Tue', active: 890, new: 52 },
  { name: 'Wed', active: 920, new: 38 },
  { name: 'Thu', active: 880, new: 65 },
  { name: 'Fri', active: 950, new: 80 },
  { name: 'Sat', active: 1020, new: 120 },
  { name: 'Sun', active: 1100, new: 95 },
];

const USER_GROWTH_WEEKLY = [
  { name: 'Week 1', active: 5200, new: 350 },
  { name: 'Week 2', active: 5400, new: 420 },
  { name: 'Week 3', active: 5800, new: 380 },
  { name: 'Week 4', active: 6100, new: 550 },
];

const USER_GROWTH_MONTHLY = [
  { name: 'Jan', active: 4000, new: 2400 },
  { name: 'Feb', active: 3000, new: 1398 },
  { name: 'Mar', active: 2000, new: 9800 },
  { name: 'Apr', active: 2780, new: 3908 },
  { name: 'May', active: 1890, new: 4800 },
  { name: 'Jun', active: 2390, new: 3800 },
];

const DELIVERY_PERFORMANCE = [
  { name: 'On Time', value: 75, color: '#10b981' },
  { name: 'Delayed', value: 15, color: '#f59e0b' },
  { name: 'Failed', value: 10, color: '#ef4444' },
];

// Financial Data
const REVENUE_GST_DAILY = [
  { name: 'Mon', revenue: 4000, gst: 720 },
  { name: 'Tue', revenue: 3000, gst: 540 },
  { name: 'Wed', revenue: 2000, gst: 360 },
  { name: 'Thu', revenue: 2780, gst: 500 },
  { name: 'Fri', revenue: 1890, gst: 340 },
  { name: 'Sat', revenue: 2390, gst: 430 },
  { name: 'Sun', revenue: 3490, gst: 628 },
];

const REVENUE_GST_WEEKLY = [
  { name: 'Week 1', revenue: 24000, gst: 4320 },
  { name: 'Week 2', revenue: 13980, gst: 2516 },
  { name: 'Week 3', revenue: 38000, gst: 6840 },
  { name: 'Week 4', revenue: 39080, gst: 7034 },
];

const REVENUE_GST_MONTHLY = [
  { name: 'Jan', revenue: 40000, gst: 2400 },
  { name: 'Feb', revenue: 30000, gst: 1398 },
  { name: 'Mar', revenue: 20000, gst: 9800 },
  { name: 'Apr', revenue: 27800, gst: 3908 },
  { name: 'May', revenue: 18900, gst: 4800 },
  { name: 'Jun', revenue: 23900, gst: 3800 },
];

// --- HELPER COMPONENT ---

const ReportControls = ({ 
  timeframe, 
  setTimeframe,
  onExport
}: { 
  timeframe: Timeframe, 
  setTimeframe: (t: Timeframe) => void,
  onExport: () => void
}) => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
     <div className="flex bg-slate-100 p-1 rounded-lg">
        {['Daily', 'Weekly', 'Monthly'].map((t) => (
            <button 
              key={t}
              onClick={() => setTimeframe(t.toLowerCase() as Timeframe)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeframe === t.toLowerCase() ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
        ))}
     </div>
     <button 
      onClick={onExport}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 shadow-sm transition-colors"
     >
       <Download size={16} /> <span className="hidden sm:inline">Download</span>
     </button>
  </div>
);

// --- COMPONENTS ---

const SalesReportsView = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  
  let data = DAILY_SALES_DATA;
  if (timeframe === 'weekly') data = WEEKLY_SALES_DATA;
  if (timeframe === 'monthly') data = MONTHLY_SALES_DATA;

  const stats = {
    daily: { total: '₹12,450', avg: '₹45', conv: '3.2%' },
    weekly: { total: '₹1,15,060', avg: '₹120', conv: '3.8%' },
    monthly: { total: '₹4,85,000', avg: '₹245', conv: '4.1%' }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Period,Value\n" 
        + data.map(row => `${row.name},${row.value}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
           <div>
             <h2 className="text-lg font-bold text-slate-900">Sales Overview</h2>
             <p className="text-sm text-slate-500">Revenue trends over {timeframe} period</p>
           </div>
           <ReportControls timeframe={timeframe} setTimeframe={setTimeframe} onExport={handleExport} />
        </div>
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                formatter={(value: number) => [`₹${value}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Sales', value: stats[timeframe].total, trend: '+12%', icon: <DollarSign className="text-emerald-600" /> },
            { label: 'Avg Order Value', value: stats[timeframe].avg, trend: '-2%', icon: <Activity className="text-blue-600" /> },
            { label: 'Conversion Rate', value: stats[timeframe].conv, trend: '+0.4%', icon: <TrendingUp className="text-purple-600" /> },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
               </div>
               <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
               <p className={`text-xs font-bold mt-1 ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                 {stat.trend} from last period
               </p>
            </div>
          ))}
      </div>
    </div>
  );
};

const ProductPerformanceView = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');

  let data = TOP_SKUS_DAILY;
  if (timeframe === 'weekly') data = TOP_SKUS_WEEKLY;
  if (timeframe === 'monthly') data = TOP_SKUS_MONTHLY;

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Product,SKU,Sales,Revenue\n" 
        + data.map(row => `${row.name},${row.sku},${row.sales},${row.revenue}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `product_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
             <div>
               <h2 className="text-lg font-bold text-slate-900">Top Performing SKUs</h2>
               <p className="text-sm text-slate-500">Best selling products by volume and revenue ({timeframe}).</p>
             </div>
             <ReportControls timeframe={timeframe} setTimeframe={setTimeframe} onExport={handleExport} />
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50">
                 <tr>
                   <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Product Name</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">SKU</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Units Sold</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Revenue</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Trend</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {data.map((item, idx) => (
                   <tr key={idx} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                     <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.sku}</td>
                     <td className="px-6 py-4 text-sm font-bold text-slate-700 text-right">{item.sales}</td>
                     <td className="px-6 py-4 text-sm font-bold text-indigo-600 text-right">₹{item.revenue.toLocaleString()}</td>
                     <td className="px-6 py-4 text-right">
                       <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                         <ArrowUpRight size={12} className="mr-1" /> High
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

const UserStatsView = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');

  let data = USER_GROWTH_DAILY;
  if (timeframe === 'weekly') data = USER_GROWTH_WEEKLY;
  if (timeframe === 'monthly') data = USER_GROWTH_MONTHLY;

  const stats = {
    daily: { active: '1,100', new: '95', churn: '0.1%' },
    weekly: { active: '6,100', new: '550', churn: '0.5%' },
    monthly: { active: '8,540', new: '1,240', churn: '2.1%' },
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Period,Active Users,New Users\n" 
        + data.map(row => `${row.name},${row.active},${row.new}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `user_stats_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">User Statistics</h2>
            <p className="text-sm text-slate-500">Active users and growth metrics ({timeframe}).</p>
          </div>
          <ReportControls timeframe={timeframe} setTimeframe={setTimeframe} onExport={handleExport} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg">
             <p className="text-indigo-100 font-medium mb-1">Total Active Users</p>
             <h3 className="text-4xl font-bold">{stats[timeframe].active}</h3>
             <p className="text-sm text-indigo-200 mt-2 flex items-center gap-1">
               <ArrowUpRight size={16} /> +15% this period
             </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <p className="text-slate-500 font-medium mb-1">New Registrations</p>
             <h3 className="text-3xl font-bold text-slate-900">{stats[timeframe].new}</h3>
             <p className="text-xs text-slate-400 mt-1">In this period</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <p className="text-slate-500 font-medium mb-1">Churn Rate</p>
             <h3 className="text-3xl font-bold text-slate-900">{stats[timeframe].churn}</h3>
             <p className="text-xs text-emerald-600 mt-1 font-bold">Low (Good)</p>
          </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">User Growth</h2>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
              />
              <Legend />
              <Bar dataKey="active" name="Active Users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="new" name="New Signups" fill="#fbbf24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const DeliveryReportsView = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');

  const stats = {
    daily: { time: '35 mins', count: '120', cost: '₹45.50' },
    weekly: { time: '38 mins', count: '450', cost: '₹125.00' },
    monthly: { time: '42 mins', count: '1,842', cost: '₹145.50' }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Status,Value\n" 
        + DELIVERY_PERFORMANCE.map(row => `${row.name},${row.value}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `delivery_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Delivery Performance</h2>
            <p className="text-sm text-slate-500">Logistics and porter metrics ({timeframe}).</p>
          </div>
          <ReportControls timeframe={timeframe} setTimeframe={setTimeframe} onExport={handleExport} />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h2 className="text-lg font-bold text-slate-900 mb-6">Porter Status Distribution</h2>
             <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DELIVERY_PERFORMANCE}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {DELIVERY_PERFORMANCE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="text-center mt-4">
                <p className="text-3xl font-bold text-slate-900">94%</p>
                <p className="text-sm text-slate-500">Success Rate</p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 font-medium mb-1">Average Delivery Time</p>
                <div className="flex items-end gap-2">
                   <h3 className="text-3xl font-bold text-slate-900">{stats[timeframe].time}</h3>
                   <span className="text-xs font-bold text-emerald-600 mb-1.5">-5 mins vs last period</span>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 font-medium mb-1">Total Deliveries ({timeframe})</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats[timeframe].count}</h3>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 font-medium mb-1">Average Cost per Trip</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats[timeframe].cost}</h3>
             </div>
          </div>
       </div>
    </div>
  );
};

const FinancialReportsView = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');

  let data = REVENUE_GST_DAILY;
  if (timeframe === 'weekly') data = REVENUE_GST_WEEKLY;
  if (timeframe === 'monthly') data = REVENUE_GST_MONTHLY;

  const stats = {
    daily: { revenue: '₹9,800', gst: '₹1,764', profit: '₹2,450' },
    weekly: { revenue: '₹85,200', gst: '₹15,336', profit: '₹21,300' },
    monthly: { revenue: '₹15,42,000', gst: '₹2,77,560', profit: '₹3,42,000' }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Period,Revenue,GST\n" 
        + data.map(row => `${row.name},${row.revenue},${row.gst}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Financial Overview</h2>
            <p className="text-sm text-slate-500">Revenue, GST, and Profit analysis ({timeframe}).</p>
          </div>
          <ReportControls timeframe={timeframe} setTimeframe={setTimeframe} onExport={handleExport} />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h2 className="text-lg font-bold text-slate-900 mb-6">Revenue vs GST Collected</h2>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} />
                      <Line type="monotone" dataKey="gst" name="GST Collected" stroke="#ec4899" strokeWidth={3} dot={{r: 4}} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><DollarSign size={20} /></div>
                   <p className="font-bold text-slate-700">Total Revenue</p>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stats[timeframe].revenue}</h3>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><FileText size={20} /></div>
                   <p className="font-bold text-slate-700">Total GST Liability</p>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stats[timeframe].gst}</h3>
                <p className="text-xs text-slate-500 mt-1">@ 18% Average</p>
             </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp size={20} /></div>
                   <p className="font-bold text-slate-700">Net Profit (Est.)</p>
                </div>
                <h3 className="text-3xl font-bold text-emerald-600">{stats[timeframe].profit}</h3>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export const ReportsView: React.FC<ReportsPageProps> = ({ activeView }) => {
  const [activeTab, setActiveTab] = useState('rep-sales');

  useEffect(() => {
    if (activeView && activeView !== 'reports') {
      setActiveTab(activeView);
    }
  }, [activeView]);

  const renderContent = () => {
    switch (activeTab) {
      case 'rep-sales': return <SalesReportsView />;
      case 'rep-products': return <ProductPerformanceView />;
      case 'rep-users': return <UserStatsView />;
      case 'rep-delivery': return <DeliveryReportsView />;
      case 'rep-financial': return <FinancialReportsView />;
      default: return <SalesReportsView />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
                <p className="text-slate-500 text-sm">Deep dive into your business metrics.</p>
            </div>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                 <Calendar size={16} /> Last 30 Days
               </button>
               {/* Export Button is now handled inside individual sub-views via ReportControls */}
            </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 pt-2">
        <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              <span className={`${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
         <div className="max-w-7xl mx-auto">
             {renderContent()}
         </div>
      </div>
    </div>
  );
};
