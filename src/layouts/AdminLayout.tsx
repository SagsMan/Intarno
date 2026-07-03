import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Users, MessageSquare,
  ShoppingCart, Images, LogOut, Menu, X, Sun, Moon,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'
import { useState, Suspense } from 'react'

const NAV_ITEMS = [
  { name: 'Dashboard',  path: '/admin/dashboard',  icon: LayoutDashboard },
  { name: 'Products',   path: '/admin/products',    icon: Package },
  { name: 'Categories', path: '/admin/categories',  icon: Tag },
  { name: 'Customers',  path: '/admin/customers',   icon: Users },
  { name: 'Inquiries',  path: '/admin/inquiries',   icon: MessageSquare },
  { name: 'Orders',     path: '/admin/orders',      icon: ShoppingCart },
  { name: 'Projects',   path: '/admin/projects',    icon: Images },
]

function AdminPageSpinner() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Logo that adapts to theme
function AdminLogo({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 200 40" fill="none" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="30" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="600"
          fontSize="28" letterSpacing="3" fill="#c8a96e">INTARNO</text>
        <circle cx="193" cy="18" r="5" fill="none" stroke="#c8a96e" strokeWidth="2" />
      </svg>
    </div>
  )
}

function AdminLayoutInner() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { admin, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const pageTitle = NAV_ITEMS.find(i => location.pathname.startsWith(i.path))?.name ?? 'Admin Portal'
  const initials  = (admin?.email?.charAt(0) ?? 'A').toUpperCase()

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-200 ${isDark ? 'admin-dark' : ''}`}>

      {/* ── Mobile top bar ─────────────────────────────────────── */}
      <div className="md:hidden bg-[#1c1c1c] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <AdminLogo isDark={isDark} />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-sm text-intarno-light hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-intarno-light hover:text-white">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#1a1a1a] text-intarno-light flex flex-col
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="px-6 py-6 hidden md:flex items-center border-b border-white/5">
          <AdminLogo isDark={isDark} />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-all duration-150
                  ${active
                    ? 'bg-intarno-accent/15 text-intarno-accent border border-intarno-accent/25'
                    : 'text-intarno-light hover:bg-white/6 hover:text-white'}
                `}
              >
                <item.icon size={17} className={active ? 'text-intarno-accent' : 'opacity-60'} />
                <span className="tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User / logout */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="px-4 py-2 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-intarno-accent/20 flex items-center justify-center text-intarno-accent text-xs font-bold shrink-0">
              {initials}
            </div>
            <p className="text-xs text-intarno-mid truncate">{admin?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-400/70 hover:bg-red-400/10 hover:text-red-400 rounded-sm transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 admin-main">

        {/* Desktop header */}
        <header className="admin-header hidden md:flex items-center justify-between px-8 py-4 border-b sticky top-0 z-20">
          <h1 className="font-display text-2xl admin-title">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sm admin-toggle transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-intarno-accent/20 flex items-center justify-center text-intarno-accent font-bold text-sm">
                {initials}
              </div>
              <span className="text-sm font-medium admin-text-secondary">{admin?.name ?? 'Administrator'}</span>
            </div>
          </div>
        </header>

        {/* Page content — Suspense scoped here so the sidebar never disappears */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto admin-content">
          <Suspense fallback={<AdminPageSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

// Wrap in ThemeProvider so toggle state lives inside the layout
export default function AdminLayout() {
  return (
    <ThemeProvider>
      <AdminLayoutInner />
    </ThemeProvider>
  )
}
