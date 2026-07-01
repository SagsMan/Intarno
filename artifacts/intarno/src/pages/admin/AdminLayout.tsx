import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, Users, MessageSquare, ShoppingCart, Images, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Projects', path: '/admin/projects', icon: Images },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const getPageTitle = () => {
    const item = navItems.find(i => i.path === location.pathname)
    return item ? item.name : 'Admin Portal'
  }

  return (
    <div className="min-h-screen bg-intarno-cream flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-intarno-charcoal text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <span className="font-display tracking-widest text-lg text-intarno-accent">INTARNO ADMIN</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-intarno-charcoal text-intarno-light flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:block border-b border-white/5">
          <h2 className="font-display text-xl tracking-[0.2em] text-intarno-accent">INTARNO</h2>
          <p className="text-[10px] tracking-widest uppercase mt-1 text-intarno-mid">Admin Portal</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-intarno-accent/10 text-intarno-accent border border-intarno-accent/20' 
                    : 'hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={18} className={isActive ? 'text-intarno-accent' : 'opacity-70'} />
                <span className="tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="mb-4 px-4">
            <p className="text-xs text-intarno-mid truncate">{admin?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-400/80 hover:bg-red-400/10 hover:text-red-400 rounded-sm transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white px-8 py-5 border-b border-intarno-light/20 flex items-center justify-between sticky top-0 z-20 hidden md:flex">
          <h1 className="font-display text-2xl text-intarno-black">{getPageTitle()}</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-intarno-cream flex items-center justify-center text-intarno-accent font-display text-lg">
              {admin?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-medium text-intarno-charcoal">{admin?.name || 'Administrator'}</span>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
