export interface Product {
  id: string
  slug: string
  name: string
  collection?: string
  category: string
  price: number
  currency: string
  images: string[]
  colors?: string[]
  description: string
  featured?: boolean
  isNew?: boolean
  isSale?: boolean
  salePrice?: number
  dimensions?: {
    width?: number
    height?: number
    depth?: number
  }
  materials?: string[]
}
