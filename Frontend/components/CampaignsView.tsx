import React, { useEffect, useState } from "react";
import {
  Tag,
  Zap,
  Plus,
  Search,
  X
} from "lucide-react";

import {
  getCampaignCoupons,
  createCampaignCoupon,
  updateCampaignCoupon,
  deleteCampaignCoupon,
  getCampaignFlashDeals
} from "../services/api";

/* =======================
   TYPES
======================= */

interface Coupon {
  id: number;
  code: string;
  type: string;
  value: string;
  target: string;
  usage_count: string;
  status: string;
  expiry?: string | null;
  min_order_value?: string; // New for workflow
  usage_limit?: string;      // New for workflow
}

interface FlashDeal {
  id: string | number;
  product: string;
  original_price: number;
  deal_price: number;
  discount: string;
  ends_in: string | null;
  status: string;
}

/* =======================
   COMPONENT
======================= */

export const CampaignsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Promos" | "Flash Deals">("Promos");
  const [searchTerm, setSearchTerm] = useState("");

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // UPDATED WORKFLOW STATE: Added fields for eCommerce app rules
  const [newPromo, setNewPromo] = useState({
    code: "",
    type: "Percentage",
    value: "",
    target: "All",
    expiry: "",
    min_order_value: "0",
    usage_limit: "100"
  });

  /* =======================
      LOAD DATA
  ======================= */

  useEffect(() => {
    loadCoupons();
    loadFlashDeals();
  }, []);

  const loadCoupons = async () => {
    const data = await getCampaignCoupons();
    setCoupons(data);
  };

  const loadFlashDeals = async () => {
    const data = await getCampaignFlashDeals();
    setFlashDeals(data);
  };

  /* =======================
      CREATE / UPDATE COUPON
  ======================= */

  const handleAddPromo = async () => {
    if (!newPromo.code || !newPromo.value) return;

    const payload: any = {
      code: newPromo.code,
      type: newPromo.type,
      value: newPromo.value,
      target: newPromo.target,
      min_order_value: newPromo.min_order_value,
      usage_limit: newPromo.usage_limit
    };

    if (newPromo.expiry?.trim()) {
      payload.expiry = newPromo.expiry;
    }

    if (editingCoupon) {
      await updateCampaignCoupon(editingCoupon.id, payload);
    } else {
      await createCampaignCoupon(payload);
    }

    setShowPromoModal(false);
    setEditingCoupon(null);
    setNewPromo({
      code: "",
      type: "Percentage",
      value: "",
      target: "All",
      expiry: "",
      min_order_value: "0",
      usage_limit: "100"
    });

    loadCoupons();
  };

  /* =======================
      UI
  ======================= */

  const TABS = [
    { id: "Promos", label: "Coupons & Promos", icon: <Tag size={18} /> },
    { id: "Flash Deals", label: "Flash Deals", icon: <Zap size={18} /> }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-6 py-5">
        <h1 className="text-2xl font-bold">Campaigns & Promotions</h1>
        <p className="text-sm text-gray-500">
          Manage coupons and product flash deals
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <nav className="flex space-x-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">

        {/* ================= PROMOS ================= */}
        {activeTab === "Promos" && (
          <>
            <div className="flex justify-between mb-4">
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setShowPromoModal(true);
                }}
                className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> Create Coupon
              </button>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Code</th>
                    <th className="px-6 py-4 font-semibold">Value</th>
                    <th className="px-6 py-4 font-semibold">Target</th>
                    <th className="px-6 py-4 font-semibold">Usage</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons
                    .filter(c =>
                      c.code.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(coupon => (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                          {coupon.code}
                        </td>
                        <td className="px-6 py-4">
                          {coupon.value} ({coupon.type})
                        </td>
                        <td className="px-6 py-4">{coupon.target}</td>
                        <td className="px-6 py-4">{coupon.usage_count}</td>
                        <td className="px-6 py-4">
                           <span className="capitalize px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                            {coupon.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-4">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold"
                              onClick={() => {
                                setEditingCoupon(coupon);
                                setNewPromo({
                                  code: coupon.code,
                                  type: coupon.type,
                                  value: coupon.value,
                                  target: coupon.target,
                                  expiry: coupon.expiry || "",
                                  min_order_value: coupon.min_order_value || "0",
                                  usage_limit: coupon.usage_limit || "100"
                                });
                                setShowPromoModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 text-xs font-semibold"
                              onClick={async () => {
                                if (!confirm(`Delete coupon ${coupon.code}?`)) return;
                                await deleteCampaignCoupon(coupon.id);
                                loadCoupons();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ================= FLASH DEALS (ORIGINAL CODE PRESERVED) ================= */}
        {activeTab === "Flash Deals" && (
          <>
            <div className="flex justify-between mb-4">
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">Original</th>
                    <th className="px-6 py-3 font-semibold">Deal Price</th>
                    <th className="px-6 py-3 font-semibold">Discount</th>
                    <th className="px-6 py-3 font-semibold">Ends</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {flashDeals
                    .filter(d =>
                      d.product.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(deal => (
                      <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{deal.product}</td>
                        <td className="px-6 py-4 text-gray-500 line-through">₹{deal.original_price}</td>
                        <td className="px-6 py-4 text-green-600 font-bold">
                          ₹{deal.deal_price}
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                             {deal.discount}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {deal.ends_in
                            ? new Date(deal.ends_in).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase px-2 py-1 rounded-full">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ================= UPDATED COUPON MODAL ================= */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
              </h3>
              <button onClick={() => setShowPromoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code</label>
                <input
                  className="w-full border px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono uppercase"
                  placeholder="E.g. WELCOME10"
                  value={newPromo.code}
                  onChange={e =>
                    setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })
                  }
                />
              </div>

              {/* Value & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                  <input
                    className="w-full border px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="20"
                    value={newPromo.value}
                    onChange={e =>
                      setNewPromo({ ...newPromo, value: e.target.value })
                    }
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                   <select 
                    className="w-full border px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={newPromo.type}
                    onChange={e => setNewPromo({...newPromo, type: e.target.value})}
                   >
                     <option value="Percentage">Percentage (%)</option>
                     <option value="Fixed">Fixed Amount (₹)</option>
                   </select>
                </div>
              </div>

              {/* Workflow Fields: Min Order & Limit */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    className="w-full border px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newPromo.min_order_value}
                    onChange={e => setNewPromo({ ...newPromo, min_order_value: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usage Limit</label>
                  <input
                    type="number"
                    className="w-full border px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newPromo.usage_limit}
                    onChange={e => setNewPromo({ ...newPromo, usage_limit: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={handleAddPromo}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all mt-4 shadow-md active:scale-[0.98]"
              >
                {editingCoupon ? "Update & Sync" : "Create & Sync to App"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};