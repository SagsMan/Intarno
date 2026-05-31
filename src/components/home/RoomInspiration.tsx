import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const rooms = [
  {
    id: 'living',
    title: 'Herlev: modern home',
    label: 'Living Room',
    image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=600&q=80',
    href: '/rooms/living',
  },
  {
    id: 'dining',
    title: 'Bergen: family dining',
    label: 'Dining Room',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80',
    href: '/rooms/dining',
  },
  {
    id: 'bedroom',
    title: 'Copenhagen: sanctuary',
    label: 'Bedroom',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80',
    href: '/rooms/bedrooms',
  },
  {
    id: 'office',
    title: 'Oslo: creative studio',
    label: 'Home Office',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    href: '/rooms/offices',
  },
  {
    id: 'outdoor',
    title: 'Malmö: terrace life',
    label: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80',
    href: '/rooms/outdoor',
  },
]

export default function RoomInspiration() {
  return (
    <section className="py-16 md:py-24 max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="eyebrow text-intarno-mid mb-2">Room by room</p>
          <h2 className="section-title">
            Discover real homes<br className="hidden md:block" />
            <span className="italic"> styled by our designers</span>
          </h2>
        </div>
        <Link to="/rooms" className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wide hover:text-intarno-accent transition-colors group">
          All rooms
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid layout: 2 large + 3 small */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {rooms.slice(0, 2).map((room) => (
          <Link key={room.id} to={room.href} className="group relative overflow-hidden aspect-[3/4]">
            <img
              src={room.image}
              alt={room.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-[10px] tracking-widest uppercase font-medium text-white/70 mb-1">{room.label}</p>
              <p className="font-display text-lg font-light">{room.title}</p>
            </div>
          </Link>
        ))}
        <div className="grid grid-rows-3 gap-4 md:col-span-1 col-span-2 md:grid-cols-1 grid-cols-3">
          {rooms.slice(2).map((room) => (
            <Link key={room.id} to={room.href} className="group relative overflow-hidden">
              <div className="aspect-video md:aspect-[4/3] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-[10px] tracking-widest uppercase font-medium text-white/70">{room.label}</p>
                  <p className="font-display text-sm font-light hidden md:block">{room.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
