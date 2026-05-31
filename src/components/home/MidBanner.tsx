import { Link } from 'react-router-dom'

export default function MidBanner() {
  return (
    <section className="py-16 md:py-0">
      <div className="max-w-screen-2xl mx-auto md:px-0">
        <div className="grid md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
          {/* Image */}
          <div className="relative overflow-hidden order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80"
              alt="Intarno armchair"
              className="w-full h-full object-cover min-h-[360px] md:min-h-auto"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 flex items-center bg-intarno-cream px-6 md:px-16 lg:px-24 py-12 md:py-16">
            <div className="max-w-lg">
              <p className="eyebrow text-intarno-mid mb-4">Beautifully crafted</p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
                Transform any space with a{' '}
                <span className="italic">living chair</span>
              </h2>
              <p className="text-intarno-mid text-base leading-relaxed mb-8">
                Our living chairs are the centrepiece of any room — organically shaped, exceptionally comfortable, and available in hundreds of material combinations.
              </p>
              <Link to="/collections/armchairs" className="btn-primary">
                Discover living chairs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
