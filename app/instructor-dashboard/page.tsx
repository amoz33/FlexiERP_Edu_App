'use client'
import { useState } from 'react'
import Image from 'next/image'
import {
  LayoutDashboard, ClipboardCheck, CalendarDays, FileText,
  Users, BarChart3, LogOut, BookOpen, MessageCircle
} from 'lucide-react'
import type { Section } from './_types'
import DashboardSection from './_sections/DashboardSection'
import AttendanceSection from './_sections/AttendanceSection'
import ScheduleSection from './_sections/ScheduleSection'
import AssessmentSection from './_sections/AssessmentSection'
import GroupsSection from './_sections/GroupsSection'
import PerformanceSection from './_sections/PerformanceSection'
import LessonPlanSection from './_sections/LessonPlanSection'
import MessagesSection from './_sections/MessagesSection'

const sidebarItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { id: 'schedule', label: 'My Schedule', icon: CalendarDays },
  { id: 'assessment', label: 'Assessment', icon: FileText },
  { id: 'lesson-plans', label: 'Lesson Plans', icon: BookOpen },
  { id: 'groups', label: 'Student Groups', icon: Users },
  { id: 'performance', label: 'Class Performance', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
]

export default function InstructorDashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')

  return (
    <div className="flex min-h-screen" style={{ background: '#F7F6F3' }}>
      {/* Instructor Sidebar */}
      <aside className="fixed left-0 top-0 h-screen flex flex-col z-50"
        style={{ width: 240, background: '#0D0D0D', borderRight: '1px solid #2A2A2A' }}>
        {/* Logo */}
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <Image src="/WHITE FLEXI LOGO.png" alt="FlexiERP Logo" width={140} height={36} className="object-contain" />
        </div>

        {/* Term Badge */}
        <div className="px-4 py-2.5">
          <div className="rounded-lg px-3 py-2 text-xs font-medium"
            style={{ background: 'rgba(201,160,32,0.10)', color: '#C9A020', border: '1px solid rgba(201,160,32,0.2)' }}>
            📅 2026 – Spring Term
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
          {sidebarItems.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id
            return (
              <button key={id} onClick={() => setActiveSection(id)}
                className="flex items-center gap-3 w-full px-4 py-3 mx-2 rounded-lg text-sm transition-all text-left"
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#C9A020'
                  if (!active) {
                    event.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  }
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = active ? '#C9A020' : '#FFFFFF'
                  event.currentTarget.style.background = active ? 'rgba(201,160,32,0.15)' : 'transparent'
                }}
                style={{
                  width: 'calc(100% - 16px)',
                  color: active ? '#C9A020' : '#FFFFFF',
                  background: active ? 'rgba(201,160,32,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(201,160,32,0.30)' : '1px solid transparent',
                }}>
                <Icon size={16} />
                <span>{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom: User + Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
            style={{ color: 'rgba(255,255,255,0.70)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(201,160,32,0.3)', color: '#C9A020' }}>RF</div>
            <span>Dr. R. Feynman</span>
          </div>
          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition-all hover:text-red-400"
            style={{ color: 'rgba(255,255,255,0.50)' }}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1" style={{ marginLeft: 240 }}>
        {activeSection === 'dashboard' && <DashboardSection onNavigate={setActiveSection} />}
        {activeSection === 'attendance' && <AttendanceSection />}
        {activeSection === 'schedule' && <ScheduleSection />}
        {activeSection === 'assessment' && <AssessmentSection />}
        {activeSection === 'lesson-plans' && <LessonPlanSection />}
        {activeSection === 'groups' && <GroupsSection />}
        {activeSection === 'performance' && <PerformanceSection />}
        {activeSection === 'messages' && <MessagesSection />}
      </div>
    </div>
  )
}
