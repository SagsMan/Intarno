import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const trends = [
  {
    id: 'warm-modernism',
    eyebrow: 'Design Trend',
    title: 'Warm Modernism',
    description:
      'Warm modernism blends the clarity of modern design with the comfort of natural materials and inviting textures. Clean lines meet earthy tones, creating interiors that feel calm, sophisticated and effortlessly welcoming.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
    href: '/inspiration/warm-modernism',
    cta: 'Explore Warm Modernism',
  },
  {
    id: 'colours-season',
    eyebrow: 'Colours of the Season',
    title: 'Rich tones,\nsoftened',
    description:
      'This season invites colour into the home in a refined and expressive way. Rich tones and soft neutrals work together to create interiors that feel fresh, balanced and personal.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80',
    href: '/inspiration/colours',
    cta: 'Discover the colours',
  },
  {
    id: 'dining-design',
    eyebrow: 'Spotlight',
    title: 'Statement dining',
    description:
      'Dining room designs that bring people together. Explore the Axo dining series — a celebration of form, function and the art of gathering around a beautiful table.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80',
    href: '/collections/tables',
    cta: 'Explore the dining series',
  },
]

export default function TrendsSection() {
  return (
    <section className="py-16 md:py-24 bg-intarno-cream/40">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow text-intarno-mid mb-2">Editorial</p>
            <h2 className="section-title">
              Trends of<br />
              <span className="italic">the season</span>
            </h2>
          </div>
          <Link
            to="/inspiration"
            className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wide hover:text-intarno-accent transition-colors group"
          >
            All trends
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trend cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {trends.map((trend) => (
            <Link key={trend.id} to={trend.href} className="group flex flex-col">
              {/* Image */}
              <div className="overflow-hidden aspect-[3/4] mb-5 bg-intarno-cream">
                <img
                  src={trend.image}
                  alt={trend.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <p className="eyebrow text-intarno-accent mb-2">{trend.eyebrow}</p>
              <h3 className="font-display text-2xl md:text-3xl font-light mb-3 group-hover:text-intarno-accent transition-colors leading-snug whitespace-pre-line">
                {trend.title}
              </h3>
              <p className="text-intarno-mid text-sm leading-relaxed mb-4 flex-1">
                {trend.description}
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase border-b border-intarno-black pb-0.5 group-hover:border-intarno-accent group-hover:text-intarno-accent transition-all self-start">
                {trend.cta} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
