import React from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  ShoppingBag,
  Wrench,
  TrendingUp,
  Wallet,
  CreditCard,
  Sliders,
  History,
  LogOut,
  Building2,
  ShieldCheck,
  X,
  PieChart,
  FileSpreadsheet
} from "lucide-react";
import { AuthUser } from "../types";

export type ActiveView =
  | "dashboard"
  | "shareholders"
  | "stock"
  | "sales"
  | "expenses"
  | "profit_loss"
  | "accounts"
  | "credits"
  | "cash_flow"
  | "all_transactions"
  | "settings"
  | "audit_log";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  companyName?: string;
  onOpenDailyClosing?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onLogout,
  isOpenMobile,
  setIsOpenMobile,
  companyName = "Clay’s Granite & Marble",
  onOpenDailyClosing
}) => {
  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    setIsOpenMobile(false);
  };

  const isActive = (view: ActiveView) => activeView === view;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs font-bold text-white tracking-wide uppercase truncate">
                {companyName}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Stock & Financials
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpenMobile(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
          {/* Main Dashboard */}
          <div>
            <button
              id="nav-dashboard"
              onClick={() => handleNav("dashboard")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                isActive("dashboard")
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Executive Dashboard</span>
            </button>
          </div>

          {/* CORE COMPANY MODULES */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Operations & Inventory
            </div>

            {/* Shareholders & Capital */}
            <button
              id="nav-shareholders"
              onClick={() => handleNav("shareholders")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("shareholders")
                  ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Shareholders & Capital</span>
            </button>

            {/* Stone Stock & Inventory */}
            <button
              id="nav-stock"
              onClick={() => handleNav("stock")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("stock")
                  ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Stone Stock & Inventory</span>
            </button>

            {/* Sales & Invoicing */}
            <button
              id="nav-sales"
              onClick={() => handleNav("sales")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("sales")
                  ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Sales & Invoicing</span>
            </button>

            {/* Company Expenses & Suppliers */}
            <button
              id="nav-expenses"
              onClick={() => handleNav("expenses")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("expenses")
                  ? "bg-rose-600 text-white font-semibold shadow-md shadow-rose-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Wrench className="w-4 h-4 text-rose-400" />
              <span>Expenses & Suppliers</span>
            </button>
          </div>

          {/* FINANCIAL ANALYSIS & LEDGERS */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Financial Analysis
            </div>

            {/* Profit & Loss Statement */}
            <button
              id="nav-profit-loss"
              onClick={() => handleNav("profit_loss")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("profit_loss")
                  ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Profit & Loss Statement</span>
            </button>

            {/* Bank & Cash Accounts */}
            <button
              id="nav-accounts"
              onClick={() => handleNav("accounts")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("accounts")
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Wallet className="w-4 h-4 text-blue-400" />
              <span>Company Bank & Cash</span>
            </button>

            {/* Customer Credits & Receivables */}
            <button
              id="nav-credits"
              onClick={() => handleNav("credits")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("credits")
                  ? "bg-amber-600 text-white font-semibold shadow-md shadow-amber-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Customer Receivables</span>
            </button>

            {/* Cash Flow Analytics */}
            <button
              id="nav-cash-flow"
              onClick={() => handleNav("cash_flow")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("cash_flow")
                  ? "bg-teal-600 text-white font-semibold shadow-md shadow-teal-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <PieChart className="w-4 h-4 text-teal-400" />
              <span>Cash Flow Analytics</span>
            </button>

            {/* Daily Closing Report */}
            {onOpenDailyClosing && (
              <button
                id="nav-daily-closing"
                onClick={() => {
                  onOpenDailyClosing();
                  setIsOpenMobile(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-teal-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-teal-400" />
                  <span>Daily Closing Excel</span>
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono font-medium">
                  24h
                </span>
              </button>
            )}
          </div>

          {/* SYSTEM SETTINGS & AUDIT */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Administration
            </div>

            <button
              id="nav-settings"
              onClick={() => handleNav("settings")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("settings")
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4 text-slate-400" />
              <span>Company Settings</span>
            </button>

            <button
              id="nav-audit"
              onClick={() => handleNav("audit_log")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                isActive("audit_log")
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Audit Trail</span>
            </button>
          </div>
        </div>

        {/* User Footer with Logout */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
                {currentUser?.full_name ? currentUser.full_name.charAt(0) : "A"}
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-white truncate text-xs">
                  {currentUser?.full_name || "Admin"}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Director / Admin
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
