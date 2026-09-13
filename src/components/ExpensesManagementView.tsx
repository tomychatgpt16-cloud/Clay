import React, { useState } from "react";
import {
  Wrench,
  Plus,
  DollarSign,
  TrendingDown,
  Phone,
  User,
  Calendar,
  Search,
  Trash2,
  Tag,
  Zap,
  Building2,
  X,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { CompanyExpense, Account } from "../types";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface ExpensesManagementViewProps {
  expenses?: CompanyExpense[];
  accounts?: Account[];
  currency: string;
  onAddExpense: (data: {
    date: string;
    category: string;
    amount: number;
    description: string;
    supplier_name: string;
    supplier_phone?: string;
    payment_method: string;
    account_id?: string;
    notes?: string;
  }) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
}

const DEFAULT_EXPENSE_CATEGORIES = [
  "Diamond Tools & Saw Blades",
  "Factory Electricity & Power",
  "Water Supply & Slurry Disposal",
  "Machinery Maintenance & Spares",
  "Diesel & Generator Fuel",
  "Workshop & Yard Rent",
  "Factory Labor & Overtime Wages",
  "Packaging, Strapping & Pallets",
  "Crane & Internal Transport",
  "Safety Equipment & PPE",
  "Utilities & Telecommunications",
  "General Operating & Administrative"
];

export const ExpensesManagementView: React.FC<ExpensesManagementViewProps> = ({
  expenses = [],
  accounts = [],
  currency,
  onAddExpense,
  onDeleteExpense
}) => {
  const safeExpenses = expenses || [];
  const safeAccounts = accounts || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CompanyExpense | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [accountId, setAccountId] = useState(safeAccounts?.[0]?.id || "");
  const [notes, setNotes] = useState("");

  const formatMoney = (val: number) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(val) + ` ${currency}`
    );
  };

  const openAddModal = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setCategory(DEFAULT_EXPENSE_CATEGORIES[0]);
    setCustomCategory("");
    setAmount("");
    setDescription("");
    setSupplierName("");
    setSupplierPhone("");
    setPaymentMethod("Bank Transfer");
    setAccountId(safeAccounts?.[0]?.id || "");
    setNotes("");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Expense amount must be greater than zero.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide an expense description.");
      return;
    }
    if (!supplierName.trim()) {
      setError("Supplier / Vendor name is required.");
      return;
    }

    const finalCategory = category === "custom" ? customCategory.trim() : category;
    if (!finalCategory) {
      setError("Category is required.");
      return;
    }

    try {
      setLoading(true);
      await onAddExpense({
        date,
        category: finalCategory,
        amount: numAmount,
        description: description.trim(),
        supplier_name: supplierName.trim(),
        supplier_phone: supplierPhone.trim() || undefined,
        payment_method: paymentMethod,
        account_id: accountId || undefined,
        notes: notes.trim() || undefined
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to record company expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (exp: CompanyExpense) => {
    setDeleteTarget(exp);
  };

  // KPIs
  const totalOperatingExpenses = safeExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryMap: Record<string, number> = {};
  safeExpenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const topCategoryEntry = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

  // Unique suppliers count
  const uniqueSuppliers = new Set(safeExpenses.map((e) => e.supplier_name)).size;

  const filteredExpenses = safeExpenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.supplier_phone && e.supplier_phone.includes(searchQuery)) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === "all" || e.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            Operational Overheads & Suppliers
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Company Expenses & Supplier Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Record operating costs (saw tools, electricity, water, rent, machinery)
            with vendor names and contact phone numbers.
          </p>
        </div>

        <button
          id="btn-add-expense"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Record Company Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Operating Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(totalOperatingExpenses)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            {expenses.length} Incurred Expenses
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Highest Expense Category</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 truncate">
            {topCategoryEntry ? topCategoryEntry[0] : "None"}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {topCategoryEntry ? formatMoney(topCategoryEntry[1]) : "No data"}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Suppliers & Vendors</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {uniqueSuppliers}
          </div>
          <div className="text-xs text-slate-500 mt-1">Verified Partners with Contacts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Average Expense</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(
              expenses.length > 0 ? totalOperatingExpenses / expenses.length : 0
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">Per Expense Entry</div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Operating Expense Ledger
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {filteredExpenses.length} entries
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white text-slate-700"
            >
              <option value="all">All Categories</option>
              {DEFAULT_EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search expense, supplier, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Wrench className="w-12 h-12 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-700">No company expenses found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Record payments for diamond saw segments, utility power bills, water slurry,
              and tool suppliers.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Record First Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Date & Category</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Supplier / Vendor</th>
                  <th className="py-3.5 px-4">Supplier Phone</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {exp.date}
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          {exp.category}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{exp.description}</div>
                      {exp.notes && (
                        <div className="text-xs text-slate-400 mt-0.5">{exp.notes}</div>
                      )}
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-900">
                      {exp.supplier_name}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {exp.supplier_phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{exp.supplier_phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No phone</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-rose-700">
                      {formatMoney(exp.amount)}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {exp.payment_method}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(exp)}
                        title="Delete Expense"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Record Company Operating Expense
                  </h3>
                  <p className="text-xs text-slate-500">
                    Captures tools, utilities, and supplier phone numbers.
                  </p>
                </div>
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

              {/* Date & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expense Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expense Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                  >
                    {DEFAULT_EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">+ Other / Custom Category</option>
                  </select>
                </div>
              </div>

              {category === "custom" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specify Custom Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Forklift Hydraulic Hose Replacement"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              )}

              {/* Amount & Description */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-rose-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expense Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5x 350mm Diamond Bridge Saw Blades"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              {/* Supplier Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supplier / Vendor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Addis Diamond Tools PLC"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supplier Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+251 91 123 4567"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Accrued / On Account">On Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deduct From Account
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                  >
                    <option value="">None (No Account Deduction)</option>
                    {safeAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.current_balance} {acc.currency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Receipt Reference
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Invoice #ADT-8902 received and approved by workshop manager"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
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
                  className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "Recording..." : "Record Expense"}
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
        title="Delete Operating Expense"
        itemName={deleteTarget ? `${deleteTarget.description} (${formatMoney(deleteTarget.amount)})` : undefined}
        description={
          deleteTarget
            ? `Are you sure you want to permanently delete expense "${deleteTarget.description}" (${formatMoney(deleteTarget.amount)}) paid to "${deleteTarget.supplier_name}"? Any linked account balance deductions will be reversed.`
            : undefined
        }
        confirmButtonText="Delete Expense"
        onConfirm={async () => {
          if (deleteTarget) {
            await onDeleteExpense(deleteTarget.id);
          }
        }}
      />
    </div>
  );
};
