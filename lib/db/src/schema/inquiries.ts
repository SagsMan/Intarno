import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";
import { productsTable } from "./products";

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull().default("contact"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  productId: integer("product_id").references(() => productsTable.id, { onDelete: "set null" }),
  customerId: integer("customer_id").references(() => customersTable.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({ id: true, createdAt: true });
export type Inquiry = typeof inquiriesTable.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
