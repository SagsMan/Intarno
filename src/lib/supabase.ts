import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY env vars')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Inquiry = {
  id?: number
  name: string
  email: string
  phone?: string
  message?: string
  service?: string
  created_at?: string
}

export type SampleRequest = {
  id?: number
  name: string
  email: string
  address?: string
  city?: string
  postcode?: string
  swatches?: string[]
  created_at?: string
}
