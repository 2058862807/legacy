/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  // Handle environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Ignore build errors for missing environment variables in development
  typescript: {
    // Disable type checking during build if needed for deployment
    ignoreBuildErrors: false,
  },
  eslint: {
    // Disable ESLint during builds if it causes issues
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
