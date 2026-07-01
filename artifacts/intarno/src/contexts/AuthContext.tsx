import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface AdminUser {
  id: number
  email: string
  name: string | null
}

interface AuthContextValue {
  isAuthenticated: boolean
  admin: AdminUser | null
  token: string | null
  login: (token: string, admin: AdminUser) => void
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'intarno_admin_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verify stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (!storedToken) {
      setIsLoading(false)
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setAdmin(data)
          setToken(storedToken)
        } else {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback((newToken: string, adminUser: AdminUser) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setAdmin(adminUser)
  }, [])

  const logout = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (storedToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${storedToken}` },
        })
      }
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setAdmin(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!admin,
        admin,
        token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/** Inject the auth token into API fetch headers automatically */
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}
