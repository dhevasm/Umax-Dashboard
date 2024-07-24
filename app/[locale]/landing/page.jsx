'use client'

import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Service from './components/Service'
import VideoSection from './components/VideoSection'
import PricingSection from './components/PricingSection'
import Team from './components/Team'
import Faq from './components/Faq'
import Call from './components/Call'
import Testimoni from './components/Testimoni'
import Contact from './components/Contact'
import Footer from './components/Footer'

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