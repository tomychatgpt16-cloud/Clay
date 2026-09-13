import React, { useState, useEffect } from "react";
import { X, Upload, Check, AlertCircle, FileText, Calendar, DollarSign, Tag, User, Hash } from "lucide-react";
import { Account, Category, Transaction, EnvironmentType, TransactionType } from "../../types";
import { api } from "../../api";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editTransaction?: Transaction | null;
  accounts?: Account[];
  categories?: Category[];
  currency?: string;
  initialEnvironment?: EnvironmentType;
  initialType?: TransactionType;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editTransaction,
  accounts = [],
  categories = [],
  initialEnvironment = "personal",
  initialType = "expense"
}) => {
  const [environment, setEnvironment] = useState<EnvironmentType>(initialEnvironment);
  const [type, setType] = useState<TransactionType>(initialType);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().substring(0, 5));
  const [category, setCategory] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [description, setDescription] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editTransaction) {
      setEnvironment(editTransaction.environment);
      setType(editTransaction.type);
      setAccountId(editTransaction.account_id);
      setAmount(Math.abs(editTransaction.amount).toString());
      setDate(editTransaction.date);
      setTime(editTransaction.time || "12:00");
      setCategory(editTransaction.category || "");
      setContactPerson(editTransaction.contact_person || "");
      setDescription(editTransaction.description || "");
      setReferenceNo(editTransaction.reference_no || "");
      setNotes(editTransaction.notes || "");
      setAttachmentUrl(editTransaction.attachment_url || null);
      setAttachmentName(editTransaction.attachment_name || null);
    } else {
      setEnvironment(initialEnvironment);
      setType(initialType);
      // Auto-select first account for this environment
      const envAccounts = (accounts || []).filter(a => a.environment === initialEnvironment);
      if (envAccounts.length > 0) {
        setAccountId(envAccounts[0]?.id || "");
      }
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setTime(new Date().toTimeString().substring(0, 5));
      setCategory("");
      setContactPerson("");
      setDescription("");
      setReferenceNo("");
      setNotes("");
      setAttachmentUrl(null);
      setAttachmentName(null);
    }
  }, [editTransaction, isOpen, initialEnvironment, initialType, accounts]);

  // When environment changes, select first account of that environment
  const handleEnvironmentChange = (newEnv: EnvironmentType) => {
    setEnvironment(newEnv);
    const envAccounts = (accounts || []).filter(a => a.environment === newEnv);
    if (envAccounts.length > 0) {
      setAccountId(envAccounts[0]?.id || "");
    } else {
      setAccountId("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError("File size must be under 15MB");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await api.uploadAttachment(file.name, base64Data);
        setAttachmentUrl(res.url);
        setAttachmentName(file.name);
      } catch (err: any) {
        setError(err.message || "Failed to upload file");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (!accountId) {
      setError("Please select an account");
      return;
    }

    setLoading(true);
    try {
      if (editTransaction) {
        await api.updateTransaction(editTransaction.id, {
          account_id: accountId,
          type,
          amount: parsedAmount,
          date,
          time,
          category: category || undefined,
          contact_person: contactPerson || undefined,
          description: description || undefined,
          reference_no: referenceNo || undefined,
          attachment_url: attachmentUrl || undefined,
          attachment_name: attachmentName || undefined,
          notes: notes || undefined
        });
      } else {
        await api.createTransaction({
          environment,
          type,
          account_id: accountId,
          amount: parsedAmount,
          date,
          time,
          category: category || undefined,
          contact_person: contactPerson || undefined,
          description: description || undefined,
          reference_no: referenceNo || undefined,
          attachment_url: attachmentUrl || undefined,
          attachment_name: attachmentName || undefined,
          notes: notes || undefined
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter(a => a.environment === environment);
  const filteredCategories = categories.filter(c => c.environment === environment || c.environment === "both");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {editTransaction ? "Edit Transaction" : "Record New Transaction"}
            </h3>
            <p className="text-xs text-slate-500">
              Record financial activity with automatic balance recalculation
            </p>
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
          {/* Environment Selector (Personal vs Company) */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Financial Environment
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleEnvironmentChange("personal")}
                className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  environment === "personal"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                PERSONAL FINANCES
              </button>
              <button
                type="button"
                onClick={() => handleEnvironmentChange("company")}
                className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  environment === "company"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                COMPANY FINANCES
              </button>
            </div>
          </div>

          {/* Transaction Type */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: "expense", label: "Expense", color: "text-rose-600" },
              { key: "income", label: "Income", color: "text-emerald-600" },
              { key: "deposit", label: "Deposit", color: "text-indigo-600" },
              { key: "withdrawal", label: "Withdrawal", color: "text-amber-600" }
            ].map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setType(t.key as any)}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition cursor-pointer text-center ${
                  type === t.key
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Amount & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Amount (ETB) *
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
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-600 font-mono">
                  ETB
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Account *
              </label>
              <select
                required
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
              >
                {filteredAccounts.length === 0 ? (
                  <option value="">No accounts available</option>
                ) : (
                  filteredAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.current_balance.toLocaleString()} {acc.currency})
                    </option>
                  ))
                )}
              </select>
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

          {/* Category & Contact / Party */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select or enter category"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
              <datalist id="category-suggestions">
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {environment === "company" ? "Customer / Supplier / Party" : "Person / Beneficiary"}
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. ABC Construction, Ahmed, CBE"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          {/* Description & Reference No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description / Purpose
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Granite slab purchase advance"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Reference / Check / Receipt No
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. INV-1049, CHK-8812"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          {/* Receipt / Attachment Upload */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Receipt / Document Attachment
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>{uploading ? "Uploading..." : "Upload Receipt Image/Doc"}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {attachmentUrl && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[180px]">{attachmentName || "Receipt Attached"}</span>
                  <button
                    type="button"
                    onClick={() => { setAttachmentUrl(null); setAttachmentName(null); }}
                    className="ml-1 text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Internal Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional confidential details..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          {/* Actions */}
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
              disabled={loading || uploading}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? "Saving..." : editTransaction ? "Update Transaction" : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
