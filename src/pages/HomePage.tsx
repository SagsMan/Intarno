import HeroSection from '../components/home/HeroSection'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedProducts from '../components/home/FeaturedProducts'
import OutdoorSection from '../components/home/OutdoorSection'
import TrendsSection from '../components/home/TrendsSection'
import MidBanner from '../components/home/MidBanner'
import CustomisationSection from '../components/home/CustomisationSection'
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
      <OutdoorSection />
      <TrendsSection />
      <MidBanner />
      <CustomisationSection />
      <RoomInspiration />
      <CraftsmanshipSection />
      <InspirationArticles />
      <CTASection />
    </div>
  )
}
