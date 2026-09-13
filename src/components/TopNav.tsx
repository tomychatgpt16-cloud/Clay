import React from "react";
import {
  Menu,
  Search,
  Plus,
  ShoppingBag,
  Layers,
  Wrench,
  Bell,
  Sliders,
  Building2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  FileSpreadsheet
} from "lucide-react";
import { AuthUser, DashboardAlert } from "../types";

interface TopNavProps {
  onOpenMobileMenu: () => void;
  onOpenSaleModal: () => void;
  onOpenStockModal: () => void;
  onOpenExpenseModal: () => void;
  onOpenDailyClosing: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  currentUser: AuthUser | null;
  alerts: DashboardAlert[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currency?: string;
  companyName?: string;
  netProfitLoss?: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenMobileMenu,
  onOpenSaleModal,
  onOpenStockModal,
  onOpenExpenseModal,
  onOpenDailyClosing,
  onOpenSettings,
  onLogout,
  currentUser,
  alerts = [],
  searchQuery,
  setSearchQuery,
  currency = "ETB",
  companyName = "Clay’s Granite & Marble Manufacturing",
  netProfitLoss = 0
}) => {
  const [showAlertsPopover, setShowAlertsPopover] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Mobile menu toggle & Global Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stone variety, customer, supplier..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Center: Live Performance Badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-slate-800">
          Clay’s Granite & Marble
        </span>
        <span className="text-slate-300">|</span>
        <span
          className={`font-mono font-bold ${
            netProfitLoss >= 0 ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          Net: {netProfitLoss >= 0 ? "+" : ""}
          {new Intl.NumberFormat("en-US").format(netProfitLoss)} {currency}
        </span>
      </div>

      {/* Right: Quick Actions & Settings */}
      <div className="flex items-center gap-2">
        {/* Quick Action: Record Sale */}
        <button
          onClick={onOpenSaleModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Record Sale</span>
        </button>

        {/* Quick Action: New Stock */}
        <button
          onClick={onOpenStockModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-semibold cursor-pointer transition"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>New Stock</span>
        </button>

        {/* Quick Action: Record Expense */}
        <button
          onClick={onOpenExpenseModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-semibold cursor-pointer transition"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Expense</span>
        </button>

        {/* Quick Action: Daily Closing Excel */}
        <button
          onClick={onOpenDailyClosing}
          title="Download today's end-of-day Excel statement or view daily closing"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/90 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden md:inline">Daily Closing</span>
          <span className="md:hidden">Closing</span>
        </button>

        {/* Alerts Notification Button */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsPopover(!showAlertsPopover)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {showAlertsPopover && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  Operational Alerts
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                  {alerts.length} Active
                </span>
              </div>
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  All stone batches and financial ledgers in good standing.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alerts.map((a, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs ${
                        a.severity === "danger"
                          ? "bg-rose-50 border-rose-200 text-rose-800"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}
                    >
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-[11px] mt-0.5 opacity-90">{a.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Company Settings & Database Reset"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
