'use client'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { dashboardApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { useAuthStore } from '@/lib/auth-store'
import ParentDashboard from '@/components/dashboard/ParentDashboard'
import StudentDashboard from '@/components/dashboard/StudentDashboard'
import {
  Users, UserCheck, Building2, ClipboardCheck,
  UserPlus, CreditCard, Megaphone, FileText, TrendingUp, TrendingDown, Minus, Zap
} from 'lucide-react'

// ── Fallback mock data (used until Laravel API is wired) ──────────────────
const MOCK_STATS = {
  total_students: 2451, total_students_change: '+3.2% vs last term',
  total_staff: 184, staff_change: 'No change',
  term_revenue: 1200000, revenue_change: '+8.4% YoY', revenue_collected_pct: 75,
  attendance_today: 96.8, attendance_change: '-0.5% vs yesterday',
  absent_count: 12, late_count: 4,
}
const MOCK_ACTIVITIES = [
  { id: 1, type: 'payment', title: 'Term Fee Payment Received', desc: 'Payment of $4,500 recorded for Student ID: 10452 (Grade 10).', time: '10 mins ago' },
  { id: 2, type: 'admission', title: 'New Admission Application', desc: 'Application #A-2025-089 submitted for Grade 5. Pending review.', time: '1 hour ago' },
  { id: 3, type: 'meeting', title: 'Staff Meeting Scheduled', desc: 'Principal called for a general staff meeting on Friday at 3:00 PM.', time: '3 hours ago' },
  { id: 4, type: 'system', title: 'System Maintenance Alert', desc: 'Scheduled portal downtime this Sunday from 02:00 AM to 04:00 AM.', time: 'Yesterday' },
]

const activityDot: Record<string, string> = {
  payment: '#C9A020', admission: '#10B981', meeting: '#6B7280', system: '#6B7280'
}

export default function DashboardPage() {
  const { data: stats = MOCK_STATS } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardApi.getOverview().then(r => r.data),
    placeholderData: MOCK_STATS,
  })
  const { data: activities = MOCK_ACTIVITIES } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: () => dashboardApi.getRecentActivities(10).then(r => r.data),
    placeholderData: MOCK_ACTIVITIES,
  })

  const { role } = useAuthStore()

  if (role === 'parent') {
    return (
      <AppLayout>
        <ParentDashboard />
      </AppLayout>
    )
  }

  if (role === 'student') {
    return (
      <AppLayout>
        <StudentDashboard />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Topbar action={{ label: 'New Entry', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Admin Overview</h1>
        <p className="page-subtitle">High-level institutional metrics and daily operations.</p>
        <p className="text-xs mt-1" style={{ color: '#A09080' }}>LAST UPDATED: TODAY, 08:45 AM</p>
      </div>

      <div className="px-6 pb-8 space-y-6">
        {/* ── Stat Cards Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Total Students */}
          <div className="stat-card animate-in stagger-1">
            <div className="flex items-center justify-between">
              <span className="stat-label">Total Students</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#F7F6F3' }}>
                <Users size={16} style={{ color: '#C9A020' }} />
              </div>
            </div>
            <div className="stat-value">{stats.total_students?.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#10B981' }}>
              <TrendingUp size={12} /> {stats.total_students_change}
            </div>
          </div>

          {/* Total Staff */}
          <div className="stat-card animate-in stagger-2">
            <div className="flex items-center justify-between">
              <span className="stat-label">Total Staff</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#F7F6F3' }}>
                <UserCheck size={16} style={{ color: '#C9A020' }} />
              </div>
            </div>
            <div className="stat-value">{stats.total_staff}</div>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#6B6660' }}>
              <Minus size={12} /> {stats.staff_change}
            </div>
          </div>

          {/* Term Revenue */}
          <div className="stat-card animate-in stagger-3">
            <div className="flex items-center justify-between">
              <span className="stat-label">Term Revenue</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#F7F6F3' }}>
                <Building2 size={16} style={{ color: '#C9A020' }} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(stats.term_revenue || 0)}</div>
            <div className="flex items-center gap-1 text-xs mb-2" style={{ color: '#10B981' }}>
              <TrendingUp size={12} /> {stats.revenue_change}
            </div>
            {/* Progress */}
            <div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E4E1D8' }}>
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: `${stats.revenue_collected_pct}%`, background: '#C9A020' }} />
              </div>
              <p className="text-xs mt-1" style={{ color: '#6B6660' }}>{stats.revenue_collected_pct}% Collected</p>
            </div>
          </div>

          {/* Attendance */}
          <div className="stat-card animate-in stagger-4">
            <div className="flex items-center justify-between">
              <span className="stat-label">Today's Attendance</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#F7F6F3' }}>
                <ClipboardCheck size={16} style={{ color: '#C9A020' }} />
              </div>
            </div>
            <div className="stat-value">{stats.attendance_today}%</div>
            <div className="flex items-center gap-1 text-xs mb-2" style={{ color: '#EF4444' }}>
              <TrendingDown size={12} /> {stats.attendance_change}
            </div>
            <div className="flex gap-2">
              <span className="badge badge-red">{stats.absent_count} Absent</span>
              <span className="badge badge-gold">{stats.late_count} Late</span>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Activities + Quick Actions ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Recent Activities */}
          <div className="card xl:col-span-2 animate-in stagger-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Recent Activities</h2>
              <a href="#" className="text-sm font-medium" style={{ color: '#C9A020' }}>View All</a>
            </div>
            <div className="space-y-0">
              {activities.map((act: typeof MOCK_ACTIVITIES[0], i: number) => (
                <div key={act.id} className={`flex gap-4 pb-5 ${i < activities.length - 1 ? 'border-b mb-5' : ''}`}
                     style={{ borderColor: '#E4E1D8' }}>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                         style={{ background: activityDot[act.type] || '#6B7280' }} />
                    {i < activities.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ background: '#E4E1D8' }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">{act.title}</p>
                      <span className="text-xs flex-shrink-0 ml-3" style={{ color: '#A09080' }}>{act.time}</span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: '#6B6660' }}>{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl p-5 animate-in stagger-3" style={{ background: '#0D0D0D' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-white">Quick Actions</h2>
              <Zap size={16} style={{ color: '#C9A020' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Admit Student', icon: UserPlus, href: '/admission' },
                { label: 'Record Payment', icon: CreditCard, href: '/fee-management' },
                { label: 'Broadcast', icon: Megaphone, href: '/messaging' },
                { label: 'Generate Report', icon: FileText, href: '/reports' },
              ].map(({ label, icon: Icon, href }) => (
                <a key={label} href={href}
                   className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200"
                   style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,160,32,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,160,32,0.3)' }}
                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}>
                  <Icon size={20} style={{ color: '#C9A020' }} />
                  <span className="text-xs text-center text-white/80 leading-tight">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
