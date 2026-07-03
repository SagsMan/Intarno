-- ============================================================
-- Intarno Supabase Setup
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

-- 3. Enable Row Level Security
ALTER TABLE public.inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_requests ENABLE ROW LEVEL SECURITY;

-- 4. Allow anyone to INSERT (public contact forms)
CREATE POLICY "public_insert_inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_insert_sample_requests"
  ON public.sample_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. Allow anyone to SELECT (needed for admin dashboard with anon key)
--    Restrict to authenticated-only once admin uses Supabase Auth
CREATE POLICY "public_select_inquiries"
  ON public.inquiries FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_select_sample_requests"
  ON public.sample_requests FOR SELECT
  TO anon, authenticated
  USING (true);
