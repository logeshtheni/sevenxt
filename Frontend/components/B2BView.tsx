
import React, { useState } from 'react';
import { Eye, FileText, CheckCircle, Clock, FileCheck, Check, X, Calendar, Activity, AlertTriangle, XCircle, ShoppingBag, Tag, CreditCard, DollarSign, Download, MapPin, Phone, Mail } from 'lucide-react';
import { MOCK_B2B_PROFILE_USERS, MOCK_KYC_REQUESTS, MOCK_B2B_ACTIVITY_LOGS } from '../constants';
import { KYCRequest, B2BUser } from '../types';

export const B2BView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('B2B Users');
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>(MOCK_KYC_REQUESTS);
  const [b2bUsers, setB2BUsers] = useState<B2BUser[]>(MOCK_B2B_PROFILE_USERS);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<B2BUser | null>(null);
  const [editForm, setEditForm] = useState<Partial<B2BUser>>({});

  // View User Modal State
  const [viewingUser, setViewingUser] = useState<B2BUser | null>(null);
  
  // PO State
  const [purchaseOrders, setPurchaseOrders] = useState([
      { id: 'PO-10029', company: 'Tech Solutions Ltd', amount: '₹1,50,000', date: '2024-05-21', status: 'Pending' },
      { id: 'PO-10030', company: 'Global Imports Inc', amount: '₹85,500', date: '2024-05-20', status: 'Approved' },
      { id: 'PO-10031', company: 'Business Traders', amount: '₹2,10,000', date: '2024-05-19', status: 'Pending' },
  ]);

  const tabs = [
    'B2B Users', 
    'KYC Approvals', 
    'Purchase Orders', 
    'Contract Pricing', 
    'Quotations', 
    'Ledger',
    'Activity Logs'
  ];

  // Mock Data for Contract Pricing
  const MOCK_CONTRACTS = [
      { id: 'CNT-01', company: 'Tech Solutions Ltd', product: 'Samsung Monitor 24"', standardPrice: '₹12,000', contractPrice: '₹10,500', expiry: '2024-12-31' },
      { id: 'CNT-02', company: 'Global Imports Inc', product: 'Wireless Mouse M2', standardPrice: '₹850', contractPrice: '₹700', expiry: '2024-09-30' },
  ];

  // Mock Data for Quotations
  const MOCK_QUOTES = [
      { id: 'QT-5001', company: 'Tech Solutions Ltd', items: 15, total: '₹45,000', date: '2024-05-22', status: 'Sent' },
      { id: 'QT-5002', company: 'Alpha Constructions', items: 50, total: '₹5,20,000', date: '2024-05-21', status: 'Draft' },
  ];

  // Mock Data for Ledger
  const MOCK_LEDGER = [
      { id: 'TXN-991', date: '2024-05-20', desc: 'Invoice #INV-8821 Payment', type: 'Credit', amount: '₹50,000', balance: '₹1,20,000' },
      { id: 'TXN-992', date: '2024-05-18', desc: 'Purchase Order #PO-10025', type: 'Debit', amount: '₹25,000', balance: '₹70,000' },
  ];


  const handleKYCAction = (id: string, status: 'Approved' | 'Rejected') => {
    setKycRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleEditUser = (user: B2BUser) => {
      setEditingUser(user);
      setEditForm({ ...user });
  };

  const handleViewUser = (user: B2BUser) => {
      setViewingUser(user);
  };

  const handleSaveUser = () => {
      if (editingUser && editForm.companyName) {
          setB2BUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...editForm } as B2BUser : u));
          setEditingUser(null);
      }
  };

  const handleApprovePO = (id: string) => {
      setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status: 'Approved' } : po));
  };

  const handleDownloadLedger = () => {
      const headers = ['Transaction ID', 'Date', 'Description', 'Type', 'Amount', 'Balance'];
      const csvContent = [
          headers.join(','),
          ...MOCK_LEDGER.map(row => [
              row.id,
              row.date,
              `"${row.desc}"`,
              row.type,
              `"${row.amount}"`,
              `"${row.balance}"`
          ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'b2b_ledger_statement.csv';
      link.click();
  };

  const handleExportLogs = () => {
      const headers = ['Company', 'Action', 'Details', 'Timestamp', 'Status'];
      const csvContent = [
          headers.join(','),
          ...MOCK_B2B_ACTIVITY_LOGS.map(log => [
              `"${log.user}"`,
              log.action,
              `"${log.details}"`,
              log.timestamp,
              log.status
          ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'b2b_activity_logs.csv';
      link.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Success': return <CheckCircle size={14} className="text-green-500" />;
        case 'Failed': return <XCircle size={14} className="text-red-500" />;
        case 'Warning': return <AlertTriangle size={14} className="text-amber-500" />;
        default: return <Activity size={14} className="text-gray-500" />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'B2B Users':
        return (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Verified Business Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wider">
                      Company Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {b2bUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.companyName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.contactName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                          user.status === 'Verified' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                         <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewUser(user)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors border border-gray-200"
                              title="View Details"
                            >
                                <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                                Edit
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'KYC Approvals':
        return (
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                     <FileCheck size={20} className="text-blue-600" />
                     Document Verification Queue
                 </h3>
                 <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                     {kycRequests.length} Pending
                 </span>
             </div>
             
             {kycRequests.length === 0 ? (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-10 text-center">
                    <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
                    <p className="text-gray-500 mt-1">There are no pending KYC documents to review.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {kycRequests.map((req) => (
                        <div key={req.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            {/* Document Preview Header */}
                            <div className="h-40 bg-gray-100 relative group">
                                <img 
                                    src="https://imgv2-2-f.scribdassets.com/img/document/621621186/original/c892368009/1687524000?v=1" 
                                    alt="Document" 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                                    <button 
                                      onClick={() => alert("Opening full size document...")}
                                      className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
                                    >
                                        <Eye size={14} /> View Full Size
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                                    {req.documentType}
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-4 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-md font-bold text-gray-900 truncate" title={req.companyName}>
                                        {req.companyName}
                                    </h4>
                                    <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                                        <Calendar size={10} /> {req.submittedDate}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">{req.email}</p>
                                <div className="bg-gray-50 p-2 rounded border border-gray-100 mt-2">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Document Number</p>
                                    <p className="text-sm font-mono text-gray-800">{req.documentNumber}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                                <button 
                                    onClick={() => handleKYCAction(req.id, 'Rejected')}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <X size={16} /> Reject
                                </button>
                                <button 
                                    onClick={() => handleKYCAction(req.id, 'Approved')}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                >
                                    <Check size={16} /> Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             )}
          </div>
        );
      case 'Purchase Orders':
        return (
           <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
             <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                 <ShoppingBag size={20} className="text-purple-600" /> Recent Purchase Orders
               </h3>
               {/* <button onClick={() => alert("Creating new PO")} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800">Create PO</button> */}
             </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">PO Number</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {purchaseOrders.map((po) => (
                            <tr key={po.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-mono font-medium text-blue-600">{po.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{po.company}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{po.date}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{po.amount}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        po.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {po.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {po.status === 'Pending' && (
                                        <button 
                                            onClick={() => handleApprovePO(po.id)}
                                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                                        >
                                            Approve PO
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
           </div>
        );
      case 'Contract Pricing':
          return (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Tag size={20} className="text-indigo-600" /> Client Level Pricing
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Manage special pricing agreements for specific clients.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contract ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Std Price</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Contract Price</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Expires</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {MOCK_CONTRACTS.map((contract) => (
                                <tr key={contract.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{contract.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{contract.company}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{contract.product}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 text-right line-through">{contract.standardPrice}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">{contract.contractPrice}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{contract.expiry}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          );
      case 'Quotations':
          return (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FileText size={20} className="text-orange-600" /> Quotation Manager
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Track Quotations sent to prospective clients.</p>
                    </div>
                    <button onClick={() => alert("Creating new Quote")} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800">New Quote</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Quote ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Company</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Items</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total Value</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {MOCK_QUOTES.map((quote) => (
                                <tr key={quote.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-mono text-blue-600">{quote.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{quote.company}</td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-600">{quote.items}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{quote.total}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{quote.date}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            quote.status === 'Sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {quote.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          );
      case 'Ledger':
          return (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard size={20} className="text-emerald-600" /> Ledger Statements
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Payment Activity and account balances.</p>
                    </div>
                     <button 
                        onClick={handleDownloadLedger}
                        className="text-xs flex items-center gap-1 bg-black border border-gray-300 text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                     >
                        <Download size={14} /> Download Statement
                    </button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Balance</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {MOCK_LEDGER.map((txn) => (
                                <tr key={txn.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{txn.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{txn.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{txn.desc}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                            txn.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {txn.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-bold text-right ${txn.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.type === 'Credit' ? '+' : '-'}{txn.amount}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900 text-right">{txn.balance}</td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                 </div>
            </div>
          );
      case 'Activity Logs':
        return (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">B2B Activity Logs</h3>
              <button 
                onClick={handleExportLogs}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Download size={14} /> Export Logs
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Action</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Timestamp</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {MOCK_B2B_ACTIVITY_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${log.status === 'Success' ? 'bg-green-50 text-green-700 border border-green-100' : 
                              log.status === 'Failed' ? 'bg-red-50 text-red-700 border border-red-100' : 
                              'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                            {getStatusIcon(log.status)} {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <div className="p-3 rounded-full bg-gray-50 mb-3">
                    <CheckCircle className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">{activeTab} Module</h3>
                <p className="text-xs text-gray-500 mt-1">Content for {activeTab} is currently up to date.</p>
            </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">B2B Management</h2>
        <p className="text-gray-500 mt-1">Manage business users, KYC approvals, and purchase orders</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div>
        {renderContent()}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900">Edit B2B User</h3>
                    <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900"
                          value={editForm.companyName}
                          onChange={e => setEditForm({...editForm, companyName: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                             <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900"
                                value={editForm.contactName}
                                onChange={e => setEditForm({...editForm, contactName: e.target.value})}
                            />
                        </div>  
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                         <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900"
                                value={editForm.status}
                                onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                         >
                             <option value="Verified">Verified</option>
                             <option value="Pending">Pending</option>
                         </select>
                    </div>
                    <button 
                        onClick={handleSaveUser}
                        className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 mt-2"
                    >
                        Save Changes
                    </button>
                </div>
             </div>
         </div>
      )}

      {/* View User Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                   <h3 className="font-bold text-lg text-slate-900">Company Details</h3>
                   <button onClick={() => setViewingUser(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
               </div>
               <div className="p-6 space-y-6">
                   <div className="flex items-center gap-4">
                       <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                           {viewingUser.companyName.charAt(0)}
                       </div>
                       <div>
                           <h2 className="text-xl font-bold text-gray-900">{viewingUser.companyName}</h2>
                           <p className="text-sm text-gray-500">{viewingUser.email}</p>
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                               viewingUser.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                           }`}>
                               {viewingUser.status}
                           </span>
                       </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
                       <div>
                           <label className="text-xs font-bold text-gray-400 uppercase">Contact Person</label>
                           <p className="text-sm font-medium text-gray-900 mt-1">{viewingUser.contactName}</p>
                       </div>
                       <div>
                           <label className="text-xs font-bold text-gray-400 uppercase">Account ID</label>
                           <p className="text-sm font-medium text-gray-900 mt-1 font-mono">{viewingUser.id}</p>
                       </div>
                       <div>
                           <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                           <p className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-1"><Phone size={12} /> +91 98765 43210</p>
                       </div>
                       <div>
                           <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                           <p className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-1"><MapPin size={12} /> Bangalore, KA</p>
                       </div>
                   </div>

                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                       <h4 className="text-sm font-bold text-gray-900 mb-2">Business Metrics</h4>
                       <div className="flex justify-between text-sm">
                           <span className="text-gray-500">Total Orders</span>
                           <span className="font-medium text-gray-900">124</span>
                       </div>
                       <div className="flex justify-between text-sm mt-1">
                           <span className="text-gray-500">Lifetime Value</span>
                           <span className="font-medium text-green-600">₹45,20,000</span>
                       </div>
                   </div>
               </div>
               <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                   <button 
                       onClick={() => setViewingUser(null)}
                       className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm"
                   >
                       Close
                   </button>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};
