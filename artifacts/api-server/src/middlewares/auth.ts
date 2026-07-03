import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { adminUsersTable, adminSessionsTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

export interface AuthRequest extends Request {
  adminId?: number;
  adminEmail?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const [session] = await db
      .select({
        adminId: adminSessionsTable.adminId,
        email: adminUsersTable.email,
      })
      .from(adminSessionsTable)
      .innerJoin(adminUsersTable, eq(adminSessionsTable.adminId, adminUsersTable.id))
      .where(
        and(
          eq(adminSessionsTable.token, token),
          gt(adminSessionsTable.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!session) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }

    req.adminId = session.adminId;
    req.adminEmail = session.email;
    next();
  } catch (err) {
    req.log.error({ err }, "Auth middleware error");
    res.status(500).json({ error: "Server error" });
  }
}
