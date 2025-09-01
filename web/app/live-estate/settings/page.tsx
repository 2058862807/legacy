import { Metadata } from 'next'
import LifeEventsSettings from '@/components/LiveEstate/LifeEventsSettings'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export const metadata: Metadata = {
  title: 'Life Events Settings - NexteraEstate',
  description: 'Record important life changes to keep your estate plan current',
}

export default function LifeEventsSettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <LifeEventsSettings />
      </div>
    </DashboardLayout>
  )
}