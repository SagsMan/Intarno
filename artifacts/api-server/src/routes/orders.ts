import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /api/orders
router.get("/", requireAuth as any, async (req, res) => {
  const { status, search, limit = "100", offset = "0" } = req.query as Record<string, string>;

  const conditions = [];
  if (status) conditions.push(eq(ordersTable.status, status));
  if (search) conditions.push(ilike(ordersTable.customerName, `%${search}%`));

  const orders = await db
    .select()
    .from(ordersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(ordersTable.createdAt)
    .limit(parseInt(limit))
    .offset(parseInt(offset));

  res.json(orders.reverse());
});

// POST /api/orders
router.post("/", requireAuth as any, async (req, res) => {
  const { customerId, customerName, customerEmail, items, total, currency, status, notes } = req.body;

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerId: customerId || null,
      customerName,
      customerEmail,
      items: items || [],
      total: total?.toString() || "0",
      currency: currency || "₦",
      status: status || "pending",
      notes: notes || null,
    })
    .returning();

  res.status(201).json(order);
});

// GET /api/orders/:id
router.get("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
  if (!order) { res.status(404).json({ error: "Not found" }); return; }
  res.json(order);
});

// PATCH /api/orders/:id
router.patch("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const updates: Record<string, any> = {};
  if (req.body.status !== undefined) updates.status = req.body.status;
  if (req.body.notes !== undefined) updates.notes = req.body.notes;

  const [order] = await db.update(ordersTable).set(updates).where(eq(ordersTable.id, id)).returning();
  if (!order) { res.status(404).json({ error: "Not found" }); return; }
  res.json(order);
});

// DELETE /api/orders/:id
router.delete("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(ordersTable).where(eq(ordersTable.id, id));
  res.status(204).end();
});

export default router;
