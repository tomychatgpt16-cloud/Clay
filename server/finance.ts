import { db, logAudit, recalculateAllBalances } from "./db";

// Helper to round to 2 decimals safely
export function roundMoney(amount: number): number {
  return Math.round((Number(amount) || 0) * 100) / 100;
}

// 1. ACCOUNTS SERVICE
export function getAccounts(environment?: "personal" | "company") {
  recalculateAllBalances();
  if (environment) {
    return db.prepare("SELECT * FROM accounts WHERE environment = ? ORDER BY name ASC").all(environment);
  }
  return db.prepare("SELECT * FROM accounts ORDER BY environment ASC, name ASC").all();
}

export function getAccountById(id: string) {
  return db.prepare("SELECT * FROM accounts WHERE id = ?").get(id);
}

export function createAccount(data: {
  environment: "personal" | "company";
  name: string;
  type: "cash" | "bank" | "mobile_money" | "other";
  opening_balance: number;
  currency?: string;
  status?: "active" | "inactive";
  notes?: string;
}, user: { id: string; username: string }) {
  const id = "acc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const opening = roundMoney(data.opening_balance);
  const currency = data.currency || "ETB";
  const status = data.status || "active";

  db.prepare(`
    INSERT INTO accounts (id, environment, name, type, opening_balance, current_balance, currency, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.environment, data.name, data.type, opening, opening, currency, status, data.notes || null, now, now);

  logAudit("ACCOUNT_CREATE", user.id, user.username, `Created ${data.environment} account "${data.name}" with opening balance ${opening} ${currency}`, { account_id: id });
  recalculateAllBalances();
  return getAccountById(id);
}

export function updateAccount(id: string, data: {
  name?: string;
  type?: "cash" | "bank" | "mobile_money" | "other";
  opening_balance?: number;
  status?: "active" | "inactive";
  notes?: string;
}, user: { id: string; username: string }) {
  const account = getAccountById(id) as any;
  if (!account) throw new Error("Account not found");

  const now = new Date().toISOString();
  const name = data.name !== undefined ? data.name : account.name;
  const type = data.type !== undefined ? data.type : account.type;
  const status = data.status !== undefined ? data.status : account.status;
  const notes = data.notes !== undefined ? data.notes : account.notes;
  const opening_balance = data.opening_balance !== undefined ? roundMoney(data.opening_balance) : account.opening_balance;

  db.prepare(`
    UPDATE accounts SET name = ?, type = ?, opening_balance = ?, status = ?, notes = ?, updated_at = ?
    WHERE id = ?
  `).run(name, type, opening_balance, status, notes, now, id);

  logAudit("ACCOUNT_UPDATE", user.id, user.username, `Updated account "${name}" (${id})`, data);
  recalculateAllBalances();
  return getAccountById(id);
}

export function deleteAccount(id: string, user: { id: string; username: string }) {
  const account = getAccountById(id) as any;
  if (!account) throw new Error("Account not found");

  // Check if transactions exist
  const txCount = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE account_id = ?").get(id) as { count: number };
  if (txCount.count > 0) {
    throw new Error(`Cannot delete account with ${txCount.count} recorded transactions. Please reassign or archive instead.`);
  }

  db.prepare("DELETE FROM accounts WHERE id = ?").run(id);
  logAudit("ACCOUNT_DELETE", user.id, user.username, `Deleted account "${account.name}" (${id})`);
  return { success: true };
}

// 2. TRANSACTIONS SERVICE
export function getTransactions(filters: {
  environment?: "personal" | "company" | "all";
  type?: string;
  account_id?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = `
    SELECT t.*, a.name as account_name, a.currency as account_currency, a.type as account_type
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.environment && filters.environment !== "all") {
    query += " AND t.environment = ?";
    params.push(filters.environment);
  }
  if (filters.type && filters.type !== "all") {
    query += " AND t.type = ?";
    params.push(filters.type);
  }
  if (filters.account_id && filters.account_id !== "all") {
    query += " AND t.account_id = ?";
    params.push(filters.account_id);
  }
  if (filters.category && filters.category !== "all") {
    query += " AND t.category = ?";
    params.push(filters.category);
  }
  if (filters.startDate) {
    query += " AND t.date >= ?";
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    query += " AND t.date <= ?";
    params.push(filters.endDate);
  }
  if (filters.search) {
    query += " AND (t.description LIKE ? OR t.contact_person LIKE ? OR t.reference_no LIKE ? OR t.notes LIKE ?)";
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  query += " ORDER BY t.date DESC, t.time DESC, t.created_at DESC";

  if (filters.limit) {
    query += " LIMIT ?";
    params.push(filters.limit);
    if (filters.offset) {
      query += " OFFSET ?";
      params.push(filters.offset);
    }
  }

  return db.prepare(query).all(...params);
}

export function getTransactionById(id: string) {
  return db.prepare(`
    SELECT t.*, a.name as account_name, a.currency as account_currency
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.id = ?
  `).get(id);
}

export function createTransaction(data: {
  environment: "personal" | "company";
  type: "income" | "expense" | "deposit" | "withdrawal" | "transfer" | "credit_given" | "credit_received" | "credit_repayment" | "owner_transfer" | "other";
  account_id: string;
  amount: number;
  date: string;
  time?: string;
  category?: string;
  contact_person?: string;
  description?: string;
  reference_no?: string;
  attachment_url?: string;
  attachment_name?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  const account = getAccountById(data.account_id) as any;
  if (!account) throw new Error("Account not found");

  const amount = roundMoney(data.amount);
  if (amount <= 0) throw new Error("Transaction amount must be strictly greater than 0");

  const id = "tx_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const time = data.time || new Date().toTimeString().substring(0, 5);

  db.prepare(`
    INSERT INTO transactions (id, environment, type, account_id, amount, date, time, category, contact_person, description, reference_no, attachment_url, attachment_name, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.environment,
    data.type,
    data.account_id,
    amount,
    data.date,
    time,
    data.category || null,
    data.contact_person || null,
    data.description || null,
    data.reference_no || null,
    data.attachment_url || null,
    data.attachment_name || null,
    data.notes || null,
    now,
    now
  );

  logAudit("TX_CREATE", user.id, user.username, `Created ${data.environment} ${data.type} of ${amount} ETB in "${account.name}"`, { id, amount, account_id: data.account_id });
  recalculateAllBalances();
  return getTransactionById(id);
}

export function updateTransaction(id: string, data: Partial<{
  type: string;
  account_id: string;
  amount: number;
  date: string;
  time: string;
  category: string;
  contact_person: string;
  description: string;
  reference_no: string;
  attachment_url: string;
  attachment_name: string;
  notes: string;
}>, user: { id: string; username: string }) {
  const tx = getTransactionById(id) as any;
  if (!tx) throw new Error("Transaction not found");

  const now = new Date().toISOString();
  const amount = data.amount !== undefined ? roundMoney(data.amount) : tx.amount;
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  const account_id = data.account_id || tx.account_id;
  const type = data.type || tx.type;
  const date = data.date || tx.date;
  const time = data.time || tx.time;
  const category = data.category !== undefined ? data.category : tx.category;
  const contact_person = data.contact_person !== undefined ? data.contact_person : tx.contact_person;
  const description = data.description !== undefined ? data.description : tx.description;
  const reference_no = data.reference_no !== undefined ? data.reference_no : tx.reference_no;
  const attachment_url = data.attachment_url !== undefined ? data.attachment_url : tx.attachment_url;
  const attachment_name = data.attachment_name !== undefined ? data.attachment_name : tx.attachment_name;
  const notes = data.notes !== undefined ? data.notes : tx.notes;

  db.prepare(`
    UPDATE transactions SET
      account_id = ?, type = ?, amount = ?, date = ?, time = ?,
      category = ?, contact_person = ?, description = ?, reference_no = ?,
      attachment_url = ?, attachment_name = ?, notes = ?, updated_at = ?
    WHERE id = ?
  `).run(account_id, type, amount, date, time, category, contact_person, description, reference_no, attachment_url, attachment_name, notes, now, id);

  logAudit("TX_EDIT", user.id, user.username, `Updated transaction (${id}) to ${amount} ETB`, data);
  recalculateAllBalances();
  return getTransactionById(id);
}

export function deleteTransaction(id: string, user: { id: string; username: string }) {
  const tx = getTransactionById(id) as any;
  if (!tx) throw new Error("Transaction not found");

  // If this transaction belongs to an inter-entity transfer, delete the transfer and linked side
  if (tx.transfer_id) {
    deleteTransfer(tx.transfer_id, user);
    return { success: true, deletedLinkedTransfer: true };
  }

  db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
  logAudit("TX_DELETE", user.id, user.username, `Deleted transaction (${id}) of ${tx.amount} ETB from account ${tx.account_name}`);
  recalculateAllBalances();
  return { success: true };
}

// 3. TRANSFER CENTER (PERSONAL <-> COMPANY & INTRA-ENVIRONMENT)
export function getTransfers() {
  return db.prepare(`
    SELECT tr.*,
      fa.name as from_account_name, fa.environment as from_env,
      ta.name as to_account_name, ta.environment as to_env
    FROM transfers tr
    JOIN accounts fa ON tr.from_account_id = fa.id
    JOIN accounts ta ON tr.to_account_id = ta.id
    ORDER BY tr.date DESC, tr.created_at DESC
  `).all();
}

export function createTransfer(data: {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  date: string;
  time?: string;
  reason?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  if (data.from_account_id === data.to_account_id) {
    throw new Error("Source and destination accounts must be different");
  }

  const fromAccount = getAccountById(data.from_account_id) as any;
  const toAccount = getAccountById(data.to_account_id) as any;
  if (!fromAccount || !toAccount) throw new Error("One or both accounts not found");

  const amount = roundMoney(data.amount);
  if (amount <= 0) throw new Error("Transfer amount must be strictly greater than 0");

  const transferId = "trf_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const time = data.time || new Date().toTimeString().substring(0, 5);

  let transferType: "same_environment" | "personal_to_company" | "company_to_personal" = "same_environment";
  if (fromAccount.environment === "personal" && toAccount.environment === "company") {
    transferType = "personal_to_company";
  } else if (fromAccount.environment === "company" && toAccount.environment === "personal") {
    transferType = "company_to_personal";
  }

  // Create From Transaction (Source deduction)
  const fromTxId = "tx_trf_out_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5);
  const toTxId = "tx_trf_in_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5);

  let fromDesc = `Transfer to ${toAccount.name}`;
  let toDesc = `Transfer from ${fromAccount.name}`;
  let fromCategory = "Internal Transfer";
  let toCategory = "Internal Transfer";

  if (transferType === "company_to_personal") {
    fromDesc = `Owner Withdrawal / Transfer to Personal (${toAccount.name})`;
    toDesc = `Owner Withdrawal Received from Company (${fromAccount.name})`;
    fromCategory = "Owner Withdrawal";
    toCategory = "Owner Draw / Equity Transfer";
  } else if (transferType === "personal_to_company") {
    fromDesc = `Owner Capital Injection / Transfer to Company (${toAccount.name})`;
    toDesc = `Owner Capital Received from Personal (${fromAccount.name})`;
    fromCategory = "Owner Capital Contribution";
    toCategory = "Owner Equity Contribution";
  }

  // Record outgoing transaction (negative effect)
  db.prepare(`
    INSERT INTO transactions (
      id, environment, type, account_id, amount, date, time,
      category, contact_person, description, reference_no, notes, transfer_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    fromTxId,
    fromAccount.environment,
    transferType === "same_environment" ? "transfer" : "owner_transfer",
    fromAccount.id,
    -amount, // negative stored for outgoing transfer
    data.date,
    time,
    fromCategory,
    toAccount.name,
    data.reason ? `${fromDesc} - ${data.reason}` : fromDesc,
    `TRF-${transferId.slice(-6).toUpperCase()}-OUT`,
    data.notes || null,
    transferId,
    now,
    now
  );

  // Record incoming transaction (positive effect)
  db.prepare(`
    INSERT INTO transactions (
      id, environment, type, account_id, amount, date, time,
      category, contact_person, description, reference_no, notes, transfer_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    toTxId,
    toAccount.environment,
    transferType === "same_environment" ? "transfer" : "owner_transfer",
    toAccount.id,
    amount, // positive stored for incoming transfer
    data.date,
    time,
    toCategory,
    fromAccount.name,
    data.reason ? `${toDesc} - ${data.reason}` : toDesc,
    `TRF-${transferId.slice(-6).toUpperCase()}-IN`,
    data.notes || null,
    transferId,
    now,
    now
  );

  // Record the master transfer record
  db.prepare(`
    INSERT INTO transfers (
      id, from_account_id, to_account_id, from_environment, to_environment,
      amount, date, time, reason, notes, transfer_type, from_transaction_id, to_transaction_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    transferId,
    fromAccount.id,
    toAccount.id,
    fromAccount.environment,
    toAccount.environment,
    amount,
    data.date,
    time,
    data.reason || null,
    data.notes || null,
    transferType,
    fromTxId,
    toTxId,
    now
  );

  logAudit(
    "TRANSFER_CREATE",
    user.id,
    user.username,
    `Transferred ${amount} ETB from ${fromAccount.name} (${fromAccount.environment}) to ${toAccount.name} (${toAccount.environment}) [${transferType}]`,
    { transfer_id: transferId, amount, transferType }
  );

  recalculateAllBalances();
  return { id: transferId, success: true, transferType };
}

export function deleteTransfer(transferId: string, user: { id: string; username: string }) {
  const transfer = db.prepare("SELECT * FROM transfers WHERE id = ?").get(transferId) as any;
  if (!transfer) throw new Error("Transfer not found");

  // Delete linked transactions
  db.prepare("DELETE FROM transactions WHERE transfer_id = ?").run(transferId);
  db.prepare("DELETE FROM transfers WHERE id = ?").run(transferId);

  logAudit("TRANSFER_DELETE", user.id, user.username, `Deleted transfer ${transferId} of ${transfer.amount} ETB`);
  recalculateAllBalances();
  return { success: true };
}

// 4. CREDIT & DEBT MANAGEMENT
export function getCredits(filters: {
  environment?: "personal" | "company" | "all";
  direction?: "owed_to_me" | "i_owe" | "all";
  status?: string;
  search?: string;
}) {
  let query = `
    SELECT c.*, a.name as account_name
    FROM credits c
    LEFT JOIN accounts a ON c.account_id = a.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.environment && filters.environment !== "all") {
    query += " AND c.environment = ?";
    params.push(filters.environment);
  }
  if (filters.direction && filters.direction !== "all") {
    query += " AND c.direction = ?";
    params.push(filters.direction);
  }
  if (filters.status && filters.status !== "all") {
    query += " AND c.status = ?";
    params.push(filters.status);
  }
  if (filters.search) {
    query += " AND (c.contact_name LIKE ? OR c.phone LIKE ? OR c.notes LIKE ?)";
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }

  query += " ORDER BY c.date DESC, c.created_at DESC";
  return db.prepare(query).all(...params);
}

export function getCreditById(id: string) {
  const credit = db.prepare(`
    SELECT c.*, a.name as account_name
    FROM credits c
    LEFT JOIN accounts a ON c.account_id = a.id
    WHERE c.id = ?
  `).get(id) as any;

  if (!credit) return null;

  const payments = db.prepare(`
    SELECT cp.*, a.name as account_name
    FROM credit_payments cp
    LEFT JOIN accounts a ON cp.account_id = a.id
    WHERE cp.credit_id = ?
    ORDER BY cp.date DESC, cp.created_at DESC
  `).all(id);

  return { ...credit, payments };
}

export function getCreditPayments(creditId: string) {
  return db.prepare(`
    SELECT cp.*, a.name as account_name
    FROM credit_payments cp
    LEFT JOIN accounts a ON cp.account_id = a.id
    WHERE cp.credit_id = ?
    ORDER BY cp.date DESC, cp.created_at DESC
  `).all(creditId);
}

export function createCredit(data: {
  environment: "personal" | "company";
  direction: "owed_to_me" | "i_owe";
  contact_name: string;
  phone?: string;
  amount: number;
  date: string;
  due_date?: string;
  category?: string;
  notes?: string;
  account_id?: string;
  record_transaction?: boolean; // Whether money actually entered or left account upon creation
}, user: { id: string; username: string }) {
  const amount = roundMoney(data.amount);
  if (amount <= 0) throw new Error("Credit amount must be greater than 0");

  const id = "crd_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  // Determine initial status
  let status: "outstanding" | "overdue" = "outstanding";
  if (data.due_date && new Date(data.due_date) < new Date()) {
    status = "overdue";
  }

  db.prepare(`
    INSERT INTO credits (id, environment, direction, contact_name, phone, amount, amount_paid, remaining_balance, date, due_date, status, category, notes, account_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.environment,
    data.direction,
    data.contact_name,
    data.phone || null,
    amount,
    0.00,
    amount,
    data.date,
    data.due_date || null,
    status,
    data.category || null,
    data.notes || null,
    data.account_id || null,
    now,
    now
  );

  // If user selected to record the cash flow immediately from account:
  if (data.record_transaction && data.account_id) {
    const txId = "tx_crd_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5);
    const txType = data.direction === "owed_to_me" ? "credit_given" : "credit_received";
    const txDesc = data.direction === "owed_to_me"
      ? `Credit given to ${data.contact_name}`
      : `Credit/Loan received from ${data.contact_name}`;

    db.prepare(`
      INSERT INTO transactions (id, environment, type, account_id, amount, date, time, category, contact_person, description, reference_no, credit_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      txId,
      data.environment,
      txType,
      data.account_id,
      amount,
      data.date,
      new Date().toTimeString().substring(0, 5),
      data.category || "Credit / Loan",
      data.contact_name,
      txDesc,
      `CRD-${id.slice(-6).toUpperCase()}`,
      id,
      now,
      now
    );
    recalculateAllBalances();
  }

  logAudit(
    "CREDIT_CREATE",
    user.id,
    user.username,
    `Recorded ${data.environment} credit [${data.direction}]: ${amount} ETB for ${data.contact_name}`,
    { id, amount, direction: data.direction }
  );

  return getCreditById(id);
}

export function recordCreditPayment(creditId: string, data: {
  account_id: string;
  amount: number;
  date: string;
  reference_no?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  const credit = getCreditById(creditId) as any;
  if (!credit) throw new Error("Credit record not found");

  const paymentAmount = roundMoney(data.amount);
  if (paymentAmount <= 0) throw new Error("Payment amount must be greater than 0");

  const newTotalPaid = roundMoney(credit.amount_paid + paymentAmount);
  if (newTotalPaid > credit.amount) {
    throw new Error(`Payment of ${paymentAmount} ETB exceeds the remaining balance of ${credit.remaining_balance} ETB`);
  }

  const remainingBalance = roundMoney(credit.amount - newTotalPaid);
  let newStatus: "outstanding" | "partially_paid" | "paid" | "overdue" = "outstanding";
  if (remainingBalance <= 0) {
    newStatus = "paid";
  } else if (newTotalPaid > 0) {
    if (credit.due_date && new Date(credit.due_date) < new Date()) {
      newStatus = "overdue";
    } else {
      newStatus = "partially_paid";
    }
  }

  const paymentId = "cpay_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  // Create linked account transaction
  // If owed_to_me: customer pays me -> cash goes IN (+)
  // If i_owe: I pay supplier -> cash goes OUT (-)
  const txId = "tx_cpay_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5);
  const txAmount = credit.direction === "owed_to_me" ? paymentAmount : -paymentAmount;
  const desc = credit.direction === "owed_to_me"
    ? `Credit payment received from ${credit.contact_name}`
    : `Payment made towards debt to ${credit.contact_name}`;

  db.prepare(`
    INSERT INTO transactions (id, environment, type, account_id, amount, date, time, category, contact_person, description, reference_no, notes, credit_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    txId,
    credit.environment,
    "credit_repayment",
    data.account_id,
    txAmount,
    data.date,
    new Date().toTimeString().substring(0, 5),
    "Credit Repayment",
    credit.contact_name,
    desc,
    data.reference_no || `CPAY-${paymentId.slice(-6).toUpperCase()}`,
    data.notes || null,
    creditId,
    now,
    now
  );

  // Insert payment record
  db.prepare(`
    INSERT INTO credit_payments (id, credit_id, account_id, amount, date, reference_no, notes, transaction_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(paymentId, creditId, data.account_id, paymentAmount, data.date, data.reference_no || null, data.notes || null, txId, now);

  // Update credit status & remaining balance
  db.prepare(`
    UPDATE credits SET amount_paid = ?, remaining_balance = ?, status = ?, updated_at = ?
    WHERE id = ?
  `).run(newTotalPaid, remainingBalance, newStatus, now, creditId);

  logAudit(
    "PAYMENT_RECORD",
    user.id,
    user.username,
    `Recorded payment of ${paymentAmount} ETB for credit ${credit.contact_name} (Remaining: ${remainingBalance} ETB)`,
    { creditId, paymentAmount, remainingBalance }
  );

  recalculateAllBalances();
  return getCreditById(creditId);
}

export function deleteCredit(id: string, user: { id: string; username: string }) {
  const credit = getCreditById(id) as any;
  if (!credit) throw new Error("Credit record not found");

  // Check if payments exist
  if (credit.payments && credit.payments.length > 0) {
    throw new Error(`Cannot delete credit with ${credit.payments.length} recorded payments. Please remove payment records first.`);
  }

  // Delete linked initial transaction if any
  db.prepare("DELETE FROM transactions WHERE credit_id = ?").run(id);
  db.prepare("DELETE FROM credits WHERE id = ?").run(id);

  logAudit("CREDIT_DELETE", user.id, user.username, `Deleted credit (${id}) for ${credit.contact_name}`);
  recalculateAllBalances();
  return { success: true };
}

// 5. DASHBOARD & CASH FLOW ANALYTICS
export function getDashboardOverview() {
  recalculateAllBalances();

  // Accounts breakdown
  const accounts = db.prepare("SELECT * FROM accounts WHERE status = 'active'").all() as any[];

  let personalCash = 0;
  let personalBank = 0;
  let personalTotal = 0;

  let companyCash = 0;
  let companyBank = 0;
  let companyTotal = 0;

  for (const acc of accounts) {
    const bal = Number(acc.current_balance || 0);
    if (acc.environment === "personal") {
      personalTotal += bal;
      if (acc.type === "cash") personalCash += bal;
      else personalBank += bal;
    } else {
      companyTotal += bal;
      if (acc.type === "cash") companyCash += bal;
      else companyBank += bal;
    }
  }

  // Credits summary
  const credits = db.prepare("SELECT * FROM credits").all() as any[];
  let personalOwedToMe = 0;
  let personalIOwe = 0;
  let companyReceivables = 0;
  let companyPayables = 0;

  for (const c of credits) {
    const rem = Number(c.remaining_balance || 0);
    if (c.status === "paid") continue;
    if (c.environment === "personal") {
      if (c.direction === "owed_to_me") personalOwedToMe += rem;
      else personalIOwe += rem;
    } else {
      if (c.direction === "owed_to_me") companyReceivables += rem;
      else companyPayables += rem;
    }
  }

  // Combined Totals
  const totalLiquid = personalTotal + companyTotal;
  const totalReceivables = personalOwedToMe + companyReceivables;
  const totalPayables = personalIOwe + companyPayables;
  const netPosition = totalLiquid + totalReceivables - totalPayables;

  // Monthly stats (current month)
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthlyTxs = db.prepare(`
    SELECT * FROM transactions WHERE date LIKE ?
  `).all(`${currentYearMonth}%`) as any[];

  let monthlyIncome = 0;
  let monthlyExpense = 0;

  for (const tx of monthlyTxs) {
    // Exclude internal transfers and owner transfers from operational P&L
    if (tx.type === "income") monthlyIncome += Number(tx.amount || 0);
    if (tx.type === "expense") monthlyExpense += Number(tx.amount || 0);
  }

  const netCashFlow = monthlyIncome - monthlyExpense;

  // Alerts
  const alerts: Array<{ type: string; title: string; message: string; severity: "warning" | "danger" | "info" }> = [];

  // 1. Overdue credits
  const overdueCredits = credits.filter(c => c.status === "overdue" || (c.status !== "paid" && c.due_date && new Date(c.due_date) < now));
  if (overdueCredits.length > 0) {
    alerts.push({
      type: "overdue_credits",
      title: `${overdueCredits.length} Overdue Credit/Debt items`,
      message: `There are ${overdueCredits.length} credit items past their due dates totaling ${overdueCredits.reduce((s, c) => s + c.remaining_balance, 0).toLocaleString()} ETB.`,
      severity: "danger"
    });
  }

  // 2. Low balance accounts
  const lowBalanceThreshold = Number((db.prepare("SELECT value FROM settings WHERE key = 'low_balance_alert'").get() as any)?.value || 0);
  if (lowBalanceThreshold > 0) {
    const lowAccounts = accounts.filter(a => {
      const bal = Number(a.current_balance || 0);
      const txCount = (db.prepare("SELECT COUNT(*) as c FROM transactions WHERE account_id = ?").get(a.id) as any)?.c || 0;
      return txCount > 0 && bal < lowBalanceThreshold;
    });
    if (lowAccounts.length > 0) {
      alerts.push({
        type: "low_balance",
        title: "Low Account Balance Warning",
        message: `${lowAccounts.map(a => a.name).join(", ")} below ${lowBalanceThreshold.toLocaleString()} ETB threshold.`,
        severity: "warning"
      });
    }
  }

  return {
    personal: {
      totalBalance: roundMoney(personalTotal),
      cashBalance: roundMoney(personalCash),
      bankBalance: roundMoney(personalBank),
      owedToMe: roundMoney(personalOwedToMe),
      iOwe: roundMoney(personalIOwe)
    },
    company: {
      totalBalance: roundMoney(companyTotal),
      cashBalance: roundMoney(companyCash),
      bankBalance: roundMoney(companyBank),
      receivables: roundMoney(companyReceivables),
      payables: roundMoney(companyPayables)
    },
    combined: {
      totalLiquid: roundMoney(totalLiquid),
      totalReceivables: roundMoney(totalReceivables),
      totalPayables: roundMoney(totalPayables),
      netPosition: roundMoney(netPosition)
    },
    monthPerformance: {
      month: currentYearMonth,
      income: roundMoney(monthlyIncome),
      expense: roundMoney(monthlyExpense),
      netCashFlow: roundMoney(netCashFlow)
    },
    alerts
  };
}

export function getCashFlowData(filters: {
  environment?: "personal" | "company" | "all";
  timeframe?: "today" | "this_week" | "this_month" | "last_month" | "this_year" | "custom";
  startDate?: string;
  endDate?: string;
}) {
  let { start, end } = getDateRangeForTimeframe(filters.timeframe || "this_month", filters.startDate, filters.endDate);

  let query = "SELECT * FROM transactions WHERE date >= ? AND date <= ?";
  const params: any[] = [start, end];

  if (filters.environment && filters.environment !== "all") {
    query += " AND environment = ?";
    params.push(filters.environment);
  }

  query += " ORDER BY date ASC";
  const txs = db.prepare(query).all(...params) as any[];

  let totalMoneyIn = 0;
  let totalMoneyOut = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  let totalTransfers = 0;
  let creditsGiven = 0;
  let creditsCollected = 0;

  const categoryMap: Record<string, number> = {};
  const inflowCategoryMap: Record<string, number> = {};
  const outflowCategoryMap: Record<string, number> = {};
  const dailyMap: Record<string, { date: string; moneyIn: number; moneyOut: number }> = {};
  const monthlyMap: Record<string, { month: string; inflow: number; outflow: number; net: number }> = {};

  // Initialize last 6 months in monthlyMap
  const curr = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(curr.getFullYear(), curr.getMonth() - i, 1);
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[mStr] = { month: mStr, inflow: 0, outflow: 0, net: 0 };
  }

  for (const tx of txs) {
    const amt = Number(tx.amount || 0);
    const day = tx.date;
    const mKey = day ? day.substring(0, 7) : "";

    if (!dailyMap[day]) {
      dailyMap[day] = { date: day, moneyIn: 0, moneyOut: 0 };
    }
    if (mKey && !monthlyMap[mKey]) {
      monthlyMap[mKey] = { month: mKey, inflow: 0, outflow: 0, net: 0 };
    }

    const cat = tx.category || "Uncategorized";

    if (tx.type === "income") {
      totalIncome += amt;
      totalMoneyIn += amt;
      dailyMap[day].moneyIn += amt;
      if (mKey) monthlyMap[mKey].inflow += amt;
      inflowCategoryMap[cat] = (inflowCategoryMap[cat] || 0) + amt;
    } else if (tx.type === "expense") {
      totalExpense += amt;
      totalMoneyOut += amt;
      dailyMap[day].moneyOut += amt;
      if (mKey) monthlyMap[mKey].outflow += amt;
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
      outflowCategoryMap[cat] = (outflowCategoryMap[cat] || 0) + amt;
    } else if (tx.type === "deposit") {
      totalMoneyIn += amt;
      dailyMap[day].moneyIn += amt;
      if (mKey) monthlyMap[mKey].inflow += amt;
      inflowCategoryMap[cat] = (inflowCategoryMap[cat] || 0) + amt;
    } else if (tx.type === "withdrawal") {
      totalMoneyOut += amt;
      dailyMap[day].moneyOut += amt;
      if (mKey) monthlyMap[mKey].outflow += amt;
      outflowCategoryMap[cat] = (outflowCategoryMap[cat] || 0) + amt;
    } else if (tx.type === "credit_given") {
      creditsGiven += amt;
      totalMoneyOut += amt;
      dailyMap[day].moneyOut += amt;
      if (mKey) monthlyMap[mKey].outflow += amt;
      outflowCategoryMap["Credit Given"] = (outflowCategoryMap["Credit Given"] || 0) + amt;
    } else if (tx.type === "credit_repayment") {
      if (amt > 0) {
        creditsCollected += amt;
        totalMoneyIn += amt;
        dailyMap[day].moneyIn += amt;
        if (mKey) monthlyMap[mKey].inflow += amt;
        inflowCategoryMap["Credit Collected"] = (inflowCategoryMap["Credit Collected"] || 0) + amt;
      } else {
        totalMoneyOut += Math.abs(amt);
        dailyMap[day].moneyOut += Math.abs(amt);
        if (mKey) monthlyMap[mKey].outflow += Math.abs(amt);
        outflowCategoryMap["Credit Repaid"] = (outflowCategoryMap["Credit Repaid"] || 0) + Math.abs(amt);
      }
    } else if (tx.type === "transfer" || tx.type === "owner_transfer") {
      totalTransfers += Math.abs(amt);
      if (amt > 0) {
        totalMoneyIn += amt;
        dailyMap[day].moneyIn += amt;
        if (mKey) monthlyMap[mKey].inflow += amt;
      } else {
        totalMoneyOut += Math.abs(amt);
        dailyMap[day].moneyOut += Math.abs(amt);
        if (mKey) monthlyMap[mKey].outflow += Math.abs(amt);
      }
    }
  }

  // Compute monthly net
  Object.values(monthlyMap).forEach((m) => {
    m.inflow = roundMoney(m.inflow);
    m.outflow = roundMoney(m.outflow);
    m.net = roundMoney(m.inflow - m.outflow);
  });

  const netCashFlow = totalMoneyIn - totalMoneyOut;
  const dailyTrend = Object.values(dailyMap);
  const categoriesBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount: roundMoney(amount)
  })).sort((a, b) => b.amount - a.amount);

  const monthlyList = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

  const inflowCategories = Object.entries(inflowCategoryMap).map(([category, amount]) => ({
    category,
    amount: roundMoney(amount)
  })).sort((a, b) => b.amount - a.amount);

  const outflowCategories = Object.entries(outflowCategoryMap).map(([category, amount]) => ({
    category,
    amount: roundMoney(amount)
  })).sort((a, b) => b.amount - a.amount);

  return {
    timeframe: filters.timeframe || "this_month",
    startDate: start,
    endDate: end,
    summary: {
      totalMoneyIn: roundMoney(totalMoneyIn),
      totalMoneyOut: roundMoney(totalMoneyOut),
      netCashFlow: roundMoney(netCashFlow),
      totalIncome: roundMoney(totalIncome),
      totalExpense: roundMoney(totalExpense),
      totalTransfers: roundMoney(totalTransfers),
      creditsGiven: roundMoney(creditsGiven),
      creditsCollected: roundMoney(creditsCollected)
    },
    totals: {
      inflows: roundMoney(totalMoneyIn),
      outflows: roundMoney(totalMoneyOut),
      net: roundMoney(netCashFlow)
    },
    monthly: monthlyList,
    categories: {
      inflows: inflowCategories,
      outflows: outflowCategories
    },
    dailyTrend,
    categoriesBreakdown
  };
}

function getDateRangeForTimeframe(timeframe: string, customStart?: string, customEnd?: string) {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();

  if (timeframe === "today") {
    const s = today.toISOString().split("T")[0];
    return { start: s, end: s };
  } else if (timeframe === "this_week") {
    const d = new Date(today);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0]
    };
  } else if (timeframe === "this_month") {
    const start = new Date(y, m, 1).toISOString().split("T")[0];
    const end = new Date(y, m + 1, 0).toISOString().split("T")[0];
    return { start, end };
  } else if (timeframe === "last_month") {
    const start = new Date(y, m - 1, 1).toISOString().split("T")[0];
    const end = new Date(y, m, 0).toISOString().split("T")[0];
    return { start, end };
  } else if (timeframe === "this_year") {
    return { start: `${y}-01-01`, end: `${y}-12-31` };
  } else {
    return {
      start: customStart || `${y}-01-01`,
      end: customEnd || today.toISOString().split("T")[0]
    };
  }
}

// 6. CATEGORIES
export function getCategories(environment?: string) {
  if (environment && environment !== "all") {
    return db.prepare("SELECT * FROM categories WHERE environment = ? OR environment = 'both' ORDER BY name ASC").all(environment);
  }
  return db.prepare("SELECT * FROM categories ORDER BY environment ASC, name ASC").all();
}

export function createCategory(data: {
  environment: "personal" | "company" | "both";
  name: string;
  type: "income" | "expense" | "other";
  icon?: string;
  color?: string;
}, user: { id: string; username: string }) {
  const id = "cat_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  db.prepare(`
    INSERT INTO categories (id, environment, name, type, icon, color, is_default)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `).run(id, data.environment, data.name, data.type, data.icon || "tag", data.color || "#4f46e5");

  logAudit("CATEGORY_CREATE", user.id, user.username, `Created category "${data.name}" (${data.environment})`);
  return { id, success: true };
}

export function deleteCategory(id: string, user: { id: string; username: string }) {
  const cat = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as any;
  if (!cat) throw new Error("Category not found");
  if (cat.is_default) throw new Error("Default system categories cannot be deleted");

  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  logAudit("CATEGORY_DELETE", user.id, user.username, `Deleted category "${cat.name}"`);
  return { success: true };
}

// 7. SETTINGS
export function getSettings() {
  const rows = db.prepare("SELECT * FROM settings").all() as any[];
  const settings: Record<string, string> = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  return settings;
}

export function updateSettings(updates: Record<string, string>, user: { id: string; username: string }) {
  const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
  const updateMany = db.transaction((entries: [string, string][]) => {
    for (const [k, v] of entries) {
      stmt.run(k, v);
    }
  });

  updateMany(Object.entries(updates));
  logAudit("SETTINGS_UPDATE", user.id, user.username, "Updated system settings", updates);
  return getSettings();
}

// 8. AUDIT LOGS
export function getAuditLogs(limit: number = 100) {
  return db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?").all(limit);
}

// 9. SHAREHOLDERS SERVICE
export function getShareholders() {
  const rows = db.prepare("SELECT * FROM shareholders ORDER BY contribution_date DESC, created_at DESC").all() as any[];
  const totalCapital = rows.reduce((sum, s) => sum + Number(s.contribution_amount || 0), 0);

  const shareholders = rows.map((s) => {
    const amt = Number(s.contribution_amount || 0);
    const pct = totalCapital > 0 ? Math.round((amt / totalCapital) * 10000) / 100 : 0;
    return {
      ...s,
      contribution_amount: amt,
      computed_percentage: pct
    };
  });

  return {
    shareholders,
    totalCapital: roundMoney(totalCapital),
    shareholderCount: shareholders.length
  };
}

export function createShareholder(data: {
  name: string;
  phone?: string;
  email?: string;
  contribution_amount: number;
  contribution_date: string;
  account_id?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  const id = "sh_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const amt = roundMoney(data.contribution_amount);

  db.prepare(`
    INSERT INTO shareholders (id, name, phone, email, contribution_amount, contribution_date, ownership_percentage, account_id, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 0.00, ?, ?, ?, ?)
  `).run(
    id,
    data.name.trim(),
    data.phone ? data.phone.trim() : null,
    data.email ? data.email.trim() : null,
    amt,
    data.contribution_date || now.split("T")[0],
    data.account_id || null,
    data.notes || null,
    now,
    now
  );

  if (data.account_id && amt > 0) {
    const txId = "tx_cap_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    db.prepare(`
      INSERT INTO transactions (id, environment, type, account_id, amount, date, time, category, contact_person, description, reference_no, notes, created_at, updated_at)
      VALUES (?, 'company', 'deposit', ?, ?, ?, '09:00:00', 'Shareholder Capital', ?, ?, ?, ?, ?, ?)
    `).run(
      txId,
      data.account_id,
      amt,
      data.contribution_date || now.split("T")[0],
      data.name,
      `Shareholder capital contribution from ${data.name}`,
      `CAP-${id.slice(-6).toUpperCase()}`,
      data.notes || null,
      now,
      now
    );
    recalculateAllBalances();
  }

  logAudit("SHAREHOLDER_CREATE", user.id, user.username, `Recorded shareholder capital for ${data.name} (${amt} ETB)`, { shareholder_id: id, amount: amt });
  return db.prepare("SELECT * FROM shareholders WHERE id = ?").get(id);
}

export function updateShareholder(id: string, data: {
  name?: string;
  phone?: string;
  email?: string;
  contribution_amount?: number;
  contribution_date?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  const existing = db.prepare("SELECT * FROM shareholders WHERE id = ?").get(id) as any;
  if (!existing) throw new Error("Shareholder not found");

  const now = new Date().toISOString();
  const name = data.name !== undefined ? data.name.trim() : existing.name;
  const phone = data.phone !== undefined ? data.phone.trim() : existing.phone;
  const email = data.email !== undefined ? data.email.trim() : existing.email;
  const amt = data.contribution_amount !== undefined ? roundMoney(data.contribution_amount) : existing.contribution_amount;
  const date = data.contribution_date !== undefined ? data.contribution_date : existing.contribution_date;
  const notes = data.notes !== undefined ? data.notes : existing.notes;

  db.prepare(`
    UPDATE shareholders
    SET name = ?, phone = ?, email = ?, contribution_amount = ?, contribution_date = ?, notes = ?, updated_at = ?
    WHERE id = ?
  `).run(name, phone, email, amt, date, notes, now, id);

  logAudit("SHAREHOLDER_UPDATE", user.id, user.username, `Updated shareholder record for ${name}`, { shareholder_id: id });
  return db.prepare("SELECT * FROM shareholders WHERE id = ?").get(id);
}

export function deleteShareholder(id: string, user: { id: string; username: string }) {
  const existing = db.prepare("SELECT * FROM shareholders WHERE id = ?").get(id) as any;
  if (!existing) throw new Error("Shareholder not found");

  db.prepare("DELETE FROM shareholders WHERE id = ?").run(id);
  logAudit("SHAREHOLDER_DELETE", user.id, user.username, `Deleted shareholder record for ${existing.name}`);
  return { success: true };
}

// 10. STOCK & INVENTORY SERVICE
export function getStockItems() {
  const items = db.prepare("SELECT * FROM stock_items ORDER BY purchase_date DESC, created_at DESC").all() as any[];

  return items.map((item) => {
    const initQty = Number(item.initial_quantity || 0);
    const availQty = Number(item.available_quantity || 0);
    const soldQty = Number(item.quantity_sold || 0);
    const wasteQty = Number(item.waste_quantity || 0);
    const unitCost = Number(item.cost_per_unit || 0);
    const totalCost = Number(item.total_cost || 0);

    return {
      ...item,
      initial_quantity: initQty,
      available_quantity: availQty,
      quantity_sold: soldQty,
      waste_quantity: wasteQty,
      cost_per_unit: unitCost,
      total_cost: totalCost,
      current_valuation: roundMoney(availQty * unitCost),
      waste_valuation: roundMoney(wasteQty * unitCost)
    };
  });
}

export function getStockItemById(id: string) {
  return db.prepare("SELECT * FROM stock_items WHERE id = ?").get(id);
}

export function createStockItem(data: {
  stone_type: string;
  batch_no?: string;
  unit: "ton" | "sqm" | "linear_meter" | "piece";
  initial_quantity: number;
  purchase_cost: number;
  transport_cost?: number;
  cutting_cost?: number;
  handling_cost?: number;
  other_expenses?: number;
  purchase_date: string;
  supplier_name?: string;
  supplier_phone?: string;
  account_id?: string;
  location?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  const id = "stk_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const qty = Number(data.initial_quantity) || 0;
  if (qty <= 0) throw new Error("Initial quantity must be greater than zero");

  const purchaseCost = roundMoney(data.purchase_cost || 0);
  const transportCost = roundMoney(data.transport_cost || 0);
  const cuttingCost = roundMoney(data.cutting_cost || 0);
  const handlingCost = roundMoney(data.handling_cost || 0);
  const otherExpenses = roundMoney(data.other_expenses || 0);

  const totalCost = roundMoney(purchaseCost + transportCost + cuttingCost + handlingCost + otherExpenses);
  const costPerUnit = qty > 0 ? Math.round((totalCost / qty) * 100) / 100 : 0;
  const batchNo = data.batch_no || `LOT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  db.prepare(`
    INSERT INTO stock_items (
      id, stone_type, batch_no, unit, initial_quantity, available_quantity, quantity_sold, waste_quantity,
      purchase_cost, transport_cost, cutting_cost, handling_cost, other_expenses,
      cost_per_unit, total_cost, purchase_date, supplier_name, supplier_phone, account_id, location, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 0.00, 0.00, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.stone_type.trim(),
    batchNo,
    data.unit,
    qty,
    qty,
    purchaseCost,
    transportCost,
    cuttingCost,
    handlingCost,
    otherExpenses,
    costPerUnit,
    totalCost,
    data.purchase_date || now.split("T")[0],
    data.supplier_name ? data.supplier_name.trim() : null,
    data.supplier_phone ? data.supplier_phone.trim() : null,
    data.account_id || null,
    data.location || "Main Factory Yard",
    data.notes || null,
    now,
    now
  );

  if (data.account_id && totalCost > 0) {
    const txId = "tx_stk_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    db.prepare(`
      INSERT INTO transactions (id, environment, type, account_id, amount, date, time, category, contact_person, description, reference_no, notes, created_at, updated_at)
      VALUES (?, 'company', 'expense', ?, ?, ?, '10:00:00', 'Raw Stone & Block Purchases', ?, ?, ?, ?, ?, ?)
    `).run(
      txId,
      data.account_id,
      totalCost,
      data.purchase_date || now.split("T")[0],
      data.supplier_name || null,
      `Stock purchase: ${data.stone_type} (${qty} ${data.unit}) - Lot: ${batchNo}`,
      batchNo,
      `Breakdown: Stone=${purchaseCost}, Transport=${transportCost}, Cutting=${cuttingCost}, Handling=${handlingCost}`,
      now,
      now
    );
    recalculateAllBalances();
  }

  logAudit("STOCK_CREATE", user.id, user.username, `Added stock ${data.stone_type} (${qty} ${data.unit}, Total Cost: ${totalCost} ETB, Unit Cost: ${costPerUnit} ETB/${data.unit})`);
  return getStockItemById(id);
}

export function logStockWaste(stockId: string, data: {
  quantity: number;
  reason: string;
  date?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  const stock = db.prepare("SELECT * FROM stock_items WHERE id = ?").get(stockId) as any;
  if (!stock) throw new Error("Stock item not found");

  const wasteQty = Number(data.quantity) || 0;
  if (wasteQty <= 0) throw new Error("Waste quantity must be greater than zero");
  if (wasteQty > stock.available_quantity) {
    throw new Error(`Cannot record ${wasteQty} ${stock.unit} waste. Only ${stock.available_quantity} ${stock.unit} currently available.`);
  }

  const id = "wst_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const date = data.date || now.split("T")[0];
  const unitCost = Number(stock.cost_per_unit || 0);
  const estimatedLoss = roundMoney(wasteQty * unitCost);

  db.prepare(`
    INSERT INTO stock_waste_logs (id, stock_id, stone_type, quantity, unit, reason, date, estimated_loss, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    stockId,
    stock.stone_type,
    wasteQty,
    stock.unit,
    data.reason.trim(),
    date,
    estimatedLoss,
    data.notes || null,
    now
  );

  const newAvailable = Math.max(0, stock.available_quantity - wasteQty);
  const newWaste = stock.waste_quantity + wasteQty;

  db.prepare(`
    UPDATE stock_items
    SET available_quantity = ?, waste_quantity = ?, updated_at = ?
    WHERE id = ?
  `).run(newAvailable, newWaste, now, stockId);

  logAudit("STOCK_WASTE_LOG", user.id, user.username, `Logged ${wasteQty} ${stock.unit} waste for ${stock.stone_type} (${data.reason}, Loss: ${estimatedLoss} ETB). Deducted from inventory.`);

  return {
    success: true,
    wasteId: id,
    available_quantity: newAvailable,
    waste_quantity: newWaste,
    estimated_loss: estimatedLoss
  };
}

export function getStockWasteLogs() {
  return db.prepare("SELECT * FROM stock_waste_logs ORDER BY date DESC, created_at DESC").all();
}

export function deleteStockItem(id: string, user: { id: string; username: string }) {
  const stock = db.prepare("SELECT * FROM stock_items WHERE id = ?").get(id) as any;
  if (!stock) throw new Error("Stock item not found");

  if (stock.quantity_sold > 0) {
    throw new Error(`Cannot delete stock with recorded sales (${stock.quantity_sold} ${stock.unit} sold).`);
  }

  db.prepare("DELETE FROM stock_waste_logs WHERE stock_id = ?").run(id);
  db.prepare("DELETE FROM stock_items WHERE id = ?").run(id);
  logAudit("STOCK_DELETE", user.id, user.username, `Deleted stock ${stock.stone_type} (${stock.batch_no})`);
  return { success: true };
}

// 11. SALES SERVICE
export function getSales() {
  const rows = db.prepare("SELECT * FROM sales ORDER BY sale_date DESC, created_at DESC").all() as any[];
  return rows.map((r) => ({
    ...r,
    quantity_sold: Number(r.quantity_sold || 0),
    selling_price_per_unit: Number(r.selling_price_per_unit || 0),
    total_revenue: Number(r.total_revenue || 0),
    cost_per_unit: Number(r.cost_per_unit || 0),
    total_cogs: Number(r.total_cogs || 0),
    gross_profit: Number(r.gross_profit || 0)
  }));
}

export function createSale(data: {
  customer_name: string;
  customer_phone?: string;
  stock_id?: string;
  stone_type: string;
  unit: string;
  quantity_sold: number;
  selling_price_per_unit: number;
  sale_date: string;
  payment_method: string;
  payment_status?: "paid" | "partial" | "unpaid";
  account_id?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  const id = "sal_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const qty = Number(data.quantity_sold) || 0;
  if (qty <= 0) throw new Error("Quantity sold must be greater than zero");

  const price = roundMoney(data.selling_price_per_unit || 0);
  if (price <= 0) throw new Error("Selling price must be greater than zero");

  const totalRevenue = roundMoney(qty * price);
  let costPerUnit = 0;

  if (data.stock_id) {
    const stockItem = db.prepare("SELECT * FROM stock_items WHERE id = ?").get(data.stock_id) as any;
    if (!stockItem) throw new Error("Selected stock item not found");

    if (qty > stockItem.available_quantity) {
      throw new Error(`Insufficient stock: Only ${stockItem.available_quantity} ${stockItem.unit} available for ${stockItem.stone_type}.`);
    }

    costPerUnit = Number(stockItem.cost_per_unit || 0);

    const updatedAvailable = Math.max(0, stockItem.available_quantity - qty);
    const updatedSold = stockItem.quantity_sold + qty;
    db.prepare(`
      UPDATE stock_items
      SET available_quantity = ?, quantity_sold = ?, updated_at = ?
      WHERE id = ?
    `).run(updatedAvailable, updatedSold, now, data.stock_id);
  }

  const totalCogs = roundMoney(qty * costPerUnit);
  const grossProfit = roundMoney(totalRevenue - totalCogs);
  const invoiceNo = "INV-" + new Date().getFullYear() + "-" + Math.random().toString(36).substring(2, 7).toUpperCase();
  const paymentStatus = data.payment_status || "paid";

  db.prepare(`
    INSERT INTO sales (
      id, invoice_no, customer_name, customer_phone, stock_id, stone_type, unit,
      quantity_sold, selling_price_per_unit, total_revenue, cost_per_unit, total_cogs, gross_profit,
      sale_date, payment_method, payment_status, account_id, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    invoiceNo,
    data.customer_name.trim(),
    data.customer_phone ? data.customer_phone.trim() : null,
    data.stock_id || null,
    data.stone_type.trim(),
    data.unit,
    qty,
    price,
    totalRevenue,
    costPerUnit,
    totalCogs,
    grossProfit,
    data.sale_date || now.split("T")[0],
    data.payment_method || "cash",
    paymentStatus,
    data.account_id || null,
    data.notes || null,
    now,
    now
  );

  if (paymentStatus === "paid" && data.account_id) {
    const txId = "tx_sal_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    db.prepare(`
      INSERT INTO transactions (id, environment, type, account_id, amount, date, time, category, contact_person, description, reference_no, notes, created_at, updated_at)
      VALUES (?, 'company', 'income', ?, ?, ?, '14:00:00', 'Granite & Marble Sales', ?, ?, ?, ?, ?, ?)
    `).run(
      txId,
      data.account_id,
      totalRevenue,
      data.sale_date || now.split("T")[0],
      data.customer_name,
      `Sale: ${qty} ${data.unit} ${data.stone_type} to ${data.customer_name}`,
      invoiceNo,
      data.notes || null,
      now,
      now
    );
    recalculateAllBalances();
  }

  logAudit("SALE_RECORD", user.id, user.username, `Recorded sale ${invoiceNo}: ${qty} ${data.unit} of ${data.stone_type} for ${totalRevenue} ETB (Profit: ${grossProfit} ETB)`);
  return db.prepare("SELECT * FROM sales WHERE id = ?").get(id);
}

export function deleteSale(id: string, user: { id: string; username: string }) {
  const sale = db.prepare("SELECT * FROM sales WHERE id = ?").get(id) as any;
  if (!sale) throw new Error("Sale not found");

  if (sale.stock_id) {
    const stock = db.prepare("SELECT * FROM stock_items WHERE id = ?").get(sale.stock_id) as any;
    if (stock) {
      const restoredAvailable = stock.available_quantity + sale.quantity_sold;
      const restoredSold = Math.max(0, stock.quantity_sold - sale.quantity_sold);
      db.prepare(`
        UPDATE stock_items
        SET available_quantity = ?, quantity_sold = ?, updated_at = ?
        WHERE id = ?
      `).run(restoredAvailable, restoredSold, new Date().toISOString(), sale.stock_id);
    }
  }

  db.prepare("DELETE FROM transactions WHERE reference_no = ?").run(sale.invoice_no);
  recalculateAllBalances();

  db.prepare("DELETE FROM sales WHERE id = ?").run(id);
  logAudit("SALE_DELETE", user.id, user.username, `Deleted sale ${sale.invoice_no} (${sale.quantity_sold} ${sale.unit} ${sale.stone_type})`);
  return { success: true };
}

// 12. COMPANY OPERATING EXPENSES
export function getCompanyExpenses() {
  const rows = db.prepare("SELECT * FROM company_expenses ORDER BY date DESC, created_at DESC").all() as any[];
  return rows.map((r) => ({
    ...r,
    amount: Number(r.amount || 0)
  }));
}

export function createCompanyExpense(data: {
  date: string;
  category: string;
  amount: number;
  description: string;
  supplier_name: string;
  supplier_phone?: string;
  payment_method: string;
  account_id?: string;
  notes?: string;
}, user: { id: string; username: string }) {
  const id = "exp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const amt = roundMoney(data.amount || 0);
  if (amt <= 0) throw new Error("Expense amount must be greater than zero");

  db.prepare(`
    INSERT INTO company_expenses (id, date, category, amount, description, supplier_name, supplier_phone, payment_method, account_id, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.date || now.split("T")[0],
    data.category.trim(),
    amt,
    data.description.trim(),
    data.supplier_name.trim(),
    data.supplier_phone ? data.supplier_phone.trim() : null,
    data.payment_method || "cash",
    data.account_id || null,
    data.notes || null,
    now,
    now
  );

  if (data.account_id) {
    const txId = "tx_exp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    db.prepare(`
      INSERT INTO transactions (id, environment, type, account_id, amount, date, time, category, contact_person, description, reference_no, notes, created_at, updated_at)
      VALUES (?, 'company', 'expense', ?, ?, ?, '11:00:00', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      txId,
      data.account_id,
      amt,
      data.date || now.split("T")[0],
      data.supplier_name,
      data.description,
      `EXP-${id.slice(-6).toUpperCase()}`,
      `Supplier Phone: ${data.supplier_phone || "N/A"}`,
      now,
      now
    );
    recalculateAllBalances();
  }

  logAudit("EXPENSE_RECORD", user.id, user.username, `Recorded company expense ${amt} ETB for ${data.category} (Supplier: ${data.supplier_name})`);
  return db.prepare("SELECT * FROM company_expenses WHERE id = ?").get(id);
}

export function deleteCompanyExpense(id: string, user: { id: string; username: string }) {
  const exp = db.prepare("SELECT * FROM company_expenses WHERE id = ?").get(id) as any;
  if (!exp) throw new Error("Expense not found");

  const ref = `EXP-${id.slice(-6).toUpperCase()}`;
  db.prepare("DELETE FROM transactions WHERE reference_no = ?").run(ref);
  recalculateAllBalances();

  db.prepare("DELETE FROM company_expenses WHERE id = ?").run(id);
  logAudit("EXPENSE_DELETE", user.id, user.username, `Deleted expense "${exp.description}" (${exp.amount} ETB)`);
  return { success: true };
}

// 13. COMPANY FINANCIAL & STOCK EXECUTIVE SUMMARY
export function getCompanyExecutiveSummary() {
  recalculateAllBalances();

  // 1. Sales metrics
  const sales = db.prepare("SELECT * FROM sales").all() as any[];
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_revenue || 0), 0);
  const totalCogs = sales.reduce((sum, s) => sum + Number(s.total_cogs || 0), 0);
  const grossProfit = totalRevenue - totalCogs;
  const grossMarginPct = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 10000) / 100 : 0;

  // 2. Operating expenses
  const expenses = db.prepare("SELECT * FROM company_expenses").all() as any[];
  const totalOperatingExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // 3. Net Profit or Loss
  const netProfitLoss = grossProfit - totalOperatingExpenses;
  const netMarginPct = totalRevenue > 0 ? Math.round((netProfitLoss / totalRevenue) * 10000) / 100 : 0;

  // 4. Stock valuation & waste
  const stockItems = db.prepare("SELECT * FROM stock_items").all() as any[];
  let totalStockValuation = 0;
  let totalWasteValuation = 0;
  let totalAvailableTons = 0;
  let totalAvailableSqm = 0;
  let totalSoldTons = 0;
  let totalSoldSqm = 0;

  const stoneMap: Record<string, { stone_type: string; unit: string; available: number; sold: number; waste: number; value: number }> = {};

  for (const s of stockItems) {
    const avail = Number(s.available_quantity || 0);
    const sold = Number(s.quantity_sold || 0);
    const waste = Number(s.waste_quantity || 0);
    const unitCost = Number(s.cost_per_unit || 0);

    const val = avail * unitCost;
    totalStockValuation += val;
    totalWasteValuation += waste * unitCost;

    if (s.unit === "ton") {
      totalAvailableTons += avail;
      totalSoldTons += sold;
    } else if (s.unit === "sqm") {
      totalAvailableSqm += avail;
      totalSoldSqm += sold;
    }

    if (!stoneMap[s.stone_type]) {
      stoneMap[s.stone_type] = {
        stone_type: s.stone_type,
        unit: s.unit,
        available: 0,
        sold: 0,
        waste: 0,
        value: 0
      };
    }
    stoneMap[s.stone_type].available += avail;
    stoneMap[s.stone_type].sold += sold;
    stoneMap[s.stone_type].waste += waste;
    stoneMap[s.stone_type].value += val;
  }

  // 5. Shareholders
  const shareholders = db.prepare("SELECT * FROM shareholders ORDER BY contribution_amount DESC").all() as any[];
  const totalShareholderCapital = shareholders.reduce((sum, sh) => sum + Number(sh.contribution_amount || 0), 0);

  // 6. Liquid Cash & Bank
  const accounts = db.prepare("SELECT * FROM accounts WHERE status = 'active'").all() as any[];
  const totalLiquidCashBank = accounts.reduce((sum, a) => sum + Number(a.current_balance || 0), 0);

  // 7. Expenses by category
  const expenseCatMap: Record<string, number> = {};
  for (const e of expenses) {
    const cat = e.category || "General";
    expenseCatMap[cat] = (expenseCatMap[cat] || 0) + Number(e.amount || 0);
  }
  const expensesByCategory = Object.entries(expenseCatMap)
    .map(([category, amount]) => ({ category, amount: roundMoney(amount) }))
    .sort((a, b) => b.amount - a.amount);

  // 8. Recent records
  const recentSales = sales.slice(-6).reverse();
  const recentStock = stockItems.slice(-6).reverse();
  const recentExpenses = expenses.slice(-6).reverse();

  return {
    totalRevenue: roundMoney(totalRevenue),
    totalCogs: roundMoney(totalCogs),
    grossProfit: roundMoney(grossProfit),
    grossMarginPct,
    totalOperatingExpenses: roundMoney(totalOperatingExpenses),
    netProfitLoss: roundMoney(netProfitLoss),
    netMarginPct,
    isProfit: netProfitLoss >= 0,
    totalStockValuation: roundMoney(totalStockValuation),
    totalWasteValuation: roundMoney(totalWasteValuation),
    totalShareholderCapital: roundMoney(totalShareholderCapital),
    totalLiquidCashBank: roundMoney(totalLiquidCashBank),
    totalAvailableTons: roundMoney(totalAvailableTons),
    totalAvailableSqm: roundMoney(totalAvailableSqm),
    totalSoldTons: roundMoney(totalSoldTons),
    totalSoldSqm: roundMoney(totalSoldSqm),
    shareholdersCount: shareholders.length,
    shareholders,
    accounts,
    stoneBreakdown: Object.values(stoneMap),
    expensesByCategory,
    recentSales,
    recentStock,
    recentExpenses
  };
}
