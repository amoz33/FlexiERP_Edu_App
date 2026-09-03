import AppLayout from '@/components/layout/AppLayout'
import { StudentProjects } from '@/components/portal/PortalViews'

export default function ProjectsPage() {
  return (
    <AppLayout>
      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Assignments/Projects</h1>
        <p className="page-subtitle">Assigned work with details, due dates, progress, and submissions.</p>
      </div>
      <div className="px-6 pb-8 animate-in stagger-1">
        <StudentProjects />
      </div>
    </AppLayout>
  )
}
