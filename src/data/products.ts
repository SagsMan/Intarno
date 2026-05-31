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

export const products: Product[] = [
  {
    id: '1',
    slug: 'oslo-sofa',
    name: 'Oslo',
    collection: 'Nordic Series',
    category: 'sofas',
    price: 2850000,
    currency: '₦',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    ],
    colors: ['#c8b9a2', '#6b7280', '#1a1a2e', '#8b7355'],
    description: 'A masterpiece of Scandinavian design. The Oslo sofa balances clean geometric lines with sumptuous comfort, available in over 200 fabric and leather options.',
    featured: true,
    materials: ['Premium wool blend', 'Solid beech frame', 'High-resilience foam'],
    dimensions: { width: 240, height: 78, depth: 90 },
  },
  {
    id: '2',
    slug: 'stockholm-chair',
    name: 'Stockholm',
    collection: 'Lounge Collection',
    category: 'chairs',
    price: 780000,
    currency: '₦',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    ],
    colors: ['#8b6914', '#2c3e50', '#c8b9a2'],
    description: 'The Stockholm chair is where architectural precision meets everyday comfort. Its distinctive silhouette has become an icon of modern Danish living.',
    featured: true,
    isNew: true,
    materials: ['Italian leather', 'Walnut veneer legs'],
    dimensions: { width: 80, height: 85, depth: 82 },
  },
  {
    id: '3',
    slug: 'bergen-dining-table',
    name: 'Bergen',
    collection: 'Dining Series',
    category: 'tables',
    price: 1250000,
    currency: '₦',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    ],
    colors: ['#5c4033', '#c8b9a2'],
    description: 'Crafted from sustainably sourced oak, the Bergen table adapts from intimate family dinners to grand entertaining.',
    materials: ['Solid oak', 'Steel base'],
    dimensions: { width: 200, height: 75, depth: 95 },
  },
  {
    id: '4',
    slug: 'copenhagen-bed',
    name: 'Copenhagen',
    collection: 'Bedroom Series',
    category: 'beds',
    price: 2100000,
    currency: '₦',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    ],
    colors: ['#c8b9a2', '#4a4a4a'],
    description: 'A sanctuary for sleep. The Copenhagen bed features a generously padded headboard and thoughtfully integrated storage beneath a sleek profile.',
    featured: true,
    materials: ['Bouclé fabric', 'Solid ash frame'],
    dimensions: { width: 180, height: 105, depth: 210 },
  },
  {
    id: '5',
    slug: 'malmo-sideboard',
    name: 'Malmö',
    collection: 'Storage Series',
    category: 'storage',
    price: 980000,
    currency: '₦',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    ],
    colors: ['#3d2b1f', '#c8b9a2', '#4a4a4a'],
    description: 'Sleek yet capacious, the Malmö sideboard brings Scandinavian order to any space. Hidden compartments and adjustable shelving maximize functionality.',
    materials: ['Smoked oak', 'Brass hardware'],
    dimensions: { width: 180, height: 65, depth: 45 },
  },
  {
    id: '6',
    slug: 'fjord-armchair',
    name: 'Fjord',
    collection: 'Lounge Collection',
    category: 'chairs',
    price: 650000,
    currency: '₦',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    ],
    colors: ['#c8b9a2', '#8b6914', '#2c3e50'],
    description: 'Inspired by Norwegian fjords, this armchair’s organic curves cradle you in exceptional comfort.',
    isNew: true,
    isSale: false,
    materials: ['Velvet fabric', 'Walnut base'],
    dimensions: { width: 82, height: 88, depth: 84 },
  },
  {
    id: '7',
    slug: 'tivoli-coffee-table',
    name: 'Tivoli',
    collection: 'Table Series',
    category: 'tables',
    price: 420000,
    currency: '₦',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80',
    ],
    colors: ['#c8b9a2', '#5c4033'],
    description: 'A sculptural centrepiece that grounds any living room. The Tivoli\'s marble-top floats above a slim brass frame.',
    isSale: true,
    salePrice: 310000,
    materials: ['Carrara marble', 'Brass frame'],
    dimensions: { width: 120, height: 40, depth: 60 },
  },
  {
    id: '8',
    slug: 'arken-floor-lamp',
    name: 'Arken',
    collection: 'Lighting',
    category: 'lamps',
    price: 285000,
    currency: '₦',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    ],
    colors: ['#1a1a1a', '#c8b9a2'],
    description: 'Architectural precision in lighting. The Arken floor lamp\'s adjustable arc delivers light exactly where needed.',
    materials: ['Brushed steel', 'Marble base'],
    dimensions: { width: 35, height: 165, depth: 35 },
  },
]

export const categories = [
  { id: 'sofas', label: 'Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=75' },
  { id: 'chairs', label: 'Chairs', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=75' },
  { id: 'tables', label: 'Tables', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=75' },
  { id: 'beds', label: 'Beds', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=75' },
  { id: 'storage', label: 'Storage', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=75' },
  { id: 'accessories', label: 'Accessories', image: 'https://images.unsplash.com/photo-1606170033648-5d55a3edf314?w=600&q=75' },
  { id: 'rugs', label: 'Rugs', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=75' },
  { id: 'lamps', label: 'Lamps', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=75' },
  { id: 'outdoor', label: 'Outdoor', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=75' },
]

export function formatPrice(price: number, currency: string = '₦'): string {
  return `${currency}${price.toLocaleString('en-NG')}`
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}
