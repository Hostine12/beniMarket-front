import Hero from '../components/home/Hero'
import TrustBar from '../components/home/TrustBar'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedProducts from '../components/home/FeaturedProducts'
import HowItWorks from '../components/home/HowItWorks'
import Testimonials from '../components/home/Testimonials'
import SellerCTA from '../components/home/SellerCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
      <SellerCTA />
    </>
  )
}
