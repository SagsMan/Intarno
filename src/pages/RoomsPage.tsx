import { Link, useParams } from 'react-router-dom'

const roomTypes = [
  {
    id: 'living',
    label: 'Living Rooms',
    hero: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=80',
    description: 'Transform your living room into a sanctuary for relaxation and entertaining.',
  },
  {
    id: 'dining',
    label: 'Dining Rooms',
    hero: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
    description: 'Create a space for sharing meals, stories, and memories.',
  },
  {
    id: 'bedrooms',
    label: 'Bedrooms',
    hero: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
    description: 'Design your personal retreat with furniture that soothes and restores.',
  },
  {
    id: 'outdoor',
    label: 'Outdoor Spaces',
    hero: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
    description: 'Bring Scandinavian style to your terrace, garden or balcony.',
  },
  {
    id: 'small',
    label: 'Small Spaces',
    hero: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    description: 'Smart, multifunctional solutions for apartment living and compact rooms.',
  },
  {
    id: 'offices',
    label: 'Home Offices',
    hero: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80',
    description: 'Create a productive workspace that reflects your personal style.',
  },
]

const inspirationImages = [
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=600&q=75',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=75',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=75',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=75',
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=75',
]

export default function RoomsPage() {
  const { type } = useParams()
  const room = roomTypes.find(r => r.id === type)

  if (type && room) {
    return (
      <div>
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={room.hero} alt={room.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
            <div>
              <h1 className="font-display text-5xl md:text-6xl font-light mb-4">{room.label}</h1>
              <p className="text-white/80 text-lg font-light max-w-lg">{room.description}</p>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {inspirationImages.map((src, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 md:col-span-2 aspect-video' : 'aspect-square'}`}>
                <img src={src} alt="Room inspiration" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="font-display text-2xl font-light mb-6">Ready to transform your space?</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/shop" className="btn-primary">Shop furniture</Link>
              <Link to="/contact" className="btn-secondary">Book a consultation</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-12">
      <p className="eyebrow text-intarno-mid mb-3">Find your style</p>
      <h1 className="section-title mb-10">Rooms</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roomTypes.map(room => (
          <Link key={room.id} to={`/rooms/${room.id}`} className="group relative overflow-hidden aspect-[4/3]">
            <img
              src={room.hero}
              alt={room.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <h2 className="font-display text-2xl font-light">{room.label}</h2>
              <p className="text-white/70 text-sm mt-1 max-w-xs">{room.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
