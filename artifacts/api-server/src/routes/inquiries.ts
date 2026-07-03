import { Router } from "express";
import { db } from "@workspace/db";
import { inquiriesTable, customersTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateInquiryBody, UpdateInquiryBody } from "@workspace/api-zod";

const router = Router();

async function upsertCustomer(name: string, email: string, phone?: string) {
  const existing = await db.select().from(customersTable).where(eq(customersTable.email, email.toLowerCase())).limit(1);
  if (existing[0]) return existing[0].id;

  const [created] = await db.insert(customersTable).values({
    name, email: email.toLowerCase(), phone: phone || null,
  }).returning();
  return created.id;
}

// GET /api/inquiries
router.get("/", requireAuth as any, async (req, res) => {
  const { type, status, limit = "100", offset = "0" } = req.query as Record<string, string>;

  const conditions = [];
  if (type) conditions.push(eq(inquiriesTable.type, type));
  if (status) conditions.push(eq(inquiriesTable.status, status));

  const results = await db
    .select({
      id: inquiriesTable.id,
      type: inquiriesTable.type,
      name: inquiriesTable.name,
      email: inquiriesTable.email,
      phone: inquiriesTable.phone,
      message: inquiriesTable.message,
      status: inquiriesTable.status,
      productId: inquiriesTable.productId,
      productName: productsTable.name,
      customerId: inquiriesTable.customerId,
      notes: inquiriesTable.notes,
      createdAt: inquiriesTable.createdAt,
    })
    .from(inquiriesTable)
    .leftJoin(productsTable, eq(inquiriesTable.productId, productsTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(inquiriesTable.createdAt)
    .limit(parseInt(limit))
    .offset(parseInt(offset));

  res.json(results.reverse());
});

// POST /api/inquiries (public)
router.post("/", async (req, res) => {
  const parsed = CreateInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { type, name, email, phone, message, productId } = parsed.data;

  const customerId = await upsertCustomer(name, email, phone);

  const [inquiry] = await db
    .insert(inquiriesTable)
    .values({ type, name, email, phone: phone || null, message: message || null, productId: productId || null, customerId, status: "new" })
    .returning();

  res.status(201).json({ ...inquiry, productName: null });
});

// GET /api/inquiries/:id
router.get("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [inquiry] = await db
    .select({
      id: inquiriesTable.id,
      type: inquiriesTable.type,
      name: inquiriesTable.name,
      email: inquiriesTable.email,
      phone: inquiriesTable.phone,
      message: inquiriesTable.message,
      status: inquiriesTable.status,
      productId: inquiriesTable.productId,
      productName: productsTable.name,
      customerId: inquiriesTable.customerId,
      notes: inquiriesTable.notes,
      createdAt: inquiriesTable.createdAt,
    })
    .from(inquiriesTable)
    .leftJoin(productsTable, eq(inquiriesTable.productId, productsTable.id))
    .where(eq(inquiriesTable.id, id))
    .limit(1);

  if (!inquiry) { res.status(404).json({ error: "Not found" }); return; }
  res.json(inquiry);
});

// PATCH /api/inquiries/:id
router.patch("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateInquiryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }

  const updates: Record<string, any> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const [inquiry] = await db.update(inquiriesTable).set(updates).where(eq(inquiriesTable.id, id)).returning();
  if (!inquiry) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...inquiry, productName: null });
});

// DELETE /api/inquiries/:id
router.delete("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(inquiriesTable).where(eq(inquiriesTable.id, id));
  res.status(204).end();
});

export default router;
