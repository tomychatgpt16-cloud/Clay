import React, { useState, useEffect, useCallback } from "react";
import { api, getStoredToken, removeStoredToken } from "./api";
import {
  AuthUser,
  Account,
  Transaction,
  Credit,
  Category,
  DashboardData,
  EnvironmentType,
  Shareholder,
  StockItem,
  StockWasteLog,
  Sale,
  CompanyExpense,
  CompanyFinanceSummary,
  CreditDirection
} from "./types";

// Component Views
import { LoginView } from "./components/LoginView";
import { Sidebar, ActiveView } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { DashboardView } from "./components/DashboardView";
import { ShareholdersView } from "./components/ShareholdersView";
import { StockManagementView } from "./components/StockManagementView";
import { SalesManagementView } from "./components/SalesManagementView";
import { ExpensesManagementView } from "./components/ExpensesManagementView";
import { ProfitLossView } from "./components/ProfitLossView";
import { AccountsView } from "./components/AccountsView";
import { CreditManagementView } from "./components/CreditManagementView";
import { CashFlowView } from "./components/CashFlowView";
import { TransactionsView } from "./components/TransactionsView";
import { AuditLogView } from "./components/AuditLogView";
import { SettingsView } from "./components/SettingsView";
import { SecurityWarningBanner } from "./components/SecurityWarningBanner";

