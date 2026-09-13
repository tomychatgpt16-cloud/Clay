import React, { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Layers,
  Building2,
  User,
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Transaction, Account, Credit, EnvironmentType } from "../types";
import { getExportTransactionsUrl } from "../api";

interface ReportsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  credits: Credit[];
  currency?: string;
  initialReport?: "company_pnl" | "personal_statement" | "aging" | "combined";
  companyName?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions = [],
  accounts = [],
  credits = [],
  currency = "ETB",
  initialReport = "company_pnl",
  companyName = "Clay’s Granite & Marble"
}) => {
  const safeTransactions = transactions || [];
  const safeAccounts = accounts || [];
  const safeCredits = credits || [];

  const [selectedReport, setSelectedReport] = useState<"company_pnl" | "personal_statement" | "aging" | "combined">(initialReport);
  const [dateFilter, setDateFilter] = useState<"this_month" | "this_year" | "all">("all");

  const today = new Date();
  const currentMonthStr = today.toISOString().substring(0, 7);
  const currentYearStr = today.getFullYear().toString();

  // Filter transactions by period
  const filteredTxs = useMemo(() => {
    return safeTransactions.filter((t) => {
      if (dateFilter === "this_month") {
        return t.date.startsWith(currentMonthStr);
      }
      if (dateFilter === "this_year") {
        return t.date.startsWith(currentYearStr);
      }
      return true;
    });
  }, [safeTransactions, dateFilter, currentMonthStr, currentYearStr]);

  // Company Profit & Loss calculations
  const companyPNL = useMemo(() => {
    const compTxs = filteredTxs.filter((t) => t.environment === "company");
    const revenueByCategory: { [cat: string]: number } = {};
    const expenseByCategory: { [cat: string]: number } = {};
    let totalRevenue = 0;
    let totalExpense = 0;

    compTxs.forEach((t) => {
      if (t.type === "income") {
        const cat = t.category || "General Sales";
        revenueByCategory[cat] = (revenueByCategory[cat] || 0) + t.amount;
        totalRevenue += t.amount;
      } else if (t.type === "expense") {
        const cat = t.category || "Operating Expenses";
        expenseByCategory[cat] = (expenseByCategory[cat] || 0) + t.amount;
        totalExpense += t.amount;
      }
    });

    const netOperatingProfit = totalRevenue - totalExpense;

    return {
      revenueByCategory,
      expenseByCategory,
      totalRevenue,
      totalExpense,
      netOperatingProfit
    };
  }, [filteredTxs]);

  // Personal Statement calculations
  const personalStatement = useMemo(() => {
    const persTxs = filteredTxs.filter((t) => t.environment === "personal");
    const incomeByCategory: { [cat: string]: number } = {};
    const expenseByCategory: { [cat: string]: number } = {};
    let totalIncome = 0;
    let totalExpense = 0;

    persTxs.forEach((t) => {
      if (t.type === "income") {
        const cat = t.category || "Personal Income";
        incomeByCategory[cat] = (incomeByCategory[cat] || 0) + t.amount;
        totalIncome += t.amount;
      } else if (t.type === "expense") {
        const cat = t.category || "Personal Expense";
        expenseByCategory[cat] = (expenseByCategory[cat] || 0) + t.amount;
        totalExpense += t.amount;
      }
    });

    return {
      incomeByCategory,
      expenseByCategory,
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense
    };
  }, [filteredTxs]);

  // Aging Receivables & Payables
  const agingReport = useMemo(() => {
    const todayMs = new Date().getTime();
    const customerReceivables: Credit[] = [];
    const supplierPayables: Credit[] = [];

    safeCredits.forEach((c) => {
      if (c.remaining_balance > 0) {
        if (c.direction === "owed_to_me") {
          customerReceivables.push(c);
        } else {
          supplierPayables.push(c);
        }
      }
    });

    return { customerReceivables, supplierPayables };
  }, [safeCredits]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const env = selectedReport === "company_pnl" ? "company" : selectedReport === "personal_statement" ? "personal" : "all";
    window.location.href = getExportTransactionsUrl(env);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial Statements & Reports
          </h1>
          <p className="text-xs text-slate-500">
            Exportable, print-ready accounting reports and audit summaries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs & Period Controls (hidden in print) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => setSelectedReport("company_pnl")}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              selectedReport === "company_pnl"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Company Profit & Loss
          </button>
          <button
            onClick={() => setSelectedReport("personal_statement")}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              selectedReport === "personal_statement"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Personal Statement & Savings
          </button>
          <button
            onClick={() => setSelectedReport("aging")}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              selectedReport === "aging"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Receivables & Payables Aging
          </button>
          <button
            onClick={() => setSelectedReport("combined")}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              selectedReport === "combined"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            Combined Executive Ledger
          </button>
        </div>

        {/* Date period selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Period:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
          >
            <option value="this_month">This Month</option>
            <option value="this_year">This Fiscal Year</option>
            <option value="all">All-Time Cumulative</option>
          </select>
        </div>
      </div>

      {/* REPORT CONTENT (Formatted for both screen & print) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs print:border-none print:shadow-none print:p-0">
        {/* Printable Document Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
              {selectedReport === "company_pnl"
                ? `${companyName} — Profit & Loss Statement`
                : selectedReport === "personal_statement"
                ? "Personal Financial Income & Savings Statement"
                : selectedReport === "aging"
                ? "Receivables & Payables Credit Aging Report"
                : "Combined Personal & Company Financial Position"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Period: {dateFilter.replace("_", " ").toUpperCase()} • Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-800 block">PRIVATE & CONFIDENTIAL</span>
            <span className="text-[11px] text-slate-400 font-mono">Currency: {currency}</span>
          </div>
        </div>

        {/* REPORT 1: COMPANY PROFIT & LOSS */}
        {selectedReport === "company_pnl" && (
          <div className="space-y-6 text-xs">
            {/* Revenue Section */}
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Operating Revenue / Sales
              </h3>
              <div className="divide-y divide-slate-100">
                {Object.keys(companyPNL.revenueByCategory).length === 0 ? (
                  <p className="py-2 text-slate-400 italic">No revenue recorded in this period.</p>
                ) : (
                  Object.entries(companyPNL.revenueByCategory).map(([cat, amount]) => (
                    <div key={cat} className="py-2 flex justify-between">
                      <span className="text-slate-700">{cat}</span>
                      <span className="font-mono font-medium text-slate-900">
                        {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-800 text-sm">
                <span>Total Operating Revenue</span>
                <span className="font-mono">
                  +{companyPNL.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
            </div>

            {/* Expenses Section */}
            <div className="pt-4">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Cost of Goods & Operating Expenses
              </h3>
              <div className="divide-y divide-slate-100">
                {Object.keys(companyPNL.expenseByCategory).length === 0 ? (
                  <p className="py-2 text-slate-400 italic">No expenses recorded in this period.</p>
                ) : (
                  Object.entries(companyPNL.expenseByCategory).map(([cat, amount]) => (
                    <div key={cat} className="py-2 flex justify-between">
                      <span className="text-slate-700">{cat}</span>
                      <span className="font-mono font-medium text-slate-900">
                        {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-rose-800 text-sm">
                <span>Total Operating Expenses</span>
                <span className="font-mono">
                  -{companyPNL.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
            </div>

            {/* Net Operating Profit / Margin */}
            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-sm">
              <div>
                <span className="font-bold text-slate-900 block">
                  Net Operating Profit / (Loss)
                </span>
                <span className="text-[11px] text-slate-500">
                  Revenue − Operating Expenses (Excludes non-operating owner transfers)
                </span>
              </div>
              <span
                className={`text-xl font-bold font-mono ${
                  companyPNL.netOperatingProfit >= 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {companyPNL.netOperatingProfit >= 0 ? "+" : ""}
                {companyPNL.netOperatingProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
              </span>
            </div>
          </div>
        )}

        {/* REPORT 2: PERSONAL STATEMENT */}
        {selectedReport === "personal_statement" && (
          <div className="space-y-6 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Personal Incomes & Cash Inflows
              </h3>
              <div className="divide-y divide-slate-100">
                {Object.keys(personalStatement.incomeByCategory).length === 0 ? (
                  <p className="py-2 text-slate-400 italic">No personal income recorded in this period.</p>
                ) : (
                  Object.entries(personalStatement.incomeByCategory).map(([cat, amount]) => (
                    <div key={cat} className="py-2 flex justify-between">
                      <span className="text-slate-700">{cat}</span>
                      <span className="font-mono font-medium text-slate-900">
                        {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-800 text-sm">
                <span>Total Personal Income</span>
                <span className="font-mono">
                  +{personalStatement.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Personal Living & Discretionary Expenses
              </h3>
              <div className="divide-y divide-slate-100">
                {Object.keys(personalStatement.expenseByCategory).length === 0 ? (
                  <p className="py-2 text-slate-400 italic">No personal expenses recorded in this period.</p>
                ) : (
                  Object.entries(personalStatement.expenseByCategory).map(([cat, amount]) => (
                    <div key={cat} className="py-2 flex justify-between">
                      <span className="text-slate-700">{cat}</span>
                      <span className="font-mono font-medium text-slate-900">
                        {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-rose-800 text-sm">
                <span>Total Personal Expenses</span>
                <span className="font-mono">
                  -{personalStatement.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-sm">
              <div>
                <span className="font-bold text-slate-900 block">Net Personal Savings / Surplus</span>
                <span className="text-[11px] text-slate-500">Total Personal Inflow minus Outflows</span>
              </div>
              <span
                className={`text-xl font-bold font-mono ${
                  personalStatement.netSavings >= 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {personalStatement.netSavings >= 0 ? "+" : ""}
                {personalStatement.netSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
              </span>
            </div>
          </div>
        )}

        {/* REPORT 3: AGING REPORT */}
        {selectedReport === "aging" && (
          <div className="space-y-8 text-xs">
            {/* Customer Receivables */}
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex justify-between">
                <span>Customer Receivables (Money Owed to Me)</span>
                <span className="text-emerald-700 font-mono font-bold">
                  Total: +
                  {agingReport.customerReceivables
                    .reduce((sum, c) => sum + c.remaining_balance, 0)
                    .toLocaleString()}{" "}
                  {currency}
                </span>
              </h3>
              <table className="w-full text-left mt-3">
                <thead className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2">Customer / Entity</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Issue Date</th>
                    <th className="py-2">Due Date</th>
                    <th className="py-2 text-right">Original</th>
                    <th className="py-2 text-right">Balance Due</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agingReport.customerReceivables.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-400">
                        No outstanding receivables.
                      </td>
                    </tr>
                  ) : (
                    agingReport.customerReceivables.map((c) => (
                      <tr key={c.id}>
                        <td className="py-2.5 font-semibold text-slate-900">{c.contact_name}</td>
                        <td className="py-2.5 font-mono text-slate-500">{c.phone || "-"}</td>
                        <td className="py-2.5 font-mono text-slate-500">{c.date}</td>
                        <td className="py-2.5 font-mono text-slate-700">{c.due_date || "-"}</td>
                        <td className="py-2.5 text-right font-mono">{c.amount.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-emerald-700">
                          {c.remaining_balance.toLocaleString()} {currency}
                        </td>
                        <td className="py-2.5 text-center uppercase font-mono text-[10px]">
                          <span
                            className={`px-2 py-0.5 rounded ${
                              c.status === "overdue"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Supplier Payables */}
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex justify-between">
                <span>Supplier Payables (Money I Owe)</span>
                <span className="text-rose-700 font-mono font-bold">
                  Total: -
                  {agingReport.supplierPayables
                    .reduce((sum, c) => sum + c.remaining_balance, 0)
                    .toLocaleString()}{" "}
                  {currency}
                </span>
              </h3>
              <table className="w-full text-left mt-3">
                <thead className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2">Supplier / Creditor</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Issue Date</th>
                    <th className="py-2">Due Date</th>
                    <th className="py-2 text-right">Original</th>
                    <th className="py-2 text-right">Balance Due</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agingReport.supplierPayables.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-400">
                        No outstanding payables.
                      </td>
                    </tr>
                  ) : (
                    agingReport.supplierPayables.map((c) => (
                      <tr key={c.id}>
                        <td className="py-2.5 font-semibold text-slate-900">{c.contact_name}</td>
                        <td className="py-2.5 font-mono text-slate-500">{c.phone || "-"}</td>
                        <td className="py-2.5 font-mono text-slate-500">{c.date}</td>
                        <td className="py-2.5 font-mono text-slate-700">{c.due_date || "-"}</td>
                        <td className="py-2.5 text-right font-mono">{c.amount.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-rose-700">
                          {c.remaining_balance.toLocaleString()} {currency}
                        </td>
                        <td className="py-2.5 text-center uppercase font-mono text-[10px]">
                          <span
                            className={`px-2 py-0.5 rounded ${
                              c.status === "overdue"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT 4: COMBINED EXECUTIVE LEDGER */}
        {selectedReport === "combined" && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
                  Liquid Asset Balances
                </h4>
                <div className="space-y-2">
                  {accounts.map((acc) => (
                    <div key={acc.id} className="flex justify-between">
                      <span className="text-slate-600">
                        [{acc.environment.toUpperCase()}] {acc.name}
                      </span>
                      <span className="font-mono font-semibold text-slate-900">
                        {acc.current_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                        {acc.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
                  Executive Net Worth Formulation
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Liquid Cash/Bank:</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {accounts.reduce((sum, a) => sum + a.current_balance, 0).toLocaleString()} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Total Receivables (+):</span>
                    <span className="font-mono font-semibold">
                      +{credits.filter(c => c.direction === "owed_to_me").reduce((s, c) => s + c.remaining_balance, 0).toLocaleString()} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Total Payables (-):</span>
                    <span className="font-mono font-semibold">
                      -{credits.filter(c => c.direction === "i_owe").reduce((s, c) => s + c.remaining_balance, 0).toLocaleString()} {currency}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Executive Net Position:</span>
                    <span className="font-mono text-emerald-800">
                      {(
                        accounts.reduce((sum, a) => sum + a.current_balance, 0) +
                        credits.filter(c => c.direction === "owed_to_me").reduce((s, c) => s + c.remaining_balance, 0) -
                        credits.filter(c => c.direction === "i_owe").reduce((s, c) => s + c.remaining_balance, 0)
                      ).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                      {currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
