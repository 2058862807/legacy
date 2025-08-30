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
}

export default nextConfig
