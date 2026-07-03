import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext'

// ─── Public layout & pages (non-lazy for instant navigation) ────────────────
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CollectionsPage from './pages/CollectionsPage'
import RoomsPage from './pages/RoomsPage'
import InspirationPage from './pages/InspirationPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

// ─── Admin layout — imported directly (NOT lazy) so sidebar never disappears ─
//     during page-to-page navigation inside the admin.
import AdminLayout from './layouts/AdminLayout'

// ─── Secondary public pages (lazy — rarely visited) ─────────────────────────
const DesignServicesPage    = lazy(() => import('./pages/DesignServicesPage'))
const CustomFurniturePage   = lazy(() => import('./pages/CustomFurniturePage'))
const KitchenCabinetsPage   = lazy(() => import('./pages/KitchenCabinetsPage'))
const DoorsPage             = lazy(() => import('./pages/DoorsPage'))
const TvConsolesPage        = lazy(() => import('./pages/TvConsolesPage'))
const FactoryPage           = lazy(() => import('./pages/FactoryPage'))
const ProjectsPortfolioPage = lazy(() => import('./pages/ProjectsPortfolioPage'))
const ProjectDetailPage     = lazy(() => import('./pages/ProjectDetailPage'))

// ─── Admin pages (lazy — Suspense lives inside AdminLayout now) ──────────────
const AdminLoginPage      = lazy(() => import('./pages/admin/LoginPage'))
const AdminDashboardPage  = lazy(() => import('./pages/admin/DashboardPage'))
const AdminProductsPage   = lazy(() => import('./pages/admin/ProductsPage'))
const AdminCategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'))
const AdminCustomersPage  = lazy(() => import('./pages/admin/CustomersPage'))
const AdminInquiriesPage  = lazy(() => import('./pages/admin/InquiriesPage'))
const AdminOrdersPage     = lazy(() => import('./pages/admin/OrdersPage'))
const AdminProjectsPage   = lazy(() => import('./pages/admin/ProjectsAdminPage'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="w-6 h-6 border-2 border-[#c8a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

function PublicPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
      <Routes>
        {/* ── Public site ── wrapped in its own Suspense */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:category" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/:type" element={<CollectionsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="rooms/:type" element={<RoomsPage />} />
          <Route path="inspiration" element={<InspirationPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="design-services"   element={<Suspense fallback={<PublicPageLoader />}><DesignServicesPage /></Suspense>} />
          <Route path="custom-furniture"  element={<Suspense fallback={<PublicPageLoader />}><CustomFurniturePage /></Suspense>} />
          <Route path="kitchen-cabinets"  element={<Suspense fallback={<PublicPageLoader />}><KitchenCabinetsPage /></Suspense>} />
          <Route path="doors"             element={<Suspense fallback={<PublicPageLoader />}><DoorsPage /></Suspense>} />
          <Route path="tv-consoles"       element={<Suspense fallback={<PublicPageLoader />}><TvConsolesPage /></Suspense>} />
          <Route path="factory"           element={<Suspense fallback={<PublicPageLoader />}><FactoryPage /></Suspense>} />
          <Route path="projects"          element={<Suspense fallback={<PublicPageLoader />}><ProjectsPortfolioPage /></Suspense>} />
          <Route path="projects/:slug"    element={<Suspense fallback={<PublicPageLoader />}><ProjectDetailPage /></Suspense>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── Admin login (standalone, no layout) ── */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#1a1a1a]" />}>
              <AdminLoginPage />
            </Suspense>
          }
        />

        {/* ── Protected admin area ──
              AdminLayout is NOT lazy, so the sidebar never flashes away.
              Suspense for page content lives inside AdminLayout's <Outlet />.     ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"  element={<AdminDashboardPage />} />
          <Route path="products"   element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="customers"  element={<AdminCustomersPage />} />
          <Route path="inquiries"  element={<AdminInquiriesPage />} />
          <Route path="orders"     element={<AdminOrdersPage />} />
          <Route path="projects"   element={<AdminProjectsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <AppRoutes />
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
