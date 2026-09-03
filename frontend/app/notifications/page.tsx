import AppLayout from '@/components/layout/AppLayout'
import { ParentNotifications } from '@/components/portal/PortalViews'

export default function NotificationsPage() {
  return (
    <AppLayout>
      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Parent Notifications</h1>
        <p className="page-subtitle">School updates, reminders, and action items for linked children.</p>
      </div>
      <div className="px-6 pb-8 animate-in stagger-1">
        <ParentNotifications />
      </div>
    </AppLayout>
  )
}
