-- ============================================================
-- Intarno Supabase Setup — Full Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ggunmcamhfoyveggkavc/sql
-- ============================================================

-- 1. Inquiries (contact form submissions)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT,
  message    TEXT,
  service    TEXT        DEFAULT 'consultation',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Sample requests (free fabric swatch orders)
CREATE TABLE IF NOT EXISTS public.sample_requests (
  id         BIGSERIAL   PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  address    TEXT,
  city       TEXT,
  postcode   TEXT,
  swatches   TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. Products
CREATE TABLE IF NOT EXISTS public.products (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  price         NUMERIC(14,2) NOT NULL DEFAULT 0,
  sale_price    NUMERIC(14,2),
  currency      TEXT DEFAULT '₦',
  category_id   BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT,
  images        TEXT[] DEFAULT '{}',
  materials     TEXT[] DEFAULT '{}',
  colors        TEXT[] DEFAULT '{}',
  collection    TEXT,
  width_cm      NUMERIC(8,2),
  height_cm     NUMERIC(8,2),
  depth_cm      NUMERIC(8,2),
  stock_qty     INT DEFAULT 0,
  featured      BOOLEAN DEFAULT false,
  is_new        BOOLEAN DEFAULT false,
  is_sale       BOOLEAN DEFAULT false,
  status        TEXT DEFAULT 'active',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 5. Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  phone      TEXT,
  address    TEXT,
  city       TEXT,
  country    TEXT DEFAULT 'Nigeria',
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id              BIGSERIAL PRIMARY KEY,
  order_number    TEXT NOT NULL UNIQUE,
  customer_id     BIGINT REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_phone  TEXT,
  items           JSONB DEFAULT '[]',
  subtotal        NUMERIC(14,2) DEFAULT 0,
  total           NUMERIC(14,2) DEFAULT 0,
  currency        TEXT DEFAULT '₦',
  status          TEXT DEFAULT 'pending',
  notes           TEXT,
  delivery_address TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 7. Projects (portfolio)
CREATE TABLE IF NOT EXISTS public.projects (
  id              BIGSERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  category        TEXT DEFAULT 'residential',
  client          TEXT,
  location        TEXT,
  year            INT,
  description     TEXT,
  challenge       TEXT,
  solution        TEXT,
  outcome         TEXT,
  testimonial     TEXT,
  testimonial_author TEXT,
  images          TEXT[] DEFAULT '{}',
  cover_image     TEXT,
  featured        BOOLEAN DEFAULT false,
  status          TEXT DEFAULT 'published',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.inquiries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects        ENABLE ROW LEVEL SECURITY;

-- Public insert policies (contact forms)
CREATE POLICY "public_insert_inquiries"
  ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_insert_sample_requests"
  ON public.sample_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Public select policies
CREATE POLICY "public_select_inquiries"
  ON public.inquiries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_sample_requests"
  ON public.sample_requests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_categories"
  ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_products"
  ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_projects"
  ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_customers"
  ON public.customers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_select_orders"
  ON public.orders FOR SELECT TO anon, authenticated USING (true);

-- Full admin CRUD via anon key (admin panel)
CREATE POLICY "public_all_categories" ON public.categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_all_products"   ON public.products   FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_all_customers"  ON public.customers  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_all_orders"     ON public.orders     FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_all_projects"   ON public.projects   FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_all_inquiries"  ON public.inquiries  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_all_samples"    ON public.sample_requests FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Sofas',            'sofas',            'Premium sofas and sectionals',          1),
  ('Chairs',           'chairs',           'Accent, dining and lounge chairs',      2),
  ('Tables',           'tables',           'Dining, coffee and side tables',        3),
  ('Beds',             'beds',             'Luxury bed frames and headboards',      4),
  ('Storage',          'storage',          'Wardrobes, shelving and cabinets',      5),
  ('Kitchen Cabinets', 'kitchen-cabinets', 'Custom kitchen and fitted units',       6),
  ('Doors',            'doors',            'Internal, external and bespoke doors',  7),
  ('Accessories',      'accessories',      'Decorative and functional accessories', 8)
ON CONFLICT (slug) DO NOTHING;
