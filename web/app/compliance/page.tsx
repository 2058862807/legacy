'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import Link from 'next/link';

export default function Page() {
  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Compliance</h1>
        <p className="text-gray-600 mb-6">State rules, required clauses, and validation results.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/compliance/check" className="rounded-lg bg-orange-600 px-4 py-3 text-white hover:bg-orange-700">
            Run Compliance Check
          </Link>
          <Link href="/compliance/states" className="rounded-lg bg-gray-800 px-4 py-3 text-white hover:bg-black">
            View State Requirements
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>
      </main>
    </DashboardLayout>
  );
}
