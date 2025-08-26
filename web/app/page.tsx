import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">NextEra Estate</h1>
      <p className="text-gray-600">Secure estate planning with AI, payments, and compliance.</p>
      <div className="flex gap-4">
        <Link href="/dashboard" className="px-4 py-2 rounded bg-blue-600 text-white">Dashboard</Link>
        <Link href="/pricing" className="px-4 py-2 rounded border">Pricing</Link>
      </div>
    </main>
  )
}
