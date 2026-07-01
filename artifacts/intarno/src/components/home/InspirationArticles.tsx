import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const articles = [
  {
    id: '1',
    title: '5 tips for selecting the perfect sofa',
    excerpt: 'In Scandinavian design, every piece tells a story of comfort, style and craftsmanship. Choosing the perfect sofa is about creating a space that truly feels like home.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=75',
    category: 'Buying Guide',
    href: '/inspiration/sofa-guide',
  },
  {
    id: '2',
    title: 'How do I choose the perfect dining chair?',
    excerpt: 'Size, colour, material, design, budget — there are so many factors. Our comprehensive guide covers all the important questions when buying a dining chair.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=75',
    category: 'Buying Guide',
    href: '/inspiration/dining-chair-guide',
  },
  {
    id: '3',
    title: 'Dining table buyer\'s guide',
    excerpt: 'You\'ll use your dining table for 5–10 years. To help you make the right decision, we\'ve put together this comprehensive buying guide.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=75',
    category: 'Buying Guide',
    href: '/inspiration/dining-table-guide',
  },
]

export default function InspirationArticles() {
  return (
    <section className="py-16 md:py-24 max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="eyebrow text-intarno-mid mb-2">Style advice & expert tips</p>
          <h2 className="section-title">
            Buying guides.<br />
            <span className="italic">Expert tips.</span>
          </h2>
        </div>
        <Link to="/inspiration" className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wide hover:text-intarno-accent transition-colors group">
          All articles
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {articles.map((article) => (
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
            <p className="text-intarno-mid text-sm leading-relaxed line-clamp-2 mb-3">
              {article.excerpt}
            </p>
            <span className="text-xs font-medium tracking-wider uppercase border-b border-intarno-black pb-0.5 group-hover:border-intarno-accent group-hover:text-intarno-accent transition-all">
              Read more
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
