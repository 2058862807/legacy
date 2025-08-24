// frontend/pages/index.tsx
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">NextEra Estate</h1>
        <p className="text-gray-300 mb-8">Sign in to access your dashboard</p>
        <button
          onClick={() => signIn("google")} // or remove "google" to show the NextAuth provider list
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
