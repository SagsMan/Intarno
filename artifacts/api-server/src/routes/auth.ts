import { Router } from "express";
import { db } from "@workspace/db";
import { adminUsersTable, adminSessionsTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import type { AuthRequest } from "../middlewares/auth";
import { requireAuth } from "../middlewares/auth";
import { LoginBody } from "@workspace/api-zod";

const scryptAsync = promisify(scrypt);
const router = Router();

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [salt, hash] = stored.split(":");
    const hashBuf = Buffer.from(hash, "hex");
    const supplied = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(hashBuf, supplied);
  } catch {
    return false;
  }
}

function generateToken(): string {
  return randomBytes(48).toString("hex");
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { email, password } = parsed.data;

  const [admin] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email.toLowerCase()))
    .limit(1);

  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(adminSessionsTable).values({
    token,
    adminId: admin.id,
    expiresAt,
  });

  res.json({
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  });
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    await db.delete(adminSessionsTable).where(eq(adminSessionsTable.token, token)).catch(() => {});
  }
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", requireAuth as any, async (req: AuthRequest, res) => {
  const [admin] = await db
    .select({ id: adminUsersTable.id, email: adminUsersTable.email, name: adminUsersTable.name })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.id, req.adminId!))
    .limit(1);

  if (!admin) {
    res.status(401).json({ error: "Not found" });
    return;
  }

  res.json(admin);
});

export default router;
