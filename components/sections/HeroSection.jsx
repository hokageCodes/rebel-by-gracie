"use client"
import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  const [heroContent, setHeroContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch('/api/content/home')
        const data = await response.json()
        
        if (data.success && data.content?.sections?.hero) {
          setHeroContent(data.content.sections.hero)
        }
      } catch (error) {
        console.error('Error fetching hero content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroContent()
  }, [])

  const defaultContent = {
    centerContent: {
      title: "Handcrafted Luxury Bags",
      subtitle: "Premium Quality, Timeless Design",
      description: "Discover our collection of handcrafted bags made with the finest materials",
      ctaText: "Shop Now",
      ctaLink: "/shop",
      ctaStyle: "primary"
    },
    background: { type: "gradient" }
  }

  const content = heroContent || defaultContent

  const renderCTA = () => {
    if (!content.centerContent?.ctaText) return null

    const baseClasses = "px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 lg:px-8 lg:py-3 xl:px-10 xl:py-4 rounded-md sm:rounded-lg font-semibold text-sm sm:text-base md:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
    const styleClasses = {
      primary: "bg-white text-[#4a2c23] hover:bg-gray-100",
      secondary: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#4a2c23]",
      outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#4a2c23]"
    }

    const ctaClasses = `${baseClasses} ${styleClasses[content.centerContent.ctaStyle] || styleClasses.primary}`

    if (content.centerContent.ctaLink) {
      return (
        <Link href={content.centerContent.ctaLink} className={ctaClasses}>
          {content.centerContent.ctaText}
        </Link>
      )
    }

    return <button className={ctaClasses}>{content.centerContent.ctaText}</button>
  }

  const renderBackground = () => {
    switch (content.background?.type) {
      case 'solid':
        return {
          backgroundColor: content.backgroundColor || '#4a2c23'
        }
      case 'image':
        return {
          backgroundImage: `url(${content.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'gradient':
      default:
        return {
          background: 'linear-gradient(to right, #4a2c23, #b08968)'
        }
    }
  }

  const renderImage = (imageData, position) => {
    if (!imageData?.url) return null

    const imageElement = (
      <div className="relative w-[200px] h-64 sm:w-[220px] sm:h-72 md:w-[260px] md:h-80 lg:w-[280px] lg:h-96 xl:w-[320px] xl:h-[450px] 2xl:w-[360px] 2xl:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl group">
        <Image
          src={imageData.url}
          alt={imageData.alt || `${position} hero image`}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
      </div>
    )

    if (imageData.link) {
      return (
        <Link href={imageData.link} className="block">
          {imageElement}
        </Link>
      )
    }

    return imageElement
  }

  if (loading) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/gallery/1.jpeg')`,
          }}
        />
        {/* Loading Spinner */}
        <div className="relative z-10 animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    )
  }

  return (
    <section 
      className="relative min-h-screen h-screen flex items-center justify-center text-white overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${content.background?.imageUrl || '/gallery/1.jpeg'})`,
        }}
      />
      
      {/* Content Container */}
      <div className="container relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
          
          {/* Left Image */}
          <div className="hidden lg:block flex-shrink-0">
            {renderImage(content.leftImage, 'Left')}
          </div>

          {/* Center Content */}
          {/* <div className="relative flex-1 max-w-4xl text-center space-y-4 sm:space-y-5 md:space-y-5 lg:space-y-6 px-4 sm:px-6 lg:px-8">
            {content.centerContent?.title && (
              <h1 className="relative hidden md:block sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold tracking-tight leading-tight text-white [text-shadow:_3px_3px_10px_rgb(0_0_0_/_0.9),_0_0_25px_rgb(0_0_0_/_0.6)]">
                {content.centerContent.title}
              </h1>
            )}
            
            {content.centerContent?.subtitle && (
              <h2 className="relative hidden md:block text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-semibold lg:font-medium text-white lg:opacity-90 leading-relaxed [text-shadow:_2px_2px_8px_rgb(0_0_0_/_0.9),_0_0_20px_rgb(0_0_0_/_0.6)]">
                {content.centerContent.subtitle}
              </h2>
            )}
            
            <div className="pt-4 hidden md:block sm:pt-4 md:pt-4 lg:pt-6">
              {renderCTA()}
            </div>
          </div> */}

          {/* Right Image */}
          <div className="hidden lg:block flex-shrink-0">
            {renderImage(content.rightImage, 'Right')}
          </div>

        </div>

        {/* Tablet & Mobile Images */}
        <div className="lg:hidden mt-8 sm:mt-10 md:mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-sm sm:max-w-md md:max-w-lg mx-auto px-8">
          {content.leftImage?.url && (
            <div className="flex justify-center">
              {renderImage(content.leftImage, 'Left')}
            </div>
          )}
          {content.rightImage?.url && (
            <div className="flex justify-center">
              {renderImage(content.rightImage, 'Right')}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}