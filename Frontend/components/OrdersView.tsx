
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Eye, Download, ShoppingBag, Printer, X, CreditCard, MapPin, Phone, Mail, ArrowLeft, Calendar, PlayCircle
} from 'lucide-react';
import logo from '../assets/logo.jpg';
// Mock Data (Local to ensure type safety with amount as number for calculations)
const MOCK_ORDERS = [
  { id: 'ORD-7001', customer: 'TechCorp Solutions', date: 'May 14, 2024', amount: 4500.00, items: 12, status: 'Processing', payment: 'Paid', type: 'B2B', email: 'accounts@techcorp.com', address: 'Tech Park, Sector 4, Bangalore' },
  { id: 'ORD-7002', customer: 'Alice Freeman', date: 'May 13, 2024', amount: 129.99, items: 1, status: 'On the way', payment: 'Paid', type: 'B2C', email: 'alice.f@gmail.com', address: '123 Maple Drive, Mumbai' },
  { id: 'ORD-7003', customer: 'John Doe', date: 'May 12, 2024', amount: 45.50, items: 2, status: 'Delivered', payment: 'Paid', type: 'B2C', email: 'john.d@yahoo.com', address: '45 Park Avenue, Delhi' },
  { id: 'ORD-7004', customer: 'Global Logistics', date: 'May 11, 2024', amount: 1200.50, items: 5, status: 'Pending', payment: 'Unpaid', type: 'B2B', email: 'logistics@global.com', address: 'Warehouse 9, Chennai Port' },
  { id: 'ORD-7005', customer: 'Sarah Jenkins', date: 'May 10, 2024', amount: 899.00, items: 1, status: 'Cancelled', payment: 'Refunded', type: 'B2C', email: 'sarah.j@outlook.com', address: '78 Hilltop View, Pune' },
  { id: 'ORD-7006', customer: 'Wayne Enterprises', date: 'May 14, 2024', amount: 25000.00, items: 50, status: 'Confirmed', payment: 'Paid', type: 'B2B', email: 'procurement@wayne.com', address: 'Gotham Tower, Mumbai' },
  { id: 'ORD-7007', customer: 'Peter Parker', date: 'May 14, 2024', amount: 25.00, items: 1, status: 'Pickup', payment: 'Paid', type: 'B2C', email: 'p.parker@dailybugle.com', address: '20 Ingram St, Queens' },
  { id: 'ORD-7008', customer: 'Stark Ind', date: 'May 14, 2024', amount: 9999.00, items: 10, status: 'On the way', payment: 'Paid', type: 'B2B', email: 'tony@stark.com', address: 'Malibu Point, Goa' },
  { id: 'ORD-7009', customer: 'Bruce Banner', date: 'April 20, 2024', amount: 150.00, items: 3, status: 'Delivered', payment: 'Paid', type: 'B2C', email: 'bruce@hulk.com', address: 'Green St, Dayton' },
  { id: 'ORD-7010', customer: 'Clark Kent', date: 'January 15, 2023', amount: 55.00, items: 1, status: 'Delivered', payment: 'Paid', type: 'B2C', email: 'ck@dailyplanet.com', address: 'Metropolis' },
];

const STATUS_TABS = [
  'All Orders',
  'Confirmed',
  'Processing',
  'Pickup',
  'On the way',
  'Delivered',
  'Cancelled'
];

