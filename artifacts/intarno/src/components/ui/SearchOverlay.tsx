import { useState, useEffect, useRef } from 'react'
import { X, Search, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { products } from '../../data/products'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const popularSearches = ['Sofa', 'Dining table', 'Armchair', 'Bed frame', 'Floor lamp', 'Bookcase']

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-intarno-white shadow-2xl animate-slide-down">
        <div className="max-w-screen-lg mx-auto px-4 md:px-8 py-6">
          {/* Search input */}
          <div className="flex items-center gap-4">
            <Search size={20} className="text-intarno-mid shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for furniture, collections, rooms..."
              className="flex-1 bg-transparent text-intarno-black text-lg font-light placeholder:text-intarno-light focus:outline-none"
            />
            <button onClick={onClose} className="p-1 hover:text-intarno-accent transition-colors">
              <X size={22} />
            </button>
          </div>

          <div className="h-px bg-intarno-cream mt-4" />

          {/* Results or suggestions */}
          <div className="py-6">
            {results.length > 0 ? (
              <div>
                <p className="eyebrow mb-4 text-intarno-light">Results</p>
                <div className="space-y-3">
                  {results.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-16 h-16 overflow-hidden bg-intarno-cream shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm group-hover:text-intarno-accent transition-colors">{product.name}</p>
                        <p className="text-intarno-mid text-xs capitalize">{product.category}</p>
                      </div>
                      <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-intarno-accent" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="eyebrow mb-4 text-intarno-light">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 border border-intarno-light text-sm hover:border-intarno-black hover:bg-intarno-black hover:text-white transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
