import React from 'react'
import HeroSection from '../components/sections/HeroSection'
import NewReleaseSection from '../components/sections/NewReleaseSection'
import FeaturedProduct from '../components/sections/FeaturedProduct'
import PreviousCollections from '../components/sections/PreviousCollections'
import FAQSection from '../components/sections/FAQSection'
import NewsletterSection from '../components/sections/NewsletterSection'
import MasonryGallerySection from '../components/sections/MasonGallery'
import NewsletterPopup from '../components/NewsletterPopup'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <NewReleaseSection />
      <FeaturedProduct />
      <PreviousCollections />
      <FAQSection />
      <MasonryGallerySection />
      <NewsletterSection />
      <NewsletterPopup />
    </div>
  )
}

export default Home;