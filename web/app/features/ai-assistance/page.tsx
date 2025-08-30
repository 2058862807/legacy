import Link from 'next/link'
import Bot from '../../../components/Bot'

export const metadata = {
  title: 'AI Assistance - NexteraEstate',
  description: 'Smart AI guidance through estate planning with personalized recommendations, legal expertise, and 24/7 support for all your estate planning needs.',
}

export default function AIAssistancePage() {
  return (
    <main className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          AI Assistance
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Smart guidance through estate planning with personalized recommendations and 24/7 expert support
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">💬</div>
          <h3 className="text-lg font-semibold mb-3">Help Bot</h3>
          <p className="text-gray-600 mb-4">
            24/7 intelligent assistance for estate planning questions, document guidance, and step-by-step support.
          </p>
          <button 
            onClick={() => window.helpBot?.open?.()} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Help Bot →
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🫂</div>
          <h3 className="text-lg font-semibold mb-3">Grief Support Bot</h3>
          <p className="text-gray-600 mb-4">
            Compassionate AI support during difficult times with crisis resources and emotional guidance.
          </p>
          <button 
            onClick={() => window.griefBot?.open?.()} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Access Support →
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold mb-3">Smart Recommendations</h3>
          <p className="text-gray-600 mb-4">
            Personalized estate planning suggestions based on your unique family situation and financial profile.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-3">Legal Knowledge Base</h3>
          <p className="text-gray-600 mb-4">
            Comprehensive database of estate planning laws, regulations, and best practices across all 50 states.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-3">Document Review</h3>
          <p className="text-gray-600 mb-4">
            AI-powered analysis of your estate planning documents for completeness and legal compliance.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-4">🔄</div>
          <h3 className="text-lg font-semibold mb-3">Continuous Learning</h3>
          <p className="text-gray-600 mb-4">
            AI that adapts and improves recommendations based on changing laws and your evolving needs.
          </p>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Capabilities</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🧠 Advanced Intelligence</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Natural language processing for complex legal queries</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Machine learning from thousands of estate plans</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Real-time legal compliance checking</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🎯 Personalized Support</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Tailored recommendations for your state</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Family structure and asset-specific guidance</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Crisis intervention and emotional support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How AI Helps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How AI Helps Your Estate Planning</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Ask Questions</h3>
            <p className="text-sm text-gray-600">Get instant answers to complex estate planning questions in plain English</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Receive Guidance</h3>
            <p className="text-sm text-gray-600">Get personalized recommendations based on your unique family and financial situation</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Document Review</h3>
            <p className="text-sm text-gray-600">Have your documents analyzed for completeness and legal compliance</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-600 font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">Ongoing Support</h3>
            <p className="text-sm text-gray-600">Receive updates when laws change or your situation requires plan adjustments</p>
          </div>
        </div>
      </div>

      {/* AI Bot Types */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Support Types</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">💬</div>
              <div>
                <h3 className="font-semibold text-gray-800">Help Bot</h3>
                <p className="text-sm text-gray-600">General estate planning assistance</p>
              </div>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Will creation guidance</li>
              <li>• Legal requirement explanations</li>
              <li>• Document completion help</li>
              <li>• Asset planning advice</li>
              <li>• Beneficiary management</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">🫂</div>
              <div>
                <h3 className="font-semibold text-gray-800">Grief Support Bot</h3>
                <p className="text-sm text-gray-600">Compassionate crisis support</p>
              </div>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Emotional support resources</li>
              <li>• Crisis intervention guidance</li>
              <li>• Bereavement planning help</li>
              <li>• Professional counseling referrals</li>
              <li>• Immediate assistance protocols</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Try Our AI Bots</h2>
        <p className="text-gray-600 mb-6">
          Experience our AI assistance right now! Click the bot widgets below to see how our AI can help with your estate planning needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.helpBot?.open?.()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Open Help Bot 💬
          </button>
          <button 
            onClick={() => window.griefBot?.open?.()} 
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Open Grief Support 🫂
          </button>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Get AI-Powered Estate Planning</h2>
        <p className="text-lg opacity-90 mb-6">
          Let our intelligent assistants guide you through every step of securing your legacy
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/will" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Start with AI Help
          </Link>
          <Link href="/login" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
            Sign Up Free
          </Link>
        </div>
      </div>

      {/* AI Bot Components */}
      <Bot type="help" />
    </main>
  )
}