'use client'

import React from 'react'
import Navbar from '@/components/landing-component/Navbar'
import Hero from '@/components/landing-component/Hero'
import Service from '@/components/landing-component/Service'
import VideoSection from '@/components/landing-component/VideoSection'
import PricingSection from '@/components/landing-component/PricingSection'
import Team from '@/components/landing-component/Team'
import Faq from '@/components/landing-component/Faq'
import Call from '@/components/landing-component/Call'
import Testimoni from '@/components/landing-component/Testimoni'
import Contact from '@/components/landing-component/Contact'
import Footer from '@/components/landing-component/Footer'

const page = () => {
  return (
    <div className='max-w-screen'>
      <Navbar />
      <Hero />
      <Service />
      <VideoSection />
      <PricingSection />
      <Team />
      {/* <Faq /> */}
      {/* <Call /> */}
      <Testimoni />
      <Contact />
      <Footer />
    </div>
  )
}

export default page