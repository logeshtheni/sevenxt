
import React, { useState, useMemo } from 'react';
import { 
  CreditCard, FileText, RefreshCcw, Percent, DollarSign, 
  Search, Filter, Download, TrendingUp, CheckCircle, AlertCircle, Clock, MoreVertical, X
} from 'lucide-react';
import { MOCK_REFUNDS } from '../constants';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-8821', orderId: 'ORD-7001', date: '2024-05-14', amount: 4500.00, method: 'Credit Card', status: 'SUCCESS', gateway: 'Stripe' },
  { id: 'TXN-8822', orderId: 'ORD-7002', date: '2024-05-13', amount: 129.99, method: 'UPI', status: 'SUCCESS', gateway: 'Razorpay' },
  { id: 'TXN-8823', orderId: 'ORD-7004', date: '2024-05-11', amount: 1200.50, method: 'NetBanking', status: 'PENDING', gateway: 'Razorpay' },
  { id: 'TXN-8824', orderId: 'ORD-7005', date: '2024-05-10', amount: 899.00, method: 'Credit Card', status: 'FAILED', gateway: 'Stripe' },
  { id: 'TXN-8825', orderId: 'ORD-7006', date: '2024-05-14', amount: 25000.00, method: 'Wire Transfer', status: 'SUCCESS', gateway: 'Bank' },
  { id: 'TXN-8826', orderId: 'ORD-7007', date: '2024-05-16', amount: 250.00, method: 'UPI', status: 'SUCCESS', gateway: 'PhonePe' },
  { id: 'TXN-8827', orderId: 'ORD-7008', date: '2024-05-16', amount: 5000.00, method: 'Credit Card', status: 'PROCESSING', gateway: 'Stripe' },
];

const MOCK_SETTLEMENTS = [
  { id: 'SET-001', vendor: 'TechSupplies Co.', date: '2024-05-14', amount: 12450.00, status: 'PROCESSED', utr: 'UTR8829292' },
  { id: 'SET-002', vendor: 'Office Essentials', date: '2024-05-13', amount: 3200.00, status: 'PROCESSED', utr: 'UTR8829293' },
  { id: 'SET-003', vendor: 'Global Trade', date: '2024-05-15', amount: 8900.00, status: 'PENDING', utr: '-' },
];

const MOCK_COMMISSIONS = [
  { id: 'COM-101', orderId: 'ORD-7001', amount: 4500.00, rate: 2.5, earning: 112.50, date: '2024-05-14' },
  { id: 'COM-102', orderId: 'ORD-7002', amount: 129.99, rate: 5.0, earning: 6.50, date: '2024-05-13' },
  { id: 'COM-103', orderId: 'ORD-7006', amount: 25000.00, rate: 1.5, earning: 375.00, date: '2024-05-14' },
];

const TABS = [
  { id: 'Payments', label: 'Payments', icon: <CreditCard size={18} /> },
  { id: 'Settlements', label: 'Settlements', icon: <FileText size={18} /> },
  { id: 'Refunds', label: 'Refunds', icon: <RefreshCcw size={18} /> },
  { id: 'Taxes', label: 'Taxes', icon: <Percent size={18} /> },
  { id: 'Commission', label: 'Commission', icon: <DollarSign size={18} /> },
];

