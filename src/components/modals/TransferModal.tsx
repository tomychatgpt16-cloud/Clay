import React, { useState, useEffect } from "react";
import { X, ArrowRightLeft, AlertCircle, Info, ShieldAlert } from "lucide-react";
import { Account, EnvironmentType } from "../../types";
import { api } from "../../api";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts?: Account[];
  defaultFromEnv?: EnvironmentType;
  defaultToEnv?: EnvironmentType;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  accounts = [],
  defaultFromEnv = "company",
  defaultToEnv = "personal"
}) => {
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().substring(0, 5));
  const [reason, setReason] = useState("Owner withdrawal");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && accounts?.length >= 2) {
      // Find default from account
      const fromOptions = accounts.filter(a => a.environment === defaultFromEnv);
      const toOptions = accounts.filter(a => a.environment === defaultToEnv);

      const fId = fromOptions.length > 0 ? fromOptions[0].id : (accounts[0]?.id || "");
      const tId = toOptions.length > 0 ? toOptions[0].id : (accounts[1]?.id || accounts[0]?.id || "");

      setFromAccountId(fId);
      setToAccountId(tId);
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setTime(new Date().toTimeString().substring(0, 5));
      if (defaultFromEnv === "company" && defaultToEnv === "personal") {
        setReason("Owner withdrawal");
      } else if (defaultFromEnv === "personal" && defaultToEnv === "company") {
        setReason("Owner capital contribution");
      } else {
        setReason("Account rebalancing");
      }
    }
  }, [isOpen, defaultFromEnv, defaultToEnv, accounts]);

  if (!isOpen) return null;

  const fromAcc = accounts.find(a => a.id === fromAccountId);
  const toAcc = accounts.find(a => a.id === toAccountId);

  const isInterEntity = fromAcc && toAcc && fromAcc.environment !== toAcc.environment;
  const transferDirection = isInterEntity
    ? fromAcc?.environment === "company"
      ? "Company → Personal (Owner Withdrawal / Draw)"
      : "Personal → Company (Owner Capital Contribution)"
    : "Intra-Entity Account Transfer";

  const handleSubmit = async (e: React.FormEvent) => {
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

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to execute transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Transfer Center</h3>
              <p className="text-xs text-slate-500">Personal ↔ Company & Internal Transfers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Visual Classification Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="font-semibold text-slate-800 flex items-center justify-between mb-1">
              <span>Transfer Classification</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                isInterEntity ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
              }`}>
                {isInterEntity ? "INTER-ENTITY" : "INTRA-ENTITY"}
              </span>
            </div>
            <p className="text-slate-600">
              {transferDirection}
            </p>
            {isInterEntity && (
              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  This transfer updates both Personal and Company ledgers simultaneously without counting as regular operational income or expense.
                </span>
              </div>
            )}
          </div>

          {/* From & To Accounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                From Account (Source) *
              </label>
              <select
                required
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <optgroup label="Company Accounts">
                  {accounts.filter(a => a.environment === "company").map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Personal Accounts">
                  {accounts.filter(a => a.environment === "personal").map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                To Account (Destination) *
              </label>
              <select
                required
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <optgroup label="Personal Accounts">
                  {accounts.filter(a => a.environment === "personal").map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Company Accounts">
                  {accounts.filter(a => a.environment === "company").map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Amount to Transfer (ETB) *
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
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-600 font-mono">
                ETB
              </span>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          {/* Reason / Classification */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Purpose / Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Owner monthly dividend draw, Project capital injection"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Transfer Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes for accounting and audit reconciliation..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? "Processing..." : "Execute Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
