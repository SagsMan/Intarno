import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-intarno-charcoal -mt-16 md:-mt-[4.5rem]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=85"
          alt="Contemporary living room"
          className="w-full h-full object-cover img-reveal"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      </div>

      {/* Content — padded top to clear the header */}
      <div className="relative h-full min-h-screen flex items-end pb-16 md:pb-24 pt-32 md:pt-36">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 w-full">
          <div className="max-w-xl animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <p className="eyebrow text-intarno-accent mb-4">New Collection 2026</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-6">
              Elegantly designed<br />
              <span className="italic">for comfort</span> and calm
            </h1>
            <p className="text-white/70 font-light text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              Discover our latest Nordic sofa collections — crafted for real life, designed to last generations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/collections/sofas" className="btn-primary">
                Explore Sofas
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-white text-sm font-medium tracking-wider border-b border-white/40 pb-0.5 hover:border-white transition-colors"
              >
                Shop All Furniture <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Scroll indicator — hidden on small screens to avoid overflow */}
          <div className="hidden sm:flex absolute right-8 md:right-12 bottom-12 flex-col items-center gap-2 text-white/50 animate-fade-in" style={{ animationDelay: '1s', opacity: 0 }}>
            <div className="w-px h-12 bg-white/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full bg-white/60 animate-[scrollLine_2s_ease_infinite]" style={{ height: '40%' }} />
            </div>
            <span className="text-[9px] tracking-[0.2em] uppercase">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  )
}
