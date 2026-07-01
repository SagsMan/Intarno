# Intarno — Luxury Furniture & Interior Design Platform

## Project Overview
Full-stack luxury furniture & interior design platform for the Nigerian market.
Brand concept: **"The Curated Canvas"** — luxury editorial magazine feel.

## Architecture

### Monorepo (pnpm workspaces)
```
artifacts/
  intarno/          ← React + Vite frontend (preview: /)
  api-server/       ← Express 5 + TypeScript API (preview: /api)
lib/
  db/               ← Drizzle ORM schema + migrations (PostgreSQL)
  api-spec/         ← OpenAPI 3.1 spec
  api-client-react/ ← Generated React Query hooks (orval)
  api-zod/          ← Generated Zod schemas (orval)
```

### Key Libraries
- **Frontend:** React 18, react-router-dom v6, Tailwind CSS v4, shadcn/ui, @tanstack/react-query
- **Backend:** Express 5, Drizzle ORM, pino logging
- **DB:** Replit-provisioned PostgreSQL (DATABASE_URL env var, runtime-managed)
- **Auth:** Custom Bearer token auth using Node.js crypto (scrypt), stored in admin_sessions table

## Database Tables
- `admin_users` — admin credentials (email + scrypt-hashed password)
- `admin_sessions` — session tokens (7-day expiry)
- `categories` — furniture categories
- `products` — furniture products with images, materials, dimensions
- `customers` — customer records (auto-created from inquiries)
- `inquiries` — consultation, quote, contact & custom furniture inquiries
- `orders` — order management (5 statuses: pending → delivered)
- `projects` — portfolio projects with gallery images

## Admin Access
- URL: `/admin/login`
- Email: `softwareclone100@gmail.com`
- Password: `123456`

## Design System
- **Fonts:** Cormorant Garamond (display/headings), DM Sans (body), JetBrains Mono
- **Colors:**
  - `intarno-black` (#0a0a0a) — primary text
  - `intarno-white` (#fafaf8) — background
  - `intarno-cream` (#f5f2ed) — secondary background
  - `intarno-charcoal` (#2a2a2a) — admin sidebar, headings
  - `intarno-mid` (#6b6b6b) — muted text
  - `intarno-light` (#b8b4ad) — borders, dividers
  - `intarno-accent` (#c8a96e) — gold accent, CTAs

## Public Pages
- `/` — Home (hero, collections, categories, inspiration)
- `/shop` — Shop all furniture
- `/product/:slug` — Product detail
- `/collections/:type` — Curated collections
- `/rooms/:type` — Room inspiration
- `/inspiration` — Inspiration gallery
- `/design-services` — Interior design services
- `/custom-furniture` — Custom furniture inquiry
- `/kitchen-cabinets` — Kitchen cabinetry
- `/doors` — Door collections
- `/tv-consoles` — TV consoles & media units
- `/factory` — Factory & craftsmanship story
- `/projects` — Portfolio projects gallery
- `/projects/:slug` — Project detail
- `/about` — About Intarno
- `/contact` — Contact & appointment

## Admin Pages (protected, require login)
- `/admin/login` — Login
- `/admin/dashboard` — Stats overview
- `/admin/products` — Product CRUD
- `/admin/categories` — Category management
- `/admin/customers` — Customer database
- `/admin/inquiries` — Inquiry management
- `/admin/orders` — Order management
- `/admin/projects` — Portfolio management

## User Preferences
- Nigerian Naira (₦) as default currency
- Large, editorial photography with generous white space
- No mocking/placeholder data in production — real data from API
