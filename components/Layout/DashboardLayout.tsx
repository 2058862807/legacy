'use client'
import TopNav from './TopNav'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
return (
<>
<TopNav />
<div className="container mx-auto p-6">
{children}
</div>
</>
)
}
