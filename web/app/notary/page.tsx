'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import Link from 'next/link';

export default function Page() {
  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Notary</h1>
        <p className="text-gray-600 mb-6">Request remote or in-person notarization for eligible documents.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/notary/request" className="rounded-lg bg-purple-600 px-4 py-3 text-white hover:bg-purple-700">
            Request Notarization
          </Link>
          <Link href="/notary/status" className="rounded-lg bg-gray-800 px-4 py-3 text-white hover:bg-black">
            Check Request Status
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>
      </main>
    </DashboardLayout>
  );
}
