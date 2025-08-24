/** @type {import('next').NextConfig} */

// Treat this as a clean, stable config for Next 13/14 "pages" or "app" projects.
// - Redirects: nukes /login (sends users to NextAuth or home)
// - Rewrites: optional proxy to Railway under /backend/* so the browser avoids CORS
// - Headers: allows your own origin to hit any Next API routes if you use them

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // If you don't need external images, remove this. Keep Google avatar domain.
  images: {
    domains: ['lh3.googleusercontent.com'],
  },

  async redirects() {
    return [
      // Send /login to NextAuth signin (or change destination to '/' if you prefer)
      { source: '/login', destination: '/api/auth/signin', permanent: false },
    ];
  },

  async rewrites() {
    return [
      // FRONTEND → BACKEND (Railway) proxy to dodge CORS in the browser.
      // Call fetch('/backend/health') or '/backend/whatever' from the client.
      // IMPORTANT: Do NOT put Next routes like /api/auth behind this prefix.
      {
        source: '/backend/:path*',
        destination: 'https://api.nexteraestate.com/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          // This is harmless and only applies to Next's own API routes (not your Railway service).
          { key: 'Access-Control-Allow-Origin', value: 'https://nexteraestate.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
