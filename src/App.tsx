import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CollectionsPage from './pages/CollectionsPage'
import RoomsPage from './pages/RoomsPage'
import InspirationPage from './pages/InspirationPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
