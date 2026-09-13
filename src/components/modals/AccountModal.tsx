import React, { useState, useEffect } from "react";
import { X, AlertCircle, Landmark } from "lucide-react";
import { Account, AccountType, EnvironmentType } from "../../types";
import { api } from "../../api";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editAccount?: Account | null;
  defaultEnvironment?: EnvironmentType;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editAccount,
  defaultEnvironment = "personal"
}) => {
  const [environment, setEnvironment] = useState<EnvironmentType>(defaultEnvironment);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("bank");
  const [openingBalance, setOpeningBalance] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editAccount) {
      setEnvironment(editAccount.environment);
      setName(editAccount.name);
      setType(editAccount.type);
      setOpeningBalance(editAccount.opening_balance.toString());
      setCurrency(editAccount.currency || "ETB");
      setStatus(editAccount.status || "active");
      setNotes(editAccount.notes || "");
    } else {
      setEnvironment(defaultEnvironment);
      setName("");
      setType("bank");
      setOpeningBalance("0.00");
      setCurrency("ETB");
      setStatus("active");
      setNotes("");
    }
  }, [editAccount, isOpen, defaultEnvironment]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedOpening = parseFloat(openingBalance);
    if (isNaN(parsedOpening)) {
      setError("Please enter a valid opening balance");
      return;
    }

    if (!name.trim()) {
      setError("Account name is required");
      return;
    }

    setLoading(true);
    try {
      if (editAccount) {
        await api.updateAccount(editAccount.id, {
          name: name.trim(),
          type,
          opening_balance: parsedOpening,
          status,
          notes: notes.trim() || undefined
        });
      } else {
        await api.createAccount({
          environment,
          name: name.trim(),
          type,
          opening_balance: parsedOpening,
          currency,
          status,
          notes: notes.trim() || undefined
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {editAccount ? "Edit Financial Account" : "Create New Account"}
            </h3>
            <p className="text-xs text-slate-500">Bank accounts, physical cash registers, and mobile wallets</p>
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
          {!editAccount && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Financial Environment
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEnvironment("personal")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${
                    environment === "personal" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironment("company")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${
                    environment === "company" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Company
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Account Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CBE Savings, Awash Checking, Office Cash"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Account Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="bank">Bank Account</option>
                <option value="cash">Physical Cash</option>
                <option value="mobile_money">Mobile Money (Telebirr/etc)</option>
                <option value="other">Other Asset</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                disabled={!!editAccount}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-100"
              >
                <option value="ETB">ETB (Ethiopian Birr)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Opening Balance ({currency}) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
            <p className="text-[11px] text-slate-600 mt-1">
              Initial ledger starting balance. Ongoing current balance is automatically computed from all ledger movements.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="active">Active (Available for transactions)</option>
              <option value="inactive">Inactive / Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Account Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Account numbers, branch location, signers..."
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
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : editAccount ? "Update Account" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
