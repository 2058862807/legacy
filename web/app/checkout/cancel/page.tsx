'use client'

export default function CheckoutCancelPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">
            Your payment was cancelled. You can try again or return to browse our plans.
          </p>
        </div>
        <div className="space-y-3">
          <a
            href="/pricing"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Plans
          </a>
          <a
            href="/"
            className="block w-full text-blue-600 py-2 px-4 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}