import { Link } from 'react-router-dom'

const articles = [
  { id: '1', title: '5 tips for selecting the perfect sofa', category: 'Buying Guide', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=75', href: '/inspiration/sofa-guide', date: 'May 2026' },
  { id: '2', title: 'How to choose the perfect dining chair', category: 'Buying Guide', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=75', href: '/inspiration/dining-chair-guide', date: 'April 2026' },
  { id: '3', title: 'The art of Danish living', category: 'Trends', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=75', href: '/inspiration/danish-living', date: 'March 2026' },
  { id: '4', title: 'How to style a small living room', category: 'Style Tips', image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=600&q=75', href: '/inspiration/small-living-room', date: 'March 2026' },
  { id: '5', title: 'Dining table buyer\'s guide', category: 'Buying Guide', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=75', href: '/inspiration/dining-table-guide', date: 'February 2026' },
  { id: '6', title: 'Colour trends for 2026 interiors', category: 'Trends', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=75', href: '/inspiration/colour-trends', date: 'January 2026' },
]

const categories = ['All', 'Buying Guide', 'Trends', 'Style Tips', 'Professionals']

export default function InspirationPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-12">
      <div className="mb-10">
        <p className="eyebrow text-intarno-mid mb-3">Ideas & advice</p>
        <h1 className="section-title">Inspiration</h1>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            className={`shrink-0 px-4 py-2 text-xs font-medium tracking-wide border transition-all ${
              cat === 'All'
                ? 'bg-intarno-black text-white border-intarno-black'
                : 'border-intarno-light text-intarno-mid hover:border-intarno-black hover:text-intarno-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured first article */}
      <Link to={articles[0].href} className="group grid md:grid-cols-2 gap-8 mb-12">
        <div className="overflow-hidden aspect-video md:aspect-auto">
          <img
            src={articles[0].image}
            alt={articles[0].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow text-intarno-accent mb-3">{articles[0].category}</p>
          <h2 className="font-display text-3xl md:text-4xl font-light leading-snug mb-4 group-hover:text-intarno-accent transition-colors">
            {articles[0].title}
          </h2>
          <p className="text-intarno-mid text-sm mb-6">{articles[0].date}</p>
          <span className="btn-ghost w-fit">Read article</span>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(1).map(article => (
          <Link key={article.id} to={article.href} className="group">
            <div className="overflow-hidden aspect-[4/3] mb-4 bg-intarno-cream">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <p className="eyebrow text-intarno-accent mb-2">{article.category}</p>
            <h3 className="font-display text-xl font-light mb-2 group-hover:text-intarno-accent transition-colors leading-snug">
              {article.title}
            </h3>
            <p className="text-intarno-light text-xs">{article.date}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
