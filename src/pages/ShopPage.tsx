import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { products, categories, formatPrice } from '../data/products'
import ProductCard from '../components/ui/ProductCard'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
]

export default function ShopPage() {
  const { category } = useParams()
  const [sort, setSort] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000])

  const activeCategory = categories.find(c => c.id === category)

  const filteredProducts = useMemo(() => {
    let result = category
      ? products.filter(p => p.category === category)
      : [...products]

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1))
        break
    }

    return result
  }, [category, sort, priceRange])

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
            <span className="text-intarno-black capitalize">{activeCategory.label}</span>
          </>
        )}
      </div>

      {/* Page header */}
      <div className="py-6 md:py-10 border-b border-intarno-cream">
        <h1 className="section-title">
          {activeCategory ? activeCategory.label : 'All Furniture'}
        </h1>
        <p className="text-intarno-mid mt-2 text-sm">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
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
            to={`/shop/${cat.id}`}
            className={`shrink-0 px-4 py-2 text-xs font-medium tracking-wide border transition-all ${
              category === cat.id
                ? 'bg-intarno-black text-white border-intarno-black'
                : 'border-intarno-light text-intarno-mid hover:border-intarno-black hover:text-intarno-black'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 border-b border-intarno-cream">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 text-sm font-medium hover:text-intarno-accent transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-intarno-mid hidden md:block">Sort by:</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-transparent text-sm font-medium pr-6 pl-1 py-1 border-b border-intarno-light focus:outline-none focus:border-intarno-black cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-intarno-mid" />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="border-b border-intarno-cream py-6 animate-slide-down">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Price range */}
            <div>
              <h4 className="eyebrow mb-3">Price Range</h4>
              <div className="space-y-2">
                {[
                  ['0', '500000', 'Under ₦500k'],
                  ['500000', '1000000', '₦500k – ₦1M'],
                  ['1000000', '2000000', '₦1M – ₦2M'],
                  ['2000000', '5000000', 'Over ₦2M'],
                ].map(([min, max, label]) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 accent-intarno-black"
                      onChange={(e) => {
                        if (e.target.checked) setPriceRange([Number(min), Number(max)])
                        else setPriceRange([0, 5000000])
                      }}
                    />
                    <span className="text-sm group-hover:text-intarno-black transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* New/Sale */}
            <div>
              <h4 className="eyebrow mb-3">Availability</h4>
              <div className="space-y-2">
                {['New Arrivals', 'On Sale', 'In Stock'].map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-intarno-black" />
                    <span className="text-sm group-hover:text-intarno-black transition-colors">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => { setPriceRange([0, 5000000]); setFiltersOpen(false) }}
            className="mt-4 flex items-center gap-1.5 text-xs font-medium text-intarno-mid hover:text-intarno-black transition-colors"
          >
            <X size={13} /> Clear all filters
          </button>
        </div>
      )}

      {/* Products grid */}
      <div className="py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display text-2xl font-light text-intarno-mid mb-4">No products found</p>
            <Link to="/shop" className="btn-secondary">View all furniture</Link>
          </div>
        )}
      </div>
    </div>
  )
}
