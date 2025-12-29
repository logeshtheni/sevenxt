import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingCart,
  Truck,
  RotateCcw,
  Package,
  FolderTree,
  CreditCard,
  Menu,
  Bell,
  Search,
  ChevronDown,
  X,
  Settings,
  DollarSign,
  Layout,
  BarChart3,
  LogOut,
  Plane,
<<<<<<< HEAD
  MapPin,
  RefreshCw
=======
  MapPin
>>>>>>> 1e65977e (connnect)
} from "lucide-react";
import { DashboardView } from "./components/DashboardView";
import { ProductsView } from "./components/ProductsView";
import { UsersView } from "./components/UsersView";
import { B2BView } from "./components/B2BView";
import { OrdersView } from "./components/OrdersView";
import { DeliveryView } from "./components/DeliveryView";
<<<<<<< HEAD
import { PorterView } from "./components/LocalDelivery";
import { RefundsView } from "./components/RefundsView";
import ExchangesView from "./components/ExchangesView";
=======
import { PorterView } from "./components/PorterView";
import { RefundsView } from "./components/RefundsView";
>>>>>>> 1e65977e (connnect)
import { CategoriesView } from "./components/CategoriesView";
import { SettingsView } from "./components/SettingsView";
import { FinanceView } from "./components/FinanceView";
import { CampaignsView } from "./components/CampaignsView";
import { CMSView } from "./components/CMSView";
import { ReportsView } from "./components/ReportsView";
import { LoginView } from "./components/LoginView";
import { ViewState } from "./types";
import logo from "./assets/logo.jpg";
import { apiService } from "./services/api";


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(apiService.isAuthenticated());
  const [activeView, setActiveView] = useState<ViewState | string>(
    ViewState.DASHBOARD
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sidebar Menu Items configuration
  const menuItems = [
    { id: ViewState.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { id: "USERS", label: "Users", icon: Users },
    { id: "B2B", label: "B2B Management", icon: Briefcase },
    { id: ViewState.ORDERS, label: "Orders", icon: ShoppingCart },
    { id: "FINANCE", label: "Payments & Finance", icon: DollarSign },
    { id: "REPORTS", label: "Reports", icon: BarChart3 },
    { id: "DELIVERY", label: "Delivery (Outstation)", icon: Truck }, // Updated label and icon
    { id: "PORTER", label: "Local Delivery (Chennai)", icon: MapPin }, // Updated label and icon
    { id: "REFUNDS", label: "Refunds", icon: RotateCcw },
<<<<<<< HEAD
    { id: "EXCHANGES", label: "Exchanges", icon: RefreshCw },
=======
>>>>>>> 1e65977e (connnect)
    { id: ViewState.PRODUCTS, label: "Products", icon: Package },
    { id: "CATEGORIES", label: "Categories", icon: FolderTree },
    { id: "PRICING", label: "Campaigns", icon: CreditCard },
    { id: "CMS", label: "CMS", icon: Layout },
    { id: ViewState.SETTINGS, label: "Settings", icon: Settings },
  ];

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      apiService.logout();
      setIsAuthenticated(false);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewState.DASHBOARD:
        return <DashboardView onNavigate={setActiveView} />;
      case ViewState.PRODUCTS:
        return <ProductsView />;
      case "USERS":
        return <UsersView />;
      case "B2B":
        return <B2BView />;
      case ViewState.ORDERS:
        return <OrdersView />;
      case "FINANCE":
        return <FinanceView />;
      case "REPORTS":
        return <ReportsView />;
      case "DELIVERY":
        return <DeliveryView />;
      case "PORTER":
        return <PorterView />;
      case "REFUNDS":
        return <RefundsView />;
<<<<<<< HEAD
      case "EXCHANGES":
        return <ExchangesView />;
=======
>>>>>>> 1e65977e (connnect)
      case "CATEGORIES":
        return <CategoriesView />;
      case "PRICING":
        return <CampaignsView />;
      case "CMS":
        return <CMSView activeView={activeView} />;
      case ViewState.SETTINGS:
        return <SettingsView activeView={activeView} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-lg border border-dashed border-gray-300 m-4">
            <div className="p-4 rounded-full bg-gray-50 mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Work in Progress
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              This module is currently under development.
            </p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-[#f3f4f6]">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#222a2d] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
<<<<<<< HEAD
        overflow-hidden shadow-xl
=======
        overflow-y-auto no-scrollbar shadow-xl
>>>>>>> 1e65977e (connnect)
      `}
      >
        {/* Sidebar Header - Admin Box - Black */}
        <div className="h-24 flex items-center justify-between px-6 bg-black shrink-0">
          <div className="flex items-center">
<<<<<<< HEAD
            <img
              src={logo}
              alt="Logo"
              className="h-full w-full object-cover"
            />
=======
              <img
                src={logo}
                alt="Logo"
                className="h-full w-full object-cover"
              />
>>>>>>> 1e65977e (connnect)
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation - Dark Ace */}
<<<<<<< HEAD
        <nav className="flex-1 px-3 space-y-1 py-4 bg-[#000000] overflow-y-auto no-scrollbar">
=======
        <nav className="flex-1 px-3 space-y-1 py-4 bg-[#000000]">
>>>>>>> 1e65977e (connnect)
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsMobileMenuOpen(false);
              }}
<<<<<<< HEAD
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeView === item.id
                ? "bg-[#DC2626] text-white shadow-sm ring-1 ring-white/10" /* Active Red */
                : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
=======
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeView === item.id
                  ? "bg-[#DC2626] text-white shadow-sm ring-1 ring-white/10" /* Active Red */
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
>>>>>>> 1e65977e (connnect)
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Footer */}
<<<<<<< HEAD
        <div className="p-4 border-t border-white/10 mt-auto bg-[#222a2d] ">
=======
        <div className="p-4 border-t border-white/10 mt-auto bg-[#222a2d]">
>>>>>>> 1e65977e (connnect)
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
            <div
              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              onClick={() => setActiveView(ViewState.SETTINGS)}
            >
              <div className="h-9 w-9 rounded-full bg-[#DC2626] flex items-center justify-center text-white font-semibold border-2 border-white/20">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Super Admin
                </p>
                <p className="text-xs text-gray-400 truncate">
                  admin@ecommerce.com
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-500 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            {/* Branding Text Removed based on request to keep header clean */}
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
<<<<<<< HEAD
              {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
              {/* <input
=======
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
>>>>>>> 1e65977e (connnect)
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#DC2626] text-sm w-64 outline-none text-gray-900"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  alert(`Searching for: ${e.currentTarget.value}`)
                }
<<<<<<< HEAD
              /> */}
=======
              />
>>>>>>> 1e65977e (connnect)
            </div>

            <button
              onClick={() => alert("You have 3 new notifications")}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div
              onClick={() => handleLogout()}
              className="flex items-center gap-2 cursor-pointer pl-2 border-l border-gray-200 group"
              title="Logout"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#DC2626] to-red-600"></div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block group-hover:text-gray-900">
                Super Admin
              </span>
              <ChevronDown
                size={16}
                className="text-gray-400 hidden sm:block group-hover:text-gray-600"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;