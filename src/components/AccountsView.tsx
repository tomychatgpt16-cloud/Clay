import React, { useState } from "react";
import {
  Wallet,
  Landmark,
  Smartphone,
  Plus,
  Edit2,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Account, EnvironmentType } from "../types";
import { api } from "../api";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface AccountsViewProps {
  accounts: Account[];
  currency?: string;
  initialEnvironment?: EnvironmentType | "all";
  onOpenNewAccount: (env?: EnvironmentType) => void;
  onEditAccount: (acc: Account) => void;
  onOpenTransactionForAccount: (accountId: string, env: EnvironmentType) => void;
  onViewAccountLedger: (accountId: string) => void;
  onRefresh: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts = [],
  currency = "ETB",
  initialEnvironment = "all",
  onOpenNewAccount,
  onEditAccount,
  onOpenTransactionForAccount,
  onViewAccountLedger,
  onRefresh
}) => {
  const [environment, setEnvironment] = useState<EnvironmentType | "all">(initialEnvironment);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeAccounts = accounts || [];
  const filtered = safeAccounts.filter(
    (a) => environment === "all" || a.environment === environment
  );

  const totalBalance = filtered.reduce((sum, a) => sum + a.current_balance, 0);

  const handleDelete = (acc: Account) => {
    setDeleteTarget(acc);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Landmark className="w-5 h-5 text-indigo-600" />;
      case "cash":
        return <Wallet className="w-5 h-5 text-emerald-600" />;
      case "mobile_money":
        return <Smartphone className="w-5 h-5 text-amber-600" />;
      default:
        return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {environment === "personal"
              ? "Personal Accounts"
              : environment === "company"
              ? "Company Accounts"
              : "Financial Accounts Overview"}
          </h1>
          <p className="text-xs text-slate-500">
            Physical cash registers, bank institutions, and corporate accounts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setEnvironment("all")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                environment === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setEnvironment("personal")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                environment === "personal" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setEnvironment("company")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                environment === "company" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Company
            </button>
          </div>

          <button
            onClick={() => onOpenNewAccount(environment === "all" ? undefined : environment)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Aggregate Balance Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Total Aggregate Balance ({filtered.length} Accounts)
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">
            {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            <span className="text-sm font-semibold text-slate-500">{currency}</span>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Dynamic balance validation active
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((acc) => {
          return (
            <div
              key={acc.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {getIcon(acc.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {acc.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider capitalize">
                        {acc.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                        acc.environment === "personal"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {acc.environment}
                    </span>
                  </div>
                </div>

                {/* Balance display */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Current Balance
                  </span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {acc.current_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                    <span className="text-xs font-semibold text-slate-500">{acc.currency}</span>
                  </div>
                </div>

                {/* Sub info */}
                <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    <span>Opening: </span>
                    <strong className="text-slate-700 font-mono">
                      {acc.opening_balance.toLocaleString()} {acc.currency}
                    </strong>
                  </div>
                  <div>
                    <span>Status: </span>
                    <span className="font-semibold text-emerald-600 uppercase text-[10px]">
                      {acc.status || "active"}
                    </span>
                  </div>
                </div>

                {acc.notes && (
                  <p className="text-[11px] text-slate-400 italic mt-2 line-clamp-1">
                    {acc.notes}
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenTransactionForAccount(acc.id, acc.environment)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  + Entry
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewAccountLedger(acc.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="View Ledger Statement"
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditAccount(acc)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Account Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(acc)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Financial Account"
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.current_balance.toLocaleString()} ${currency})` : undefined}
        description={
          deleteTarget
            ? `Are you sure you want to permanently delete account "${deleteTarget.name}"? If this account contains recorded transactions, they will be removed and balances will be recalculated.`
            : undefined
        }
        confirmButtonText="Delete Account"
        onConfirm={async () => {
          if (deleteTarget) {
            await api.deleteAccount(deleteTarget.id);
            onRefresh();
          }
        }}
      />
    </div>
  );
};
