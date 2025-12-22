import React, { useState, useMemo, useEffect } from 'react';
import { 
  CreditCard, FileText, RefreshCcw, Percent, DollarSign, 
  Search, Filter, TrendingUp, MoreVertical, X, RotateCcw
} from 'lucide-react';
import { getTransactions } from '../services/api'; 

export const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  // Stats State
  const [stats, setStats] = useState({
    totalVolume: 0,
    successRate: 0,
    failedCount: 0
  });

  // Filter Modal State
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'All',
    from: '',
    to: ''
  });

  // --- NEW: REFUND HANDLER ---
  const handleRefund = async (paymentId: string) => {
    if (!paymentId) return alert("No Payment ID found for this transaction.");
    
    const confirmRefund = window.confirm(`Are you sure you want to refund payment ${paymentId}?`);
    if (!confirmRefund) return;

    setRefundingId(paymentId);
    try {
        const response = await fetch(`http://localhost:8001/api/v1/finance/refund/${paymentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Refund Processed Successfully!");
            loadFinanceData(); // Refresh list to show 'REFUNDED' status
        } else {
            alert("❌ Refund Failed: " + (data.detail || "Unknown error"));
        }
    } catch (error) {
        console.error("Refund error:", error);
        alert("Server error. Check if backend is running.");
    } finally {
        setRefundingId(null);
    }
  };

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(); 
      setTransactions(data);
      
      const success = data.filter((t: any) => t.status === 'SUCCESS');
      const totalAmt = success.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
      const sRate = data.length > 0 ? (success.length / data.length) * 100 : 0;
      const fCount = data.filter((t: any) => t.status === 'FAILED').length;

      setStats({
        totalVolume: totalAmt,
        successRate: sRate,
        failedCount: fCount
      });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const applyFilters = () => {
      setAppliedFilters({
          status: filterStatus,
          from: filterDateFrom,
          to: filterDateTo
      });
      setShowFilterModal(false);
  };

  const filteredTransactions = useMemo(() => {
      return transactions.filter(txn => {
          if (appliedFilters.status !== 'All') {
              if (appliedFilters.status === 'Success' && txn.status !== 'SUCCESS') return false;
              if (appliedFilters.status === 'Refunded' && txn.status !== 'REFUNDED') return false;
              if (appliedFilters.status === 'Pending' && (txn.status !== 'PENDING' && txn.status !== 'PROCESSING')) return false;
              if (appliedFilters.status === 'Failed' && txn.status !== 'FAILED') return false;
          }
          const txnDate = new Date(txn.created_at);
          if (appliedFilters.from && txnDate < new Date(appliedFilters.from)) return false;
          if (appliedFilters.to && txnDate > new Date(appliedFilters.to)) return false;
          if (searchTerm) {
              const searchLower = searchTerm.toLowerCase();
              return txn.razorpay_payment_id?.toLowerCase().includes(searchLower) || txn.internal_order_id.toLowerCase().includes(searchLower);
          }
          return true;
      });
  }, [appliedFilters, searchTerm, transactions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': case 'PROCESSED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REFUNDED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PENDING': case 'PROCESSING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const TABS = [
    { id: 'Payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'Settlements', label: 'Settlements', icon: <FileText size={18} /> },
    { id: 'Refunds', label: 'Refunds', icon: <RefreshCcw size={18} /> },
    { id: 'Taxes', label: 'Taxes', icon: <Percent size={18} /> },
    { id: 'Commission', label: 'Commission', icon: <DollarSign size={18} /> },
  ];

  const renderPayments = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm text-slate-500 font-medium">Total Volume (Real-time)</p>
           <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-900">₹{stats.totalVolume.toLocaleString()}</h3>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={14} className="mr-1"/> Live
              </span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm text-slate-500 font-medium">Success Rate</p>
           <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-900">{stats.successRate.toFixed(1)}%</h3>
              <span className="text-xs font-medium text-slate-400">All Time</span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm text-slate-500 font-medium">Failed Transactions</p>
           <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-rose-600">{stats.failedCount}</h3>
              <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                Alert
              </span>
           </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction List</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Payment ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order Ref</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map(txn => (
              <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium text-indigo-600">{txn.razorpay_payment_id || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(txn.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">{txn.internal_order_id}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{Number(txn.amount).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* REFUND BUTTON - DESIGNED TO MATCH YOUR ACTION AREA */}
                      {txn.status === 'SUCCESS' && (
                        <button 
                          onClick={() => handleRefund(txn.razorpay_payment_id)}
                          disabled={refundingId === txn.razorpay_payment_id}
                          className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 transition-all"
                        >
                          <RotateCcw size={12} className={refundingId === txn.razorpay_payment_id ? 'animate-spin' : ''} />
                          {refundingId === txn.razorpay_payment_id ? 'Wait...' : 'Refund'}
                        </button>
                      )}
                      <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 -m-4 sm:-m-6 lg:-m-8 font-sans overflow-hidden relative">
      <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Payments & Finance</h1>
        <p className="text-slate-500 text-sm">Manage real-time Razorpay transactions and settlements.</p>
      </div>

      <div className="bg-white border-b border-slate-200 px-6 pt-2 shrink-0">
        <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="px-6 py-4 flex items-center justify-between gap-4 shrink-0 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder={`Search payments...`}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none shadow-sm text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilterModal(true)} className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-sm font-bold"><Filter size={16}/> Filter</button>
            <button onClick={() => loadFinanceData()} className="p-2 bg-white border rounded-lg hover:bg-gray-50"><RefreshCcw size={16} className={loading ? 'animate-spin' : ''}/></button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'Payments' && renderPayments()}
      </div>

      {/* FILTER MODAL */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Filter Transactions</h3>
                    <button onClick={() => setShowFilterModal(false)}><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-2 border rounded-lg mt-1 text-gray-900">
                            <option>All</option><option>Success</option><option>Refunded</option><option>Pending</option><option>Failed</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">From</label>
                            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full p-2 border rounded-lg mt-1 text-gray-900"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">To</label>
                            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full p-2 border rounded-lg mt-1 text-gray-900"/>
                        </div>
                    </div>
                    <button onClick={applyFilters} className="w-full py-3 bg-black text-white rounded-xl font-bold mt-4">Apply Filters</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
export default FinanceView;