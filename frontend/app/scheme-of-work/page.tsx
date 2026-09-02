'use client'

import AppLayout from '@/components/layout/AppLayout'
import { SchemeOfWorkView } from '@/components/dashboard/StudentDashboard'

export default function SchemeOfWorkPage() {
  return (
    <AppLayout>
      <div className="px-6 py-6">
        <SchemeOfWorkView />
      </div>
    </AppLayout>
  )
}