export const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Payments');
  const [searchTerm, setSearchTerm] = useState('');

  // Tax Slab State
  const [taxSlabs, setTaxSlabs] = useState([
      { category: 'Electronics (Standard)', rate: '18%' },
      { category: 'Books (Exempt)', rate: '0%' },
      { category: 'Furniture (Reduced)', rate: '12%' },
      { category: 'Luxury Goods (High)', rate: '28%' }
  ]);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [newSlab, setNewSlab] = useState({ category: '', rate: '' });

  // Filter Modal State
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Applied Filters State (to trigger re-render of table)
  const [appliedFilters, setAppliedFilters] = useState({
      status: 'All',
      from: '',
      to: ''
  });

  const handleAddSlab = () => {
      if (newSlab.category && newSlab.rate) {
          setTaxSlabs([...taxSlabs, newSlab]);
          setShowTaxModal(false);
          setNewSlab({ category: '', rate: '' });
      }
  };

  const handleExport = () => {
    let data: any[] = [];
    let filename = 'export.csv';

    switch (activeTab) {
        case 'Payments':
            data = filteredTransactions; // Export filtered view
            filename = 'payments.csv';
            break;
        case 'Settlements':
            data = MOCK_SETTLEMENTS;
            filename = 'settlements.csv';
            break;
        case 'Refunds':
            data = MOCK_REFUNDS;
            filename = 'refunds.csv';
            break;
        case 'Taxes':
            data = taxSlabs;
            filename = 'taxes.csv';
            break;
        case 'Commission':
            data = MOCK_COMMISSIONS;
            filename = 'commissions.csv';
            break;
        default:
            return;
    }

    if (data.length === 0) {
        alert("No data to export.");
        return;
    }

    // Extract headers dynamically
    const headers = Object.keys(data[0]);
    
    // Convert to CSV string
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(fieldName => {
            const value = (row as any)[fieldName];
            // Escape commas if present in string
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const applyFilters = () => {
      setAppliedFilters({
          status: filterStatus,
          from: filterDateFrom,
          to: filterDateTo
      });
      setShowFilterModal(false);
  };

  const filteredTransactions = useMemo(() => {
      return MOCK_TRANSACTIONS.filter(txn => {
          // Status Filter
          if (appliedFilters.status !== 'All') {
              if (appliedFilters.status === 'Success' && txn.status !== 'SUCCESS') return false;
              if (appliedFilters.status === 'Pending' && (txn.status !== 'PENDING' && txn.status !== 'PROCESSING')) return false;
              if (appliedFilters.status === 'Failed' && txn.status !== 'FAILED') return false;
          }

          // Date Range Filter
          const txnDate = new Date(txn.date);
          if (appliedFilters.from && txnDate < new Date(appliedFilters.from)) return false;
          if (appliedFilters.to && txnDate > new Date(appliedFilters.to)) return false;

          // Search Filter
          if (searchTerm) {
              const searchLower = searchTerm.toLowerCase();
              return txn.id.toLowerCase().includes(searchLower) || txn.orderId.toLowerCase().includes(searchLower);
          }

          return true;
      });
  }, [appliedFilters, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': case 'PROCESSED': case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDING': case 'PROCESSING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'FAILED': case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderPayments = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm text-slate-500 font-medium">Total Volume (24h)</p>
           <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-900">₹32,450.00</h3>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={14} className="mr-1"/> +12%
              </span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm text-slate-500 font-medium">Success Rate</p>
           <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-900">98.2%</h3>
              <span className="text-xs font-medium text-slate-400">Last 30 days</span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm text-slate-500 font-medium">Failed Transactions</p>
           <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-rose-600">12</h3>
              <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                Action Req.
              </span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction List</h3>
            {(appliedFilters.status !== 'All' || appliedFilters.from) && (
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                    Filters Active
                </span>
            )}
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order Ref</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Method</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map(txn => (
              <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium text-indigo-600">{txn.id}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{txn.date}</td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">{txn.orderId}</td>
                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                   <div className="w-6 h-4 bg-slate-200 rounded flex items-center justify-center text-[8px] font-bold text-slate-500">IMG</div>
                   {txn.method}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{txn.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button 
                    onClick={() => alert(`Viewing transaction details for ${txn.id}`)}
                    className="text-slate-400 hover:text-slate-600"
                   >
                    <MoreVertical size={16} />
                   </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                        No transactions found matching your filters.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettlements = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
       <div className="bg-indigo-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
             <div>
                <p className="text-indigo-200 font-medium mb-1">Next Payout</p>
                <h3 className="text-4xl font-bold">₹8,900.00</h3>
                <p className="text-indigo-300 text-sm mt-2 flex items-center gap-2">
                   <Clock size={14} /> Scheduled for Tomorrow, 10:00 AM
                </p>
             </div>
             <div className="text-right">
                 <button 
                  onClick={() => alert("Payout processing initiated.")}
                  className="bg-white text-indigo-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                 >
                    Process Now
                 </button>
             </div>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
       </div>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Settlements</h3>
            <button onClick={() => alert("Navigating to full history")} className="text-sm text-indigo-600 font-medium">View All</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Settlement ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Vendor</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">UTR Number</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_SETTLEMENTS.map(set => (
              <tr key={set.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium text-slate-600">{set.id}</td>
                <td className="px-6 py-4 text-sm text-slate-900 font-bold">{set.vendor}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{set.date}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{set.utr}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{set.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(set.status)}`}>
                    {set.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRefunds = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
    

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                <Clock size={24} />
             </div>
             <div>
                <p className="text-sm text-slate-500">Pending Approval</p>
                <h3 className="text-xl font-bold text-slate-900">23</h3>
             </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
                <AlertCircle size={24} />
             </div>
             <div>
                <p className="text-sm text-slate-500">Disputed</p>
                <h3 className="text-xl font-bold text-slate-900">5</h3>
             </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle size={24} />
             </div>
             <div>
                <p className="text-sm text-slate-500">Processed (This Month)</p>
                <h3 className="text-xl font-bold text-slate-900">₹4,200</h3>
             </div>
          </div>
       </div>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Refund ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order Ref</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Reason</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_REFUNDS.map(ref => (
                <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-indigo-600">{ref.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{ref.orderId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{ref.customerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 italic">{ref.reason}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{Number(ref.amount.replace(/[^0-9.-]+/g,"")).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(ref.status)}`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     {/* Mock Risk Score generation since it's not in MOCK_REFUNDS */}
                     <span className={`text-xs font-bold ${Math.random() > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {Math.floor(Math.random() * 100)}/100
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  );

  const renderTaxes = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">GST Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Default GST Rate (%)</label>
                  <input type="number" defaultValue={18} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white" />
              </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">GSTIN Number</label>
                  <input type="text" defaultValue="29AAAAA0000A1Z5" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono uppercase text-gray-900 bg-white" />
              </div>
              
              {/* Tax Slabs Section */}
              <div className="col-span-full">
                  <div className="flex items-center justify-between mb-2">
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Tax Slabs</label>
                        <p className="text-xs text-slate-500">Category wise tax rules</p>
                     </div>
                     <button 
                      onClick={() => setShowTaxModal(true)}
                      className="text-xs font-bold text-gray-900 hover:text-gray-700"
                     >
                      + Add Slab
                     </button>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 flex justify-between">
                          <span>Category / Slab</span>
                          <span>Tax Rate</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                          {taxSlabs.map((slab, index) => (
                            <div key={index} className="px-4 py-3 flex justify-between items-center text-sm">
                                <span className="text-slate-700">{slab.category}</span>
                                <span className="font-mono font-bold">{slab.rate}</span>
                            </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
          <div className="mt-6 flex justify-end">
              <button 
                onClick={() => alert("GST Settings Saved.")}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 shadow-md shadow-indigo-200"
              >
                  Save Configuration
              </button>
          </div>
      </div>
    </div>
  );

  const renderCommission = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
         {/* Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
               <p className="text-indigo-100 font-medium mb-1">Total Earnings</p>
               <h3 className="text-3xl font-bold">₹4,502.50</h3>
               <p className="text-indigo-200 text-xs mt-2">Platform Commission (Lifetime)</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <p className="text-slate-500 font-medium mb-1">Average Rate</p>
               <h3 className="text-3xl font-bold text-slate-900">2.4%</h3>
               <p className="text-slate-400 text-xs mt-2">Per Transaction</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <p className="text-slate-500 font-medium mb-1">This Month</p>
               <h3 className="text-3xl font-bold text-emerald-600">+₹450.00</h3>
               <p className="text-emerald-600 text-xs mt-2 font-bold">On Track</p>
            </div>
         </div>

         {/* Margin Settings Section */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Margin Settings</h3>
                    <p className="text-sm text-slate-500">Vendor Level Commission Configuration</p>
                </div>
                <button 
                  onClick={() => alert("Viewing Vendor Tiers")}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  View Vendor Tiers
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700">Standard Vendor</span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-200 rounded text-slate-600">Tier 3</span>
                    </div>
                    <div className="flex items-end gap-1">
                        <input type="number" defaultValue="5.0" className="w-16 bg-transparent border-b border-slate-300 focus:border-indigo-500 text-xl font-bold text-slate-900 outline-none" />
                        <span className="text-sm text-slate-500 mb-1">%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Default margin for new onboarded vendors.</p>
                </div>
                
                <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-indigo-900">Silver Vendor</span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-indigo-200 rounded text-indigo-800">Tier 2</span>
                    </div>
                    <div className="flex items-end gap-1">
                        <input type="number" defaultValue="3.5" className="w-16 bg-transparent border-b border-indigo-300 focus:border-indigo-500 text-xl font-bold text-indigo-900 outline-none" />
                        <span className="text-sm text-indigo-500 mb-1">%</span>
                    </div>
                    <p className="text-xs text-indigo-400 mt-2">{'>'} ₹10k Monthly Sales</p>
                </div>

                <div className="p-4 border border-amber-100 rounded-xl bg-amber-50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-amber-900">Gold Partner</span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-amber-200 rounded text-amber-800">Tier 1</span>
                    </div>
                    <div className="flex items-end gap-1">
                        <input type="number" defaultValue="1.5" className="w-16 bg-transparent border-b border-amber-300 focus:border-amber-500 text-xl font-bold text-amber-900 outline-none" />
                        <span className="text-sm text-amber-500 mb-1">%</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-2">Strategic partners & {'>'} ₹50k Sales</p>
                </div>
            </div>
            <div className="mt-4 text-right">
                <button 
                  onClick={() => alert("Margins updated successfully.")}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Update Margins
                </button>
            </div>
         </div>

         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Commission Ledger</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order Ref</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order Amt</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Rate</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Earning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_COMMISSIONS.map(com => (
                  <tr key={com.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{com.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{com.orderId}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{com.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">₹{com.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{com.rate}%</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">+₹{com.earning.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 -m-4 sm:-m-6 lg:-m-8 font-sans overflow-hidden relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Payments & Finance</h1>
        <p className="text-slate-500 text-sm">Manage payments, settlements, refunds, taxes, and commissions.</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 pt-2 shrink-0">
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

      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center justify-between gap-4 shrink-0 bg-slate-50">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-black border border-slate-200 rounded-lg text-white text-sm font-medium hover:bg-gray-800"
            >
                <Filter size={16} /> Filter
            </button>
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-black border border-slate-200 rounded-lg text-white text-sm font-medium hover:bg-gray-800 "
            >
                <Download size={16} /> Export
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-8">
         <div className="max-w-6xl mx-auto">
             {activeTab === 'Payments' && renderPayments()}
             {activeTab === 'Settlements' && renderSettlements()}
             {activeTab === 'Refunds' && renderRefunds()}
             {activeTab === 'Taxes' && renderTaxes()}
             {activeTab === 'Commission' && renderCommission()}
         </div>
      </div>

      {/* Add Slab Modal */}
      {showTaxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                 <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900">Add Tax Slab</h3>
                    <button onClick={() => setShowTaxModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Clothing"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 bg-white"
                          value={newSlab.category}
                          onChange={e => setNewSlab({...newSlab, category: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tax Rate</label>
                         <input 
                          type="text" 
                          placeholder="e.g. 12%"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 bg-white"
                          value={newSlab.rate}
                          onChange={e => setNewSlab({...newSlab, rate: e.target.value})}
                        />
                    </div>
                    <button 
                        onClick={handleAddSlab}
                        className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 mt-2"
                    >
                        Add Slab
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                 <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900">Filter Transactions</h3>
                    <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 bg-white"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Success">Success / Processed</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed / Rejected</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 bg-white"
                                value={filterDateFrom}
                                onChange={(e) => setFilterDateFrom(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 bg-white"
                                value={filterDateTo}
                                onChange={(e) => setFilterDateTo(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            onClick={() => {
                                setFilterStatus('All');
                                setFilterDateFrom('');
                                setFilterDateTo('');
                                setAppliedFilters({ status: 'All', from: '', to: '' });
                                setShowFilterModal(false);
                            }}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium"
                        >
                            Clear All
                        </button>
                        <button 
                            onClick={applyFilters}
                            className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 shadow-sm"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
