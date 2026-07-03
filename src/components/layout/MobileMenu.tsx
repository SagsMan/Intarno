import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronDown, X } from 'lucide-react'
import { navItems } from '../../data/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-intarno-white z-50 transform transition-transform duration-300 ease-smooth md:hidden overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-intarno-cream">
          <Link to="/" onClick={onClose}>
            <img src="/logo.svg" alt="Intarno" className="h-6 w-auto" />
          </Link>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="px-4 py-4">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full py-3.5 border-b border-intarno-cream/80 text-left"
                  >
                    <span className="font-medium text-sm tracking-wide">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`text-intarno-mid transition-transform duration-200 ${
                        expanded === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expanded === item.label && (
                    <div className="py-2 pl-4 space-y-0.5 animate-fade-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={onClose}
                          className="flex items-center justify-between py-2.5 text-sm text-intarno-mid hover:text-intarno-black transition-colors"
                        >
                          {child.label}
                          <ChevronRight size={13} />
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between w-full py-3.5 border-b border-intarno-cream/80 font-medium text-sm tracking-wide"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-6 mt-4 space-y-3 border-t border-intarno-cream">
          <Link to="/contact" onClick={onClose} className="btn-primary w-full text-center">
            Book a Consultation
          </Link>
          <Link to="/contact#stores" onClick={onClose} className="btn-secondary w-full text-center">
            Find a Store
          </Link>
        </div>
      </div>
    </>
  )
}
