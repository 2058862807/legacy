/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable to reduce overhead
  experimental: {
    esmExternals: false,
  },
  // Optimize for development speed
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
