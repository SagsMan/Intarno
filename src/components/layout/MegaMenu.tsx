import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { NavItem } from '../../data/navigation'

interface MegaMenuProps {
  item: NavItem
  onClose: () => void
}

export default function MegaMenu({ item, onClose }: MegaMenuProps) {
  if (!item.children) return null

  return (
    <div className="absolute top-full left-0 right-0 bg-intarno-white border-t border-intarno-cream shadow-xl animate-slide-down z-40">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Category links */}
          <div className="col-span-4">
            <p className="eyebrow mb-5 text-intarno-light">{item.label}</p>
            <ul className="space-y-1">
              {item.children.map((child) => (
                <li key={child.label}>
                  <Link
                    to={child.href}
                    onClick={onClose}
                    className="flex items-center justify-between group py-2 text-intarno-charcoal hover:text-intarno-black transition-colors border-b border-transparent hover:border-intarno-cream"
                  >
                    <span className="font-body text-sm font-medium">{child.label}</span>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-intarno-accent"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={item.href}
              onClick={onClose}
              className="inline-flex items-center gap-2 mt-6 text-xs font-medium tracking-wider uppercase text-intarno-mid hover:text-intarno-black transition-colors"
            >
              View all {item.label}
              <ChevronRight size={12} />
            </Link>
          </div>

          {/* Featured images */}
          {item.featured && (
            <div className="col-span-8">
              <div className={`grid gap-4 ${item.featured.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {item.featured.map((feat) => (
                  <Link
                    key={feat.title}
                    to={feat.href}
                    onClick={onClose}
                    className="group relative overflow-hidden block aspect-[4/3]"
                  >
                    <img
                      src={feat.image}
                      alt={feat.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-display text-xl font-light">{feat.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No featured — wider links */}
          {!item.featured && (
            <div className="col-span-8 grid grid-cols-3 gap-4">
              {/* Empty state or promo */}
              <div className="col-span-3 flex items-center justify-center h-32 bg-intarno-cream/50">
                <p className="font-display text-2xl font-light italic text-intarno-mid">Find your perfect space</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
