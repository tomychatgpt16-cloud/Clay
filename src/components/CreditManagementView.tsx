import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Plus,
  DollarSign,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Receipt
} from "lucide-react";
import { Credit, CreditPayment, Account, EnvironmentType, CreditDirection } from "../types";
import { api } from "../api";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface CreditManagementViewProps {
  credits: Credit[];
  accounts: Account[];
  currency?: string;
  initialEnvironment?: EnvironmentType | "all";
  initialDirection?: CreditDirection | "all";
  onOpenCreditModal: (env?: EnvironmentType, dir?: CreditDirection) => void;
  onOpenPaymentModal: (credit: Credit) => void;
  onRefresh: () => void;
}

export const CreditManagementView: React.FC<CreditManagementViewProps> = ({
  credits = [],
  accounts = [],
  currency = "ETB",
  initialEnvironment = "all",
  initialDirection = "all",
  onOpenCreditModal,
  onOpenPaymentModal,
  onRefresh
}) => {
  const safeCredits = credits || [];
  const safeAccounts = accounts || [];

  const [environment, setEnvironment] = useState<EnvironmentType | "all">(initialEnvironment);
  const [direction, setDirection] = useState<CreditDirection | "all">(initialDirection);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCreditId, setExpandedCreditId] = useState<string | null>(null);
  const [creditPayments, setCreditPayments] = useState<{ [creditId: string]: CreditPayment[] }>({});
  const [loadingPayments, setLoadingPayments] = useState<{ [creditId: string]: boolean }>({});
  const [deleteTarget, setDeleteTarget] = useState<Credit | null>(null);

  const filtered = useMemo(() => {
    return safeCredits.filter((c) => {
      if (environment !== "all" && c.environment !== environment) return false;
      if (direction !== "all" && c.direction !== direction) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.contact_name.toLowerCase().includes(q);
        const matchPhone = c.phone?.toLowerCase().includes(q);
        const matchCategory = c.category?.toLowerCase().includes(q);
        const matchNotes = c.notes?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCategory && !matchNotes) return false;
      }

      return true;
    });
  }, [safeCredits, environment, direction, statusFilter, searchQuery]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    let totalReceivables = 0;
    let totalPayables = 0;
    let overdueCount = 0;
    let overdueAmount = 0;

    safeCredits.forEach((c) => {
      if (c.direction === "owed_to_me") {
        totalReceivables += c.remaining_balance;
      } else {
        totalPayables += c.remaining_balance;
      }

      if (c.status === "overdue") {
        overdueCount++;
        overdueAmount += c.remaining_balance;
      }
    });

    return { totalReceivables, totalPayables, overdueCount, overdueAmount };
  }, [safeCredits]);

  const toggleExpand = async (creditId: string) => {
    if (expandedCreditId === creditId) {
      setExpandedCreditId(null);
      return;
    }

    setExpandedCreditId(creditId);
    if (!creditPayments[creditId]) {
      setLoadingPayments((prev) => ({ ...prev, [creditId]: true }));
      try {
        const payments = await api.getCreditPayments(creditId);
        setCreditPayments((prev) => ({ ...prev, [creditId]: payments }));
      } catch (err) {
        console.error("Failed to load payments:", err);
      } finally {
        setLoadingPayments((prev) => ({ ...prev, [creditId]: false }));
      }
    }
  };

  const handleDeleteClick = (c: Credit) => {
    setDeleteTarget(c);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Overdue
          </span>
        );
      case "settled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Settled
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Partially Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Credit & Debt Management
          </h1>
          <p className="text-xs text-slate-500">
            Customer receivables, supplier payables, personal debts, and lending portfolios
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenCreditModal(environment === "all" ? undefined : environment, "owed_to_me")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Money Owed to Me</span>
          </button>

          <button
            onClick={() => onOpenCreditModal(environment === "all" ? undefined : environment, "i_owe")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Money I Owe</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
            Total Receivables (Owed to Me)
          </span>
          <span className="text-xl font-bold text-emerald-800 mt-1 block">
            +{metrics.totalReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Customer & personal loans</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-rose-700 uppercase tracking-wider block">
            Total Payables (Money I Owe)
          </span>
          <span className="text-xl font-bold text-rose-800 mt-1 block">
            -{metrics.totalPayables.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Supplier & personal debts</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Net Credit Difference
          </span>
          <span
            className={`text-xl font-bold mt-1 block ${
              metrics.totalReceivables - metrics.totalPayables >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {(metrics.totalReceivables - metrics.totalPayables >= 0 ? "+" : "") +
              (metrics.totalReceivables - metrics.totalPayables).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
            {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Receivables − Payables</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider block">
            Overdue Balance
          </span>
          <span className="text-xl font-bold text-amber-800 mt-1 block">
            {metrics.overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">
            {metrics.overdueCount} {metrics.overdueCount === 1 ? "credit" : "credits"} past deadline
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Environment
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Environments</option>
              <option value="personal">Personal Only</option>
              <option value="company">Company Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Direction
            </label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Directions</option>
              <option value="owed_to_me">Money Owed to Me (Receivables)</option>
              <option value="i_owe">Money I Owe (Payables)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Settlement Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="partial">Partially Paid</option>
              <option value="settled">Fully Settled</option>
              <option value="overdue">Overdue Deadline</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Search Contact / Phone
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, phone number..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Records List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs">
            No credit obligations found matching your criteria.
          </div>
        ) : (
          filtered.map((c) => {
            const isReceivable = c.direction === "owed_to_me";
            const percentPaid = c.amount > 0 ? Math.min(100, Math.round((c.amount_paid / c.amount) * 100)) : 100;
            const isExpanded = expandedCreditId === c.id;
            const payments = creditPayments[c.id] || [];

            return (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition"
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Contact info */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleExpand(c.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition mt-0.5 cursor-pointer"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{c.contact_name}</h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                            c.environment === "personal"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {c.environment}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            isReceivable ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {isReceivable ? "Owed to Me (Receivable)" : "Money I Owe (Payable)"}
                        </span>
                        {getStatusBadge(c.status)}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                        {c.phone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {c.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Issued: {c.date}
                        </span>
                        {c.due_date && (
                          <span className={`flex items-center gap-1 font-mono ${c.status === "overdue" ? "text-rose-600 font-bold" : ""}`}>
                            Due: {c.due_date}
                          </span>
                        )}
                        {c.category && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                            {c.category}
                          </span>
                        )}
                      </div>

                      {c.notes && (
                        <p className="text-xs text-slate-500 italic mt-1.5">{c.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Amounts & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 self-end md:self-auto w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="flex items-baseline gap-2 sm:justify-end">
                        <span className="text-[11px] text-slate-400 uppercase font-mono">Remaining:</span>
                        <span className={`text-base font-bold ${isReceivable ? "text-emerald-700" : "text-rose-700"}`}>
                          {c.remaining_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Paid: {c.amount_paid.toLocaleString()} / Total: {c.amount.toLocaleString()} {currency} ({percentPaid}%)
                      </div>
                      {/* Repayment Progress Bar */}
                      <div className="w-full sm:w-44 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            c.status === "settled" ? "bg-emerald-500" : "bg-indigo-500"
                          }`}
                          style={{ width: `${percentPaid}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {c.remaining_balance > 0 && (
                        <button
                          onClick={() => onOpenPaymentModal(c)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer whitespace-nowrap"
                        >
                          Record Payment
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(c)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Credit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Payment History Section */}
                {isExpanded && (
                  <div className="bg-slate-50/70 px-6 py-4 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800">
                        Payment & Settlement History
                      </h4>
                      <span className="text-slate-400 text-[11px]">
                        {payments.length} {payments.length === 1 ? "payment" : "payments"} recorded
                      </span>
                    </div>

                    {loadingPayments[c.id] ? (
                      <p className="text-slate-400 py-2">Loading payment records...</p>
                    ) : payments.length === 0 ? (
                      <p className="text-slate-400 py-2">No payments recorded yet for this credit.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                              <th className="py-2">Date</th>
                              <th className="py-2">Amount Paid</th>
                              <th className="py-2">Account</th>
                              <th className="py-2">Ref / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {payments.map((p) => (
                              <tr key={p.id}>
                                <td className="py-2 font-mono text-slate-600">{p.date}</td>
                                <td className="py-2 font-semibold text-emerald-700">
                                  {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                                </td>
                                <td className="py-2 text-slate-700 font-medium">{p.account_name}</td>
                                <td className="py-2 text-slate-500">
                                  {p.reference_no && <span className="font-mono mr-2">[{p.reference_no}]</span>}
                                  {p.notes || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Credit / Loan Record"
        itemName={deleteTarget ? `${deleteTarget.contact_name} (${deleteTarget.remaining_amount.toLocaleString()} ${currency})` : undefined}
        description={
          deleteTarget
            ? `Are you sure you want to permanently delete this credit/loan record for "${deleteTarget.contact_name}"? All linked partial payment history will also be removed.`
            : undefined
        }
        confirmButtonText="Delete Credit Record"
        onConfirm={async () => {
          if (deleteTarget) {
            await api.deleteCredit(deleteTarget.id);
            onRefresh();
          }
        }}
      />
    </div>
  );
};
