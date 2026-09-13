import React, { useState, useMemo } from "react";
import {
  ArrowRightLeft,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Calendar,
  Layers,
  Trash2,
  Info,
  ShieldCheck
} from "lucide-react";
import { Transfer, Account } from "../types";
import { api } from "../api";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface TransferCenterViewProps {
  transfers?: Transfer[];
  accounts?: Account[];
  currency?: string;
  onRefresh: () => void;
}

export const TransferCenterView: React.FC<TransferCenterViewProps> = ({
  transfers = [],
  accounts = [],
  currency = "ETB",
  onRefresh
}) => {
  const safeTransfers = transfers || [];
  const safeAccounts = accounts || [];

  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().substring(0, 5));
  const [reason, setReason] = useState("Owner withdrawal");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Transfer | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set initial accounts
  React.useEffect(() => {
    if (safeAccounts?.length >= 2 && !fromAccountId && !toAccountId) {
      const companyAccs = safeAccounts.filter(a => a.environment === "company");
      const personalAccs = safeAccounts.filter(a => a.environment === "personal");
      if (companyAccs.length > 0 && personalAccs.length > 0) {
        setFromAccountId(companyAccs[0]?.id || "");
        setToAccountId(personalAccs[0]?.id || "");
      } else {
        setFromAccountId(safeAccounts[0]?.id || "");
        setToAccountId(safeAccounts[1]?.id || safeAccounts[0]?.id || "");
      }
    }
  }, [safeAccounts, fromAccountId, toAccountId]);

  // Derived transfer metrics
  const metrics = useMemo(() => {
    let companyToPersonal = 0;
    let personalToCompany = 0;

    safeTransfers.forEach((t) => {
      if (t.from_environment === "company" && t.to_environment === "personal") {
        companyToPersonal += t.amount;
      } else if (t.from_environment === "personal" && t.to_environment === "company") {
        personalToCompany += t.amount;
      }
    });

    return {
      companyToPersonal,
      personalToCompany,
      netOwnerDraw: companyToPersonal - personalToCompany
    };
  }, [safeTransfers]);

  const fromAcc = safeAccounts.find(a => a.id === fromAccountId);
  const toAcc = safeAccounts.find(a => a.id === toAccountId);
  const isInterEntity = fromAcc && toAcc && fromAcc.environment !== toAcc.environment;

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid transfer amount greater than 0");
      return;
    }

    if (fromAccountId === toAccountId) {
      setError("Source and destination accounts must be different");
      return;
    }

    setLoading(true);
    try {
      await api.createTransfer({
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        amount: parsedAmount,
        date,
        time,
        reason,
        notes
      });

      setAmount("");
      setNotes("");
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to execute transfer");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (t: Transfer) => {
    setDeleteTarget(t);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Transfer Center (Personal ↔ Company)
        </h1>
        <p className="text-xs text-slate-500">
          Strict double-entry fund movements between owner personal accounts and corporate ledgers
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Company → Personal (Owner Draws)
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {metrics.companyToPersonal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Cumulative profits transferred to private accounts
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Personal → Company (Capital Injected)
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {metrics.personalToCompany.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Cumulative personal funds injected into business
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Net Owner Draw Position
          </span>
          <span className={`text-xl font-bold mt-1 block ${metrics.netOwnerDraw >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            {metrics.netOwnerDraw >= 0 ? "+" : ""}
            {metrics.netOwnerDraw.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Draws minus owner capital contributions
          </span>
        </div>
      </div>

      {/* Instant Transfer Action Console */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Execute Fund Transfer</h3>
              <p className="text-[11px] text-slate-400">Instantly debit source and credit target account</p>
            </div>
          </div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold ${
            isInterEntity ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
          }`}>
            {isInterEntity ? "INTER-ENTITY TRANSFER" : "INTERNAL REBALANCING"}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleExecute} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Source Account (From) *
              </label>
              <select
                required
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <optgroup label="Company Accounts">
                  {safeAccounts.filter(a => a.environment === "company").map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Personal Accounts">
                  {safeAccounts.filter(a => a.environment === "personal").map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Destination Account (To) *
              </label>
              <select
                required
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <optgroup label="Personal Accounts">
                  {safeAccounts.filter(a => a.environment === "personal").map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Company Accounts">
                  {safeAccounts.filter(a => a.environment === "company").map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Transfer Amount (ETB) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10,000.00"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
                <span className="absolute right-3 top-2 text-[11px] text-slate-400 font-mono">
                  {currency}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Reason / Type
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Owner withdrawal, Capital injection..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Audit explanation, check reference, authorization..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Does not distort operational income or expense statements.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Processing..." : "Execute Transfer"}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Transfer Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Transfer Audit History</h3>
          <span className="text-xs text-slate-400 font-mono">{safeTransfers.length} Transfers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Transfer Route</th>
                <th className="px-5 py-3">Source Account</th>
                <th className="px-5 py-3">Destination Account</th>
                <th className="px-5 py-3">Reason / Notes</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No transfer records found.
                  </td>
                </tr>
              ) : (
                safeTransfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3 font-mono text-slate-600 whitespace-nowrap">
                      {t.date} <span className="text-[10px] text-slate-400">{t.time || ""}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <span className="uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100">
                          {t.from_environment}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100">
                          {t.to_environment}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap font-medium text-slate-900">
                      {t.from_account_name}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap font-medium text-slate-900">
                      {t.to_account_name}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <span className="font-medium text-slate-800">{t.reason || "Transfer"}</span>
                      {t.notes && <span className="text-slate-400 block text-[11px]">{t.notes}</span>}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                    </td>
                    <td className="px-5 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteClick(t)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                        title="Revert & Delete Transfer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Revert & Delete Transfer"
        itemName={deleteTarget ? `${deleteTarget.amount.toLocaleString()} ${currency} (${deleteTarget.from_account_name} → ${deleteTarget.to_account_name})` : undefined}
        description={
          deleteTarget
            ? `Are you sure you want to revert and delete transfer of ${deleteTarget.amount.toLocaleString()} ${currency} from "${deleteTarget.from_account_name}" to "${deleteTarget.to_account_name}"? Both the debit and credit legs of this transfer will be cancelled and balances recalculated.`
            : undefined
        }
        confirmButtonText="Revert & Delete Transfer"
        onConfirm={async () => {
          if (deleteTarget) {
            await api.deleteTransfer(deleteTarget.id);
            onRefresh();
          }
        }}
      />
    </div>
  );
};
