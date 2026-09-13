import React, { useState } from "react";
import { Tags, Plus, Trash2, Layers, AlertCircle } from "lucide-react";
import { Category, EnvironmentType } from "../types";
import { api } from "../api";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface CategoriesViewProps {
  categories: Category[];
  onRefresh: () => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories = [],
  onRefresh
}) => {
  const safeCategories = categories || [];
  const [environment, setEnvironment] = useState<EnvironmentType | "both">("company");
  const [name, setName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await api.createCategory({
        environment,
        name: name.trim()
      });
      setName("");
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const personalCats = safeCategories.filter(c => c.environment === "personal" || c.environment === "both");
  const companyCats = safeCategories.filter(c => c.environment === "company" || c.environment === "both");

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Financial Categories
        </h1>
        <p className="text-xs text-slate-500">
          Standardized tags for personal budgets and company accounting ledgers
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Category Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Create New Category
        </h3>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-48">
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none"
            >
              <option value="company">Company</option>
              <option value="personal">Personal</option>
              <option value="both">Both Environments</option>
            </select>
          </div>

          <div className="flex-1">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Raw Material Slabs, Vehicle Fuel, Dividends..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Adding..." : "+ Add Category"}
          </button>
        </form>
      </div>

      {/* Categories Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Company Categories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Company Categories
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{companyCats.length} Tags</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {companyCats.length === 0 ? (
              <p className="text-slate-400 py-3 text-center">No categories configured.</p>
            ) : (
              companyCats.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50/70 hover:bg-slate-100 transition group"
                >
                  <span className="text-slate-800 font-medium">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    {cat.environment === "both" && (
                      <span className="text-[10px] text-slate-400 font-mono">[BOTH]</span>
                    )}
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Personal Categories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Personal Categories
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{personalCats.length} Tags</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {personalCats.length === 0 ? (
              <p className="text-slate-400 py-3 text-center">No categories configured.</p>
            ) : (
              personalCats.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50/70 hover:bg-slate-100 transition group"
                >
                  <span className="text-slate-800 font-medium">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    {cat.environment === "both" && (
                      <span className="text-[10px] text-slate-400 font-mono">[BOTH]</span>
                    )}
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
        itemName={deleteTarget?.name}
        description={
          deleteTarget
            ? `Are you sure you want to delete category "${deleteTarget.name}"? Transactions assigned to this category will retain their history.`
            : undefined
        }
        confirmButtonText="Delete Category"
        onConfirm={async () => {
          if (deleteTarget) {
            await api.deleteCategory(deleteTarget.id);
            onRefresh();
          }
        }}
      />
    </div>
  );
};
