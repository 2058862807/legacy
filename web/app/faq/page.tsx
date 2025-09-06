'use client'
import React, { useState } from 'react'
import Navbar from '../../components/Layout/Navbar'
import Footer from '../../components/Footer'

const faqs = [
  {
    question: 'What is MetaMask?',
    answer: 'MetaMask is a secure digital wallet used by millions to manage cryptocurrency and blockchain assets.\n\nYou do not need MetaMask to use our service. Your estate plan will always be notarized on the blockchain, and all blockchain fees are already included in your package.\n\nMetaMask is optional. Only connect it if you want to link your crypto holdings and include them in your estate plan.\n\nOnce connected, your wallet address will appear in your dashboard and your estate plan will include your crypto assets.\n\nBottom line: Most users skip this step. MetaMask is there for advanced users who want to add digital assets.',
    id: 'metamask'
  },
  {
    question: 'What is NexteraEstate?',
    answer: 'An online tool to create estate documents, pay, and complete notarization where allowed.'
  },
  {
    question: 'Do you replace a lawyer?',
    answer: 'No. We provide software and general information. For complex situations or legal advice, consult with a qualified attorney.'
  },
  {
    question: 'Is online notarization available everywhere?',
    answer: 'No. Some states require in-person steps. We show your state rules before payment so you know exactly what to expect.'
  },
  {
    question: 'How do payments work?',
    answer: 'We use Stripe for secure payments. You see the exact price and terms before you pay. No hidden fees or surprises.'
  },
  {
    question: 'Do I need a crypto wallet for blockchain features?',
    answer: 'No! You don\'t need any cryptocurrency wallet or technical knowledge. We handle all blockchain operations behind the scenes, and all fees are included in your plan. It\'s completely automatic and hassle-free.'
  },
  {
    question: 'What is blockchain proof?',
    answer: 'We store a hash of your file on Blockchain to prove existence and timestamp. This creates an immutable record of when your document was created. No crypto wallet required - all blockchain fees are included in your plan.'
  },
  {
    question: 'Can I export my documents?',
    answer: 'Yes. You can download your files anytime in PDF format. Your documents belong to you.'
  },
  {
    question: 'What about refunds?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact support@nexteraestate.com for a full refund.'
  },
  {
    question: 'How secure is my information?',
    answer: 'We use HTTPS encryption, Stripe for payments, and Google for authentication. We store only what we need and never sell your data.'
  },
  {
    question: 'What is the notarization timeline?',
    answer: 'Online notarization (where available) can be completed immediately. In-person requirements vary by state and location - typically 1-7 days to schedule.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about NexteraEstate
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <span className="text-gray-500 text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to help.
          </p>
          <a
            href="mailto:support@nexteraestate.com"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}