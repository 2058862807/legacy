'use client';

import DashboardLayout from '../../components/Layout/DashboardLayout';
import Link from 'next/link';

export default function Page() {
  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Will Builder</h1>
        <p className="text-gray-600 mb-6">
          Start or continue building your estate will. Add heirs, assets, and conditions step by step.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/will/start"
            className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            Start New Will
          </Link>
          <Link
            href="/will/edit"
            className="rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700"
          >
            Continue Existing Will
          </Link>
          <Link
            href="/will/heirs"
            className="rounded-lg bg-purple-600 px-4 py-3 text-white hover:bg-purple-700"
          >
            Manage Heirs
          </Link>
          <Link
            href="/will/review"
            className="rounded-lg bg-orange-600 px-4 py-3 text-white hover:bg-orange-700"
          >
            Review & Finalize
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </DashboardLayout>
  );
}
