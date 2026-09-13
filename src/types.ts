export type EnvironmentType = 'personal' | 'company';

export type AccountType = 'cash' | 'bank' | 'mobile_money' | 'other';

export interface Account {
  id: string;
  environment: EnvironmentType;
  name: string;
  type: AccountType;
  opening_balance: number;
  current_balance: number;
  currency: string;
  status: 'active' | 'inactive';
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type TransactionType =
  | 'income'
  | 'expense'
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'credit_given'
  | 'credit_received'
  | 'credit_repayment'
  | 'owner_transfer'
  | 'other';

export interface Transaction {
  id: string;
  environment: EnvironmentType;
  type: TransactionType;
  account_id: string;
  account_name?: string;
  account_currency?: string;
  amount: number;
  date: string;
  time: string;
  category?: string | null;
  contact_person?: string | null;
  description?: string | null;
  reference_no?: string | null;
  attachment_url?: string | null;
  attachment_name?: string | null;
  notes?: string | null;
  status?: 'completed' | 'cleared' | 'pending';
  transfer_id?: string | null;
  credit_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Transfer {
  id: string;
  from_account_id: string;
  to_account_id: string;
  from_account_name?: string;
  to_account_name?: string;
  from_env?: EnvironmentType;
  to_env?: EnvironmentType;
  amount: number;
  date: string;
  time: string;
  reason?: string | null;
  notes?: string | null;
  transfer_type: 'same_environment' | 'personal_to_company' | 'company_to_personal';
  created_at?: string;
}

export type CreditDirection = 'owed_to_me' | 'i_owe';

export type CreditStatus = 'outstanding' | 'partially_paid' | 'paid' | 'overdue';

export interface CreditPayment {
  id: string;
  credit_id: string;
  account_id: string;
  account_name?: string;
  amount: number;
  date: string;
  reference_no?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface Credit {
  id: string;
  environment: EnvironmentType;
  direction: CreditDirection;
  contact_name: string;
  phone?: string | null;
  amount: number;
  amount_paid: number;
  remaining_balance: number;
  date: string;
  due_date?: string | null;
  status: CreditStatus;
  category?: string | null;
  notes?: string | null;
  account_id?: string | null;
  account_name?: string | null;
  payments?: CreditPayment[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  environment: 'personal' | 'company' | 'both';
  name: string;
  type: 'income' | 'expense' | 'other';
  icon?: string;
  color?: string;
  is_default?: number;
}

export interface DashboardAlert {
  type: string;
  title: string;
  message: string;
  severity: 'warning' | 'danger' | 'info';
}

export interface DashboardData {
  personal: {
    totalBalance: number;
    cashBalance: number;
    bankBalance: number;
    owedToMe: number;
    iOwe: number;
  };
  company: {
    totalBalance: number;
    cashBalance: number;
    bankBalance: number;
    receivables: number;
    payables: number;
  };
  combined: {
    totalLiquid: number;
    totalReceivables: number;
    totalPayables: number;
    netPosition: number;
  };
  monthPerformance: {
    month: string;
    income: number;
    expense: number;
    netCashFlow: number;
  };
  alerts: DashboardAlert[];
}

export interface CashFlowData {
  timeframe: string;
  startDate: string;
  endDate: string;
  summary: {
    totalMoneyIn: number;
    totalMoneyOut: number;
    netCashFlow: number;
    totalIncome: number;
    totalExpense: number;
    totalTransfers: number;
    creditsGiven: number;
    creditsCollected: number;
  };
  dailyTrend: Array<{ date: string; moneyIn: number; moneyOut: number }>;
  categoriesBreakdown: Array<{ category: string; amount: number }>;
  monthly?: Array<{ month: string; inflow: number; outflow: number; net: number }>;
  totals?: {
    inflows: number;
    outflows: number;
    net: number;
  };
  categories?: {
    inflows: Array<{ category: string; amount: number }>;
    outflows: Array<{ category: string; amount: number }>;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  user_id: string | null;
  username: string | null;
  description: string;
  timestamp: string;
  details?: string | null;
}

export interface SystemSettings {
  company_name: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  currency: string;
  currency_symbol: string;
  low_balance_alert: string;
  theme: string;
  date_format?: string;
  owner_name?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  full_name: string;
  email: string;
  is_default_password?: boolean;
}

// Company Shareholders
export interface Shareholder {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  contribution_amount: number;
  contribution_date: string;
  ownership_percentage?: number;
  computed_percentage?: number;
  account_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Stone Stock & Inventory
export type StockUnit = 'ton' | 'sqm' | 'linear_meter' | 'piece';

export interface StockItem {
  id: string;
  stone_type: string;
  batch_no?: string | null;
  unit: StockUnit;
  initial_quantity: number;
  available_quantity: number;
  quantity_sold: number;
  waste_quantity: number;
  purchase_cost: number;
  transport_cost: number;
  cutting_cost: number;
  handling_cost: number;
  other_expenses: number;
  cost_per_unit: number;
  total_cost: number;
  purchase_date: string;
  supplier_name?: string | null;
  supplier_phone?: string | null;
  account_id?: string | null;
  location?: string | null;
  notes?: string | null;
  current_valuation?: number;
  waste_valuation?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StockWasteLog {
  id: string;
  stock_id: string;
  stone_type: string;
  quantity: number;
  unit: string;
  reason: string;
  date: string;
  estimated_loss: number;
  notes?: string | null;
  created_at?: string;
}

// Sales & Revenue
export interface Sale {
  id: string;
  invoice_no: string;
  customer_name: string;
  customer_phone?: string | null;
  stock_id?: string | null;
  stone_type: string;
  unit: string;
  quantity_sold: number;
  selling_price_per_unit: number;
  total_revenue: number;
  cost_per_unit: number;
  total_cogs: number;
  gross_profit: number;
  sale_date: string;
  payment_method: string;
  payment_status: 'paid' | 'partial' | 'unpaid';
  account_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Company Operating Expenses
export interface CompanyExpense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  supplier_name: string;
  supplier_phone?: string | null;
  payment_method: string;
  account_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Company Executive Performance & Stock Summary
export interface CompanyFinanceSummary {
  totalRevenue: number;
  totalCogs: number;
  grossProfit: number;
  grossMarginPct: number;
  totalOperatingExpenses: number;
  netProfitLoss: number;
  netMarginPct: number;
  isProfit: boolean;
  totalStockValuation: number;
  totalWasteValuation: number;
  totalShareholderCapital: number;
  totalLiquidCashBank: number;
  totalAvailableTons: number;
  totalAvailableSqm: number;
  totalSoldTons: number;
  totalSoldSqm: number;
  shareholdersCount: number;
  shareholders: Shareholder[];
  accounts: Account[];
  stoneBreakdown: Array<{
    stone_type: string;
    unit: string;
    available: number;
    sold: number;
    waste: number;
    value: number;
  }>;
  expensesByCategory: Array<{
    category: string;
    amount: number;
  }>;
  recentSales: Sale[];
  recentStock: StockItem[];
  recentExpenses: CompanyExpense[];
}
