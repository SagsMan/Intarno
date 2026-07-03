import type { AdminUser } from '../types/admin'

  const ADMIN_EMAIL    = import.meta.env.VITE_ADMIN_EMAIL    || 'softwareclone100@gmail.com'
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '123456'

  function makeToken(email: string): string {
    const payload = {
      id: 1,
      email,
      name: 'Intarno Admin',
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }
    return btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  }

  function parseToken(token: string): { id: number; email: string; name: string; exp: number } | null {
    try {
      const padded = token.replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(atob(padded))
    } catch {
      return null
    }
  }

  export async function loginAdmin(email: string, password: string): Promise<{ token: string; admin: AdminUser } | null> {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = makeToken(email)
      return {
        token,
        admin: { id: 1, email, name: 'Intarno Admin' },
      }
    }
    return null
  }

  export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
    const payload = parseToken(token)
    if (!payload) return null
    if (payload.exp < Date.now()) return null
    return { id: payload.id, email: payload.email, name: payload.name }
  }

  export async function logoutAdmin(_token: string | null): Promise<void> {
    // client-side only — nothing to call
  }
  