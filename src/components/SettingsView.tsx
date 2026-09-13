import React, { useState } from "react";
import {
  Sliders,
  Database,
  Download,
  Upload,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldAlert,
  User,
  RotateCcw,
  Palette,
  Layers,
  Wallet,
  Tag,
  Eye,
  Check,
  FileSpreadsheet,
  Calendar,
  Clock
} from "lucide-react";
import { api, getBackupUrl } from "../api";

interface SettingsViewProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  onRefreshData: () => void;
  onNavigateToAccounts?: () => void;
  onNavigateToCategories?: () => void;
}

type Tab = "security" | "organization" | "backup" | "appearance";

export const SettingsView: React.FC<SettingsViewProps> = ({
  companyName,
  setCompanyName,
  currency,
  setCurrency,
  onRefreshData,
  onNavigateToAccounts,
  onNavigateToCategories,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("security");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // Restore state
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  // Reset to zero state
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetMode, setResetMode] = useState<"balances_zero" | "full_wipe">("balances_zero");
  const [confirmInput, setConfirmInput] = useState("");
  const [pendingRestoreFile, setPendingRestoreFile] = useState<File | null>(null);

  // Daily Closing Excel state
  const [closingDate, setClosingDate] = useState(new Date().toISOString().split("T")[0]);
  const [closingDownloading, setClosingDownloading] = useState(false);
  const [autoPromptChecked, setAutoPromptChecked] = useState(() => {
    return localStorage.getItem("auto_prompt_daily_excel") !== "false";
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPassError("Password must be at least 6 characters");
      return;
    }

    setPassLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPassSuccess("Administrator password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPassError(err.message || "Failed to update password");
    } finally {
      setPassLoading(false);
    }
  };

  const handleRestoreFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingRestoreFile(file);
    e.target.value = "";
  };

  const executeRestore = async () => {
    if (!pendingRestoreFile) return;
    setRestoreError(null);
    setRestoreSuccess(null);
    setRestoreLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(",")[1];
        await api.restoreBackup({ base64Data });
        setRestoreSuccess("Database successfully restored! Reloading financial ledgers...");
        setPendingRestoreFile(null);
        setTimeout(() => {
          onRefreshData();
        }, 1200);
      } catch (err: any) {
        setRestoreError(err.message || "Failed to restore database file");
      } finally {
        setRestoreLoading(false);
      }
    };
    reader.readAsDataURL(pendingRestoreFile);
  };

  const handleResetToZero = async () => {
    if (confirmInput.trim() !== "RESET ZERO") {
      setResetError("Please type 'RESET ZERO' exactly to confirm.");
      return;
    }

    setResetLoading(true);
    setResetError(null);
    setResetSuccess(null);

    try {
      if (resetMode === "balances_zero") {
        await api.resetBalancesToZero();
        setResetSuccess("All account balances reset to 0.00 ETB! Shareholders and accounts preserved. Reloading...");
      } else {
        await api.resetData();
        setResetSuccess("All financial data has been wiped clean to ZERO balance! Reloading...");
      }
      setShowResetConfirmModal(false);
      setConfirmInput("");
      setTimeout(() => {
        onRefreshData();
      }, 1000);
    } catch (err: any) {
      setResetError(err.message || "Failed to reset database");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System & Financial Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Security controls, cryptographic credentials, organization profile, and SQLite database backup engine
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-1.5 pb-3 px-3 transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === "security"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab("organization")}
          className={`flex items-center gap-1.5 pb-3 px-3 transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === "organization"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Personal & Company Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`flex items-center gap-1.5 pb-3 px-3 transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === "backup"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Backup & Data Reset</span>
        </button>

        <button
          onClick={() => setActiveTab("appearance")}
          className={`flex items-center gap-1.5 pb-3 px-3 transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === "appearance"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Appearance & Quick Links</span>
        </button>
      </div>

      {/* TAB 1: SECURITY */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Change Master Password</h3>
                <p className="text-[11px] text-slate-400">
                  Secures both Personal and Company sections
                </p>
              </div>
            </div>

            {passSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password (e.g., 082012)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter secure new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full mt-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {passLoading ? "Updating..." : "Update Master Password"}
              </button>
            </form>
          </div>

          {/* Security Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between text-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Private Single-User Authentication Architecture</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                This system runs as an isolated, private single-administrator vault. Your password is
                never stored in plain text and is salted and hashed using standard bcrypt cryptographic
                primitives.
              </p>
              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Authentication Scheme:</span>
                  <span className="font-mono font-semibold text-slate-700">JWT + Bcrypt (Cost 10)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Default Credentials:</span>
                  <span className="font-mono font-semibold text-slate-700">admin / 082012</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Session Validity:</span>
                  <span className="font-mono font-semibold text-slate-700">7 Days Local Token</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px]">
              Tip: If you are still using the initial default password <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">082012</code>, please replace it above with a private password of your choice.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIZATION PROFILE */}
      {activeTab === "organization" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Personal & Company Identity</h3>
              <p className="text-[11px] text-slate-400">Display labels and default currency for ledgers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Company / Business Legal Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Shown on corporate invoices, receipts, and reports
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Default Currency Code
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard currency symbol across all calculations (e.g., ETB)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP & DATA RESET */}
      {activeTab === "backup" && (
        <div className="space-y-6">
          {resetSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {resetError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{resetError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BACKUP */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Database Backup & Recovery</h3>
                  <p className="text-[11px] text-slate-400">Direct file-based SQLite engine</p>
                </div>
              </div>

              {restoreSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{restoreSuccess}</span>
                </div>
              )}

              {restoreError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{restoreError}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-1">Create Full Offline Backup</h4>
                  <p className="text-slate-500 mb-3 text-[11px]">
                    Download a complete copy of your database (<code className="font-mono">finance.db</code>) containing all accounts, balances, transactions, and audit logs.
                  </p>
                  <a
                    href={getBackupUrl()}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Database Backup (.db)</span>
                  </a>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-1">Restore Database from Backup</h4>
                  <p className="text-slate-500 mb-3 text-[11px]">
                    Upload a previously downloaded <code className="font-mono">.db</code> or <code className="font-mono">.sqlite</code> file to restore all ledger records.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>{restoreLoading ? "Restoring Database..." : "Select Backup File to Restore"}</span>
                    <input
                      type="file"
                      accept=".db,.sqlite"
                      onChange={handleRestoreFileSelected}
                      disabled={restoreLoading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* RESET OPTIONS */}
            <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-900">Financial Balances & Data Reset</h3>
                  <p className="text-[11px] text-rose-500">Zero balances or wipe test data to refill with live records</p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-2 text-amber-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">Make All Balances 0.00 ETB (Recommended)</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Clears operational sales, stock, and expenses, sets all bank & cash balances to <strong>0.00 ETB</strong>, but <strong>preserves your shareholders (Ato Mohammed, Ato Ali, Ato Hussein)</strong> and accounts so you can refill easily.
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setResetMode("balances_zero");
                      setConfirmInput("");
                      setResetError(null);
                      setShowResetConfirmModal(true);
                    }}
                    className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs transition cursor-pointer shadow-xs"
                  >
                    Reset All Balances to 0.00 ETB (Keep Shareholders)
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200/80 text-xs space-y-2 text-rose-900">
                <p className="font-semibold text-rose-950">Complete Factory Wipe:</p>
                <p className="text-[11px] text-rose-800">
                  Permanently deletes all transactions, stock, sales, expenses, and resets accounts and shareholders completely to a brand new factory default.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setResetMode("full_wipe");
                      setConfirmInput("");
                      setResetError(null);
                      setShowResetConfirmModal(true);
                    }}
                    className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs transition cursor-pointer shadow-xs"
                  >
                    Full Factory Wipe (Delete Everything)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DAILY CLOSING & 24-HOUR EXCEL STATEMENT ARCHIVE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Daily Closing & 24-Hour End-of-Day Excel Statements
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Multi-sheet audit statements for day-end reconciliation (.xlsx)
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every day's transactions (Sales invoices, Factory expenses, Cash movements, Ending account balances, and Factory stock valuation) can be exported into an official multi-tab Excel spreadsheet so you can archive your financial status every 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-700">Select Date to Export:</span>
                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                />
              </div>

              <button
                onClick={async () => {
                  setClosingDownloading(true);
                  try {
                    await api.downloadDailyClosingExcel(closingDate);
                  } catch (err: any) {
                    alert(err.message || "Failed to download Excel");
                  } finally {
                    setClosingDownloading(false);
                  }
                }}
                disabled={closingDownloading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {closingDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Excel...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Closing Statement (.xlsx)</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPromptChecked}
                  onChange={(e) => {
                    setAutoPromptChecked(e.target.checked);
                    localStorage.setItem("auto_prompt_daily_excel", e.target.checked ? "true" : "false");
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Prompt to download today's closing Excel immediately after saving every entry</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APPEARANCE & SHORTCUTS */}
      {activeTab === "appearance" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Theme & Interface Density</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The application uses an ultra-clean, high-contrast private banking layout with subtle neutral borders, accessible typography, and distinctive color-coded transaction badges.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Private Banking Light Theme (Active)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Direct Configuration Links</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Easily manage your registered bank accounts and transaction category taxonomies:
            </p>
            <div className="flex flex-col gap-2 pt-1">
              {onNavigateToAccounts && (
                <button
                  onClick={onNavigateToAccounts}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 font-semibold transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    Manage Accounts
                  </span>
                  <span>→</span>
                </button>
              )}
              {onNavigateToCategories && (
                <button
                  onClick={onNavigateToCategories}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 font-semibold transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    Manage Categories
                  </span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESTORE CONFIRMATION MODAL */}
      {pendingRestoreFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Restore Database Backup</h3>
                <p className="text-xs text-amber-600">Overwrites existing database</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Restoring <strong className="text-slate-900 font-mono">{pendingRestoreFile.name}</strong> will overwrite current accounts and ledgers with the contents of the backup file. Are you sure you want to proceed?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPendingRestoreFile(null)}
                disabled={restoreLoading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeRestore}
                disabled={restoreLoading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                {restoreLoading ? "Restoring..." : "Confirm & Restore"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR RESET TO ZERO */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {resetMode === "balances_zero"
                    ? "Reset Balances to 0.00 ETB"
                    : "Confirm Full Factory Wipe"}
                </h3>
                <p className="text-xs text-rose-600">
                  {resetMode === "balances_zero"
                    ? "Preserves registered shareholders & accounts"
                    : "Wipes entire database to factory defaults"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {resetMode === "balances_zero" ? (
                <>
                  This will clear all transactions, sales, stock, and expense records, and reset all 4 account balances to <strong>0.00 ETB</strong> so you can refill with live operational data. <strong>Your shareholders (Ato Mohammed, Ato Ali, Ato Hussein) will be safely preserved.</strong>
                </>
              ) : (
                <>
                  This will permanently delete all records including custom shareholders, transactions, stock, and expenses, restoring the initial template state.
                </>
              )}
            </p>

            <div className="text-xs">
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Type <span className="font-mono font-bold text-rose-600">RESET ZERO</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="RESET ZERO"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowResetConfirmModal(false);
                  setConfirmInput("");
                  setResetError(null);
                }}
                disabled={resetLoading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToZero}
                disabled={confirmInput.trim() !== "RESET ZERO" || resetLoading}
                className={`px-4 py-2 text-white rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50 shadow-xs ${
                  resetMode === "balances_zero"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {resetLoading ? "Resetting..." : resetMode === "balances_zero" ? "Reset Balances to 0 ETB" : "Confirm Full Wipe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
