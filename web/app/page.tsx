'use client'
import React from 'react'
import Navbar from '../components/Layout/Navbar'
import Hero from '../components/Home/Hero'
import HowItWorks from '../components/Home/HowItWorks'
import ChatBots from '../components/Home/ChatBots'
import LiveEstateFeature from '../components/LiveEstate/LiveEstateFeature'
import Features from '../components/Home/Features'
import StateBadge from '../components/Compliance/StateBadge'
import Trust from '../components/Home/Trust'
import SimplePricingCards from '../components/Pricing/SimplePricingCards'
import HomeCTA from '../components/Home/HomeCTA'
import Footer from '../components/Footer'
import Bot from '../components/Bot'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ChatBots />
      <LiveEstateFeature />
      <Features />
      <StateBadge />
      <Trust />
      <SimplePricingCards />
      <HomeCTA />
      <Footer />
      
      {/* Esquire AI Chat Bot */}
      <Bot type="help" />
    </div>
  )
}