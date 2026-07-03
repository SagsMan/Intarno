import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, customersTable, ordersTable, inquiriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth as any, async (req, res) => {
  const [
    [products],
    [customers],
    [orders],
    [inquiries],
    recentOrders,
    recentInquiries,
    ordersByStatus,
    inquiriesByType,
  ] = await Promise.all([
    db.select({ count: sql<number>`cast(count(*) as int)` }).from(productsTable),
    db.select({ count: sql<number>`cast(count(*) as int)` }).from(customersTable),
    db.select({
      count: sql<number>`cast(count(*) as int)`,
      revenue: sql<number>`cast(coalesce(sum(cast(total as numeric)), 0) as numeric)`,
    }).from(ordersTable),
    db.select({ count: sql<number>`cast(count(*) as int)` }).from(inquiriesTable),
    db.select().from(ordersTable).orderBy(ordersTable.createdAt).limit(5),
    db.select().from(inquiriesTable).orderBy(inquiriesTable.createdAt).limit(5),
    db.select({
      status: ordersTable.status,
      count: sql<number>`cast(count(*) as int)`,
    }).from(ordersTable).groupBy(ordersTable.status),
    db.select({
      type: inquiriesTable.type,
      count: sql<number>`cast(count(*) as int)`,
    }).from(inquiriesTable).groupBy(inquiriesTable.type),
  ]);

  res.json({
    totalProducts: products?.count ?? 0,
    totalCustomers: customers?.count ?? 0,
    totalOrders: orders?.count ?? 0,
    totalInquiries: inquiries?.count ?? 0,
    totalRevenue: Number(orders?.revenue ?? 0),
    recentOrders: recentOrders.reverse(),
    recentInquiries: recentInquiries.reverse(),
    ordersByStatus,
    inquiriesByType,
  });
});

export default router;
