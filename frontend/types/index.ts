export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
}

export interface StudentSummary {
  id: string
  name: string
  avatar: string
  studentClass: string
  level: string
  attendance: number
  feesDue: number
  position: number
}

export interface SubjectScore {
  subject: string
  teacher: string
  ca1: number
  ca2: number
  midterm: number
}

export interface ChildProfile extends StudentSummary {
  class: string
  level: string
}
