import React, { useState } from "react";
import {
  Users,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  PieChart,
  Search,
  Trash2,
  Edit2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  X
} from "lucide-react";
import { Shareholder, Account } from "../types";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface ShareholdersViewProps {
  shareholders?: Shareholder[];
  totalCapital?: number;
  accounts?: Account[];
  currency: string;
  onAddShareholder: (data: {
    name: string;
    phone?: string;
    email?: string;
    contribution_amount: number;
    contribution_date: string;
    account_id?: string;
    notes?: string;
  }) => Promise<void>;
  onUpdateShareholder?: (id: string, data: Partial<Shareholder>) => Promise<void>;
  onDeleteShareholder: (id: string) => Promise<void>;
}

export const ShareholdersView: React.FC<ShareholdersViewProps> = ({
  shareholders = [],
  totalCapital = 0,
  accounts = [],
  currency,
  onAddShareholder,
  onUpdateShareholder,
  onDeleteShareholder
}) => {
  const safeShareholders = shareholders || [];
  const safeAccounts = accounts || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingShareholder, setEditingShareholder] = useState<Shareholder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Shareholder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributionDate, setContributionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [accountId, setAccountId] = useState(accounts?.[0]?.id || "");
  const [notes, setNotes] = useState("");

  const formatMoney = (amount: number) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount) + ` ${currency}`
    );
  };

  const openAddModal = () => {
    setEditingShareholder(null);
    setName("");
    setPhone("");
    setEmail("");
    setContributionAmount("");
    setContributionDate(new Date().toISOString().split("T")[0]);
    setAccountId(accounts?.[0]?.id || "");
    setNotes("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sh: Shareholder) => {
    setEditingShareholder(sh);
    setName(sh.name);
    setPhone(sh.phone || "");
    setEmail(sh.email || "");
    setContributionAmount(sh.contribution_amount.toString());
    setContributionDate(sh.contribution_date);
    setAccountId(sh.account_id || accounts?.[0]?.id || "");
    setNotes(sh.notes || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please provide shareholder name.");
      return;
    }
    const amt = parseFloat(contributionAmount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid contribution amount greater than zero.");
      return;
    }

    try {
      setLoading(true);
      if (editingShareholder) {
        await onUpdateShareholder(editingShareholder.id, {
          name: name.trim(),
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          contribution_amount: amt,
          contribution_date: contributionDate,
          notes: notes.trim() || undefined
        });
      } else {
        await onAddShareholder({
          name: name.trim(),
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          contribution_amount: amt,
          contribution_date: contributionDate,
          account_id: accountId || undefined,
          notes: notes.trim() || undefined
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save shareholder record");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (sh: Shareholder) => {
    setDeleteTarget(sh);
  };

  const filteredShareholders = safeShareholders.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.phone && s.phone.includes(searchQuery)) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const avgContribution =
    safeShareholders.length > 0 ? totalCapital / safeShareholders.length : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Company Equity & Ownership
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Shareholder Capital & Equity Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track individual shareholder equity investments, contribution dates,
            and ownership percentages.
          </p>
        </div>

        <button
          id="btn-add-shareholder"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Record Shareholder Capital
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Contributed Capital</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(totalCapital)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            100% Equity Basis
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Shareholders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {shareholders.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Registered Equity Partners
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Average Contribution</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(avgContribution)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Per Shareholder</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Largest Shareholder</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 truncate">
            {safeShareholders.length > 0 ? safeShareholders[0]?.name : "None"}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {safeShareholders.length > 0
              ? `${safeShareholders[0]?.computed_percentage || 0}% Ownership`
              : "No data"}
          </div>
        </div>
      </div>

      {/* Equity Ownership Visual Bar */}
      {safeShareholders.length > 0 && totalCapital > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Equity Share Allocation Breakdown
            </h3>
            <span className="text-xs text-slate-500">
              Total Capital: {formatMoney(totalCapital)}
            </span>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
            {safeShareholders.map((sh, idx) => {
              const colors = [
                "bg-emerald-500",
                "bg-teal-500",
                "bg-blue-500",
                "bg-indigo-500",
                "bg-violet-500",
                "bg-amber-500",
                "bg-rose-500"
              ];
              const color = colors[idx % colors.length];
              const pct = sh.computed_percentage || 0;
              return (
                <div
                  key={sh.id}
                  style={{ width: `${pct}%` }}
                  title={`${sh.name}: ${pct}% (${formatMoney(sh.contribution_amount)})`}
                  className={`${color} h-full transition-all duration-300 relative group`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 pt-1 text-xs">
            {safeShareholders.map((sh, idx) => {
              const colors = [
                "bg-emerald-500",
                "bg-teal-500",
                "bg-blue-500",
                "bg-indigo-500",
                "bg-violet-500",
                "bg-amber-500",
                "bg-rose-500"
              ];
              const color = colors[idx % colors.length];
              return (
                <div key={sh.id} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="font-medium text-slate-700">{sh.name}</span>
                  <span className="text-slate-400">
                    ({sh.computed_percentage || 0}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shareholders List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Shareholder Ledger
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {filteredShareholders.length} recorded
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shareholder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {filteredShareholders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-700">
              No shareholder records found
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Record the contribution amount and date for each shareholder to
              begin tracking equity shares and capital accounts.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Shareholder
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Shareholder Name</th>
                  <th className="py-3.5 px-4">Contribution Date</th>
                  <th className="py-3.5 px-4 text-right">Contribution Amount</th>
                  <th className="py-3.5 px-4 text-right">Ownership Stake</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredShareholders.map((sh) => (
                  <tr key={sh.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {sh.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {sh.name}
                          </div>
                          <div className="text-xs text-slate-400">ID: {sh.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {sh.contribution_date}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {formatMoney(sh.contribution_amount)}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        {sh.computed_percentage || 0}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {sh.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {sh.phone}
                        </div>
                      )}
                      {sh.email && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {sh.email}
                        </div>
                      )}
                      {!sh.phone && !sh.email && (
                        <span className="text-slate-400 italic">No contact</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500 max-w-xs truncate">
                      {sh.notes || "—"}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(sh)}
                          title="Edit Shareholder"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sh)}
                          title="Delete Shareholder"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shareholder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  {editingShareholder
                    ? "Edit Shareholder Details"
                    : "Record Shareholder Capital"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shareholder Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ato Bekele Tadesse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+251 91 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@claysgranite.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contribution ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contribution Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={contributionDate}
                    onChange={(e) => setContributionDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {!editingShareholder && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deposit Destination Account (Optional)
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="">None (Record Equity Only)</option>
                    {safeAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.current_balance} {acc.currency})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Selecting an account automatically logs a capital deposit transaction.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Share Certificate Ref
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Initial capital injection for cutting machine acquisition"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingShareholder
                    ? "Update Shareholder"
                    : "Save Capital Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Shareholder"
        itemName={deleteTarget?.name}
        description={
          deleteTarget
            ? `Are you sure you want to permanently delete shareholder "${deleteTarget.name}" (${deleteTarget.contribution_amount.toLocaleString()} ${currency})? This cannot be undone.`
            : undefined
        }
        confirmButtonText="Delete Shareholder"
        onConfirm={async () => {
          if (deleteTarget) {
            await onDeleteShareholder(deleteTarget.id);
          }
        }}
      />
    </div>
  );
};
