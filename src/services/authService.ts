import { apiFetch, authHeaders } from '../api/client'
import type { AdminUser } from '../types/admin'

export async function loginAdmin(email: string, password: string): Promise<{ token: string; admin: AdminUser } | null> {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) return null
  return res.json()
}

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  const res = await apiFetch('/auth/me', { headers: authHeaders(token) })
  if (!res.ok) return null
  return res.json()
}

export async function logoutAdmin(token: string | null): Promise<void> {
  if (!token) return
  await apiFetch('/auth/logout', { method: 'POST', headers: authHeaders(token) })
}
