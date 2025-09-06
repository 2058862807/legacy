import PricingCards from '../../components/Pricing/PricingCards'
import Bot from '../../components/Bot'

export default function Pricing() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete Pricing Details
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect estate planning solution for your family. All plans include our cutting-edge AI legal assistance, 50-state compliance, and secure document management.
            </p>
          </div>

          {/* Pricing Cards */}
          <PricingCards />

          {/* FAQ Section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">What's included in the Essential plan?</h3>
                <p className="text-gray-600 text-sm">
                  All core estate planning documents including wills, healthcare directives, power of attorney, automatic legal updates when laws change, secure document storage, and 24/7 AI legal assistant.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">How does the Lifetime plan work?</h3>
                <p className="text-gray-600 text-sm">
                  Pay once, own forever. You get lifetime access to all current and future features, priority support, and all legal updates. No recurring fees, ever.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Is my data secure?</h3>
                <p className="text-gray-600 text-sm">
                  Yes. We use bank-level encryption, secure data centers, and blockchain technology for document verification. Your sensitive information is protected with the highest security standards.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibent text-gray-900 mb-3">Can I upgrade or downgrade plans?</h3>
                <p className="text-gray-600 text-sm">
                  You can upgrade to the Lifetime plan at any time. The Free plan has no limitations on duration. All paid plans include a 60-day money-back guarantee.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">What makes NexteraEstate different?</h3>
                <p className="text-gray-600 text-sm">
                  We're the only platform combining AI legal guidance, automatic compliance updates, gasless blockchain notarization, and live estate monitoring - all in one integrated solution.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! All paid plans include a 60-day money-back guarantee. If you're not completely satisfied, contact us for a full refund, no questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-24 text-center bg-white rounded-2xl p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our estate planning experts are here to help you choose the right plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Schedule Free Consultation
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Chat with Support
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Bot type="help" />
    </>
  )
}