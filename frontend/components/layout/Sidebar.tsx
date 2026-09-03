'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, UserPlus, CreditCard, BookOpen, Package,
  CalendarDays, ClipboardCheck, Settings, Users, Mail,
  User, BarChart3, ExternalLink, Zap, FileText, Bell, ClipboardList
} from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { label: 'Dashboard',       href: '/dashboard',       icon: LayoutDashboard },
  { label: 'Admission',       href: '/admission',       icon: UserPlus },
  { label: 'Fee Management',  href: '/fee-management',  icon: CreditCard },
  { label: 'Academics',       href: '/academics',       icon: BookOpen },
  { label: 'Inventory',       href: '/inventory',       icon: Package },
  { label: 'Timetable',       href: '/timetable',       icon: CalendarDays },
  { label: 'Attendance',      href: '/attendance',      icon: ClipboardCheck },
  { label: 'Settings',        href: '/settings',        icon: Settings },
  { label: 'Staff Management',href: '/staff',           icon: Users },
  { label: 'Messaging',       href: '/messaging',       icon: Mail },
  { label: 'Student Info',    href: '/students',        icon: User },
  { label: 'Reports',         href: '/reports',         icon: BarChart3 },
  { label: 'Results',         href: '/results',         icon: Zap },
  { label: 'Report Card',     href: '/report-card',     icon: FileText },
  { label: 'Portal',          href: '/portal',          icon: ExternalLink },
]

const studentNavItems = [
  { label: 'Dashboard',       href: '/dashboard',       icon: LayoutDashboard },
  { label: 'Assignments/Projects', href: '/projects',   icon: ClipboardList },
  { label: 'Subjects & Scores', href: '/subjects',      icon: BookOpen },
  { label: 'Scheme of Work',   href: '/scheme-of-work', icon: CalendarDays },
  { label: 'School Fees',     href: '/fees',           icon: CreditCard },
  { label: 'Attendance',      href: '/attendance',      icon: ClipboardCheck },
  { label: 'Report Card',     href: '/report-card',     icon: FileText },
  { label: 'Portal',          href: '/portal',         icon: ExternalLink },
]

const parentNavItems = [
  { label: 'My Children',     href: '/switch',         icon: Users },
  { label: 'Notifications',   href: '/notifications',  icon: Bell },
  { label: 'Dashboard',       href: '/dashboard',       icon: LayoutDashboard },
  { label: 'Subjects & Scores', href: '/subjects',      icon: BookOpen },
  { label: 'School Fees',     href: '/fees',           icon: CreditCard },
  { label: 'Attendance',      href: '/attendance',      icon: ClipboardCheck },
  { label: 'Report Card',     href: '/report-card',     icon: FileText },
  { label: 'Portal',          href: '/portal',         icon: ExternalLink },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { role } = useAuthStore()
  const navItems =
    role === 'student' ? studentNavItems :
    role === 'parent' ? parentNavItems :
    adminNavItems

  return (
    <aside className="sidebar">
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn('sidebar-nav-item', active && 'active')}>
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
