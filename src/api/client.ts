/**
 * Thin fetch wrapper for the Intarno API.
 * Centralizes the base path so the rest of the app never hardcodes '/api'.
 */
export const API_BASE = '/api'

export function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, init)
}
