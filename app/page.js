import React from 'react'
import HeroSection from '../components/sections/HeroSection'
import NewReleaseSection from '../components/sections/NewReleaseSection'
import FeaturedProduct from '../components/sections/FeaturedProduct'
import PreviousCollections from '../components/sections/PreviousCollections'
import FAQSection from '../components/sections/FAQSection'
import NewsletterSection from '../components/sections/NewsletterSection'
import MasonryGallerySection from '../components/sections/MasonGallery'

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
    </div>
  )
}

export default Home;