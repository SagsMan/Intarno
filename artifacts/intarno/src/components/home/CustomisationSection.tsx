import { Link } from 'react-router-dom'
import { Palette, Ruler, Sparkles } from 'lucide-react'

const options = [
  {
    Icon: Ruler,
    title: 'Choose your configuration',
    description: 'Every piece adapts to your space. Select from modular configurations designed to fit any room, any lifestyle.',
  },
  {
    Icon: Palette,
    title: 'Select your materials',
    description: 'Over 300 fabric, leather and finish options. From warm velvets to durable performance textiles — the choice is yours.',
  },
  {
    Icon: Sparkles,
    title: 'Refine with a designer',
    description: 'Our Interior Designers will guide you through every decision, ensuring a result that is uniquely and perfectly yours.',
  },
]

export default function CustomisationSection() {
  return (
    <section className="py-16 md:py-28 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text + options */}
          <div>
            <p className="eyebrow text-intarno-accent mb-4">Tailored to you</p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
              Endless possibilities,<br />
              <span className="italic">tailored to you</span>
            </h2>
            <p className="text-intarno-mid text-base leading-relaxed mb-10 max-w-md">
              Our collections are created with customisation in mind. Choose your configuration and materials to craft a design that is uniquely yours, or turn to our Interior Designers to help refine your vision.
            </p>

            {/* Feature list */}
            <div className="space-y-6 mb-10">
              {options.map(({ Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-intarno-cream">
                    <Icon size={18} className="text-intarno-charcoal" />
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">{title}</p>
                    <p className="text-intarno-mid text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link to="/contact#samples" className="btn-primary">
                Get free fabric samples
              </Link>
              <Link to="/contact" className="btn-ghost text-intarno-black">
                Help customising
              </Link>
            </div>
          </div>

          {/* Image collage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 aspect-video overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80"
                alt="Customise your sofa"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80"
                alt="Fabric swatches"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80"
                alt="Material selection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
