'use client'
import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: false 
      })
      if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center text-white hover:text-blue-300 transition-all duration-300">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 -mt-20">
        <div className="w-full max-w-md">
          {/* Main Login Card */}
          <div className="backdrop-blur-xl bg-white/[0.08] border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
            {/* Brand Section */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-3xl font-black text-white">NE</span>
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-3">
                NexteraEstate
              </h1>
              <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-4 rounded-full"></div>
              <p className="text-blue-100/70 text-lg font-medium">
                Secure your legacy with cutting-edge technology
              </p>
            </div>

            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-3">Welcome Back</h2>
              <p className="text-blue-200/60 leading-relaxed">
                Access your estate planning dashboard with enterprise-grade security
              </p>
            </div>

            {/* Enhanced Google Sign In Button */}
            <div className="space-y-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center px-8 py-5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {isLoading ? (
                  <div className="relative flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mr-3"></div>
                    <span className="text-lg">Authenticating...</span>
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-lg">Continue with Google</span>
                  </div>
                )}
              </button>

              {/* Security Badges */}
              <div className="flex items-center justify-center space-x-6 text-sm text-blue-200/50">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>256-bit Encryption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.08] transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3">🏛️</div>
              <div className="text-sm text-blue-200/80 font-semibold">Estate Planning</div>
            </div>
            <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.08] transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3">🔗</div>
              <div className="text-sm text-blue-200/80 font-semibold">Blockchain Security</div>
            </div>
            <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.08] transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3">🤖</div>
              <div className="text-sm text-blue-200/80 font-semibold">AI Assistant</div>
            </div>
          </div>

          {/* Legal Footer */}
          <div className="mt-10 text-center">
            <p className="text-blue-200/40 text-sm leading-relaxed">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-blue-300 hover:text-white underline transition-colors">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-300 hover:text-white underline transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Ambient Light */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-64 bg-gradient-to-t from-purple-600/10 via-blue-600/5 to-transparent blur-3xl"></div>
    </div>
  )
}

export default function LoginPage() {
  return <LoginContent />
}
