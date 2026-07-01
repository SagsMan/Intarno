import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /api/categories
router.get("/", async (req, res) => {
  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      imageUrl: categoriesTable.imageUrl,
      productCount: sql<number>`cast(count(${productsTable.id}) as int)`,
    })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(categoriesTable.id, productsTable.categoryId))
    .groupBy(categoriesTable.id);

  res.json(categories);
});

// POST /api/categories
router.post("/", requireAuth as any, async (req, res) => {
  const { name, slug, description, imageUrl } = req.body;
  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const [category] = await db
    .insert(categoriesTable)
    .values({ name, slug: generatedSlug, description, imageUrl })
    .returning();

  res.status(201).json({ ...category, productCount: 0 });
});

// PATCH /api/categories/:id
router.patch("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const updates: Record<string, any> = {};
  for (const field of ["name", "slug", "description", "imageUrl"]) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const [category] = await db.update(categoriesTable).set(updates).where(eq(categoriesTable.id, id)).returning();
  if (!category) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...category, productCount: 0 });
});

// DELETE /api/categories/:id
router.delete("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  res.status(204).end();
});

export default router;
