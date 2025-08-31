import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

// Check if Google OAuth is properly configured
const isGoogleConfigured = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  
  return clientId && 
         clientSecret && 
         clientId !== 'your-google-client-id' && 
         clientSecret !== 'your-google-client-secret'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // Allow dynamic host URLs
  providers: isGoogleConfigured() ? [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ] : [],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      // Create or update user in our database when they sign in
      if (account?.provider === 'google' && user.email) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8001'
          
          const response = await fetch(`${backendUrl}/api/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name || '',
              image: user.image || null,
              provider: 'google',
              provider_id: account.providerAccountId
            }),
          })
          
          if (!response.ok) {
            console.error('Failed to create/update user in backend:', response.status)
            // Continue with sign in even if backend fails
          }
        } catch (error) {
          console.error('Error creating/updating user:', error)
          // Continue with sign in even if backend fails
        }
      }
      
      return true
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})