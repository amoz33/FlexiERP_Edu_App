import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import AppFooter from '@/components/layout/AppFooter'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#F7F6F3' }}>
      <Sidebar />
      <div className="main-content flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </div>
  )
}
