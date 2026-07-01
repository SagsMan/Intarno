import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, or, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /api/products
router.get("/", async (req, res) => {
  const { category, search, status, featured, limit = "100", offset = "0" } = req.query as Record<string, string>;

  let query = db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      price: productsTable.price,
      currency: productsTable.currency,
      images: productsTable.images,
      materials: productsTable.materials,
      colors: productsTable.colors,
      dimensions: productsTable.dimensions,
      isFeatured: productsTable.isFeatured,
      isNew: productsTable.isNew,
      status: productsTable.status,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .limit(parseInt(limit))
    .offset(parseInt(offset))
    .$dynamic();

  const conditions = [];
  if (status) conditions.push(eq(productsTable.status, status));
  if (featured === "true") conditions.push(eq(productsTable.isFeatured, true));
  if (category) {
    const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category)).limit(1);
    if (cat) conditions.push(eq(productsTable.categoryId, cat.id));
  }
  if (search) {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const products = await query;
  res.json(products);
});

// POST /api/products
router.post("/", requireAuth as any, async (req, res) => {
  const { name, slug, description, categoryId, price, currency, images, materials, colors, dimensions, isFeatured, isNew, status } = req.body;

  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const [product] = await db
    .insert(productsTable)
    .values({
      name,
      slug: generatedSlug,
      description,
      categoryId: categoryId || null,
      price: price?.toString() || "0",
      currency: currency || "₦",
      images: images || [],
      materials: materials || [],
      colors: colors || [],
      dimensions: dimensions || null,
      isFeatured: isFeatured || false,
      isNew: isNew || false,
      status: status || "active",
    })
    .returning();

  res.status(201).json(product);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [product] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      price: productsTable.price,
      currency: productsTable.currency,
      images: productsTable.images,
      materials: productsTable.materials,
      colors: productsTable.colors,
      dimensions: productsTable.dimensions,
      isFeatured: productsTable.isFeatured,
      isNew: productsTable.isNew,
      status: productsTable.status,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, id))
    .limit(1);

  if (!product) { res.status(404).json({ error: "Not found" }); return; }
  res.json(product);
});

// PATCH /api/products/:id
router.patch("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const updates: Record<string, any> = {};
  const fields = ["name", "slug", "description", "categoryId", "price", "currency", "images", "materials", "colors", "dimensions", "isFeatured", "isNew", "status"];
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      if (field === "price") updates.price = req.body[field].toString();
      else if (field === "categoryId") updates.categoryId = req.body[field] || null;
      else updates[field] = req.body[field];
    }
  }

  const [product] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
  if (!product) { res.status(404).json({ error: "Not found" }); return; }
  res.json(product);
});

// DELETE /api/products/:id
router.delete("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.status(204).end();
});

export default router;
