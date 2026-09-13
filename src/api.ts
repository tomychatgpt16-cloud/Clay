import {
  Account, Transaction, Transfer, Credit, CreditPayment, Category,
  DashboardData, CashFlowData, AuditLog, SystemSettings, AuthUser,
  Shareholder, StockItem, StockWasteLog, Sale, CompanyExpense, CompanyFinanceSummary
} from "./types";

const TOKEN_KEY = "pfin_auth_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const removeStoredToken = clearStoredToken;

export function getExportTransactionsUrl(params?: string | { environment?: string; accountId?: string }): string {
  const token = getStoredToken();
  let env = "";
  let acc = "";
  if (typeof params === "string") {
    if (params && params !== "all") env = `&environment=${params}`;
  } else if (params) {
    if (params.environment && params.environment !== "all") env = `&environment=${params.environment}`;
    if (params.accountId && params.accountId !== "all") acc = `&accountId=${params.accountId}`;
  }
  return `/api/export/excel?type=all_transactions${env}${acc}&token=${token || ""}`;
}

export function getBackupUrl(): string {
  const token = getStoredToken();
  return `/api/backup?token=${token || ""}`;
}

export function getDailyClosingExportUrl(date?: string): string {
  const token = getStoredToken();
  const dateParam = date ? `&date=${date}` : "";
  return `/api/export/daily-closing?token=${token || ""}${dateParam}`;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearStoredToken();
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Session expired or unauthorized. Please log in again.");
  }

  if (!response.ok) {
    let errMsg = "An error occurred";
    try {
      const errObj = await response.json();
      errMsg = errObj.error || errMsg;
    } catch {
      errMsg = response.statusText;
    }
    throw new Error(errMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    request<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    }),

  logout: () =>
    request<{ success: boolean }>("/api/auth/logout", { method: "POST" }),

  getMe: () =>
    request<{ user: AuthUser }>("/api/auth/me"),

  changePassword: (arg1: string | { currentPassword: string; newPassword: string }, arg2?: string) => {
    const payload = typeof arg1 === "string" ? { currentPassword: arg1, newPassword: arg2 || "" } : arg1;
    return request<{ success: boolean; message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  // Dashboard & Cash Flow
  getDashboard: () =>
    request<DashboardData>("/api/dashboard"),

  getCashFlow: (params?: string | { environment?: string; timeframe?: string; startDate?: string; endDate?: string }) => {
    const q = typeof params === "string" ? `environment=${params}` : new URLSearchParams(params as any).toString();
    return request<CashFlowData>(`/api/cash-flow?${q}`);
  },

  // Accounts
  getAccounts: (environment?: string) => {
    const q = environment ? `?environment=${environment}` : "";
    return request<Account[]>(`/api/accounts${q}`);
  },

  createAccount: (data: Partial<Account>) =>
    request<Account>("/api/accounts", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateAccount: (id: string, data: Partial<Account>) =>
    request<Account>(`/api/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  deleteAccount: (id: string) =>
    request<{ success: boolean }>(`/api/accounts/${id}`, { method: "DELETE" }),

  // Transactions
  getTransactions: (filters: {
    environment?: string;
    type?: string;
    account_id?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
  } = {}) => {
    const q = new URLSearchParams(filters as any).toString();
    return request<Transaction[]>(`/api/transactions?${q}`);
  },

  createTransaction: (data: Partial<Transaction>) =>
    request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateTransaction: (id: string, data: Partial<Transaction>) =>
    request<Transaction>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  deleteTransaction: (id: string) =>
    request<{ success: boolean }>(`/api/transactions/${id}`, { method: "DELETE" }),

  // Transfers
  getTransfers: () =>
    request<Transfer[]>("/api/transfers"),

  createTransfer: (data: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    date: string;
    time?: string;
    reason?: string;
    notes?: string;
  }) =>
    request<{ id: string; success: boolean; transferType: string }>("/api/transfers", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  deleteTransfer: (id: string) =>
    request<{ success: boolean }>(`/api/transfers/${id}`, { method: "DELETE" }),

  // Credits & Debts
  getCredits: (filters: { environment?: string; direction?: string; status?: string; search?: string } = {}) => {
    const q = new URLSearchParams(filters as any).toString();
    return request<Credit[]>(`/api/credits?${q}`);
  },

  getCreditById: (id: string) =>
    request<Credit>(`/api/credits/${id}`),

  getCreditPayments: (creditId: string) =>
    request<CreditPayment[]>(`/api/credits/${creditId}/payments`),

  createCredit: (data: any) =>
    request<Credit>("/api/credits", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  recordCreditPayment: (creditId: string, data: { account_id: string; amount: number; date: string; reference_no?: string; notes?: string }) =>
    request<Credit>(`/api/credits/${creditId}/payment`, {
      method: "POST",
      body: JSON.stringify(data)
    }),

  deleteCredit: (id: string) =>
    request<{ success: boolean }>(`/api/credits/${id}`, { method: "DELETE" }),

  // Categories
  getCategories: (environment?: string) => {
    const q = environment ? `?environment=${environment}` : "";
    return request<Category[]>(`/api/categories${q}`);
  },

  createCategory: (data: Partial<Category>) =>
    request<{ id: string; success: boolean }>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  deleteCategory: (id: string) =>
    request<{ success: boolean }>(`/api/categories/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () =>
    request<SystemSettings>("/api/settings"),

  updateSettings: (settings: Partial<SystemSettings>) =>
    request<SystemSettings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings)
    }),

  // Audit Logs
  getAuditLogs: (limit?: number) =>
    request<AuditLog[]>(`/api/audit-logs?limit=${limit || 100}`),

  // File Upload
  uploadAttachment: (fileName: string, base64Data: string) =>
    request<{ url: string; fileName: string; originalName: string }>("/api/upload", {
      method: "POST",
      body: JSON.stringify({ fileName, base64Data })
    }),

  // Database Backup / Restore
  downloadBackup: async () => {
    const token = getStoredToken();
    const res = await fetch("/api/backup/download", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  restoreBackup: (backupJson: any) =>
    request<{ success: boolean }>("/api/backup/restore", {
      method: "POST",
      body: JSON.stringify(backupJson)
    }),

  // Reset Financial Data to Zero
  resetData: () =>
    request<{ success: boolean; message: string }>("/api/settings/reset", {
      method: "POST"
    }),

  resetBalancesToZero: () =>
    request<{ success: boolean; message: string }>("/api/settings/reset-balances-zero", {
      method: "POST"
    }),

  // Shareholders & Capital
  getShareholders: () =>
    request<{ shareholders: Shareholder[]; totalCapital: number; shareholderCount: number }>("/api/shareholders"),

  createShareholder: (data: {
    name: string;
    phone?: string;
    email?: string;
    contribution_amount: number;
    contribution_date: string;
    account_id?: string;
    notes?: string;
  }) =>
    request<Shareholder>("/api/shareholders", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateShareholder: (id: string, data: Partial<Shareholder>) =>
    request<Shareholder>(`/api/shareholders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  deleteShareholder: (id: string) =>
    request<{ success: boolean }>(`/api/shareholders/${id}`, {
      method: "DELETE"
    }),

  // Stone Stock & Inventory
  getStockItems: () =>
    request<StockItem[]>("/api/stock"),

  getStockWasteLogs: () =>
    request<StockWasteLog[]>("/api/stock/waste-logs"),

  createStockItem: (data: {
    stone_type: string;
    batch_no?: string;
    batch_number?: string;
    unit: string;
    initial_quantity: number;
    purchase_cost?: number;
    purchase_cost_per_unit?: number;
    transport_cost?: number;
    cutting_cost?: number;
    handling_cost?: number;
    other_expenses?: number;
    purchase_date?: string;
    intake_date?: string;
    supplier_name?: string;
    supplier_phone?: string;
    account_id?: string;
    location?: string;
    notes?: string;
  }) => {
    const payload = {
      stone_type: data.stone_type,
      batch_no: data.batch_no || data.batch_number,
      unit: data.unit,
      initial_quantity: data.initial_quantity,
      purchase_cost: data.purchase_cost ?? data.purchase_cost_per_unit ?? 0,
      transport_cost: data.transport_cost || 0,
      cutting_cost: data.cutting_cost || 0,
      handling_cost: data.handling_cost || 0,
      other_expenses: data.other_expenses || 0,
      purchase_date: data.purchase_date || data.intake_date || new Date().toISOString().split("T")[0],
      supplier_name: data.supplier_name,
      supplier_phone: data.supplier_phone,
      account_id: data.account_id,
      location: data.location,
      notes: data.notes
    };
    return request<StockItem>("/api/stock", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  logStockWaste: (
    stockIdOrData:
      | string
      | {
          stock_item_id: string;
          waste_date?: string;
          waste_quantity: number;
          reason?: string;
          action_taken?: string;
        },
    data?: {
      quantity: number;
      reason: string;
      date?: string;
      notes?: string;
    }
  ) => {
    if (typeof stockIdOrData === "object") {
      const stockId = stockIdOrData.stock_item_id;
      const payload = {
        quantity: stockIdOrData.waste_quantity,
        reason: stockIdOrData.reason || "Cut damage / scrap",
        date: stockIdOrData.waste_date || new Date().toISOString().split("T")[0],
        notes: stockIdOrData.action_taken
      };
      return request<{
        success: boolean;
        wasteId: string;
        available_quantity: number;
        waste_quantity: number;
        estimated_loss: number;
      }>(`/api/stock/${stockId}/waste`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    return request<{
      success: boolean;
      wasteId: string;
      available_quantity: number;
      waste_quantity: number;
      estimated_loss: number;
    }>(`/api/stock/${stockIdOrData}/waste`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  deleteStockItem: (id: string) =>
    request<{ success: boolean }>(`/api/stock/${id}`, {
      method: "DELETE"
    }),

  // Sales & Revenue
  getSales: () =>
    request<Sale[]>("/api/sales"),

  createSale: (data: {
    customer_name: string;
    customer_phone?: string;
    stock_id?: string;
    stock_item_id?: string;
    stone_type?: string;
    unit?: string;
    quantity_sold: number;
    selling_price_per_unit: number;
    sale_date: string;
    payment_method?: string;
    deposit_account_id?: string;
    payment_status?: "paid" | "partial" | "unpaid";
    account_id?: string;
    amount_paid?: number;
    notes?: string;
  }) => {
    const payload = {
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      stock_id: data.stock_id || data.stock_item_id,
      stone_type: data.stone_type || "Stone",
      unit: data.unit || "ton",
      quantity_sold: data.quantity_sold,
      selling_price_per_unit: data.selling_price_per_unit,
      sale_date: data.sale_date,
      payment_method: data.payment_method || "Bank Transfer",
      payment_status: data.payment_status || "paid",
      account_id: data.account_id || data.deposit_account_id,
      notes: data.notes
    };
    return request<Sale>("/api/sales", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  deleteSale: (id: string) =>
    request<{ success: boolean }>(`/api/sales/${id}`, {
      method: "DELETE"
    }),

  // Company Operating Expenses
  getCompanyExpenses: () =>
    request<CompanyExpense[]>("/api/expenses"),

  getExpenses: () =>
    request<CompanyExpense[]>("/api/expenses"),

  createCompanyExpense: (data: {
    date: string;
    category: string;
    amount: number;
    description: string;
    supplier_name: string;
    supplier_phone?: string;
    payment_method: string;
    account_id?: string;
    notes?: string;
  }) =>
    request<CompanyExpense>("/api/expenses", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  createExpense: (data: {
    date: string;
    category: string;
    amount: number;
    description: string;
    supplier_name: string;
    supplier_phone?: string;
    payment_method: string;
    account_id?: string;
    notes?: string;
  }) =>
    request<CompanyExpense>("/api/expenses", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  deleteCompanyExpense: (id: string) =>
    request<{ success: boolean }>(`/api/expenses/${id}`, {
      method: "DELETE"
    }),

  deleteExpense: (id: string) =>
    request<{ success: boolean }>(`/api/expenses/${id}`, {
      method: "DELETE"
    }),

  // Company Executive Performance & Stock Summary
  getCompanySummary: () =>
    request<CompanyFinanceSummary>("/api/company/summary"),

  // Excel Export
  downloadExcel: async (type: string, params: Record<string, string> = {}) => {
    const token = getStoredToken();
    const q = new URLSearchParams({ type, ...params }).toString();
    const res = await fetch(`/api/export/excel?${q}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split("T")[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  // Daily Closing & End-of-Day 24-Hour Excel Statements
  getDailyClosingSummary: (date?: string) =>
    request<{ success: boolean; data: any }>(`/api/export/daily-summary?date=${date || ""}`),

  downloadDailyClosingExcel: async (date?: string) => {
    const token = getStoredToken();
    const targetDate = date || new Date().toISOString().split("T")[0];
    const res = await fetch(`/api/export/daily-closing?date=${targetDate}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error("Failed to download daily closing statement Excel");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clays_daily_closing_${targetDate}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};
