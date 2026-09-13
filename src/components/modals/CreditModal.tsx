import React, { useState, useEffect } from "react";
import { X, AlertCircle, Calendar, Phone, DollarSign, User } from "lucide-react";
import { Account, CreditDirection, EnvironmentType } from "../../types";
import { api } from "../../api";

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts?: Account[];
  currency?: string;
  initialEnvironment?: EnvironmentType;
  initialDirection?: CreditDirection;
}

export const CreditModal: React.FC<CreditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  accounts = [],
  currency = "ETB",
  initialEnvironment = "company",
  initialDirection = "owed_to_me"
}) => {
  const [environment, setEnvironment] = useState<EnvironmentType>(initialEnvironment);
  const [direction, setDirection] = useState<CreditDirection>(initialDirection);
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [accountId, setAccountId] = useState("");
  const [recordTransaction, setRecordTransaction] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEnvironment(initialEnvironment);
      setDirection(initialDirection);
      setContactName("");
      setPhone("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setDueDate("");
      setCategory("");
      setNotes("");
      setRecordTransaction(false);

      const envAccs = (accounts || []).filter(a => a.environment === initialEnvironment);
      if (envAccs.length > 0) setAccountId(envAccs[0]?.id || "");
    }
  }, [isOpen, initialEnvironment, initialDirection, accounts]);

  if (!isOpen) return null;

  const filteredAccounts = (accounts || []).filter(a => a.environment === environment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (!contactName.trim()) {
      setError("Contact name or entity is required");
      return;
    }

    setLoading(true);
    try {
      await api.createCredit({
        environment,
        direction,
        contact_name: contactName.trim(),
        phone: phone.trim() || undefined,
        amount: parsedAmount,
        date,
        due_date: dueDate || undefined,
        category: category || undefined,
        notes: notes || undefined,
        account_id: accountId || undefined,
        record_transaction: recordTransaction
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create credit record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {direction === "owed_to_me" ? "Record Money Owed to Me (Receivable)" : "Record Money I Owe (Payable)"}
            </h3>
            <p className="text-xs text-slate-500">Track loans, customer invoices, and supplier balances</p>
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
          {/* Environment and Direction Pills */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Environment
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEnvironment("personal")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${
                    environment === "personal" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Personal Finances
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironment("company")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${
                    environment === "company" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Company Finances
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Direction
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setDirection("owed_to_me")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${
                    direction === "owed_to_me" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600"
                  }`}
                >
                  {environment === "company" ? "Customer Receivables (They owe me)" : "Money Owed to Me (Lent out)"}
                </button>
                <button
                  type="button"
                  onClick={() => setDirection("i_owe")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${
                    direction === "i_owe" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600"
                  }`}
                >
                  {environment === "company" ? "Supplier Payables (I owe them)" : "Money I Owe (Borrowed)"}
                </button>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {direction === "owed_to_me" ? "Borrower / Customer Name *" : "Creditor / Supplier Name *"}
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. ABC Construction, Ahmed Mohammed"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 91 234 5678"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Total Amount (ETB) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-600 font-mono">
                ETB
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Issue / Start Date *
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
                Due Date / Deadline
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          {/* Optional account linking */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recordTxCheck"
                checked={recordTransaction}
                onChange={(e) => setRecordTransaction(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="recordTxCheck" className="text-xs font-medium text-slate-800 cursor-pointer">
                Also record instant cash movement in account
              </label>
            </div>
            {recordTransaction && (
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Disburse/Receive from Account
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  {filteredAccounts.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.current_balance.toLocaleString()} {a.currency})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Category & Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Category / Project Tag
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Milestone 2, Emergency Loan, Raw Material Batch"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Notes & Contract Terms
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Repayment agreement, guarantee, or terms..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Recording..." : "Save Credit Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
