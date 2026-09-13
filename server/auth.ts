import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db, logAudit } from "./db";
import { Request, Response, NextFunction } from "express";

// Active sessions map: token -> { userId, username, createdAt }
const sessions = new Map<string, { userId: string; username: string; expiresAt: number }>();

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function login(username: string, passwordPlain: string, ip?: string) {
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;
  if (!user) {
    logAudit("LOGIN_FAILED", null, username, `Failed login attempt for unknown user "${username}" from ${ip || "client"}`);
    throw new Error("Invalid username or password");
  }

  const matches = bcrypt.compareSync(passwordPlain, user.password_hash);
  if (!matches) {
    logAudit("LOGIN_FAILED", user.id, username, `Failed password attempt for user "${username}" from ${ip || "client"}`);
    throw new Error("Invalid username or password");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, {
    userId: user.id,
    username: user.username,
    expiresAt
  });

  logAudit("LOGIN", user.id, user.username, `Successful login from ${ip || "client"}`);

  const isDefaultPassword = bcrypt.compareSync("082012", user.password_hash);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      is_default_password: isDefaultPassword
    }
  };
}

export function logout(token: string) {
  const session = sessions.get(token);
  if (session) {
    logAudit("LOGOUT", session.userId, session.username, "User logged out");
    sessions.delete(token);
  }
  return { success: true };
}

export function changePassword(userId: string, currentPasswordPlain: string, newPasswordPlain: string) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
  if (!user) throw new Error("User not found");

  const matches = bcrypt.compareSync(currentPasswordPlain, user.password_hash);
  if (!matches) throw new Error("Current password is incorrect");

  if (!newPasswordPlain || newPasswordPlain.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPasswordPlain, salt);

  db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").run(
    newHash,
    new Date().toISOString(),
    userId
  );

  logAudit("PASSWORD_CHANGE", user.id, user.username, "Administrator changed password successfully");
  const isDefault = bcrypt.compareSync("082012", newHash);
  return { success: true, is_default_password: isDefault };
}

export function getCurrentUser(token: string) {
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    return null;
  }
  const user = db.prepare("SELECT id, username, full_name, email, password_hash FROM users WHERE id = ?").get(session.userId) as any;
  if (!user) return null;
  const isDefaultPassword = bcrypt.compareSync("082012", user.password_hash);
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    is_default_password: isDefaultPassword
  };
}

// Express Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    full_name: string;
    email: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "") || (req.query.token as string);

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = getCurrentUser(token);
  if (!user) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  req.user = user;
  next();
}
