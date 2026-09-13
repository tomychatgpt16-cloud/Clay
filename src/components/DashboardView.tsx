import React from "react";
import {
  ShoppingBag,
  Layers,
  Wrench,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Package,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  Phone,
  Landmark,
  Scissors,
  FileSpreadsheet,
  Download,
  Clock
} from "lucide-react";
import {
  CompanyFinanceSummary,
  Sale,
  StockItem,
  CompanyExpense,
  Shareholder,
  Account
} from "../types";
import { api } from "../api";

interface DashboardViewProps {
  summary: CompanyFinanceSummary | null;
  currency?: string;
  onNavigate: (view: string) => void;
  onOpenSaleModal: () => void;
  onOpenStockModal: () => void;
  onOpenExpenseModal: () => void;
  onOpenShareholderModal: () => void;
  onOpenWasteModal: () => void;
  onOpenDailyClosingModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  currency = "ETB",
  onNavigate,
  onOpenSaleModal,
  onOpenStockModal,
  onOpenExpenseModal,
  onOpenShareholderModal,
  onOpenWasteModal,
  onOpenDailyClosingModal
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const [quickDownloading, setQuickDownloading] = React.useState(false);

  const handleQuickDownloadToday = async () => {
    setQuickDownloading(true);
    try {
      await api.downloadDailyClosingExcel(todayStr);
    } catch (e) {
      console.error(e);
    } finally {
      setQuickDownloading(false);
    }
  };

