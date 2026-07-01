import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /api/projects
router.get("/", async (req, res) => {
  const { category, featured } = req.query as Record<string, string>;

  const conditions = [];
  if (category) conditions.push(eq(projectsTable.category, category));
  if (featured === "true") conditions.push(eq(projectsTable.isFeatured, true));

  const projects = await db
    .select()
    .from(projectsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(projectsTable.createdAt);

  res.json(projects.reverse());
});

// POST /api/projects
router.post("/", requireAuth as any, async (req, res) => {
  const { title, slug, category, description, clientChallenge, designSolution, outcome, testimonial, clientName, images, isFeatured } = req.body;
  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const [project] = await db
    .insert(projectsTable)
    .values({
      title, slug: generatedSlug, category: category || "residential",
      description: description || null, clientChallenge: clientChallenge || null,
      designSolution: designSolution || null, outcome: outcome || null,
      testimonial: testimonial || null, clientName: clientName || null,
      images: images || [], isFeatured: isFeatured || false,
    })
    .returning();

  res.status(201).json(project);
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json(project);
});

// PATCH /api/projects/:id
router.patch("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const updates: Record<string, any> = {};
  for (const field of ["title", "slug", "category", "description", "clientChallenge", "designSolution", "outcome", "testimonial", "clientName", "images", "isFeatured"]) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const [project] = await db.update(projectsTable).set(updates).where(eq(projectsTable.id, id)).returning();
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json(project);
});

// DELETE /api/projects/:id
router.delete("/:id", requireAuth as any, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.status(204).end();
});

export default router;
