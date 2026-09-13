import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Layers,
  Calendar,
  DollarSign
} from "lucide-react";
import { CashFlowData, EnvironmentType } from "../types";
import { api } from "../api";

interface CashFlowViewProps {
  currency?: string;
  initialEnvironment?: EnvironmentType | "both";
}

export const CashFlowView: React.FC<CashFlowViewProps> = ({
  currency = "ETB",
  initialEnvironment = "both"
}) => {
  const [environment, setEnvironment] = useState<EnvironmentType | "both">(initialEnvironment);
  const [data, setData] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getCashFlow(environment);
      setData(res);
    } catch (err) {
      console.error("Failed to load cash flow:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [environment]);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Computing cash flow analytics...</p>
        </div>
      </div>
    );
  }

  // Extract safe fallback arrays and metrics
  const safeMonthly = data?.monthly || [];
  const safeTotals = data?.totals || {
    inflows: data?.summary?.totalMoneyIn || 0,
    outflows: data?.summary?.totalMoneyOut || 0,
    net: data?.summary?.netCashFlow || 0
  };
  const safeCategories = data?.categories || {
    inflows: [],
    outflows: data?.categoriesBreakdown || []
  };
  const safeInflows = safeCategories.inflows || [];
  const safeOutflows = safeCategories.outflows || [];

  // Calculate highest monthly value to scale chart bars nicely
  const maxMonthlyVal = Math.max(
    ...safeMonthly.map((m) => Math.max(m.inflow || 0, m.outflow || 0)),
    1000
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Cash Flow Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Operating liquidity trends, inflows vs outflows, and monthly capital pacing
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setEnvironment("both")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              environment === "both" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Combined
          </button>
          <button
            onClick={() => setEnvironment("company")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              environment === "company" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Company
          </button>
          <button
            onClick={() => setEnvironment("personal")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              environment === "personal" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Personal
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
            Total Operational Inflows
          </span>
          <span className="text-xl font-bold text-emerald-800 mt-1 block">
            +{safeTotals.inflows.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Sales, fees, and operational income
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-rose-700 uppercase tracking-wider block">
            Total Operational Outflows
          </span>
          <span className="text-xl font-bold text-rose-800 mt-1 block">
            -{safeTotals.outflows.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Expenses, raw materials, and costs
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Net Cash Flow Position
          </span>
          <span
            className={`text-xl font-bold mt-1 block ${
              safeTotals.net >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {safeTotals.net >= 0 ? "+" : ""}
            {safeTotals.net.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Operating surplus or deficit
          </span>
        </div>
      </div>

      {/* Monthly Comparative Visual Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Monthly Cash Inflow vs Outflow</h3>
            <p className="text-xs text-slate-400">Chronological 6-month financial performance</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-600">Inflow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span className="text-slate-600">Outflow</span>
            </div>
          </div>
        </div>

        {safeMonthly.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No monthly cash flow activity recorded yet.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {safeMonthly.map((m) => {
              const inWidth = Math.max(2, Math.round(((m.inflow || 0) / maxMonthlyVal) * 100));
              const outWidth = Math.max(2, Math.round(((m.outflow || 0) / maxMonthlyVal) * 100));

              return (
                <div key={m.month} className="p-3 bg-slate-50/70 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800 font-mono">{m.month}</span>
                    <span className={`font-mono ${(m.net || 0) >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      Net: {(m.net || 0) >= 0 ? "+" : ""}
                      {(m.net || 0).toLocaleString()} {currency}
                    </span>
                  </div>

                  {/* Inflow bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Inflow</span>
                      <span className="font-mono text-emerald-700 font-medium">
                        +{(m.inflow || 0).toLocaleString()} {currency}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${inWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Outflow bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Outflow</span>
                      <span className="font-mono text-rose-700 font-medium">
                        -{(m.outflow || 0).toLocaleString()} {currency}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${outWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Inflow Categories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 mb-3 border-b border-slate-100 flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>Inflows by Category</span>
          </h3>
          <div className="space-y-3 text-xs">
            {safeInflows.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">No inflow transactions recorded.</p>
            ) : (
              safeInflows.map((c) => (
                <div key={c.category} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-700 font-medium">{c.category}</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    +{(c.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Outflow Categories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 mb-3 border-b border-slate-100 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
            <span>Outflows by Category</span>
          </h3>
          <div className="space-y-3 text-xs">
            {safeOutflows.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">No outflow transactions recorded.</p>
            ) : (
              safeOutflows.map((c) => (
                <div key={c.category} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-700 font-medium">{c.category}</span>
                  <span className="font-mono font-semibold text-rose-700">
                    -{(c.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
