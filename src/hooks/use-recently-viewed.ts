import { useEffect, useState } from 'react'

const KEY = 'intarno_recently_viewed'
const MAX = 8

export interface RecentItem {
  id: string
  slug: string
  name: string
  price: number
  currency: string
  image: string
  category?: string
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })

  const addItem = (item: RecentItem) => {
    setItems(prev => {
      const filtered = prev.filter(i => i.id !== item.id)
      const next = [item, ...filtered].slice(0, MAX)
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return { items, addItem }
}
