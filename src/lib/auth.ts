import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "guardpro-enterprise-bangladesh-secret-key-2026";
export const COOKIE_NAME = "guardpro_session";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  branch?: string;
  companyId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getUserFromRequest(request: NextRequest): TokenPayload | null {
  // Check cookie or Authorization header
  const tokenCookie = request.cookies.get(COOKIE_NAME)?.value;
  if (tokenCookie) {
    return verifyToken(tokenCookie);
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  return null;
}

export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  COMPANY_ADMIN: "Company Admin",
  HR_MANAGER: "HR Manager",
  OPERATIONS_MANAGER: "Operations Manager",
  SUPERVISOR: "Supervisor",
  ACCOUNTANT: "Accountant",
  CLIENT: "Client",
  SECURITY_GUARD: "Security Guard",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export function hasPermission(role: string, requiredRoles: string[]): boolean {
  if (role === ROLES.SUPER_ADMIN || role === ROLES.COMPANY_ADMIN) return true;
  return requiredRoles.includes(role);
}
