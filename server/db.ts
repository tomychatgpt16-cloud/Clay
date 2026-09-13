import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, "finance.db");
export const db = new Database(dbPath);

// Enable foreign keys and WAL mode for reliability and performance
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      environment TEXT NOT NULL CHECK(environment IN ('personal', 'company')),
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('cash', 'bank', 'mobile_money', 'other')),
      opening_balance REAL NOT NULL DEFAULT 0.00,
      current_balance REAL NOT NULL DEFAULT 0.00,
      currency TEXT NOT NULL DEFAULT 'ETB',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      environment TEXT NOT NULL CHECK(environment IN ('personal', 'company', 'both')),
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense', 'other')),
      icon TEXT DEFAULT 'tag',
      color TEXT DEFAULT '#4f46e5',
      is_default INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      environment TEXT NOT NULL CHECK(environment IN ('personal', 'company')),
      type TEXT NOT NULL CHECK(type IN ('customer', 'supplier', 'personal_contact', 'other')),
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      environment TEXT NOT NULL CHECK(environment IN ('personal', 'company')),
      type TEXT NOT NULL CHECK(type IN ('income', 'expense', 'deposit', 'withdrawal', 'transfer', 'credit_given', 'credit_received', 'credit_repayment', 'owner_transfer', 'other')),
      account_id TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      category TEXT,
      contact_person TEXT,
      description TEXT,
      reference_no TEXT,
      attachment_url TEXT,
      attachment_name TEXT,
      notes TEXT,
      transfer_id TEXT,
      credit_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transfers (
      id TEXT PRIMARY KEY,
      from_account_id TEXT NOT NULL,
      to_account_id TEXT NOT NULL,
      from_environment TEXT NOT NULL,
      to_environment TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      reason TEXT,
      notes TEXT,
      transfer_type TEXT NOT NULL DEFAULT 'same_environment' CHECK(transfer_type IN ('same_environment', 'personal_to_company', 'company_to_personal')),
      from_transaction_id TEXT,
      to_transaction_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (from_account_id) REFERENCES accounts(id),
      FOREIGN KEY (to_account_id) REFERENCES accounts(id)
    );

    CREATE TABLE IF NOT EXISTS credits (
      id TEXT PRIMARY KEY,
      environment TEXT NOT NULL CHECK(environment IN ('personal', 'company')),
      direction TEXT NOT NULL CHECK(direction IN ('owed_to_me', 'i_owe')),
      contact_name TEXT NOT NULL,
      phone TEXT,
      amount REAL NOT NULL,
      amount_paid REAL NOT NULL DEFAULT 0.00,
      remaining_balance REAL NOT NULL,
      date TEXT NOT NULL,
      due_date TEXT,
      status TEXT NOT NULL CHECK(status IN ('outstanding', 'partially_paid', 'paid', 'overdue')),
      category TEXT,
      notes TEXT,
      account_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS credit_payments (
      id TEXT PRIMARY KEY,
      credit_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      reference_no TEXT,
      notes TEXT,
      transaction_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (credit_id) REFERENCES credits(id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      user_id TEXT,
      username TEXT,
      description TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS shareholders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      contribution_amount REAL NOT NULL DEFAULT 0.00,
      contribution_date TEXT NOT NULL,
      ownership_percentage REAL DEFAULT 0.00,
      account_id TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stock_items (
      id TEXT PRIMARY KEY,
      stone_type TEXT NOT NULL,
      batch_no TEXT,
      unit TEXT NOT NULL CHECK(unit IN ('ton', 'sqm', 'linear_meter', 'piece')),
      initial_quantity REAL NOT NULL,
      available_quantity REAL NOT NULL,
      quantity_sold REAL NOT NULL DEFAULT 0.00,
      waste_quantity REAL NOT NULL DEFAULT 0.00,
      purchase_cost REAL NOT NULL DEFAULT 0.00,
      transport_cost REAL NOT NULL DEFAULT 0.00,
      cutting_cost REAL NOT NULL DEFAULT 0.00,
      handling_cost REAL NOT NULL DEFAULT 0.00,
      other_expenses REAL NOT NULL DEFAULT 0.00,
      cost_per_unit REAL NOT NULL DEFAULT 0.00,
      total_cost REAL NOT NULL DEFAULT 0.00,
      purchase_date TEXT NOT NULL,
      supplier_name TEXT,
      supplier_phone TEXT,
      account_id TEXT,
      location TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stock_waste_logs (
      id TEXT PRIMARY KEY,
      stock_id TEXT NOT NULL,
      stone_type TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      reason TEXT NOT NULL,
      date TEXT NOT NULL,
      estimated_loss REAL NOT NULL DEFAULT 0.00,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (stock_id) REFERENCES stock_items(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      invoice_no TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      stock_id TEXT,
      stone_type TEXT NOT NULL,
      unit TEXT NOT NULL,
      quantity_sold REAL NOT NULL,
      selling_price_per_unit REAL NOT NULL,
      total_revenue REAL NOT NULL,
      cost_per_unit REAL NOT NULL DEFAULT 0.00,
      total_cogs REAL NOT NULL DEFAULT 0.00,
      gross_profit REAL NOT NULL DEFAULT 0.00,
      sale_date TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'paid' CHECK(payment_status IN ('paid', 'partial', 'unpaid')),
      account_id TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS company_expenses (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT NOT NULL,
      supplier_name TEXT NOT NULL,
      supplier_phone TEXT,
      payment_method TEXT NOT NULL,
      account_id TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  seedInitialData();

  // Ensure any previous sample records or personal accounts are transitioned to pure company state
  const personalAccounts = db.prepare("SELECT COUNT(*) as count FROM accounts WHERE environment = 'personal'").get() as any;
  const demoCredits = db.prepare("SELECT COUNT(*) as count FROM credits WHERE id IN ('crd_p_01', 'crd_c_01')").get() as any;
  if (personalAccounts?.count > 0 || demoCredits?.count > 0) {
    resetFinancialDataToZero();
  }
}

export function resetFinancialDataToZero() {
  // Clear all transactions, transfers, credits, payments, contacts, stock, sales, expenses, shareholders
  db.prepare("DELETE FROM sales").run();
  db.prepare("DELETE FROM stock_waste_logs").run();
  db.prepare("DELETE FROM stock_items").run();
  db.prepare("DELETE FROM company_expenses").run();
  db.prepare("DELETE FROM shareholders").run();
  db.prepare("DELETE FROM transactions").run();
  db.prepare("DELETE FROM transfers").run();
  db.prepare("DELETE FROM credit_payments").run();
  db.prepare("DELETE FROM credits").run();
  db.prepare("DELETE FROM contacts").run();
  db.prepare("DELETE FROM audit_logs").run();

  // Reset accounts to clean 0.00 ETB state - COMPANY ONLY
  db.prepare("DELETE FROM accounts").run();
  const now = new Date().toISOString();
  const insertAccount = db.prepare(`
    INSERT INTO accounts (id, environment, name, type, opening_balance, current_balance, currency, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, 0.00, 0.00, 'ETB', 'active', ?, ?, ?)
  `);

  // Solely Company Accounts (0 ETB)
  insertAccount.run("acc_c_cash", "company", "Company Cash Drawer & Petty Cash", "cash", "Company office and factory petty cash drawer", now, now);
  insertAccount.run("acc_c_cbe", "company", "Commercial Bank of Ethiopia (CBE)", "bank", "Primary commercial operating bank account", now, now);
  insertAccount.run("acc_c_awash", "company", "Awash Bank Business Account", "bank", "Secondary corporate checking account", now, now);
  insertAccount.run("acc_c_telebirr", "company", "Telebirr Merchant / Business", "mobile_money", "Company digital merchant payment account", now, now);

  // Set / update admin user with hashed 082012 password
  const existingAdmin = db.prepare("SELECT * FROM users WHERE username = 'admin'").get() as any;
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync("082012", salt);
    db.prepare(`
      INSERT INTO users (id, username, password_hash, full_name, email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run("usr_admin_01", "admin", passwordHash, "System Administrator", "admin@claysgranite.com", now, now);
  }

  // Ensure default categories exist
  seedCategories();

  // Settings
  const defaultSettings: Record<string, string> = {
    company_name: "Clay’s Granite and Marble Manufacturing",
    company_email: "office@claysgranite.com",
    company_phone: "+251 91 123 4567",
    company_address: "Addis Ababa, Ethiopia",
    currency: "ETB",
    currency_symbol: "ETB",
    low_balance_alert: "0",
    theme: "light",
    date_format: "YYYY-MM-DD",
    owner_name: "Administrator"
  };

  const insertSetting = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
  for (const [k, v] of Object.entries(defaultSettings)) {
    insertSetting.run(k, v);
  }

  logAudit("SYSTEM_INIT", "usr_admin_01", "admin", "Initialized company stock and financial management system (0 ETB balances)");
}

export function resetBalancesToZeroPreservingMasterData() {
  // Clear operational tables: transactions, transfers, credits, payments, sales, stock, expenses, waste logs
  db.prepare("DELETE FROM sales").run();
  db.prepare("DELETE FROM stock_waste_logs").run();
  db.prepare("DELETE FROM stock_items").run();
  db.prepare("DELETE FROM company_expenses").run();
  db.prepare("DELETE FROM transactions").run();
  db.prepare("DELETE FROM transfers").run();
  db.prepare("DELETE FROM credit_payments").run();
  db.prepare("DELETE FROM credits").run();

  // Reset accounts to 0.00 ETB
  db.prepare("UPDATE accounts SET opening_balance = 0.00, current_balance = 0.00, updated_at = ?").run(new Date().toISOString());

  // Keep shareholders intact, unlink account_id so ledger reflects 0 balance
  db.prepare("UPDATE shareholders SET account_id = NULL").run();

  logAudit("RESET_BALANCES_ZERO", "usr_admin_01", "admin", "Reset all operational balances to zero while keeping shareholders and accounts");
}

function seedCategories() {
  db.prepare("DELETE FROM categories").run();
  const insertCat = db.prepare(`
    INSERT INTO categories (id, environment, name, type, icon, color, is_default)
    VALUES (?, 'company', ?, ?, ?, ?, 1)
  `);

  // Company revenue categories
  insertCat.run("cat_c_inc_sales", "Granite & Marble Sales", "income", "layers", "#10b981");
  insertCat.run("cat_c_inc_inst", "Installation Services", "income", "hammer", "#059669");
  insertCat.run("cat_c_inc_proj", "Architectural Contracts", "income", "building", "#047857");
  insertCat.run("cat_c_inc_scrap", "Scrap & Waste Stone Sales", "income", "recycle", "#0d9488");
  insertCat.run("cat_c_inc_oth", "Other Business Revenue", "income", "plus-circle", "#0f766e");

  // Company expense categories
  insertCat.run("cat_c_exp_mat", "Raw Stone & Block Purchases", "expense", "box", "#ef4444");
  insertCat.run("cat_c_exp_tools", "Diamond Tools & Saw Blades", "expense", "tool", "#dc2626");
  insertCat.run("cat_c_exp_abrasives", "Abrasives & Polishing Supplies", "expense", "disc", "#ea580c");
  insertCat.run("cat_c_exp_sal", "Employee Salaries & Labor Wages", "expense", "users", "#e11d48");
  insertCat.run("cat_c_exp_trans", "Freight, Transport & Logistics", "expense", "truck", "#f97316");
  insertCat.run("cat_c_exp_rent", "Workshop & Showroom Rent", "expense", "warehouse", "#b91c1c");
  insertCat.run("cat_c_exp_util", "Factory Power & 3-Phase Electricity", "expense", "zap", "#d97706");
  insertCat.run("cat_c_exp_water", "Industrial Water & Slurry Mgt", "expense", "droplet", "#0284c7");
  insertCat.run("cat_c_exp_fuel", "Diesel & Generator Fuel", "expense", "flame", "#ca8a04");
  insertCat.run("cat_c_exp_eq", "Machinery Maintenance & Spares", "expense", "wrench", "#7c3aed");
  insertCat.run("cat_c_exp_tax", "Taxes & Government Fees", "expense", "file-text", "#4b5563");
  insertCat.run("cat_c_exp_supp", "Supplier & Vendor Payments", "expense", "credit-card", "#be123c");
  insertCat.run("cat_c_exp_mkt", "Marketing & Showroom Promo", "expense", "megaphone", "#2563eb");
}

function seedInitialData() {
  const countAccounts = db.prepare("SELECT COUNT(*) as count FROM accounts").get() as { count: number };
  if (countAccounts.count === 0) {
    resetFinancialDataToZero();
  } else {
    const existingAdmin = db.prepare("SELECT * FROM users WHERE username = 'admin'").get() as any;
    if (!existingAdmin) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync("082012", salt);
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO users (id, username, password_hash, full_name, email, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run("usr_admin_01", "admin", passwordHash, "System Administrator", "admin@privatefinance.local", now, now);
    }
  }
}

export function logAudit(action: string, userId: string | null, username: string | null, description: string, details?: any) {
  try {
    const id = "aud_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const timestamp = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_logs (id, action, user_id, username, description, timestamp, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, action, userId || "system", username || "system", description, timestamp, details ? JSON.stringify(details) : null);
  } catch (err) {
    console.error("Audit log error:", err);
  }
}

export function recalculateAllBalances() {
  const accounts = db.prepare("SELECT * FROM accounts").all() as any[];
  for (const acc of accounts) {
    // calculate balance
    let balance = Number(acc.opening_balance || 0);

    // transactions on this account
    const txs = db.prepare("SELECT * FROM transactions WHERE account_id = ?").all(acc.id) as any[];
    for (const tx of txs) {
      const amt = Number(tx.amount || 0);
      switch (tx.type) {
        case "income":
        case "deposit":
          balance += amt;
          break;
        case "expense":
        case "withdrawal":
          balance -= amt;
          break;
        case "transfer":
        case "owner_transfer":
          // If transfer: check if it's incoming or outgoing based on amount sign or description
          // In our model: outgoing is stored with negative sign or withdrawal; incoming with positive sign
          balance += amt;
          break;
        case "credit_received": // borrowed money entering the account
          balance += amt;
          break;
        case "credit_given": // loaned money leaving the account
          balance -= amt;
          break;
        case "credit_repayment":
          // Repayment can be incoming (if collected from customer) or outgoing (if paid to supplier)
          balance += amt;
          break;
        default:
          balance += amt;
          break;
      }
    }

    // Keep 2 decimal places precision
    balance = Math.round(balance * 100) / 100;
    db.prepare("UPDATE accounts SET current_balance = ?, updated_at = ? WHERE id = ?").run(
      balance,
      new Date().toISOString(),
      acc.id
    );
  }
}

function recordTransactionHelper(tx: {
  environment: "personal" | "company";
  type: string;
  account_id: string;
  amount: number;
  date: string;
  time: string;
  category?: string;
  contact_person?: string;
  description?: string;
  reference_no?: string;
}) {
  const id = "tx_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO transactions (id, environment, type, account_id, amount, date, time, category, contact_person, description, reference_no, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    tx.environment,
    tx.type,
    tx.account_id,
    tx.amount,
    tx.date,
    tx.time,
    tx.category || null,
    tx.contact_person || null,
    tx.description || null,
    tx.reference_no || null,
    null,
    now,
    now
  );
  return id;
}
