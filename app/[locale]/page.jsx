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
    <div className='max-w-screen overflow-x-hidden'>
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
      <script src="https://cdn.botpress.cloud/webchat/v2/inject.js" async></script>
      <script src="https://mediafiles.botpress.cloud/40be869e-3bbd-4b55-a0a6-5dacdfaa8951/webchat/v2/config.js" async></script>
    </div>
    
  )
}

export default page