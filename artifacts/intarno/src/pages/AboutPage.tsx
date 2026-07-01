import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1920&q=80"
          alt="About Intarno"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div>
            <p className="eyebrow text-intarno-accent mb-3">Our story</p>
            <h1 className="font-display text-5xl md:text-6xl font-light">About Intarno</h1>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <p className="eyebrow text-intarno-mid mb-4">Our heritage</p>
            <h2 className="font-display text-4xl font-light leading-tight mb-6">
              More than 70 years of<br /><span className="italic">Danish design</span>
            </h2>
            <p className="text-intarno-mid text-base leading-relaxed mb-4">
              Intarno was born in Scandinavia in the 1950s from a small cabinetmakers' workshop. Over seven decades, we have grown into a global design brand — but we have never lost sight of what made us: exceptional craft, honest materials, and an enduring belief that beautiful design should be part of everyday life.
            </p>
            <p className="text-intarno-mid text-base leading-relaxed mb-6">
              Today, Intarno is present in over 65 countries. Every piece we make is fully customisable — because we believe your home should be an expression of who you are, not a catalogue compromise.
            </p>
            <Link to="/shop" className="btn-primary">Explore our collections</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1416339442236-8ceb164046f8?w=500&q=80',
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
              'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80',
              'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&q=80',
            ].map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden">
                <img src={src} alt="Craftsmanship" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="border-t border-intarno-cream pt-16 mb-16">
          <p className="eyebrow text-intarno-mid mb-4 text-center">What we stand for</p>
          <h2 className="font-display text-4xl font-light text-center mb-12">Our values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Enduring Quality',
                desc: 'We source only the finest materials and work with master craftspeople to ensure every Intarno piece lasts for generations.',
              },
              {
                title: 'Thoughtful Customisation',
                desc: 'Every piece is made to order. Choose from hundreds of fabrics, leathers, finishes, and configurations to create something uniquely yours.',
              },
              {
                title: 'Responsible Design',
                desc: 'From sustainably sourced timber to low-impact production, we take our responsibility to the planet seriously at every step.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="text-center">
                <h3 className="font-display text-xl font-light mb-3">{title}</h3>
                <p className="text-intarno-mid text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-intarno-black text-white py-12 px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '1952', label: 'Founded' },
            { value: '65+', label: 'Countries' },
            { value: '300+', label: 'Stores' },
            { value: '300+', label: 'Material options' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-display text-4xl text-intarno-accent font-light">{value}</p>
              <p className="text-intarno-light text-xs mt-1 tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