interface OrdersViewProps {
  initialSearchTerm?: string;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ initialSearchTerm = '' }) => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeStatus, setActiveStatus] = useState('All Orders');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Date Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Sync with global search prop
  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Get unique years for dropdown
  const availableYears = useMemo(() => {
    const years = new Set(orders.map(o => new Date(o.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [orders]);

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    const matchesStatus = activeStatus === 'All Orders' || order.status === activeStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date Logic
    let matchesDate = true;
    
    if (filterDate) {
        // Exact Date Match
        const selDate = new Date(filterDate);
        matchesDate = orderDate.getDate() === selDate.getDate() &&
                      orderDate.getMonth() === selDate.getMonth() &&
                      orderDate.getFullYear() === selDate.getFullYear();
    } else {
        // Month & Year Logic
        if (filterMonth) {
            matchesDate = matchesDate && orderDate.getMonth() === parseInt(filterMonth);
        }
        if (filterYear) {
            matchesDate = matchesDate && orderDate.getFullYear() === parseInt(filterYear);
        }
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  // Group Orders by Date
  const groupedOrders = useMemo(() => {
    const groups: Record<string, typeof MOCK_ORDERS> = {};
    filteredOrders.forEach(order => {
      if (!groups[order.date]) {
        groups[order.date] = [];
      }
      groups[order.date].push(order);
    });
    return groups;
  }, [filteredOrders]);

  // Sort dates (newest first)
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'On the way': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processing': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Confirmed': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'Pickup': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const downloadCSV = () => {
    const headers = ['Order ID', 'Customer', 'Date', 'Amount', 'Items', 'Status', 'Payment', 'Type', 'Email', 'Address'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id,
        `"${order.customer}"`,
        order.date,
        order.amount,
        order.items,
        order.status,
        order.payment,
        order.type,
        order.email,
        `"${order.address}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'orders_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearDateFilters = () => {
      setFilterDate('');
      setFilterMonth('');
      setFilterYear('');
  };

  const handleProcessOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status: 'Processing' } : order
    ));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 -m-4 sm:-m-6 lg:-m-8 font-sans overflow-hidden relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
        <p className="text-slate-500 text-sm">Track and manage all customer orders.</p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 pt-2 shrink-0">
        <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
          {STATUS_TABS.map(status => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                ${activeStatus === status
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              {status}
              {status !== 'All Orders' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeStatus === status ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  {orders.filter(o => o.status === status).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 flex flex-col gap-4 shrink-0 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by Order ID or Customer..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-gray-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50"
                >
                    <Download size={16} />
                    Export
                </button>
            </div>
        </div>

        {/* Date Filters */}
        <div className="flex flex-wrap items-center gap-3">
            {/* Specific Date */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-sm">
                <span className="text-xs text-slate-500 mr-2 font-medium">Date:</span>
                <input 
                    type="date" 
                    value={filterDate}
                    onChange={(e) => {
                        setFilterDate(e.target.value);
                        setFilterMonth(''); 
                        setFilterYear('');
                    }}
                    className="text-sm outline-none text-slate-700 bg-transparent border-none focus:ring-0 h-5"
                />
            </div>

            <span className="text-xs text-slate-400 font-medium">OR</span>

            {/* Month */}
            <select 
                value={filterMonth}
                onChange={(e) => {
                    setFilterMonth(e.target.value);
                    setFilterDate(''); 
                }}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none shadow-sm focus:border-indigo-500"
            >
                <option value="">All Months</option>
                {Array.from({length: 12}, (_, i) => (
                    <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                ))}
            </select>

            {/* Year */}
            <select 
                value={filterYear}
                onChange={(e) => {
                    setFilterYear(e.target.value);
                    setFilterDate('');
                }}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none shadow-sm focus:border-indigo-500"
            >
                <option value="">All Years</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* Clear Filters */}
            {(filterDate || filterMonth || filterYear) && (
                <button 
                    onClick={clearDateFilters}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline ml-auto sm:ml-0 flex items-center gap-1"
                >
                    <X size={12} /> Clear Filters
                </button>
            )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Process</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedDates.map(date => (
                <React.Fragment key={date}>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td colSpan={7} className="py-2 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={12} /> {date}
                    </td>
                  </tr>
                  {groupedOrders[date].map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6 font-medium text-indigo-600 text-sm">{order.id}</td>
                      <td className="py-4 px-6 text-sm text-slate-900">
                        {order.customer}
                        <div className="text-[10px] text-slate-400 uppercase">{order.type}</div>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-900">₹{order.amount.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          order.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {order.status === 'Confirmed' ? (
                            <button 
                              onClick={() => handleProcessOrder(order.id)}
                              className="flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full max-w-[100px] mx-auto"
                              title="Move to Processing"
                            >
                              <PlayCircle size={14} /> Process
                            </button>
                        ) : (
                            <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Invoice"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="p-4 bg-slate-50 rounded-full mb-3">
                <ShoppingBag size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-medium">No orders found</h3>
              <p className="text-slate-500 text-sm mt-1">Try changing the filters or search term.</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex justify-center items-start bg-black/60 backdrop-blur-sm p-4 pt-24 overflow-y-auto">
          <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
      )}
    </div>
  );
};

const InvoiceModal = ({ order, onClose }: { order: any, onClose: () => void }) => {
  // Robust amount handling: parse string if needed, or use number directly
  const amountValue = typeof order.amount === 'string' 
    ? parseFloat(order.amount.replace(/[^0-9.-]+/g,"")) 
    : order.amount;

  const taxRate = 0.18;
  const subtotal = amountValue / (1 + taxRate);
  const sgst = subtotal * 0.09;
  const cgst = subtotal * 0.09;
  
  // Generate dummy items based on item count
  const invoiceItems = Array.from({ length: order.items }).map((_, i) => ({
    id: i + 1,
    desc: i === 0 ? `Main Product - ${order.type} SKU` : `Accessory / Component Part #${1000 + i}`,
    qty: 1,
    price: (subtotal / order.items)
  }));

  return (
    <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 mb-8">
      {/* Modal Actions */}
      <div className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center print:hidden">
        <span className="font-medium flex items-center gap-2">
          <CreditCard size={16} /> Invoice Preview
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()} 
            className="p-2 hover:bg-slate-700 rounded-md transition-colors text-slate-300 hover:text-white"
            title="Print Invoice"
          >
            <Printer size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors text-white"
            title="Close Invoice"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Invoice Content (Printable Area) */}
      <div className="p-8 print:p-0" id="invoice-content">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={logo} alt="Logo" className="h-[90px] w-auto" />
              {/* <h1 className="text-2xl font-bold text-gray-900">Sevenxt</h1> */}
            </div>
            <p className="text-sm text-gray-500">123 Innovation Park, Tech City</p>
            <p className="text-sm text-gray-500">Bangalore, Karnataka 560103</p>
            <p className="text-sm text-gray-500 mt-1">GSTIN: 29ABCDE1234F1Z5</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-light text-gray-200 uppercase tracking-widest mb-2">Invoice</h2>
            <p className="text-sm font-bold text-gray-900">INV-{order.id.split('-')[1]}</p>
            <p className="text-sm text-gray-500">Date: {order.date}</p>
            <div className={`mt-2 inline-block px-3 py-1 rounded border text-xs font-bold uppercase ${order.payment === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {order.payment}
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Bill To</h3>
            <p className="font-bold text-gray-900 text-lg">{order.customer}</p>
            <div className="text-sm text-gray-600 mt-1 space-y-1">
              <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> {order.address || 'Address on file'}</p>
              <p className="flex items-center gap-2"><Mail size={14} /> {order.email || 'email@example.com'}</p>
              <p className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Order Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
               <p>Order ID: <span className="font-mono font-medium text-gray-900">{order.id}</span></p>
               <p>Order Type: <span className="font-medium text-gray-900">{order.type}</span></p>
               <p>Total Items: <span className="font-medium text-gray-900">{order.items}</span></p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-4 py-3 rounded-l-md">#</th>
                <th className="px-4 py-3 w-1/2">Item Description</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Rate</th>
                <th className="px-4 py-3 text-right rounded-r-md">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoiceItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.desc}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.qty}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-bold text-right">₹{(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">₹{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>SGST (9%)</span>
              <span className="font-medium">₹{sgst.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>CGST (9%)</span>
              <span className="font-medium">₹{cgst.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
              <span>Total</span>
              <span className="text-blue-600">₹{amountValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          <p className="mb-1">Thank you for your business!</p>
          <p>This is a computer generated invoice and does not require a physical signature.</p>
        </div>

        {/* Exit Button */}
        <div className="mt-8 flex justify-center print:hidden border-t border-gray-100 pt-6">
            <button 
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm font-medium text-sm"
            >
                <ArrowLeft size={16} />
                Exit to Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};
