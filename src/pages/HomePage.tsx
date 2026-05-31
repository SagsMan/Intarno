import HeroSection from '../components/home/HeroSection'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedProducts from '../components/home/FeaturedProducts'
import MidBanner from '../components/home/MidBanner'
import RoomInspiration from '../components/home/RoomInspiration'
import CraftsmanshipSection from '../components/home/CraftsmanshipSection'
import InspirationArticles from '../components/home/InspirationArticles'
import CTASection from '../components/home/CTASection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <MidBanner />
      <RoomInspiration />
      <CraftsmanshipSection />
      <InspirationArticles />
      <CTASection />
    </div>
  )
}
