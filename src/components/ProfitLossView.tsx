import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  PieChart,
  Calendar,
  Layers,
  ShoppingBag,
  Wrench,
  Users,
  Printer,
  Download,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { CompanyFinanceSummary } from "../types";

interface ProfitLossViewProps {
  summary: CompanyFinanceSummary;
  currency: string;
}

export const ProfitLossView: React.FC<ProfitLossViewProps> = ({ summary, currency }) => {
  const [timeframe, setTimeframe] = useState<"all" | "year" | "month">("all");

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
  const netProfitBg = isProfit ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200";
  const expensesByCategory = summary?.expensesByCategory || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <PieChart className="w-4 h-4" />
            Financial Statement & Performance
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Company Profit & Loss (Income Statement)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Automated financial breakdown: Total Sales Revenue – Cost of Goods Sold (COGS)
            – Operating Expenses = Net Profit/Loss.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3.5 py-2 rounded-xl text-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print P&L Statement
          </button>
        </div>
      </div>

      {/* Net Profit/Loss Highlight Banner */}
      <div className={`p-6 rounded-2xl border ${netProfitBg} shadow-xs`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isProfit ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Current Financial Performance
              </span>
            </div>
            <div className={`text-3xl font-extrabold ${netProfitColor} font-display`}>
              {formatMoney(summary.netProfitLoss)}
            </div>
            <p className="text-xs text-slate-600 max-w-xl">
              {isProfit
                ? `The company is currently operating profitably with a net profit margin of ${summary.netMarginPct}%. Total sales revenue exceeds all stone manufacturing costs and operational overheads.`
                : `The company currently shows a net operating loss of ${formatMoney(
                    Math.abs(summary.netProfitLoss)
                  )}. Review overheads and stone sales turnover to achieve profitability.`}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium">Gross Margin</div>
              <div className="text-lg font-bold text-slate-900">
                {summary.grossMarginPct}%
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium">Net Margin</div>
              <div className={`text-lg font-bold ${netProfitColor}`}>
                {summary.netMarginPct}%
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium">Equity Return</div>
              <div className="text-lg font-bold text-slate-900">
                {summary.totalShareholderCapital > 0
                  ? `${(
                      (summary.netProfitLoss / summary.totalShareholderCapital) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Income Statement Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Clay’s Granite & Marble Manufacturing — Income Statement
            </h2>
            <p className="text-xs text-slate-500">
              Reporting Currency: {currency} | Prepared automatically from verified transactions
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            All-Time To Date
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-sm">
          {/* Section 1: Revenue */}
          <div className="p-6 space-y-3 bg-slate-50/40">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>1. Total Sales Revenue (Gross Invoicing)</span>
              </div>
              <span className="text-base text-emerald-700">
                {formatMoney(summary.totalRevenue)}
              </span>
            </div>
            <div className="pl-6 space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Revenue from Granite & Marble Sales</span>
                <span className="font-medium text-slate-700">
                  {formatMoney(summary.totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Quantity Dispatched</span>
                <span className="font-medium text-slate-700">
                  {summary.totalSoldTons.toLocaleString()} Tons |{" "}
                  {summary.totalSoldSqm.toLocaleString()} m²
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Cost of Goods Sold */}
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>2. Cost of Goods Sold (COGS)</span>
              </div>
              <span className="text-base text-slate-800">
                - {formatMoney(summary.totalCogs)}
              </span>
            </div>
            <div className="pl-6 space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Raw Block Purchase Cost (allocated to sold units)</span>
                <span className="font-medium text-slate-700">Included in COGS</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Quarry Freight & Transportation</span>
                <span className="font-medium text-slate-700">Included in COGS</span>
              </div>
              <div className="flex justify-between">
                <span>Gangsaw Slicing & Edge Cutting Costs</span>
                <span className="font-medium text-slate-700">Included in COGS</span>
              </div>
            </div>
          </div>

          {/* Gross Profit Row */}
          <div className="p-6 bg-slate-50 flex items-center justify-between font-bold text-slate-900">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>GROSS PROFIT (Revenue minus COGS)</span>
            </div>
            <div className="text-right">
              <div className="text-lg text-emerald-700 font-bold">
                {formatMoney(summary.grossProfit)}
              </div>
              <div className="text-xs text-slate-500 font-normal">
                Gross Margin: {summary.grossMarginPct}%
              </div>
            </div>
          </div>

          {/* Section 3: Operating Expenses */}
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-rose-600" />
                <span>3. Operating Overheads & Factory Expenses</span>
              </div>
              <span className="text-base text-rose-700">
                - {formatMoney(summary.totalOperatingExpenses)}
              </span>
            </div>

            <div className="pl-6 space-y-2 text-xs">
              {expensesByCategory.length === 0 ? (
                <div className="text-slate-400 italic">No operating expenses recorded yet.</div>
              ) : (
                expensesByCategory.map((cat) => (
                  <div key={cat.category} className="flex justify-between text-slate-600">
                    <span>{cat.category}</span>
                    <span className="font-medium text-slate-800">
                      {formatMoney(cat.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* NET PROFIT / LOSS FINAL LINE */}
          <div className={`p-6 ${netProfitBg} flex items-center justify-between font-bold`}>
            <div>
              <div className="text-lg font-bold text-slate-900 font-display">
                NET OPERATING PROFIT / (LOSS)
              </div>
              <div className="text-xs text-slate-600 font-normal mt-0.5">
                Gross Profit minus Total Operating Expenses
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-extrabold ${netProfitColor}`}>
                {formatMoney(summary.netProfitLoss)}
              </div>
              <div className="text-xs text-slate-600 font-normal">
                Net Margin: {summary.netMarginPct}%
              </div>
            </div>
          </div>

          {/* Section 4: Isolated Waste / Defect Write-off Note */}
          <div className="p-6 bg-slate-50/70 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Scrap & Defective Stone Audit (Excluded from Stock Asset Valuation)
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Total Production Waste Write-Off Loss (Cracked in cutting, transit fractures, edge scrap)
              </span>
              <span className="font-bold text-rose-700">
                {formatMoney(summary.totalWasteValuation)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * Note: These materials have been written off and are strictly excluded from current sellable inventory asset valuation.
            </p>
          </div>
        </div>
      </div>

      {/* Balance Sheet Asset Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            Current Sellable Stone Inventory
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatMoney(summary.totalStockValuation)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Valued at direct cost (Pure sellable stock)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            Liquid Cash & Bank Reserves
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatMoney(summary.totalLiquidCashBank)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Total company operational accounts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            Shareholder Capital Invested
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatMoney(summary.totalShareholderCapital)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {summary.shareholdersCount} registered equity contributors
          </div>
        </div>
      </div>
    </div>
  );
};
