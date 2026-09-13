import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";
import { db, logAudit, recalculateAllBalances } from "./db";
import { getTransactions, getCredits, getAccounts, getCashFlowData } from "./finance";

export function generateExcelExport(type: "all_transactions" | "personal_transactions" | "company_transactions" | "credits" | "cash_flow" | "account_statement" | "financial_summary", options?: any) {
  const wb = XLSX.utils.book_new();

  if (type === "all_transactions" || type === "personal_transactions" || type === "company_transactions") {
    const env = type === "personal_transactions" ? "personal" : type === "company_transactions" ? "company" : "all";
    const txs = getTransactions({ environment: env });

    const rows = txs.map((t: any) => ({
      "ID": t.id,
      "Date": t.date,
      "Time": t.time,
      "Environment": t.environment.toUpperCase(),
      "Type": t.type.toUpperCase(),
      "Account": t.account_name,
      "Amount (ETB)": t.amount,
      "Category": t.category || "General",
      "Contact / Party": t.contact_person || "-",
      "Description": t.description || "-",
      "Reference No": t.reference_no || "-",
      "Notes": t.notes || "-"
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  } else if (type === "credits") {
    const credits = getCredits({ environment: options?.environment || "all" });

    const rows = credits.map((c: any) => ({
      "ID": c.id,
      "Environment": c.environment.toUpperCase(),
      "Direction": c.direction === "owed_to_me" ? "Receivable (Owed to Me)" : "Payable (I Owe)",
      "Contact Name": c.contact_name,
      "Phone": c.phone || "-",
      "Original Amount (ETB)": c.amount,
      "Amount Paid (ETB)": c.amount_paid,
      "Remaining Balance (ETB)": c.remaining_balance,
      "Issue Date": c.date,
      "Due Date": c.due_date || "No deadline",
      "Status": c.status.toUpperCase(),
      "Category": c.category || "General",
      "Notes": c.notes || "-"
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Credits & Debts");
  } else if (type === "cash_flow") {
    const cf = getCashFlowData({
      environment: options?.environment || "all",
      timeframe: options?.timeframe || "this_month"
    });

    const summaryRows = [
      { "Metric": "Total Money In", "Amount (ETB)": cf.summary.totalMoneyIn },
      { "Metric": "Total Money Out", "Amount (ETB)": cf.summary.totalMoneyOut },
      { "Metric": "Net Cash Flow", "Amount (ETB)": cf.summary.netCashFlow },
      { "Metric": "Operational Income", "Amount (ETB)": cf.summary.totalIncome },
      { "Metric": "Operational Expenses", "Amount (ETB)": cf.summary.totalExpense },
      { "Metric": "Credits Given", "Amount (ETB)": cf.summary.creditsGiven },
      { "Metric": "Credits Collected", "Amount (ETB)": cf.summary.creditsCollected }
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Cash Flow Summary");

    if (cf.categoriesBreakdown.length > 0) {
      const wsCat = XLSX.utils.json_to_sheet(cf.categoriesBreakdown.map(c => ({
        "Category": c.category,
        "Expense Amount (ETB)": c.amount
      })));
      XLSX.utils.book_append_sheet(wb, wsCat, "Spending Breakdown");
    }
  } else if (type === "account_statement") {
    const accountId = options?.accountId;
    const account = getAccounts().find((a: any) => a.id === accountId) as any;
    const txs = accountId ? getTransactions({ account_id: accountId }) : [];

    const wsAcc = XLSX.utils.json_to_sheet([
      { "Account Name": account?.name || "All Accounts", "Currency": account?.currency || "ETB", "Current Balance": account?.current_balance || 0 }
    ]);
    XLSX.utils.book_append_sheet(wb, wsAcc, "Account Details");

    const rows = txs.map((t: any) => ({
      "Date": t.date,
      "Type": t.type,
      "Amount (ETB)": t.amount,
      "Category": t.category || "-",
      "Party": t.contact_person || "-",
      "Description": t.description || "-",
      "Ref": t.reference_no || "-"
    }));
    const wsTxs = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, wsTxs, "Statement Ledger");
  } else {
    // Financial Summary
    const accounts = getAccounts() as any[];
    const rows = accounts.map(a => ({
      "Environment": a.environment.toUpperCase(),
      "Account": a.name,
      "Type": a.type.toUpperCase(),
      "Opening Balance (ETB)": a.opening_balance,
      "Current Balance (ETB)": a.current_balance,
      "Currency": a.currency,
      "Status": a.status
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Accounts Overview");
  }

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

export function createDatabaseBackup() {
  const dataDir = path.join(process.cwd(), "data");
  const dbPath = path.join(dataDir, "finance.db");

  // Perform checkpoint to ensure WAL file is flush
  db.pragma("wal_checkpoint(TRUNCATE)");

  // Dump database as JSON bundle for portable export/import
  const tables = ["users", "settings", "accounts", "categories", "contacts", "transactions", "transfers", "credits", "credit_payments", "audit_logs"];
  const exportData: Record<string, any[]> = {};

  for (const t of tables) {
    exportData[t] = db.prepare(`SELECT * FROM ${t}`).all();
  }

  return {
    version: "1.0",
    export_date: new Date().toISOString(),
    data: exportData
  };
}

export function restoreDatabaseBackup(backupJson: any, user: { id: string; username: string }) {
  if (!backupJson || !backupJson.data) {
    throw new Error("Invalid backup file structure");
  }

  const { data } = backupJson;
  const tables = ["settings", "accounts", "categories", "contacts", "transactions", "transfers", "credits", "credit_payments", "audit_logs"];

  // Execute restore within a single atomic transaction
  const restoreTransaction = db.transaction(() => {
    // Clear dynamic tables (preserve users to prevent lockout, or update if provided)
    for (const t of tables) {
      if (data[t]) {
        db.prepare(`DELETE FROM ${t}`).run();
        const rows = data[t];
        if (rows.length > 0) {
          const keys = Object.keys(rows[0]);
          const placeholders = keys.map(() => "?").join(", ");
          const insertStmt = db.prepare(`INSERT INTO ${t} (${keys.join(", ")}) VALUES (${placeholders})`);
          for (const row of rows) {
            insertStmt.run(keys.map(k => row[k]));
          }
        }
      }
    }
  });

  restoreTransaction();
  recalculateAllBalances();
  logAudit("BACKUP_RESTORE", user.id, user.username, "Restored database from uploaded backup bundle");

  return { success: true };
}

export function getDailyClosingSummaryData(targetDate?: string) {
  const date = targetDate || new Date().toISOString().split("T")[0];

  const sales = db.prepare(`
    SELECT s.*, a.name as account_name 
    FROM sales s 
    LEFT JOIN accounts a ON s.account_id = a.id 
    WHERE s.sale_date = ? 
    ORDER BY s.created_at ASC
  `).all(date) as any[];

  const expenses = db.prepare(`
    SELECT e.*, a.name as account_name 
    FROM company_expenses e 
    LEFT JOIN accounts a ON e.account_id = a.id 
    WHERE e.date = ? 
    ORDER BY e.created_at ASC
  `).all(date) as any[];

  const transactions = db.prepare(`
    SELECT t.*, a.name as account_name 
    FROM transactions t 
    LEFT JOIN accounts a ON t.account_id = a.id 
    WHERE t.date = ? 
    ORDER BY t.time ASC, t.created_at ASC
  `).all(date) as any[];

  const stockPurchases = db.prepare(`
    SELECT s.*, a.name as account_name 
    FROM stock_items s 
    LEFT JOIN accounts a ON s.account_id = a.id 
    WHERE s.purchase_date = ? 
    ORDER BY s.created_at ASC
  `).all(date) as any[];

  const stockWaste = db.prepare(`
    SELECT w.*, s.supplier_name 
    FROM stock_waste_logs w 
    LEFT JOIN stock_items s ON w.stock_id = s.id 
    WHERE w.date = ? 
    ORDER BY w.created_at ASC
  `).all(date) as any[];

  const shareholders = db.prepare(`
    SELECT sh.*, a.name as account_name 
    FROM shareholders sh 
    LEFT JOIN accounts a ON sh.account_id = a.id 
    WHERE sh.contribution_date = ? 
    ORDER BY sh.created_at ASC
  `).all(date) as any[];

  const accounts = db.prepare(`
    SELECT * FROM accounts ORDER BY environment ASC, name ASC
  `).all() as any[];

  const fullStock = db.prepare(`
    SELECT * FROM stock_items ORDER BY stone_type ASC, purchase_date DESC
  `).all() as any[];

  // Aggregations
  const totalSalesRevenue = sales.reduce((acc, s) => acc + Number(s.total_revenue || 0), 0);
  const totalSalesCOGS = sales.reduce((acc, s) => acc + Number(s.total_cogs || 0), 0);
  const totalGrossProfit = sales.reduce((acc, s) => acc + Number(s.gross_profit || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const netDailyOperatingProfit = totalGrossProfit - totalExpenses;

  // Cash flows from transactions
  let totalMoneyIn = 0;
  let totalMoneyOut = 0;
  for (const tx of transactions) {
    const amt = Number(tx.amount || 0);
    if (["income", "deposit", "credit_received"].includes(tx.type)) {
      totalMoneyIn += amt;
    } else if (["expense", "withdrawal", "credit_given"].includes(tx.type)) {
      totalMoneyOut += amt;
    } else if (tx.type === "credit_repayment") {
      if (amt >= 0) totalMoneyIn += amt;
      else totalMoneyOut += Math.abs(amt);
    } else if (tx.type === "transfer" || tx.type === "owner_transfer") {
      if (amt > 0) totalMoneyIn += amt;
      else if (amt < 0) totalMoneyOut += Math.abs(amt);
    }
  }

  const netCashFlow = totalMoneyIn - totalMoneyOut;
  const totalLiquidCash = accounts.reduce((acc, a) => acc + Number(a.current_balance || 0), 0);
  const totalStockValuation = fullStock.reduce((acc, s) => acc + (Number(s.available_quantity || 0) * Number(s.cost_per_unit || 0)), 0);

  return {
    date,
    sales,
    expenses,
    transactions,
    stockPurchases,
    stockWaste,
    shareholders,
    accounts,
    fullStock,
    summary: {
      salesCount: sales.length,
      totalSalesRevenue,
      totalSalesCOGS,
      totalGrossProfit,
      expensesCount: expenses.length,
      totalExpenses,
      netDailyOperatingProfit,
      transactionsCount: transactions.length,
      totalMoneyIn,
      totalMoneyOut,
      netCashFlow,
      totalLiquidCash,
      batchesAddedToday: stockPurchases.length,
      wasteLoggedCount: stockWaste.length,
      wasteEstimatedLoss: stockWaste.reduce((acc, w) => acc + Number(w.estimated_loss || 0), 0),
      totalStockValuation
    }
  };
}

export function generateDailyClosingExcelExport(targetDate?: string) {
  const data = getDailyClosingSummaryData(targetDate);
  const wb = XLSX.utils.book_new();

  // Sheet 1: Daily Closing Summary
  const summaryRows = [
    { "Report Item": "COMPANY NAME", "Details / Amount": "Clay’s Granite and Marble Manufacturing", "Unit / Currency": "" },
    { "Report Item": "REPORT TYPE", "Details / Amount": "End-of-Day (24-Hour) Financial & Stock Closing Statement", "Unit / Currency": "" },
    { "Report Item": "CLOSING DATE", "Details / Amount": data.date, "Unit / Currency": "YYYY-MM-DD" },
    { "Report Item": "GENERATED AT", "Details / Amount": new Date().toISOString(), "Unit / Currency": "UTC" },
    { "Report Item": "----------------------------", "Details / Amount": "----------------------------", "Unit / Currency": "----" },
    { "Report Item": "TODAY'S OPERATIONAL METRICS", "Details / Amount": "", "Unit / Currency": "" },
    { "Report Item": "Total Sales Invoices Issued", "Details / Amount": data.summary.salesCount, "Unit / Currency": "Invoices" },
    { "Report Item": "Gross Sales Revenue", "Details / Amount": data.summary.totalSalesRevenue, "Unit / Currency": "ETB" },
    { "Report Item": "Cost of Goods Sold (COGS)", "Details / Amount": data.summary.totalSalesCOGS, "Unit / Currency": "ETB" },
    { "Report Item": "Gross Profit from Sales", "Details / Amount": data.summary.totalGrossProfit, "Unit / Currency": "ETB" },
    { "Report Item": "Total Operating Expenses", "Details / Amount": data.summary.totalExpenses, "Unit / Currency": "ETB" },
    { "Report Item": "Net Operating Margin (Gross Profit - Expenses)", "Details / Amount": data.summary.netDailyOperatingProfit, "Unit / Currency": "ETB" },
    { "Report Item": "----------------------------", "Details / Amount": "----------------------------", "Unit / Currency": "----" },
    { "Report Item": "TODAY'S CASH FLOW MOVEMENTS", "Details / Amount": "", "Unit / Currency": "" },
    { "Report Item": "Total Transactions Recorded Today", "Details / Amount": data.summary.transactionsCount, "Unit / Currency": "Records" },
    { "Report Item": "Total Money Inflow Recorded", "Details / Amount": data.summary.totalMoneyIn, "Unit / Currency": "ETB" },
    { "Report Item": "Total Money Outflow Recorded", "Details / Amount": data.summary.totalMoneyOut, "Unit / Currency": "ETB" },
    { "Report Item": "Net Daily Cash Flow", "Details / Amount": data.summary.netCashFlow, "Unit / Currency": "ETB" },
    { "Report Item": "----------------------------", "Details / Amount": "----------------------------", "Unit / Currency": "----" },
    { "Report Item": "TODAY'S STONE INVENTORY ACTIVITY", "Details / Amount": "", "Unit / Currency": "" },
    { "Report Item": "New Stock Batches Added Today", "Details / Amount": data.summary.batchesAddedToday, "Unit / Currency": "Batches" },
    { "Report Item": "Waste / Breakage Logs Recorded", "Details / Amount": data.summary.wasteLoggedCount, "Unit / Currency": "Incidents" },
    { "Report Item": "Estimated Loss from Waste / Breakage", "Details / Amount": data.summary.wasteEstimatedLoss, "Unit / Currency": "ETB" },
    { "Report Item": "Total Factory Stock Valuation", "Details / Amount": data.summary.totalStockValuation, "Unit / Currency": "ETB" },
    { "Report Item": "----------------------------", "Details / Amount": "----------------------------", "Unit / Currency": "----" },
    { "Report Item": "CLOSING LIQUIDITY POSITION", "Details / Amount": data.summary.totalLiquidCash, "Unit / Currency": "ETB" }
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary["!cols"] = [{ wch: 45 }, { wch: 35 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Daily Closing Summary");

  // Sheet 2: Account Balances at End of Day
  const accountRows = data.accounts.map(a => ({
    "Account Name": a.name,
    "Environment": a.environment.toUpperCase(),
    "Account Type": a.type.toUpperCase(),
    "Opening Balance (ETB)": a.opening_balance,
    "Closing Balance (ETB)": a.current_balance,
    "Currency": a.currency,
    "Status": a.status,
    "Notes": a.notes || ""
  }));
  const wsAccounts = XLSX.utils.json_to_sheet(accountRows.length > 0 ? accountRows : [{ "Status": "No accounts found" }]);
  wsAccounts["!cols"] = [{ wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 22 }, { wch: 22 }, { wch: 10 }, { wch: 10 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsAccounts, "Account Balances");

  // Sheet 3: Sales Invoices Today
  const salesRows = data.sales.map(s => ({
    "Invoice No": s.invoice_no,
    "Customer Name": s.customer_name,
    "Customer Phone": s.customer_phone || "-",
    "Stone Type": s.stone_type,
    "Quantity Sold": s.quantity_sold,
    "Unit": s.unit,
    "Price / Unit (ETB)": s.selling_price_per_unit,
    "Total Revenue (ETB)": s.total_revenue,
    "COGS (ETB)": s.total_cogs,
    "Gross Profit (ETB)": s.gross_profit,
    "Payment Method": s.payment_method,
    "Payment Status": (s.payment_status || "PAID").toUpperCase(),
    "Account Deposited": s.account_name || "-",
    "Sale Date": s.sale_date,
    "Notes": s.notes || "-"
  }));
  const wsSales = XLSX.utils.json_to_sheet(salesRows.length > 0 ? salesRows : [{ "Status": "No sales recorded for this date" }]);
  wsSales["!cols"] = [{ wch: 18 }, { wch: 25 }, { wch: 16 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 18 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 16 }, { wch: 15 }, { wch: 30 }, { wch: 14 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsSales, "Today's Sales");

  // Sheet 4: Expenses Today
  const expenseRows = data.expenses.map(e => ({
    "Expense ID": e.id,
    "Category": e.category,
    "Supplier / Payee": e.supplier_name || "-",
    "Supplier Phone": e.supplier_phone || "-",
    "Description": e.description,
    "Amount (ETB)": e.amount,
    "Payment Method": e.payment_method,
    "Paid From Account": e.account_name || "-",
    "Date": e.date,
    "Notes": e.notes || "-"
  }));
  const wsExpenses = XLSX.utils.json_to_sheet(expenseRows.length > 0 ? expenseRows : [{ "Status": "No expenses recorded for this date" }]);
  wsExpenses["!cols"] = [{ wch: 22 }, { wch: 25 }, { wch: 25 }, { wch: 16 }, { wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 30 }, { wch: 14 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsExpenses, "Today's Expenses");

  // Sheet 5: Cash Transactions Ledger Today
  const txRows = data.transactions.map(t => ({
    "Time": t.time,
    "Type": t.type.toUpperCase(),
    "Account": t.account_name || "-",
    "Contact / Party": t.contact_person || "-",
    "Category": t.category || "General",
    "Amount (ETB)": t.amount,
    "Reference No": t.reference_no || "-",
    "Description": t.description || "-",
    "Date": t.date,
    "Notes": t.notes || "-"
  }));
  const wsTxs = XLSX.utils.json_to_sheet(txRows.length > 0 ? txRows : [{ "Status": "No cash ledger transactions for this date" }]);
  wsTxs["!cols"] = [{ wch: 10 }, { wch: 16 }, { wch: 30 }, { wch: 22 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 35 }, { wch: 14 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsTxs, "Today's Cash Ledger");

  // Sheet 6: Stock Movements Today
  const stockMoveRows = [
    ...data.stockPurchases.map(p => ({
      "Activity": "NEW STOCK BATCH",
      "Stone Type": p.stone_type,
      "Quantity": p.initial_quantity,
      "Unit": p.unit,
      "Cost / Unit (ETB)": p.cost_per_unit,
      "Total Cost (ETB)": p.total_purchase_cost,
      "Quarry / Supplier": p.supplier_name || "-",
      "Location": p.location || "-",
      "Date": p.purchase_date,
      "Notes": p.notes || "-"
    })),
    ...data.stockWaste.map(w => ({
      "Activity": "WASTE / DAMAGE LOG",
      "Stone Type": w.stone_type,
      "Quantity": w.quantity,
      "Unit": w.unit,
      "Cost / Unit (ETB)": 0,
      "Total Cost (ETB)": w.estimated_loss,
      "Quarry / Supplier": w.supplier_name || "-",
      "Location": w.reason || "-",
      "Date": w.date,
      "Notes": w.notes || "-"
    }))
  ];
  const wsStock = XLSX.utils.json_to_sheet(stockMoveRows.length > 0 ? stockMoveRows : [{ "Status": "No stock movements recorded for this date" }]);
  wsStock["!cols"] = [{ wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 20 }, { wch: 14 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsStock, "Today's Stock Movements");

  // Sheet 7: Factory Stock Inventory Snapshot
  const inventoryRows = data.fullStock.map(s => ({
    "Stone Type": s.stone_type,
    "Quarry / Supplier": s.supplier_name || "-",
    "Available Stock": s.available_quantity,
    "Sold to Date": s.quantity_sold,
    "Unit": s.unit,
    "Cost / Unit (ETB)": s.cost_per_unit,
    "Selling Price / Unit (ETB)": s.selling_price_per_unit,
    "Current Valuation (ETB)": Math.round(Number(s.available_quantity || 0) * Number(s.cost_per_unit || 0) * 100) / 100,
    "Stock Status": s.available_quantity <= (s.minimum_stock_level || 5) ? "LOW STOCK" : "IN STOCK",
    "Location": s.location || "-"
  }));
  const wsInv = XLSX.utils.json_to_sheet(inventoryRows.length > 0 ? inventoryRows : [{ "Status": "Inventory is currently empty (awaiting live refilling)" }]);
  wsInv["!cols"] = [{ wch: 25 }, { wch: 25 }, { wch: 16 }, { wch: 15 }, { wch: 10 }, { wch: 18 }, { wch: 22 }, { wch: 22 }, { wch: 14 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsInv, "Closing Stock Inventory");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}
