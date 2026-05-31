import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, ShoppingBag, Heart } from 'lucide-react'
import { navItems } from '../../data/navigation'
import MegaMenu from './MegaMenu'
import MobileMenu from './MobileMenu'
import SearchOverlay from '../ui/SearchOverlay'

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setActiveMenu(null)
    setMobileOpen(false)
  }, [location])

  const handleMouseEnter = (label: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current)
    setActiveMenu(label)
  }

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-intarno-white/95 backdrop-blur-md shadow-sm border-b border-intarno-cream'
            : 'bg-intarno-white border-b border-intarno-cream/60'
        }`}
      >
        {/* Main header row */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0"
            >
              <img src="/logo.svg" alt="Intarno" className="h-7 w-auto" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" onMouseLeave={handleMouseLeave}>
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children ? handleMouseEnter(item.label) : undefined}
                >
                  <Link
                    to={item.href}
                    className={`nav-link text-sm font-medium py-6 inline-block border-b-2 transition-all duration-200 ${
                      activeMenu === item.label
                        ? 'border-intarno-black'
                        : 'border-transparent hover:border-intarno-light'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 md:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:text-intarno-accent transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button className="p-2 hover:text-intarno-accent transition-colors hidden md:block" aria-label="Wishlist">
                <Heart size={20} />
              </button>
              <Link to="/cart" className="p-2 hover:text-intarno-accent transition-colors relative">
                <ShoppingBag size={20} />
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-intarno-black text-intarno-white text-[10px] flex items-center justify-center font-medium">0</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        {activeMenu && (
          <div onMouseEnter={() => handleMouseEnter(activeMenu)} onMouseLeave={handleMouseLeave}>
            <MegaMenu
              item={navItems.find(i => i.label === activeMenu)!}
              onClose={() => setActiveMenu(null)}
            />
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
