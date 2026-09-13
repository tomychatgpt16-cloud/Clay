import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initDatabase, resetFinancialDataToZero, resetBalancesToZeroPreservingMasterData } from "./server/db";
import {
  login, logout, changePassword, requireAuth, AuthenticatedRequest
} from "./server/auth";
import {
  getAccounts, getAccountById, createAccount, updateAccount, deleteAccount,
  getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction,
  getTransfers, createTransfer, deleteTransfer,
  getCredits, getCreditById, getCreditPayments, createCredit, recordCreditPayment, deleteCredit,
  getDashboardOverview, getCashFlowData,
  getCategories, createCategory, deleteCategory,
  getSettings, updateSettings, getAuditLogs,
  getShareholders, createShareholder, updateShareholder, deleteShareholder,
  getStockItems, getStockItemById, createStockItem, logStockWaste, getStockWasteLogs, deleteStockItem,
  getSales, createSale, deleteSale,
  getCompanyExpenses, createCompanyExpense, deleteCompanyExpense,
  getCompanyExecutiveSummary
} from "./server/finance";
import {
  generateExcelExport,
  generateDailyClosingExcelExport,
  getDailyClosingSummaryData,
  createDatabaseBackup,
  restoreDatabaseBackup
} from "./server/export";

async function startServer() {
  // Initialize Database & seed data
  initDatabase();

  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Uploads directory
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // Health check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // --- AUTH ROUTES ---
  app.post("/api/auth/login", (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const clientIp = req.headers["x-forwarded-for"] as string || req.socket.remoteAddress;
      const result = login(username, password, clientIp);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message || "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "") || "";
      logout(token);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/auth/me", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/change-password", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      changePassword(req.user!.id, currentPassword, newPassword);
      res.json({ success: true, message: "Password updated successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- DASHBOARD & CASH FLOW ---
  app.get("/api/dashboard", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const data = getDashboardOverview();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/cash-flow", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { environment, timeframe, startDate, endDate } = req.query;
      const data = getCashFlowData({
        environment: environment as any,
        timeframe: timeframe as any,
        startDate: startDate as string,
        endDate: endDate as string
      });
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- ACCOUNTS ---
  app.get("/api/accounts", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const env = req.query.environment as "personal" | "company" | undefined;
      const accounts = getAccounts(env);
      res.json(accounts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/accounts", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const account = createAccount(req.body, req.user!);
      res.json(account);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/accounts/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updated = updateAccount(req.params.id, req.body, req.user!);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/accounts/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteAccount(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- TRANSACTIONS ---
  app.get("/api/transactions", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const txs = getTransactions({
        environment: req.query.environment as any,
        type: req.query.type as any,
        account_id: req.query.account_id as any,
        category: req.query.category as any,
        startDate: req.query.startDate as any,
        endDate: req.query.endDate as any,
        search: req.query.search as any,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined
      });
      res.json(txs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/transactions/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const tx = getTransactionById(req.params.id);
      if (!tx) return res.status(404).json({ error: "Transaction not found" });
      res.json(tx);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/transactions", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const tx = createTransaction(req.body, req.user!);
      res.json(tx);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/transactions/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updated = updateTransaction(req.params.id, req.body, req.user!);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/transactions/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteTransaction(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- TRANSFERS ---
  app.get("/api/transfers", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const transfers = getTransfers();
      res.json(transfers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/transfers", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = createTransfer(req.body, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/transfers/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteTransfer(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- CREDITS & DEBTS ---
  app.get("/api/credits", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const credits = getCredits({
        environment: req.query.environment as any,
        direction: req.query.direction as any,
        status: req.query.status as any,
        search: req.query.search as any
      });
      res.json(credits);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/credits/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const credit = getCreditById(req.params.id);
      if (!credit) return res.status(404).json({ error: "Credit not found" });
      res.json(credit);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/credits/:id/payments", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const payments = getCreditPayments(req.params.id);
      res.json(payments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/credits", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const credit = createCredit(req.body, req.user!);
      res.json(credit);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/credits/:id/payment", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updated = recordCreditPayment(req.params.id, req.body, req.user!);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/credits/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteCredit(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- CATEGORIES ---
  app.get("/api/categories", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const cats = getCategories(req.query.environment as string);
      res.json(cats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/categories", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = createCategory(req.body, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/categories/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteCategory(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- SETTINGS ---
  app.get("/api/settings", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json(getSettings());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/settings", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updated = updateSettings(req.body, req.user!);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/settings/reset", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      resetFinancialDataToZero();
      res.json({ success: true, message: "System financial data completely reset to zero" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/settings/reset-balances-zero", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      resetBalancesToZeroPreservingMasterData();
      res.json({ success: true, message: "All account balances reset to zero while preserving shareholders and accounts" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- SHAREHOLDERS & CAPITAL ---
  app.get("/api/shareholders", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json(getShareholders());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/shareholders", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const sh = createShareholder(req.body, req.user!);
      res.json(sh);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/shareholders/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const sh = updateShareholder(req.params.id, req.body, req.user!);
      res.json(sh);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/shareholders/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteShareholder(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- STONE STOCK & INVENTORY ---
  app.get("/api/stock", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json(getStockItems());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/stock/waste-logs", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json(getStockWasteLogs());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/stock/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const item = getStockItemById(req.params.id);
      if (!item) return res.status(404).json({ error: "Stock item not found" });
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/stock", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const item = createStockItem(req.body, req.user!);
      res.json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/stock/:id/waste", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = logStockWaste(req.params.id, req.body, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/stock/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteStockItem(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- SALES & REVENUE ---
  app.get("/api/sales", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json(getSales());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/sales", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const sale = createSale(req.body, req.user!);
      res.json(sale);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/sales/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteSale(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- COMPANY EXPENSES (WITH SUPPLIER DETAILS) ---
  app.get("/api/expenses", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json(getCompanyExpenses());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/expenses", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const exp = createCompanyExpense(req.body, req.user!);
      res.json(exp);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/expenses/:id", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = deleteCompanyExpense(req.params.id, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- COMPANY EXECUTIVE SUMMARY & PROFIT / LOSS ---
  app.get("/api/company/summary", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json(getCompanyExecutiveSummary());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- AUDIT LOGS ---
  app.get("/api/audit-logs", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 100;
      res.json(getAuditLogs(limit));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- EXPORT & BACKUP ---
  app.get("/api/export/daily-closing", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const dateStr = (req.query.date as string) || new Date().toISOString().split("T")[0];
      const buffer = generateDailyClosingExcelExport(dateStr);

      res.setHeader("Content-Disposition", `attachment; filename="clays_daily_closing_${dateStr}.xlsx"`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.send(buffer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/export/daily-summary", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const dateStr = (req.query.date as string) || new Date().toISOString().split("T")[0];
      const data = getDailyClosingSummaryData(dateStr);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get(["/api/export/excel", "/api/export/transactions"], requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const type = (req.query.type as any) || (req.path.includes("transactions") ? "all_transactions" : "all_transactions");
      const buffer = generateExcelExport(type, {
        environment: req.query.environment,
        accountId: req.query.accountId,
        timeframe: req.query.timeframe
      });

      res.setHeader("Content-Disposition", `attachment; filename="${type}_export_${Date.now()}.xlsx"`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.send(buffer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get(["/api/backup", "/api/backup/download"], requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const backup = createDatabaseBackup();
      res.setHeader("Content-Disposition", `attachment; filename="finance_db_backup_${Date.now()}.json"`);
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(backup, null, 2));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/backup/restore", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = restoreDatabaseBackup(req.body, req.user!);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Receipt / Document Upload
  app.post("/api/upload", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { fileName, base64Data } = req.body;
      if (!fileName || !base64Data) {
        return res.status(400).json({ error: "Missing file data" });
      }

      const ext = path.extname(fileName) || ".png";
      const safeName = "rcpt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6) + ext;
      const targetPath = path.join(uploadsDir, safeName);

      // Clean base64 prefix if present
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
      fs.writeFileSync(targetPath, Buffer.from(cleanBase64, "base64"));

      res.json({
        url: `/uploads/${safeName}`,
        fileName: safeName,
        originalName: fileName
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
