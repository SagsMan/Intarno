import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function OutdoorSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[520px]">
        {/* Image side */}
        <div className="relative order-2 lg:order-1 aspect-[4/3] lg:aspect-auto">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85"
            alt="Outdoor dining collection"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 lg:to-black/0" />
        </div>

        {/* Content side */}
        <div className="order-1 lg:order-2 bg-intarno-charcoal text-intarno-white flex items-center">
          <div className="px-8 md:px-12 lg:px-16 py-14 lg:py-20 max-w-xl">
            <p className="eyebrow text-intarno-accent mb-4">Outdoor Living</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-5xl font-light leading-tight mb-6">
              Dine outdoors with the<br />
              <span className="italic">Cancùn collection</span>
            </h2>
            <p className="text-intarno-light text-base leading-relaxed mb-8 max-w-sm">
              Discover indoor-outdoor living. Weather-resistant materials meet Danish design principles — furniture that moves seamlessly between your living space and the open air.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop/outdoor" className="btn-primary">
                Explore Outdoor
              </Link>
              <Link
                to="/rooms/outdoor"
                className="inline-flex items-center gap-2 text-intarno-white text-sm font-medium tracking-wider border-b border-white/40 pb-0.5 hover:border-white transition-colors group"
              >
                Outdoor living ideas <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
