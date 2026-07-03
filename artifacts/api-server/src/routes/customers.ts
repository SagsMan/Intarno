import { Router } from "express";
import { db } from "@workspace/db";
import { customersTable, inquiriesTable, ordersTable } from "@workspace/db";
import { eq, ilike, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /api/customers
router.get("/", requireAuth as any, async (req, res) => {
  const { search, limit = "100", offset = "0" } = req.query as Record<string, string>;

  let query = db
    .select({
      id: customersTable.id,
      name: customersTable.name,
      email: customersTable.email,
      phone: customersTable.phone,
      city: customersTable.city,
      createdAt: customersTable.createdAt,
      inquiryCount: sql<number>`cast(count(distinct ${inquiriesTable.id}) as int)`,
      orderCount: sql<number>`cast(0 as int)`,
    })
    .from(customersTable)
    .leftJoin(inquiriesTable, eq(customersTable.id, inquiriesTable.customerId))
    .groupBy(customersTable.id)
    .limit(parseInt(limit))
    .offset(parseInt(offset))
    .$dynamic();

  if (search) {
    query = query.where(ilike(customersTable.email, `%${search}%`));
  }

  const customers = await query;
  res.json(customers);
});

// GET /api/customers/:id
router.get("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [customer] = await db
    .select({
      id: customersTable.id,
      name: customersTable.name,
      email: customersTable.email,
      phone: customersTable.phone,
      city: customersTable.city,
      createdAt: customersTable.createdAt,
      inquiryCount: sql<number>`cast(0 as int)`,
      orderCount: sql<number>`cast(0 as int)`,
    })
    .from(customersTable)
    .where(eq(customersTable.id, id))
    .limit(1);

  if (!customer) { res.status(404).json({ error: "Not found" }); return; }
  res.json(customer);
});

// DELETE /api/customers/:id
router.delete("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(customersTable).where(eq(customersTable.id, id));
  res.status(204).end();
});

export default router;
