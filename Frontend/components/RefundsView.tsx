<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, AlertCircle, CheckCircle, XCircle, DollarSign, Calendar, FileText, Camera, QrCode, X, Mail, Smartphone, Eye, Send, MessageSquare } from 'lucide-react';
import { apiService } from '../services/api';

export const RefundsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [refunds, setRefunds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal & Processing States
    const [proofModalOpen, setProofModalOpen] = useState(false);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedQRRefund, setSelectedQRRefund] = useState<any>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Rejection Modal States
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectId, setRejectId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    // View Reason Modal State
    const [viewReasonModalOpen, setViewReasonModalOpen] = useState(false);
    const [viewReasonText, setViewReasonText] = useState('');

    const tabs = [
        'All Refunds',
        'Pending',
        'Approved',
        'Rejected',
        'Completed'
    ];

    // Fetch refunds on mount and when tab changes
    useEffect(() => {
        fetchRefunds();
    }, [activeTab]);

    const fetchRefunds = async () => {
        try {
            setLoading(true);
            const status = activeTab === 'All Refunds' ? undefined : activeTab;
            const data = await apiService.fetchRefunds(status);
            setRefunds(data);
        } catch (error) {
            console.error("Failed to fetch refunds:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAndGenerateQR = async (id: number) => {
        setProcessingId(id);

        try {
            await apiService.updateRefundStatus(id, 'Approved');
            alert(`Refund Approved! \n\n1. QR Code Generated containing product & damage details.\n2. Email sent to customer.\n3. App notification pushed.`);
            fetchRefunds();
        } catch (error) {
            console.error("Failed to approve refund:", error);
            alert('Failed to approve refund. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectClick = (id: number) => {
        setRejectId(id);
        setRejectReason('');
        setRejectModalOpen(true);
    };

    const confirmReject = async () => {
        if (rejectId) {
            try {
                await apiService.updateRefundStatus(rejectId, 'Rejected');
                alert(`Refund Rejected.\n\nReason sent to customer: "${rejectReason}"`);
                setRejectModalOpen(false);
                setRejectId(null);
                setRejectReason('');
                fetchRefunds();
            } catch (error) {
                console.error("Failed to reject refund:", error);
                alert('Failed to reject refund. Please try again.');
            }
        }
    };

    const handleViewProof = (imageUrl: string) => {
        const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8001";
        setSelectedProof(`${baseUrl}${imageUrl}`);
        setProofModalOpen(true);
    };

    const handleViewQR = (refund: any) => {
        setSelectedQRRefund(refund);
        setQrModalOpen(true);
    };

    const handleViewRejectionReason = (reason: string) => {
        setViewReasonText(reason);
        setViewReasonModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Approved': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getReturnStatusColor = (status: string | null) => {
        if (!status) return 'bg-gray-100 text-gray-500 border-gray-200';
        const upperStatus = status.toUpperCase();
        if (upperStatus.includes('DELIVERED')) return 'bg-green-100 text-green-800 border-green-200';
        if (upperStatus.includes('TRANSIT')) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (upperStatus.includes('PICKED')) return 'bg-purple-100 text-purple-800 border-purple-200';
        if (upperStatus.includes('MANIFEST')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const filteredRefunds = refunds.filter(item => {
        const matchesSearch =
            item.id?.toString().includes(searchTerm.toLowerCase()) ||
            item.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'All Refunds') return matchesSearch;
        return matchesSearch && item.status === activeTab;
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Refund Management</h2>
                <p className="text-gray-500 mt-1">Review damage proofs, approve returns, and auto-generate QR codes.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Amount</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                ₹{refunds.filter(r => r.status === 'Pending').reduce((sum, r) => sum + parseFloat(r.amount || 0), 0).toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-yellow-600 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> {refunds.filter(r => r.status === 'Pending').length} requests pending approval
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Approved Today</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                ₹{refunds.filter(r => r.status === 'Approved').reduce((sum, r) => sum + parseFloat(r.amount || 0), 0).toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-green-600 font-medium flex items-center gap-1">
                        <RotateCcw size={12} /> {refunds.filter(r => r.status === 'Approved').length} refunds approved
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Rejected</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{refunds.filter(r => r.status === 'Rejected').length}</h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <XCircle size={20} />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-400 font-medium">
                        This month
                    </div>
                </div>
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
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Controls */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Order ID, Customer or Refund ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Refunds Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Refund ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order & Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Return Status</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Proof</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRefunds.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">#{item.id}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar size={10} /> {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-blue-600">{item.order_number || '-'}</div>
                                        <div className="text-sm text-gray-500">{item.customer_name || 'Unknown'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.reason}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₹{parseFloat(item.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {item.return_delivery_status ? (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium ${getReturnStatusColor(item.return_delivery_status)}`}>
                                                {item.return_delivery_status}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {item.proof_image_path ? (
                                            <button
                                                onClick={() => handleViewProof(item.proof_image_path)}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
                                            >
                                                <Camera size={14} /> View
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs">No proof</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {item.status === 'Pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApproveAndGenerateQR(item.id)}
                                                    disabled={processingId === item.id}
                                                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold text-white transition-all shadow-sm ${processingId === item.id
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-gray-900 hover:bg-gray-800'
                                                        }`}
                                                    title="Approve & Generate QR"
                                                >
                                                    {processingId === item.id ? (
                                                        <RotateCcw size={14} className="animate-spin" />
                                                    ) : (
                                                        <QrCode size={14} />
                                                    )}
                                                    {processingId === item.id ? 'Processing...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleRejectClick(item.id)}
                                                    disabled={!!processingId}
                                                    className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors text-xs font-bold flex items-center gap-1"
                                                    title="Reject Refund"
                                                >
                                                    <X size={14} /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center text-gray-400">
                                                {item.status === 'Approved' ? (
                                                    <span className="text-xs text-blue-600 font-medium">Approved</span>
                                                ) : item.status === 'Completed' ? (
                                                    <span className="text-xs text-green-600 font-medium">Completed</span>
                                                ) : (
                                                    <span className="text-xs text-red-500 font-medium">Rejected</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredRefunds.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                                        No refund requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Proof Image Modal */}
            {proofModalOpen && selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl overflow-hidden max-w-lg w-full relative shadow-2xl">
                        <button
                            onClick={() => setProofModalOpen(false)}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>
                        <div className="bg-gray-100 p-1 flex items-center justify-center min-h-[300px]">
                            <img
                                src={selectedProof}
                                alt="Customer Proof"
                                className="max-w-full max-h-[60vh] object-contain rounded"
                            />
                        </div>
                        <div className="p-4 bg-white">
                            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <Camera size={16} className="text-blue-600" /> Customer Proof Image
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                This image was uploaded by the customer as proof of damage/return reason.
                                Verify clearly before approving.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Reason Input Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <XCircle size={20} className="text-red-600" /> Reject Refund
                            </h3>
                            <button onClick={() => setRejectModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Please provide a reason for rejecting this refund request. This explanation will be sent directly to the customer via email.
                            </p>

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reason for Rejection</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition-shadow"
                                    rows={4}
                                    placeholder="e.g. Item returned does not match the original product, Warranty seal broken..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    autoFocus
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setRejectModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmReject}
                                    disabled={!rejectReason.trim()}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all"
                                >
                                    <Send size={14} /> Send & Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
=======

import React, { useState } from 'react';
import { Search, RotateCcw, AlertCircle, CheckCircle, XCircle, DollarSign, Calendar, FileText, Camera, QrCode, X, Mail, Smartphone, Eye, Send, MessageSquare } from 'lucide-react';
import { MOCK_REFUNDS } from '../constants';

// Mock adding images to existing data
const REFUNDS_WITH_IMAGES = MOCK_REFUNDS.map((r, i) => ({
    ...r,
    imageUrl: "https://www.dignited.com/wp-content/uploads/2019/02/close-up-burnt-green-microchip-after-short-circuit-due-to-water-damage.jpg",
    email: 'customer@example.com',
    rejectionReason: r.status === 'Rejected' ? 'Item returned did not match the original product sent. Serial number mismatch.' : undefined
}));

export const RefundsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [refunds, setRefunds] = useState(REFUNDS_WITH_IMAGES);
  
  // Modal & Processing States
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQRRefund, setSelectedQRRefund] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Rejection Modal States
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // View Reason Modal State
  const [viewReasonModalOpen, setViewReasonModalOpen] = useState(false);
  const [viewReasonText, setViewReasonText] = useState('');

  const tabs = [
    'All Refunds',
    'Pending',
    'Processed',
    'Rejected'
  ];

  const handleApproveAndGenerateQR = (id: string) => {
    setProcessingId(id);
    
    // Simulate API call and Email generation
    setTimeout(() => {
        setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'Processed' } : r));
        setProcessingId(null);
        alert(`Refund Approved! \n\n1. QR Code Generated containing product & damage details.\n2. Email sent to customer.\n3. App notification pushed.`);
    }, 2000);
  };

  const handleRejectClick = (id: string) => {
    setRejectId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (rejectId) {
        setRefunds(prev => prev.map(r => r.id === rejectId ? { 
            ...r, 
            status: 'Rejected',
            rejectionReason: rejectReason 
        } : r));
        
        // Simulate API call
        console.log(`Refund ${rejectId} rejected. Reason: ${rejectReason}`);
        alert(`Refund Rejected.\n\nReason sent to customer: "${rejectReason}"`);
        
        setRejectModalOpen(false);
        setRejectId(null);
        setRejectReason('');
    }
  };

  const handleViewProof = (imageUrl: string) => {
      setSelectedProof(imageUrl);
      setProofModalOpen(true);
  };

  const handleViewQR = (refund: any) => {
      setSelectedQRRefund(refund);
      setQrModalOpen(true);
  };

  const handleViewRejectionReason = (reason: string) => {
      setViewReasonText(reason);
      setViewReasonModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRefunds = refunds.filter(item => {
    const matchesSearch = 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'All Refunds') return matchesSearch;
    return matchesSearch && item.status === activeTab;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Refund Management</h2>
        <p className="text-gray-500 mt-1">Review damage proofs, approve returns, and auto-generate QR codes.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
             <div className="flex justify-between items-start">
                 <div>
                     <p className="text-sm font-medium text-gray-500">Pending Amount</p>
                     <h3 className="text-2xl font-bold text-gray-900 mt-1">₹49,650</h3>
                 </div>
                 <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                     <DollarSign size={20} />
                 </div>
             </div>
             <div className="mt-4 text-xs text-yellow-600 font-medium flex items-center gap-1">
                 <AlertCircle size={12} /> 3 requests pending approval
             </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
             <div className="flex justify-between items-start">
                 <div>
                     <p className="text-sm font-medium text-gray-500">Processed Today</p>
                     <h3 className="text-2xl font-bold text-gray-900 mt-1">₹12,500</h3>
                 </div>
                 <div className="p-2 bg-green-50 rounded-lg text-green-600">
                     <CheckCircle size={20} />
                 </div>
             </div>
             <div className="mt-4 text-xs text-green-600 font-medium flex items-center gap-1">
                 <RotateCcw size={12} /> 2 refunds completed
             </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
             <div className="flex justify-between items-start">
                 <div>
                     <p className="text-sm font-medium text-gray-500">Total Rejected</p>
                     <h3 className="text-2xl font-bold text-gray-900 mt-1">15</h3>
                 </div>
                 <div className="p-2 bg-red-50 rounded-lg text-red-600">
                     <XCircle size={20} />
                 </div>
             </div>
             <div className="mt-4 text-xs text-gray-400 font-medium">
                 This month
             </div>
          </div>
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
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Controls */}
      <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer or Refund ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
      </div>

      {/* Refunds Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Refund ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order & Customer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Proof</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRefunds.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.id}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={10} /> {item.requestDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-blue-600">{item.orderId}</div>
                    <div className="text-sm text-gray-500">{item.customerName}</div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mt-1 ${item.type === 'B2B' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                        {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-sm font-medium ${item.reason === 'Failed Delivery' ? 'text-red-600' : 'text-gray-700'}`}>
                         {item.reason}
                     </span>
                     <div className="text-xs text-gray-400 mt-0.5">Verified by System</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => handleViewProof(item.imageUrl)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
                      >
                          <Camera size={14} /> View
                      </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {item.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleApproveAndGenerateQR(item.id)}
                              disabled={processingId === item.id}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold text-white transition-all shadow-sm ${
                                processingId === item.id 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gray-900 hover:bg-gray-800'
                              }`} 
                              title="Approve & Generate QR"
                            >
                                {processingId === item.id ? (
                                    <RotateCcw size={14} className="animate-spin" />
                                ) : (
                                    <QrCode size={14} />
                                )}
                                {processingId === item.id ? 'Gen QR...' : 'Approve'}
                            </button>
                            <button 
                              onClick={() => handleRejectClick(item.id)}
                              disabled={!!processingId}
                              className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors text-xs font-bold flex items-center gap-1" 
                              title="Reject Refund"
                            >
                                <X size={14} /> Reject
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center text-gray-400">
                            {item.status === 'Processed' ? (
                                <button 
                                    onClick={() => handleViewQR(item)}
                                    className="flex items-center gap-1 text-xs text-green-600 font-medium hover:underline hover:text-green-800"
                                >
                                    <QrCode size={14} /> View QR
                                </button>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                        <XCircle size={14} /> Rejected
                                    </span>
                                    {item.rejectionReason && (
                                        <button 
                                            onClick={() => handleViewRejectionReason(item.rejectionReason!)}
                                            className="text-[10px] text-gray-500 underline hover:text-gray-800 mt-1"
                                        >
                                            View Reason
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRefunds.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No refund requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Image Modal */}
      {proofModalOpen && selectedProof && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl overflow-hidden max-w-lg w-full relative shadow-2xl">
                  <button 
                    onClick={() => setProofModalOpen(false)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors z-10"
                  >
                      <X size={20} />
                  </button>
                  <div className="bg-gray-100 p-1 flex items-center justify-center min-h-[300px]">
                      <img 
                        src={selectedProof} 
                        alt="Customer Proof" 
                        className="max-w-full max-h-[60vh] object-contain rounded"
                      />
                  </div>
                  <div className="p-4 bg-white">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <Camera size={16} className="text-blue-600" /> Customer Proof Image
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                          This image was uploaded by the customer as proof of damage/return reason.
                          Verify clearly before approving.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Reject Reason Input Modal */}
      {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                          <XCircle size={20} className="text-red-600" /> Reject Refund
                      </h3>
                      <button onClick={() => setRejectModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-6">
                      <p className="text-sm text-gray-600 mb-4">
                          Please provide a reason for rejecting this refund request. This explanation will be sent directly to the customer via email.
                      </p>
                      
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reason for Rejection</label>
                          <textarea 
                              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition-shadow"
                              rows={4}
                              placeholder="e.g. Item returned does not match the original product, Warranty seal broken..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              autoFocus
                          ></textarea>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                              onClick={() => setRejectModalOpen(false)}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={confirmReject}
                              disabled={!rejectReason.trim()}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all"
                          >
                              <Send size={14} /> Send & Reject
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* View Reason Display Modal */}
      {viewReasonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-200">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <MessageSquare size={16} className="text-gray-500" /> Rejection Details
                      </h3>
                      <button onClick={() => setViewReasonModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={18} />
                      </button>
                  </div>
                  <div className="p-6">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">Sent to Customer</p>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <p className="text-sm text-red-900 italic">"{viewReasonText}"</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                          <button 
                              onClick={() => setViewReasonModalOpen(false)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded hover:bg-gray-200 transition-colors"
                          >
                              Close
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* QR Code Modal */}
      {qrModalOpen && selectedQRRefund && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
              <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl border border-gray-200">
                  <div className="bg-gray-900 p-6 text-center relative">
                      <button 
                        onClick={() => setQrModalOpen(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                      >
                          <X size={20} />
                      </button>
                      <h3 className="text-white font-bold text-lg">Refund Approved</h3>
                      <p className="text-gray-400 text-sm mt-1">Scan to verify return details</p>
                  </div>
                  <div className="p-8 flex flex-col items-center justify-center bg-white">
                      <div className="p-2 bg-white border-2 border-gray-900 rounded-lg shadow-sm mb-6">
                          {/* Placeholder for QR Code */}
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({id: selectedQRRefund.id, amount: selectedQRRefund.amount, order: selectedQRRefund.orderId}))}`}
                            alt="Refund QR Code" 
                            className="w-48 h-48"
                          />
                      </div>
                      
                      <div className="w-full text-center space-y-2">
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Refund ID</p>
                              <p className="text-lg font-mono font-bold text-gray-900">{selectedQRRefund.id}</p>
                          </div>
                          <div className="flex justify-center gap-8 pt-2 border-t border-gray-100 mt-2">
                              <div>
                                  <p className="text-xs text-gray-500 uppercase font-bold">Amount</p>
                                  <p className="text-green-600 font-bold">{selectedQRRefund.amount}</p>
                              </div>
                              <div>
                                  <p className="text-xs text-gray-500 uppercase font-bold">Order Ref</p>
                                  <p className="text-blue-600 font-bold">{selectedQRRefund.orderId}</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                      <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                          <Mail size={12} /> Sent to {selectedQRRefund.email || 'customer'}
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
>>>>>>> 1e65977e (connnect)
};
