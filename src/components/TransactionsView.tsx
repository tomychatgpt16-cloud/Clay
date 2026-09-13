import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Receipt,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  DollarSign,
  AlertCircle,
  CreditCard,
  FileSpreadsheet,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { Transaction, Account, Category, EnvironmentType, TransactionType } from "../types";
import { api, getExportTransactionsUrl } from "../api";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  categories?: Category[];
  currency?: string;
  initialEnvironment?: EnvironmentType | "all";
  onOpenNewTransaction: (env?: EnvironmentType) => void;
  onEditTransaction: (tx: Transaction) => void;
  onViewReceipt: (url: string, name: string) => void;
  onRefresh: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions = [],
  accounts = [],
  categories = [],
  currency = "ETB",
  initialEnvironment = "all",
  onOpenNewTransaction,
  onEditTransaction,
  onViewReceipt,
  onRefresh,
}) => {
  const safeTransactions = transactions || [];
  const safeAccounts = accounts || [];
  const safeCategories = categories || [];

  const [environment, setEnvironment] = useState<EnvironmentType | "all">(initialEnvironment);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Extract unique category names from transactions and passed categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    safeCategories.forEach((c) => set.add(c.name));
    safeTransactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [safeCategories, safeTransactions]);

  // Filter transactions
  const filtered = useMemo(() => {
    return safeTransactions.filter((tx) => {
      if (environment !== "all" && tx.environment !== environment) return false;
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (accountFilter !== "all" && tx.account_id !== accountFilter) return false;
      if (categoryFilter !== "all" && tx.category !== categoryFilter) return false;
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = tx.description?.toLowerCase().includes(q);
        const matchesCategory = tx.category?.toLowerCase().includes(q);
        const matchesContact = tx.contact_person?.toLowerCase().includes(q);
        const matchesRef = tx.reference_no?.toLowerCase().includes(q);
        const matchesAccount = tx.account_name?.toLowerCase().includes(q);
        const matchesNotes = tx.notes?.toLowerCase().includes(q);

        if (!matchesDesc && !matchesCategory && !matchesContact && !matchesRef && !matchesAccount && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, environment, typeFilter, accountFilter, categoryFilter, startDate, endDate, searchQuery]);

  // Statistics for the filtered view
  const stats = useMemo(() => {
    let inflow = 0;
    let outflow = 0;

    filtered.forEach((tx) => {
      if (
        tx.type === "income" ||
        tx.type === "deposit" ||
        (tx.type === "owner_transfer" && tx.amount > 0) ||
        (tx.type === "transfer" && tx.amount > 0) ||
        tx.type === "credit_repayment"
      ) {
        inflow += Math.abs(tx.amount);
      } else if (
        tx.type === "expense" ||
        tx.type === "withdrawal" ||
        (tx.type === "owner_transfer" && tx.amount < 0) ||
        (tx.type === "transfer" && tx.amount < 0) ||
        tx.type === "credit_given"
      ) {
        outflow += Math.abs(tx.amount);
      }
    });

    return {
      inflow,
      outflow,
      net: inflow - outflow,
      count: filtered.length,
    };
  }, [filtered]);

  const handleDeleteClick = (tx: Transaction) => {
    setDeleteTarget(tx);
  };

  const handleExportExcel = () => {
    const url = getExportTransactionsUrl({
      environment: environment === "all" ? undefined : environment,
      accountId: accountFilter === "all" ? undefined : accountFilter,
    });
    window.location.href = url;
  };

  // Helper badge for transaction type
  const renderTypeBadge = (type: TransactionType) => {
    switch (type) {
      case "income":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ArrowDownLeft className="w-3 h-3" />
            <span>Income</span>
          </span>
        );
      case "expense":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <ArrowUpRight className="w-3 h-3" />
            <span>Expense</span>
          </span>
        );
      case "deposit":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Plus className="w-3 h-3" />
            <span>Deposit</span>
          </span>
        );
      case "withdrawal":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <ArrowUpRight className="w-3 h-3" />
            <span>Withdrawal</span>
          </span>
        );
      case "transfer":
      case "owner_transfer":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ArrowRightLeft className="w-3 h-3" />
            <span>Transfer</span>
          </span>
        );
      case "credit_given":
      case "credit_received":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <DollarSign className="w-3 h-3" />
            <span>Credit</span>
          </span>
        );
      case "credit_repayment":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Payment</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Financial Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete transaction register with multi-account filtering and receipt documentation
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => onOpenNewTransaction(environment === "all" ? "personal" : environment)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary KPI Cards for Current Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Inflow</span>
          <span className="text-base font-bold text-emerald-600 mt-0.5 block">
            +{stats.inflow.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Outflow</span>
          <span className="text-base font-bold text-rose-600 mt-0.5 block">
            -{stats.outflow.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Net Ledger Delta</span>
          <span
            className={`text-base font-bold mt-0.5 block ${
              stats.net >= 0 ? "text-slate-900" : "text-rose-600"
            }`}
          >
            {stats.net >= 0 ? "+" : ""}
            {stats.net.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Record Count</span>
          <span className="text-base font-bold text-slate-900 mt-0.5 block font-mono">
            {stats.count}
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Environment Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Environment
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Records</option>
              <option value="personal">Personal Only</option>
              <option value="company">Company Only</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Type Filter
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
              <option value="credit_given">Credit Given</option>
              <option value="credit_received">Credit Received</option>
              <option value="credit_repayment">Credit Repayment</option>
            </select>
          </div>

          {/* Account Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Account
            </label>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Accounts</option>
              {safeAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.environment})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
            </input>
          </div>

          {/* Date Range End */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Search Field & Clear Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description, customer, supplier, reference code, notes..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
          {(typeFilter !== "all" ||
            accountFilter !== "all" ||
            categoryFilter !== "all" ||
            startDate ||
            endDate ||
            searchQuery ||
            environment !== initialEnvironment) && (
            <button
              onClick={() => {
                setTypeFilter("all");
                setAccountFilter("all");
                setCategoryFilter("all");
                setStartDate("");
                setEndDate("");
                setSearchQuery("");
                setEnvironment(initialEnvironment);
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table (Requirement 9 Columns) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                /* ZERO-STATE FOR TABLE */
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">No transactions yet.</p>
                      <p className="text-[11px] text-slate-400">
                        Start by adding your first deposit, withdrawal, income, or expense.
                      </p>
                      <button
                        onClick={() => onOpenNewTransaction(environment === "all" ? "personal" : environment)}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Transaction</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isPositive =
                    tx.type === "income" ||
                    tx.type === "deposit" ||
                    (tx.type === "owner_transfer" && tx.amount > 0) ||
                    (tx.type === "transfer" && tx.amount > 0) ||
                    tx.type === "credit_repayment";

                  const isNegative =
                    tx.type === "expense" ||
                    tx.type === "withdrawal" ||
                    (tx.type === "owner_transfer" && tx.amount < 0) ||
                    (tx.type === "transfer" && tx.amount < 0) ||
                    tx.type === "credit_given";

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                      {/* 1. Date */}
                      <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                        {tx.date}
                        <span className="text-[10px] text-slate-400 block">{tx.time || ""}</span>
                      </td>

                      {/* 2. Type Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderTypeBadge(tx.type)}
                      </td>

                      {/* 3. Description */}
                      <td className="px-4 py-3 text-slate-800 max-w-xs truncate">
                        <div className="font-medium text-slate-900">
                          {tx.description || tx.contact_person || "-"}
                        </div>
                        {tx.contact_person && tx.description && (
                          <div className="text-[11px] text-slate-400">
                            Party: {tx.contact_person}
                          </div>
                        )}
                        {tx.reference_no && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            Ref: {tx.reference_no}
                          </div>
                        )}
                      </td>

                      {/* 4. Account */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium text-slate-900 block">{tx.account_name}</span>
                        <span
                          className={`inline-block text-[9px] font-bold uppercase font-mono px-1 rounded ${
                            tx.environment === "personal"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {tx.environment}
                        </span>
                      </td>

                      {/* 5. Category */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {tx.category ? (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {tx.category}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* 6. Amount */}
                      <td className="px-4 py-3 text-right font-semibold whitespace-nowrap font-mono">
                        <span
                          className={
                            isPositive
                              ? "text-emerald-600 font-bold"
                              : isNegative
                              ? "text-rose-600 font-bold"
                              : "text-slate-800"
                          }
                        >
                          {isPositive ? "+" : ""}
                          {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                        </span>
                      </td>

                      {/* 7. Status */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Cleared</span>
                        </span>
                      </td>

                      {/* 8. Actions */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {tx.attachment_url && (
                            <button
                              onClick={() => onViewReceipt(tx.attachment_url!, tx.attachment_name || "Receipt")}
                              className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition cursor-pointer"
                              title="View receipt"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(tx)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Transaction"
        itemName={deleteTarget ? `${deleteTarget.type.toUpperCase()}: ${deleteTarget.description} (${deleteTarget.amount.toLocaleString()} ${currency})` : undefined}
        description={
          deleteTarget
            ? `Are you sure you want to permanently delete transaction "${deleteTarget.description}" (${deleteTarget.amount.toLocaleString()} ${currency}) dated ${deleteTarget.date}? The linked account balance will be automatically adjusted.`
            : undefined
        }
        confirmButtonText="Delete Transaction"
        onConfirm={async () => {
          if (deleteTarget) {
            await api.deleteTransaction(deleteTarget.id);
            onRefresh();
          }
        }}
      />
    </div>
  );
};