  if (!summary) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">
            Loading company financial & stock ledgers...
          </p>
        </div>
      </div>
    );
  }

  const formatMoney = (val: number) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(val) + ` ${currency}`
    );
  };

  const isProfit = summary.isProfit;
  const netProfitColor = isProfit ? "text-emerald-700" : "text-rose-700";
  const netProfitBg = isProfit
    ? "bg-emerald-50/80 border-emerald-200"
    : "bg-rose-50/80 border-rose-200";

  const totalAllExpenses = (summary.totalCogs || 0) + (summary.totalOperatingExpenses || 0);

  const stoneBreakdown = summary?.stoneBreakdown || [];
  const recentSales = summary?.recentSales || [];
  const recentExpenses = summary?.recentExpenses || [];
  const accounts = summary?.accounts || [];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            Clay’s Granite & Marble Manufacturing
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Company Financial & Stock Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time executive oversight: shareholder equity, raw stone intake, sales turnover,
            operating overheads, and automated profit/loss calculation.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-quick-sale"
            onClick={onOpenSaleModal}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Record Sale
          </button>
          <button
            id="btn-quick-stock"
            onClick={onOpenStockModal}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            New Stock Intake
          </button>
          <button
            id="btn-quick-expense"
            onClick={onOpenExpenseModal}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors"
          >
            <Wrench className="w-3.5 h-3.5" />
            Record Expense
          </button>
          <button
            id="btn-quick-shareholder"
            onClick={onOpenShareholderModal}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Capital
          </button>
          {onOpenDailyClosingModal && (
            <button
              id="btn-quick-daily-closing"
              onClick={onOpenDailyClosingModal}
              className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-medium px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Daily Closing Excel
            </button>
          )}
        </div>
      </div>

      {/* CORE FINANCIAL RESULT: Automated Net Profit / Loss Box */}
      <div className={`p-6 rounded-2xl border ${netProfitBg} shadow-xs transition-all`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isProfit ? (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Company Bottom Line (Automated Calculation)
              </span>
            </div>
            <div className={`text-3xl sm:text-4xl font-extrabold ${netProfitColor} font-display`}>
              {formatMoney(summary.netProfitLoss)}
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">
              <span>Formula: Sales Revenue ({formatMoney(summary.totalRevenue)})</span>
              <span>–</span>
              <span>COGS ({formatMoney(summary.totalCogs)})</span>
              <span>–</span>
              <span>Operating Expenses ({formatMoney(summary.totalOperatingExpenses)})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/70">
              <div className="text-[11px] text-slate-500 font-medium">Gross Margin</div>
              <div className="text-lg font-bold text-slate-900">
                {summary.grossMarginPct}%
              </div>
              <div className="text-[10px] text-slate-400">On Stone Sales</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/70">
              <div className="text-[11px] text-slate-500 font-medium">Net Profit Margin</div>
              <div className={`text-lg font-bold ${netProfitColor}`}>
                {summary.netMarginPct}%
              </div>
              <div className="text-[10px] text-slate-400">After all costs</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/70">
              <div className="text-[11px] text-slate-500 font-medium">Equity Return</div>
              <div className="text-lg font-bold text-slate-900">
                {summary.totalShareholderCapital > 0
                  ? `${(
                      (summary.netProfitLoss / summary.totalShareholderCapital) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </div>
              <div className="text-[10px] text-slate-400">On Capital</div>
            </div>
          </div>
        </div>
      </div>

      {/* 24-HOUR / DAILY CLOSING EXCEL STATEMENT CALLOUT */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-teal-500/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white">
                Daily Closing & 24-Hour Cycle Statement
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[10px] font-mono font-semibold uppercase">
                {todayStr}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Generates a comprehensive multi-sheet Excel archive (.xlsx) covering today's Sales, Factory Expenses, Cash Movements, and Ending Bank Balances.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleQuickDownloadToday}
            disabled={quickDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {quickDownloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Today's Excel</span>
              </>
            )}
          </button>

          {onOpenDailyClosingModal && (
            <button
              onClick={onOpenDailyClosingModal}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Summary & Dates
            </button>
          )}
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div
          onClick={() => onNavigate("sales")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(summary.totalRevenue)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>{summary.recentSales.length} Recent Invoices</span>
            <span className="text-emerald-700 font-medium group-hover:underline">
              View Sales →
            </span>
          </div>
        </div>

        {/* Total Expenses (COGS + Overheads) */}
        <div
          onClick={() => onNavigate("expenses")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(totalAllExpenses)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>
              COGS: {formatMoney(summary.totalCogs)}
            </span>
            <span className="text-rose-700 font-medium group-hover:underline">
              View Expenses →
            </span>
          </div>
        </div>

        {/* Sellable Stock Valuation */}
        <div
          onClick={() => onNavigate("stock")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Sellable Stone Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(summary.totalStockValuation)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>
              {summary.totalAvailableTons.toLocaleString()} T |{" "}
              {summary.totalAvailableSqm.toLocaleString()} m²
            </span>
            <span className="text-indigo-700 font-medium group-hover:underline">
              Manage Stock →
            </span>
          </div>
        </div>

        {/* Production Waste / Scrap Loss */}
        <div
          onClick={() => onNavigate("stock")}
          className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs bg-amber-50/20 hover:border-amber-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Waste & Scrap Loss</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">
            {formatMoney(summary.totalWasteValuation)}
          </div>
          <div className="text-xs text-amber-700/90 mt-1 font-medium flex items-center justify-between">
            <span>Excluded from Active Stock</span>
            <span className="underline">View Waste →</span>
          </div>
        </div>
      </div>

      {/* Second Row: Capital & Liquid Cash + Stone Variety Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stone Varieties Available */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Stone Varieties Inventory Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Quantities currently ready in factory bays (waste excluded).
              </p>
            </div>
            <button
              onClick={() => onNavigate("stock")}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Full Stock Ledger →
            </button>
          </div>

          {stoneBreakdown.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No stone inventory items recorded yet. Use "New Stock Intake" to add marble or granite.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stoneBreakdown.map((st) => (
                <div
                  key={`${st.stone_type}-${st.unit}`}
                  className="p-3.5 bg-slate-50/75 rounded-xl border border-slate-100 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 text-sm">
                      {st.stone_type}
                    </div>
                    <div className="text-xs text-slate-500">
                      Sold: {st.sold} {st.unit} | Waste: {st.waste} {st.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-slate-900">
                      {st.available.toLocaleString()} {st.unit}
                    </div>
                    <div className="text-xs font-medium text-indigo-600">
                      {formatMoney(st.value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shareholder Equity & Bank Liquidity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">
                Capital & Bank Reserves
              </h2>
              <button
                onClick={() => onNavigate("shareholders")}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Shareholders →
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Contributed equity & cash reserves.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-xs text-slate-500 font-semibold uppercase">
              Total Shareholder Capital
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {formatMoney(summary.totalShareholderCapital)}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {summary.shareholdersCount} Registered Equity Partners
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
            <div className="text-xs text-emerald-800 font-semibold uppercase">
              Liquid Cash & Bank Balances
            </div>
            <div className="text-2xl font-bold text-emerald-900">
              {formatMoney(summary.totalLiquidCashBank)}
            </div>
            <div className="text-xs text-emerald-700 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" />
              {accounts.length} Active Company Bank & Cash Accounts
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity: Sales vs Expenses Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Recent Stone Sales
              </h2>
            </div>
            <button
              onClick={() => onNavigate("sales")}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View All ({recentSales.length}) →
            </button>
          </div>

          {recentSales.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No sales logged yet. Use "Record Sale" to add customer orders.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentSales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 text-sm">
                      {sale.customer_name}
                    </div>
                    <div className="text-slate-400 flex items-center gap-2">
                      <span>{sale.stone_type}</span>
                      <span>•</span>
                      <span>
                        {sale.quantity_sold} {sale.unit}
                      </span>
                      {sale.customer_phone && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {sale.customer_phone}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-700 text-sm">
                      {formatMoney(sale.total_revenue)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {sale.sale_date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Operating Expenses */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-rose-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Recent Operating Expenses
              </h2>
            </div>
            <button
              onClick={() => onNavigate("expenses")}
              className="text-xs font-medium text-rose-600 hover:text-rose-700"
            >
              View All ({recentExpenses.length}) →
            </button>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No expenses recorded yet. Use "Record Expense" to add tool, utility, or maintenance costs.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentExpenses.slice(0, 5).map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 text-sm">
                      {exp.description}
                    </div>
                    <div className="text-slate-400 flex items-center gap-2">
                      <span className="font-medium text-slate-600">
                        {exp.supplier_name}
                      </span>
                      {exp.supplier_phone && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {exp.supplier_phone}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{exp.category}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-rose-700 text-sm">
                      {formatMoney(exp.amount)}
                    </div>
                    <div className="text-[11px] text-slate-400">{exp.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
