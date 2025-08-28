'use client'
import DashboardLayout from '@/components/Layout/DashboardLayout'
export default function WillBuilderHub() {
return (
<DashboardLayout>
<h1 className="text-2xl font-bold mb-2">Will Builder</h1>
<p className="text-gray-600 mb-4">Start or continue your will</p>
<div className="grid gap-3 md:grid-cols-2">
<a href="/will-builder/create" className="rounded bg-blue-600 text-white px-4 py-3">Create New Will</a>
<a href="/will-builder/drafts" className="rounded bg-gray-800 text-white px-4 py-3">View Drafts</a>
</div>
</DashboardLayout>
)
}
