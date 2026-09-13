import React, { useState, useEffect } from "react";
import { X, AlertCircle, DollarSign, CheckCircle2 } from "lucide-react";
import { Credit, Account } from "../../types";
import { api } from "../../api";

interface CreditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  credit: Credit | null;
  accounts?: Account[];
  currency?: string;
}

export const CreditPaymentModal: React.FC<CreditPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  credit,
  accounts = [],
  currency = "ETB"
}) => {
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && credit) {
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setReferenceNo("");
      setNotes("");

      // Filter accounts matching credit's environment
      const envAccounts = (accounts || []).filter(a => a.environment === credit.environment);
      if (envAccounts.length > 0) {
        setAccountId(envAccounts[0]?.id || "");
      }
    }
  }, [isOpen, credit, accounts]);

  if (!isOpen || !credit) return null;

  const filteredAccounts = (accounts || []).filter(a => a.environment === credit.environment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid payment amount greater than 0");
      return;
    }

    if (parsedAmount > credit.remaining_balance) {
      setError(`Payment cannot exceed remaining balance of ${credit.remaining_balance.toLocaleString()} ETB`);
      return;
    }

    if (!accountId) {
      setError("Please select the receiving/paying account");
      return;
    }

    setLoading(true);
    try {
      await api.recordCreditPayment(credit.id, {
        account_id: accountId,
        amount: parsedAmount,
        date,
        reference_no: referenceNo || undefined,
        notes: notes || undefined
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  const isReceiving = credit.direction === "owed_to_me";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {isReceiving ? "Collect Credit Payment" : "Make Debt Payment"}
            </h3>
            <p className="text-xs text-slate-500">Record partial or full payment transaction</p>
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

        {/* Credit details summary card */}
        <div className="m-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500 font-medium">Party:</span>
            <span className="text-slate-900 font-semibold">{credit.contact_name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total</p>
              <p className="text-xs font-semibold text-slate-800">{credit.amount.toLocaleString()} ETB</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Paid</p>
              <p className="text-xs font-semibold text-emerald-600">{credit.amount_paid.toLocaleString()} ETB</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Remaining</p>
              <p className="text-xs font-bold text-rose-600">{credit.remaining_balance.toLocaleString()} ETB</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-700">
                Payment Amount (ETB) *
              </label>
              <button
                type="button"
                onClick={() => setAmount(credit.remaining_balance.toString())}
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Pay Full Balance ({credit.remaining_balance.toLocaleString()} ETB)
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={credit.remaining_balance}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-600 font-mono">
                ETB
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {isReceiving ? "Deposit into Account *" : "Pay from Account *"}
            </label>
            <select
              required
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              {filteredAccounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Reference / Receipt
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="TX-09823"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Payment Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via CBE mobile banking"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? "Recording..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
