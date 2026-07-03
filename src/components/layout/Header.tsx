import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, ShoppingBag, Heart, MapPin, CalendarDays, Sun, Moon } from 'lucide-react'
import { navItems } from '../../data/navigation'
import MegaMenu from './MegaMenu'
import MobileMenu from './MobileMenu'
import SearchOverlay from '../ui/SearchOverlay'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useTheme } from '../../contexts/ThemeContext'

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { count: wishlistCount } = useWishlist()
  const { count: cartCount } = useCart()
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Run once on mount to set correct initial state
    handleScroll()
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

  // On homepage when not yet scrolled: transparent overlay mode
  const isTransparent = isHome && !scrolled

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent'
            : scrolled
              ? 'bg-intarno-white/95 backdrop-blur-md shadow-sm border-b border-intarno-cream'
              : 'bg-intarno-white border-b border-intarno-cream/60'
        }`}
      >
        {/* Utility top bar — only visible when solid (scrolled or not homepage) */}
        <div className={`hidden lg:block border-b transition-all duration-300 overflow-hidden ${
          isTransparent ? 'max-h-0 border-transparent opacity-0' : 'max-h-12 border-intarno-cream/60 opacity-100'
        }`}>
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex items-center justify-between h-9">
              <div className="flex items-center gap-5">
                <Link
                  to="/contact#stores"
                  className="flex items-center gap-1.5 text-[11px] text-intarno-mid hover:text-intarno-black transition-colors tracking-wide"
                >
                  <MapPin size={12} />
                  Find a store
                </Link>
                <Link
                  to="/about#professionals"
                  className="text-[11px] text-intarno-mid hover:text-intarno-black transition-colors tracking-wide"
                >
                  Professionals
                </Link>
              </div>
              <div className="flex items-center gap-5">
                <Link
                  to="/contact#samples"
                  className="text-[11px] text-intarno-mid hover:text-intarno-black transition-colors tracking-wide"
                >
                  Order free samples
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 text-[11px] font-medium text-intarno-black hover:text-intarno-accent transition-colors tracking-wide"
                >
                  <CalendarDays size={12} />
                  Make an appointment
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main header row */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X size={22} className={isTransparent ? 'text-white' : ''} />
                : <Menu size={22} className={isTransparent ? 'text-white' : ''} />
              }
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0"
            >
              <img
                src="/logo.svg"
                alt="Intarno"
                className={`h-7 w-auto transition-all duration-300 ${isTransparent ? 'brightness-0 invert' : ''}`}
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-8"
              onMouseLeave={handleMouseLeave}
            >
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children ? handleMouseEnter(item.label) : undefined}
                >
                  <Link
                    to={item.href}
                    className={`nav-link text-sm font-medium py-6 inline-block border-b-2 transition-all duration-200 ${
                      isTransparent
                        ? `text-white/90 hover:text-white ${activeMenu === item.label ? 'border-white' : 'border-transparent hover:border-white/50'}`
                        : `${activeMenu === item.label ? 'border-intarno-black' : 'border-transparent hover:border-intarno-light'}`
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
                className={`p-2 transition-colors ${isTransparent ? 'text-white hover:text-white/70' : 'hover:text-intarno-accent'}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                className={`p-2 transition-colors hidden md:block relative ${isTransparent ? 'text-white hover:text-white/70' : 'hover:text-intarno-accent'}`}
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-medium transition-colors ${
                    isTransparent ? 'bg-white text-intarno-black' : 'bg-red-500 text-white'
                  }`}>
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>
              {/* Dark / light toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 transition-colors hidden md:flex items-center justify-center ${isTransparent ? 'text-white hover:text-white/70' : 'text-intarno-mid hover:text-intarno-accent'}`}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              <Link
                to="/cart"
                className={`p-2 transition-colors relative ${isTransparent ? 'text-white hover:text-white/70' : 'hover:text-intarno-accent'}`}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-medium transition-colors ${
                    isTransparent ? 'bg-white text-intarno-black' : 'bg-intarno-accent text-intarno-white'
                  }`}>{cartCount > 9 ? '9+' : cartCount}</span>
                )}
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
