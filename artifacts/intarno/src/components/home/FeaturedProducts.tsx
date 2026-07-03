import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '../../data/products'
import ProductCard from '../ui/ProductCard'

export default function FeaturedProducts() {
  const featured = getFeaturedProducts()

  return (
    <section className="py-16 md:py-20 bg-intarno-cream/50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow text-intarno-mid mb-2">Curated for you</p>
            <h2 className="section-title">Featured pieces</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wide hover:text-intarno-accent transition-colors group">
            View all furniture
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link to="/shop" className="btn-secondary">
            View all furniture
          </Link>
        </div>
      </div>
    </section>
  )
}
