import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Product } from '../types/product'

interface WishlistContextValue {
  items: Product[]
  toggle: (product: Product) => void
  isWishlisted: (id: string) => boolean
  count: number
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

const STORAGE_KEY = 'intarno_wishlist'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage errors
    }
  }, [items])

  const toggle = useCallback((product: Product) => {
    setItems(prev => {
      const exists = prev.some(p => p.id === product.id)
      return exists ? prev.filter(p => p.id !== product.id) : [...prev, product]
    })
  }, [])

  const isWishlisted = useCallback((id: string) => items.some(p => p.id === id), [items])

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
