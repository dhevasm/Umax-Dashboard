'use client'

import React from 'react'
import Navbar from '@/components/landing-components/Navbar'
import Hero from '@/components/landing-components/Hero'
import Service from '@/components/landing-components/Service'
import VideoSection from '@/components/landing-components/VideoSection'
import PricingSection from '@/components/landing-components/PricingSection'
import Team from '@/components/landing-components/Team'
import Faq from '@/components/landing-components/Faq'
import Call from '@/components/landing-components/Call'
import Testimoni from '@/components/landing-components/Testimoni'
import Contact from '@/components/landing-components/Contact'
import Footer from '@/components/landing-components/Footer'

const page = () => {
  return (
    <div className='max-w-screen'>
      <style>
        {
          `
        html{
            scroll-behavior: smooth;  
          }
        `
        }
        
      </style>
      <Navbar />
      <Hero/>
      <Service />
      <VideoSection />
      <PricingSection />
      {/* <Team /> */}
      {/* <Faq /> */}
      {/* <Call /> */}
      {/* <Testimoni /> */}
      <Contact />
      <Footer />
    </div>
  )
}

export default page