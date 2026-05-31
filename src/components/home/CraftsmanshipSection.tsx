import { Link } from 'react-router-dom'

const craftImages = [
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
  'https://images.unsplash.com/photo-1416339442236-8ceb164046f8?w=400&q=80',
]

export default function CraftsmanshipSection() {
  return (
    <section className="py-16 md:py-24 bg-intarno-black text-intarno-white overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <p className="eyebrow text-intarno-accent mb-4">Our Heritage</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8">
              More than 70 years of<br />
              <span className="italic">Danish design</span> &amp;<br />
              craftsmanship
            </h2>
            <p className="text-intarno-light text-base leading-relaxed mb-8 max-w-md">
              Born in Scandinavia, Intarno grew from a small cabinetmakers' workshop into a global design brand — merging Nordic craft traditions with smart innovation to create customisable, contemporary furniture for real life.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { value: '70+', label: 'Years of craft' },
                { value: '65+', label: 'Countries' },
                { value: '300+', label: 'Material options' },
              ].map(({ value, label }) => (
                <div key={label} className="border-l border-white/20 pl-4">
                  <p className="font-display text-3xl font-light text-intarno-accent">{value}</p>
                  <p className="text-intarno-light text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium tracking-wider border-b border-white/40 pb-0.5 hover:border-intarno-accent hover:text-intarno-accent transition-all">
              Our history
            </Link>
          </div>

          {/* Image mosaic */}
          <div className="grid grid-cols-2 gap-3">
            {craftImages.map((src, i) => (
              <div
                key={i}
                className={`overflow-hidden ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
              >
                <img
                  src={src}
                  alt="Craftsmanship"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
