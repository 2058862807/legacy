/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  // Handle environment variables properly
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // API rewrites to proxy backend requests
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
