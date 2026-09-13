import React, { useState, useEffect } from "react";
import {
  X,
  FileSpreadsheet,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { api } from "../api";

interface DailyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
  initialDate?: string;
}

export const DailyClosingModal: React.FC<DailyClosingModalProps> = ({
  isOpen,
  onClose,
  currency = "ETB",
  initialDate
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoPromptEnabled, setAutoPromptEnabled] = useState<boolean>(() => {
    return localStorage.getItem("auto_prompt_daily_excel") !== "false";
  });

  const loadDailySummary = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDailyClosingSummary(date);
      if (res.success) {
        setSummaryData(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load daily closing summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDailySummary(selectedDate);
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      await api.downloadDailyClosingExcel(selectedDate);
    } catch (err: any) {
      setError(err.message || "Failed to download daily closing Excel");
    } finally {
      setDownloading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const setPresetDate = (type: "today" | "yesterday") => {
    if (type === "today") {
      setSelectedDate(todayStr);
    } else {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      setSelectedDate(d.toISOString().split("T")[0]);
    }
  };

  const toggleAutoPrompt = (checked: boolean) => {
    setAutoPromptEnabled(checked);
    localStorage.setItem("auto_prompt_daily_excel", checked ? "true" : "false");
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const s = summaryData?.summary;
  const isToday = selectedDate === todayStr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  End-of-Day Daily Closing Statement
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-mono font-semibold uppercase">
                  Excel .xlsx
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Clay’s Granite & Marble Manufacturing — 24-Hour Cycle Ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Container */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Date Selector & 24h Cycle Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-semibold text-slate-700">Closing Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={todayStr}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPresetDate("today")}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                  selectedDate === todayStr
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setPresetDate("yesterday")}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                  selectedDate !== todayStr
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Previous Day
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {isToday
                  ? "Active 24-Hour Cycle • Ready to generate end-of-day Excel file"
                  : `Historical Closing Statement for ${selectedDate}`}
              </span>
            </div>
            {summaryData && (
              <span className="font-mono text-slate-600 font-medium">
                {s?.transactionsCount || 0} Cash Movements • {s?.salesCount || 0} Sales • {s?.expensesCount || 0} Expenses
              </span>
            )}
          </div>

          {/* KPI Snapshot Cards */}
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Computing daily statement metrics...</span>
            </div>
          ) : summaryData ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Gross Sales */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold tracking-wider text-emerald-800 uppercase block">
                  Today's Sales
                </span>
                <p className="text-sm font-bold text-emerald-950 font-mono">
                  {formatMoney(s?.totalSalesRevenue)} {currency}
                </p>
                <span className="text-[10px] text-emerald-700 block">
                  {s?.salesCount} invoice{s?.salesCount === 1 ? "" : "s"}
                </span>
              </div>

              {/* Operating Expenses */}
              <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold tracking-wider text-rose-800 uppercase block">
                  Today's Expenses
                </span>
                <p className="text-sm font-bold text-rose-950 font-mono">
                  {formatMoney(s?.totalExpenses)} {currency}
                </p>
                <span className="text-[10px] text-rose-700 block">
                  {s?.expensesCount} expense{s?.expensesCount === 1 ? "" : "s"}
                </span>
              </div>

              {/* Net Daily Flow */}
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  (s?.netDailyOperatingProfit || 0) >= 0
                    ? "bg-teal-50/70 border-teal-200 text-teal-950"
                    : "bg-amber-50/70 border-amber-200 text-amber-950"
                }`}
              >
                <span className="text-[10px] font-semibold tracking-wider uppercase block opacity-80">
                  Daily Margin
                </span>
                <p className="text-sm font-bold font-mono">
                  {(s?.netDailyOperatingProfit || 0) >= 0 ? "+" : ""}
                  {formatMoney(s?.netDailyOperatingProfit)} {currency}
                </p>
                <span className="text-[10px] opacity-75 block">
                  Gross Profit - Overheads
                </span>
              </div>

              {/* Closing Liquid Cash */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold tracking-wider text-slate-600 uppercase block">
                  Closing Cash & Bank
                </span>
                <p className="text-sm font-bold text-slate-900 font-mono">
                  {formatMoney(s?.totalLiquidCash)} {currency}
                </p>
                <span className="text-[10px] text-slate-500 block">
                  All 4 accounts
                </span>
              </div>
            </div>
          ) : null}

          {/* Multi-Sheet Contents Breakdown */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>What's included in this Daily Closing Excel workbook:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong>Sheet 1 (Executive Summary):</strong> Total sales turnover, COGS, operating overheads, daily cash flow, and factory valuation.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong>Sheet 2 (Account Balances):</strong> Ending closing balances of CBE, Awash Bank, Cash Drawer, and Telebirr.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong>Sheet 3 (Sales Invoices):</strong> All customer stone sales for today with rates, quantities, and payment status.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong>Sheet 4 (Expenses):</strong> All factory expenses, supplier details, payment methods, and account debited.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong>Sheet 5 (Cash Ledger):</strong> Itemized chronological inflows and outflows for the day.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong>Sheet 6 & 7 (Stock & Inventory):</strong> New stone batches received, waste logs, and total factory stone valuation snapshot.</span>
              </div>
            </div>
          </div>

          {/* Auto-Prompt Preference */}
          <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={autoPromptEnabled}
                onChange={(e) => toggleAutoPrompt(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Prompt me to download today's closing Excel after saving every entry</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading || loading}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Excel File...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Daily Closing Excel ({selectedDate})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