// Modals
import { TransactionModal } from "./components/modals/TransactionModal";
import { CreditModal } from "./components/modals/CreditModal";
import { CreditPaymentModal } from "./components/modals/CreditPaymentModal";
import { AccountModal } from "./components/modals/AccountModal";
import { ReceiptViewerModal } from "./components/modals/ReceiptViewerModal";
import { ChangePasswordModal } from "./components/modals/ChangePasswordModal";
import { DailyClosingModal } from "./components/DailyClosingModal";
import { DailyClosingPromptBanner } from "./components/DailyClosingPromptBanner";

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Application settings
  const [companyName, setCompanyName] = useState("Clay’s Granite & Marble");
  const [currency, setCurrency] = useState("ETB");

  // Navigation & UI state
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

  // Core Company Data state
  const [companySummary, setCompanySummary] = useState<CompanyFinanceSummary | null>(null);
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockWasteLogs, setStockWasteLogs] = useState<StockWasteLog[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<CompanyExpense[]>([]);

  // Auxiliary data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modals state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [initialCreditDir, setInitialCreditDir] = useState<CreditDirection>("owed_to_me");
  const [selectedCreditForPayment, setSelectedCreditForPayment] = useState<Credit | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Daily Closing Statement state
  const [isDailyClosingModalOpen, setIsDailyClosingModalOpen] = useState(false);
  const [closingPrompt, setClosingPrompt] = useState<{
    show: boolean;
    message: string;
    date?: string;
  } | null>(null);

  const triggerDailyClosingPrompt = (message: string, date?: string) => {
    const enabled = localStorage.getItem("auto_prompt_daily_excel") !== "false";
    if (enabled) {
      setClosingPrompt({
        show: true,
        message,
        date: date || new Date().toISOString().split("T")[0]
      });
    }
  };

  // 1. Check Authentication on Mount
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    api
      .getMe()
      .then((res) => {
        setCurrentUser(res.user);
      })
      .catch(() => {
        removeStoredToken();
        setCurrentUser(null);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  // 2. Fetch all company data
  const fetchAllData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingData(true);
    try {
      const [
        summaryRes,
        shRes,
        stkRes,
        wstRes,
        slsRes,
        expRes,
        dashRes,
        accsRes,
        txsRes,
        credsRes,
        catsRes
      ] = await Promise.all([
        api.getCompanySummary().catch(() => null),
        api.getShareholders().catch(() => ({ shareholders: [], totalCapital: 0, shareholderCount: 0 })),
        api.getStockItems().catch(() => []),
        api.getStockWasteLogs().catch(() => []),
        api.getSales().catch(() => []),
        api.getExpenses().catch(() => []),
        api.getDashboard().catch(() => null),
        api.getAccounts("company").catch(() => []),
        api.getTransactions({ environment: "company" }).catch(() => []),
        api.getCredits({ environment: "company" }).catch(() => []),
        api.getCategories().catch(() => [])
      ]);

      if (summaryRes) setCompanySummary(summaryRes);
      const shList = Array.isArray(shRes) ? shRes : (shRes?.shareholders || []);
      setShareholders(shList);
      setStockItems(Array.isArray(stkRes) ? stkRes : []);
      setStockWasteLogs(Array.isArray(wstRes) ? wstRes : []);
      setSales(Array.isArray(slsRes) ? slsRes : []);
      setExpenses(Array.isArray(expRes) ? expRes : []);
      if (dashRes) setDashboardData(dashRes);
      setAccounts(Array.isArray(accsRes) ? accsRes : []);
      setTransactions(Array.isArray(txsRes) ? txsRes : []);
      setCredits(Array.isArray(credsRes) ? credsRes : []);
      setCategories(Array.isArray(catsRes) ? catsRes : []);
    } catch (err) {
      console.error("Error fetching company data:", err);
    } finally {
      setLoadingData(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser, fetchAllData]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    removeStoredToken();
    setCurrentUser(null);
  };

  // 3. Shareholder operations
  const handleAddShareholder = async (data: {
    name: string;
    contribution_amount: number;
    contribution_date: string;
    phone?: string;
    notes?: string;
  }) => {
    await api.createShareholder(data);
    await fetchAllData();
    triggerDailyClosingPrompt("Shareholder equity recorded!", data.contribution_date);
  };

  const handleDeleteShareholder = async (id: string) => {
    await api.deleteShareholder(id);
    await fetchAllData();
  };

  const handleUpdateShareholder = async (id: string, data: Partial<Shareholder>) => {
    await api.updateShareholder(id, data);
    await fetchAllData();
  };

  // 4. Stock operations
  const handleAddStockItem = async (data: any) => {
    await api.createStockItem(data);
    await fetchAllData();
    triggerDailyClosingPrompt("New stone stock intake recorded for today!");
  };

  const handleLogWaste = async (
    stockIdOrData: any,
    wasteData?: any
  ) => {
    await api.logStockWaste(stockIdOrData, wasteData);
    await fetchAllData();
    triggerDailyClosingPrompt("Stone waste log recorded for today!");
  };

  const handleDeleteStockItem = async (id: string) => {
    await api.deleteStockItem(id);
    await fetchAllData();
  };

  // 5. Sales operations
  const handleAddSale = async (data: {
    sale_date: string;
    customer_name: string;
    customer_phone?: string;
    stock_item_id: string;
    quantity_sold: number;
    selling_price_per_unit: number;
    deposit_account_id?: string;
    payment_status?: "paid" | "partial" | "unpaid";
    amount_paid?: number;
    notes?: string;
  }) => {
    await api.createSale(data);
    await fetchAllData();
    triggerDailyClosingPrompt("Stone sale invoice recorded for today!", data.sale_date);
  };

  const handleDeleteSale = async (id: string) => {
    await api.deleteSale(id);
    await fetchAllData();
  };

  // 6. Expense operations
  const handleAddExpense = async (data: {
    date: string;
    category: string;
    amount: number;
    description: string;
    supplier_name: string;
    supplier_phone?: string;
    payment_method: string;
    account_id?: string;
    notes?: string;
  }) => {
    await api.createExpense(data);
    await fetchAllData();
    triggerDailyClosingPrompt("Factory operating expense recorded for today!", data.date);
  };

  const handleDeleteExpense = async (id: string) => {
    await api.deleteExpense(id);
    await fetchAllData();
  };

  // Navigation shortcuts
  const handleOpenSaleModal = () => {
    setActiveView("sales");
  };

  const handleOpenStockModal = () => {
    setActiveView("stock");
  };

  const handleOpenExpenseModal = () => {
    setActiveView("expenses");
  };

  const handleOpenShareholderModal = () => {
    setActiveView("shareholders");
  };

  const handleOpenWasteModal = () => {
    setActiveView("stock");
  };

  // If loading auth state
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-9 h-9 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-400 tracking-wider uppercase">
          Verifying Company Session...
        </p>
      </div>
    );
  }

  // If not logged in
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Fallback synthetic summary if not loaded yet
  const activeSummary: CompanyFinanceSummary = {
    totalShareholderCapital:
      companySummary?.totalShareholderCapital ??
      (shareholders || []).reduce((sum, s) => sum + s.contribution_amount, 0),
    shareholdersCount:
      companySummary?.shareholdersCount ?? (shareholders || []).length,
    totalStockValuation:
      companySummary?.totalStockValuation ??
      (stockItems || []).reduce((sum, s) => sum + s.stock_valuation, 0),
    totalAvailableTons:
      companySummary?.totalAvailableTons ??
      (stockItems || [])
        .filter((s) => s.unit === "ton")
        .reduce((sum, s) => sum + s.current_quantity, 0),
    totalAvailableSqm:
      companySummary?.totalAvailableSqm ??
      (stockItems || [])
        .filter((s) => s.unit === "meter")
        .reduce((sum, s) => sum + s.current_quantity, 0),
    totalWasteValuation:
      companySummary?.totalWasteValuation ??
      (stockWasteLogs || []).reduce((sum, w) => sum + w.waste_cost_valuation, 0),
    totalRevenue:
      companySummary?.totalRevenue ??
      (sales || []).reduce((sum, s) => sum + s.total_revenue, 0),
    totalCogs:
      companySummary?.totalCogs ??
      (sales || []).reduce((sum, s) => sum + s.cost_of_goods_sold, 0),
    grossProfit:
      companySummary?.grossProfit ??
      (sales || []).reduce((sum, s) => sum + (s.total_revenue - s.cost_of_goods_sold), 0),
    grossMarginPct: companySummary?.grossMarginPct ?? 0,
    totalOperatingExpenses:
      companySummary?.totalOperatingExpenses ??
      (expenses || []).reduce((sum, e) => sum + e.amount, 0),
    netProfitLoss: companySummary?.netProfitLoss ?? 0,
    netMarginPct: companySummary?.netMarginPct ?? 0,
    isProfit: companySummary?.isProfit ?? false,
    totalSoldTons:
      companySummary?.totalSoldTons ??
      (sales || [])
        .filter((s) => s.unit === "ton")
        .reduce((sum, s) => sum + s.quantity_sold, 0),
    totalSoldSqm:
      companySummary?.totalSoldSqm ??
      (sales || [])
        .filter((s) => s.unit === "meter")
        .reduce((sum, s) => sum + s.quantity_sold, 0),
    totalLiquidCashBank:
      companySummary?.totalLiquidCashBank ??
      (accounts || []).reduce((sum, a) => sum + a.current_balance, 0),
    recentSales: companySummary?.recentSales || (sales || []).slice(0, 10),
    recentExpenses: companySummary?.recentExpenses || (expenses || []).slice(0, 10),
    recentStock: companySummary?.recentStock || stockItems || [],
    stoneBreakdown: companySummary?.stoneBreakdown || [],
    expensesByCategory: companySummary?.expensesByCategory || [],
    shareholders: companySummary?.shareholders || shareholders || [],
    accounts: companySummary?.accounts || accounts || []
  };

  // Render view router based on activeView
  const renderCurrentView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            summary={activeSummary}
            currency={currency}
            onNavigate={(view) => setActiveView(view as ActiveView)}
            onOpenSaleModal={handleOpenSaleModal}
            onOpenStockModal={handleOpenStockModal}
            onOpenExpenseModal={handleOpenExpenseModal}
            onOpenShareholderModal={handleOpenShareholderModal}
            onOpenWasteModal={handleOpenWasteModal}
            onOpenDailyClosingModal={() => setIsDailyClosingModalOpen(true)}
          />
        );

      case "shareholders":
        return (
          <ShareholdersView
            shareholders={shareholders}
            totalCapital={activeSummary.totalShareholderCapital}
            accounts={accounts}
            currency={currency}
            onAddShareholder={handleAddShareholder}
            onUpdateShareholder={handleUpdateShareholder}
            onDeleteShareholder={handleDeleteShareholder}
          />
        );

      case "stock":
        return (
          <StockManagementView
            stockItems={stockItems}
            wasteLogs={stockWasteLogs}
            accounts={accounts}
            currency={currency}
            onAddStockItem={handleAddStockItem}
            onLogWaste={handleLogWaste}
            onDeleteStockItem={handleDeleteStockItem}
          />
        );

      case "sales":
        return (
          <SalesManagementView
            sales={sales}
            stockItems={stockItems}
            accounts={accounts}
            currency={currency}
            onAddSale={handleAddSale}
            onDeleteSale={handleDeleteSale}
          />
        );

      case "expenses":
        return (
          <ExpensesManagementView
            expenses={expenses}
            accounts={accounts}
            currency={currency}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );

      case "profit_loss":
        return <ProfitLossView summary={activeSummary} currency={currency} />;

      case "accounts":
        return (
          <AccountsView
            accounts={accounts}
            currency={currency}
            initialEnvironment="company"
            onOpenNewAccount={() => {
              setEditAccount(null);
              setIsAccountModalOpen(true);
            }}
            onEditAccount={(acc) => {
              setEditAccount(acc);
              setIsAccountModalOpen(true);
            }}
            onOpenTransactionForAccount={() => {
              setActiveView("all_transactions");
            }}
            onViewAccountLedger={() => {
              setActiveView("all_transactions");
            }}
            onRefresh={fetchAllData}
          />
        );

      case "credits":
        return (
          <CreditManagementView
            credits={credits}
            accounts={accounts}
            currency={currency}
            initialEnvironment="company"
            onOpenCreditModal={(env, dir) => {
              setInitialCreditDir(dir || "owed_to_me");
              setIsCreditModalOpen(true);
            }}
            onOpenPaymentModal={(credit) => setSelectedCreditForPayment(credit)}
            onRefresh={fetchAllData}
          />
        );

      case "cash_flow":
        return <CashFlowView currency={currency} initialEnvironment="company" />;

      case "all_transactions":
        return (
          <TransactionsView
            transactions={transactions}
            accounts={accounts}
            categories={categories}
            currency={currency}
            initialEnvironment="company"
            onOpenNewTransaction={() => {
              setEditTransaction(null);
              setIsTransactionModalOpen(true);
            }}
            onEditTransaction={(tx) => {
              setEditTransaction(tx);
              setIsTransactionModalOpen(true);
            }}
            onViewReceipt={(url, name) => {
              setReceiptUrl(url);
              setReceiptName(name);
            }}
            onRefresh={fetchAllData}
          />
        );

      case "audit_log":
        return <AuditLogView />;

      case "settings":
        return (
          <SettingsView
            companyName={companyName}
            setCompanyName={setCompanyName}
            currency={currency}
            setCurrency={setCurrency}
            onRefreshData={fetchAllData}
            onNavigateToAccounts={() => setActiveView("accounts")}
            onNavigateToCategories={() => setActiveView("dashboard")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Fixed Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
        companyName={companyName}
        onOpenDailyClosing={() => setIsDailyClosingModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Navigation */}
        <TopNav
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSaleModal={handleOpenSaleModal}
          onOpenStockModal={handleOpenStockModal}
          onOpenExpenseModal={handleOpenExpenseModal}
          onOpenDailyClosing={() => setIsDailyClosingModalOpen(true)}
          onOpenSettings={() => setActiveView("settings")}
          onLogout={handleLogout}
          currentUser={currentUser}
          alerts={dashboardData?.alerts || []}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (activeView !== "stock" && activeView !== "sales" && activeView !== "expenses") {
              // Can navigate or keep in current view
            }
          }}
          currency={currency}
          companyName={companyName}
          netProfitLoss={activeSummary.netProfitLoss}
        />

        {/* Security Warning Banner if default password is still used */}
        {currentUser?.is_default_password && !isWarningDismissed && (
          <SecurityWarningBanner
            onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
            onDismiss={() => setIsWarningDismissed(true)}
          />
        )}

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals for bank accounts & customer credits */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={() => {
          fetchAllData();
          triggerDailyClosingPrompt("Transaction recorded for today!");
        }}
        editTransaction={editTransaction}
        accounts={accounts}
        categories={categories}
        currency={currency}
        initialEnvironment="company"
        initialType="expense"
      />

      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        onSuccess={() => {
          fetchAllData();
          triggerDailyClosingPrompt("Credit agreement recorded for today!");
        }}
        accounts={accounts}
        currency={currency}
        initialEnvironment="company"
        initialDirection={initialCreditDir}
      />

      <CreditPaymentModal
        isOpen={!!selectedCreditForPayment}
        onClose={() => setSelectedCreditForPayment(null)}
        onSuccess={() => {
          fetchAllData();
          triggerDailyClosingPrompt("Credit settlement payment recorded for today!");
        }}
        credit={selectedCreditForPayment}
        accounts={accounts}
        currency={currency}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSuccess={fetchAllData}
        editAccount={editAccount}
        currency={currency}
        defaultEnvironment="company"
      />

      <ReceiptViewerModal
        isOpen={!!receiptUrl}
        onClose={() => {
          setReceiptUrl(null);
          setReceiptName(null);
        }}
        receiptUrl={receiptUrl}
        receiptName={receiptName}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccess={() => {
          setIsChangePasswordModalOpen(false);
          setIsWarningDismissed(true);
        }}
      />

      {/* Daily Closing & End-of-Day 24-Hour Excel Statement Modal */}
      <DailyClosingModal
        isOpen={isDailyClosingModalOpen}
        onClose={() => setIsDailyClosingModalOpen(false)}
        currency={currency}
      />

      {/* Global Real-Time Prompt Banner triggered after recording data */}
      {closingPrompt?.show && (
        <DailyClosingPromptBanner
          message={closingPrompt.message}
          date={closingPrompt.date}
          onOpenModal={() => setIsDailyClosingModalOpen(true)}
          onDismiss={() => setClosingPrompt(null)}
        />
      )}
    </div>
  );
}
