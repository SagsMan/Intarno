import { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ui/ProductCard'

interface SupabaseProduct {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  sale_price?: number
  currency: string
  category_id?: number
  category_name?: string
  images: string[]
  materials: string[]
  colors?: string[]
  collection?: string
  width_cm?: number
  height_cm?: number
  depth_cm?: number
  stock_qty: number
  featured: boolean
  is_new: boolean
  is_sale: boolean
  status: string
}

interface Category { id: number; name: string; slug: string }

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
]

// Adapter: Supabase product → ProductCard-compatible shape
function toCardProduct(p: SupabaseProduct) {
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    collection: p.collection,
    category: p.category_name?.toLowerCase() || '',
    price: Number(p.price),
    currency: p.currency || '₦',
    images: p.images?.length ? p.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    colors: p.colors ?? [],
    description: p.description ?? '',
    featured: p.featured,
    isNew: p.is_new,
    isSale: p.is_sale,
    materials: p.materials ?? [],
    dimensions: p.width_cm ? { width: p.width_cm, height: p.height_cm ?? 0, depth: p.depth_cm ?? 0 } : undefined,
  }
}

export default function ShopPage() {
  const { category } = useParams()
  const [sort, setSort] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000_000])
  const [products, setProducts] = useState<SupabaseProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name, slug').order('sort_order'),
      ])
      setProducts(prods ?? [])
      setCategories(cats ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const activeCategory = categories.find(c => c.slug === category)

  const filteredProducts = useMemo(() => {
    let result = category
      ? products.filter(p => p.category_name?.toLowerCase() === category || p.category_name?.toLowerCase().replace(/\s+/g, '-') === category)
      : [...products]

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price); break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price); break
      case 'newest':
        result = [...result].sort((a, b) => (a.is_new ? -1 : 1) - (b.is_new ? -1 : 1)); break
      case 'featured':
        result = [...result].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1)); break
    }
    return result
  }, [category, sort, priceRange, products])

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 py-4 text-xs text-intarno-mid">
        <Link to="/" className="hover:text-intarno-black transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-intarno-black transition-colors">Furniture</Link>
        {activeCategory && (
          <>
            <span>/</span>
            <span className="text-intarno-black capitalize">{activeCategory.name}</span>
          </>
        )}
      </div>

      {/* Page header */}
      <div className="py-6 md:py-10 border-b border-intarno-cream">
        <h1 className="section-title">
          {activeCategory ? activeCategory.name : 'All Furniture'}
        </h1>
        <p className="text-intarno-mid mt-2 text-sm">
          {loading ? 'Loading…' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'piece' : 'pieces'}`}
        </p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4">
        <Link
          to="/shop"
          className={`shrink-0 px-4 py-2 text-xs font-medium tracking-wide border transition-all ${
            !category
              ? 'bg-intarno-black text-white border-intarno-black'
              : 'border-intarno-light text-intarno-mid hover:border-intarno-black hover:text-intarno-black'
          }`}
        >
          All
        </Link>
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/shop/${cat.slug}`}
            className={`shrink-0 px-4 py-2 text-xs font-medium tracking-wide border transition-all capitalize ${
              category === cat.slug
                ? 'bg-intarno-black text-white border-intarno-black'
                : 'border-intarno-light text-intarno-mid hover:border-intarno-black hover:text-intarno-black'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 border-b border-intarno-cream">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 text-sm text-intarno-mid hover:text-intarno-black transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filter & Sort
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-intarno-mid hidden sm:inline">Sort by:</span>
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs border border-intarno-light text-intarno-black focus:outline-none focus:border-intarno-accent bg-transparent cursor-pointer"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-intarno-mid" />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="py-5 border-b border-intarno-cream">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-intarno-black">Price Range</h3>
            <button onClick={() => setFiltersOpen(false)} className="text-intarno-mid hover:text-intarno-black">
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm text-intarno-mid">
            <span>₦{priceRange[0].toLocaleString('en-NG')}</span>
            <input
              type="range"
              min={0}
              max={10_000_000}
              step={100_000}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="flex-1 accent-intarno-accent"
            />
            <span>₦{priceRange[1].toLocaleString('en-NG')}</span>
          </div>
        </div>
      )}

      {/* Product grid */}
      {loading ? (
        <div className="py-32 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-intarno-accent" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-intarno-mid mb-4">No products found in this category.</p>
          <Link to="/shop" className="text-sm underline text-intarno-black hover:text-intarno-accent">
            View all furniture
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 py-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={toCardProduct(product)} />
          ))}
        </div>
      )}
    </div>
  )
}
