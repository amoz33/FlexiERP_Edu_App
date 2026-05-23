import type { LucideIcon } from 'lucide-react'

export type RoleType = 'student' | 'parent'
export type PageType = 'dashboard' | 'subjects' | 'fees' | 'attendance' | 'reportcard' | 'switch' | 'notifications' | 'projects' | 'scheme'

export type NavItem = {
  id: string
  label: string
  href?: string
  Icon: LucideIcon
}
