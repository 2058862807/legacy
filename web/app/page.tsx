'use client'
import React from 'react'
import Navbar from '../components/Layout/Navbar'
import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'
import StateBadge from '../components/Compliance/StateBadge'
import Trust from '../components/Home/Trust'
import PricingCards from '../components/Pricing/PricingCards'
import HomeCTA from '../components/Home/HomeCTA'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <StateBadge />
      <Trust />
      <PricingCards />
      <HomeCTA />
      <Footer />
    </div>
  )
}