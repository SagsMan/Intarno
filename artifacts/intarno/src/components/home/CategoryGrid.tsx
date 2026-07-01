import { Link } from 'react-router-dom'
import { categories } from '../../data/products'

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-20 max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
      <div className="mb-10">
        <p className="eyebrow text-intarno-mid mb-2">Explore</p>
        <h2 className="section-title">What are you looking for?</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop/${cat.id}`}
            className="group flex flex-col items-center gap-2.5"
          >
            <div className="w-full aspect-square overflow-hidden bg-intarno-cream">
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <span className="text-xs font-medium tracking-wide text-center group-hover:text-intarno-accent transition-colors">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
