import { Link, useParams } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ui/ProductCard'

const collectionTypes = [
  { id: 'sofas', label: 'Sofa Collections', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' },
  { id: 'chairs', label: 'Chair Collections', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80' },
  { id: 'armchairs', label: 'Armchair Collections', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
  { id: 'tables', label: 'Table Collections', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80' },
  { id: 'beds', label: 'Bed Collections', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80' },
  { id: 'storage', label: 'Storage Collections', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80' },
]

export default function CollectionsPage() {
  const { type } = useParams()

  if (!type) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="py-12">
          <p className="eyebrow text-intarno-mid mb-3">Our Signature Series</p>
          <h1 className="section-title mb-10">Collections</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {collectionTypes.map(col => (
              <Link key={col.id} to={`/collections/${col.id}`} className="group relative overflow-hidden aspect-[4/3]">
                <img
                  src={col.image}
                  alt={col.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <h2 className="font-display text-2xl font-light">{col.label}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const col = collectionTypes.find(c => c.id === type)
  const collectionProducts = products.filter(p => p.category === type || (type === 'armchairs' && p.category === 'chairs'))

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
      {/* Hero */}
      {col && (
        <div className="relative h-64 md:h-80 overflow-hidden mb-10 -mx-4 md:-mx-8 lg:-mx-12">
          <img src={col.image} alt={col.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end pb-8 px-4 md:px-8 lg:px-12">
            <h1 className="font-display text-4xl md:text-5xl text-white font-light">{col.label}</h1>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-4 pb-16">
        {collectionProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {collectionProducts.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="font-display text-2xl font-light text-intarno-mid mb-4">Collection coming soon</p>
            <Link to="/shop" className="btn-primary">Explore all furniture</Link>
          </div>
        )}
      </div>
    </div>
  )
}
