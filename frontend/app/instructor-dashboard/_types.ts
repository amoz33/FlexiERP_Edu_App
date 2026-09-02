export type Section = 'dashboard' | 'attendance' | 'schedule' | 'assessment' | 'groups' | 'performance' | 'lesson-plans' | 'messages'
export type AttendanceStatus = 'P' | 'A' | 'L' | 'H'
export type AttendanceMode = 'daily' | 'period'

export type ScheduleSlot = {
  id: string
  time: string
  subject: string
  group: string
  room: string
  batch?: string
  status?: string
}

export type BreakSlot = {
  id: string
  time: string
  type: 'break' | 'free'
  label: string
}

export type ScheduleEntry = ScheduleSlot | BreakSlot

export type AssessmentCategory = 'CA' | 'Exam'

export type Assessment = {
  id: string
  title: string
  type: 'Exam' | 'Quiz' | 'Assignment' | 'Lab' | 'CTA'
  category: AssessmentCategory
  group: string
  group_id: string
  subject: string
  date: string
  maxMarks: number
  weight: number // percentage weight towards final grade
  status: 'upcoming' | 'grading' | 'completed'
}

export type StudentGrade = {
  student_id: string
  name: string
  avatar: string
  marks: number | null
  remarks: string
}

export type Group = {
  id: string
  name: string
  section: string
  subject: string
  studentCount: number
}

export type Student = {
  id: string
  name: string
  avatar: string
  rollNo: string
  email: string
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
export type Day = typeof DAYS[number]

// Period Attendance types
export type Period = {
  id: string
  number: number
  time: string
  subject: string
}

// Lesson Plan types
export type LessonPlan = {
  id: string
  title: string
  subject: string
  group: string
  week: string
  day: Day
  period: number
  duration: string
  objectives: string[]
  activities: string[]
  resources: string[]
  homework: string
  status: 'draft' | 'published' | 'completed'
  createdAt: string
}

// Messages types
export type Message = {
  id: string
  senderId: string
  senderName: string
  senderRole: 'teacher' | 'parent'
  senderAvatar: string
  recipientId: string
  recipientName: string
  subject: string
  body: string
  timestamp: string
  read: boolean
  replies?: Message[]
}

export type Conversation = {
  id: string
  parentId: string
  parentName: string
  parentAvatar: string
  studentName: string
  studentGroup: string
  lastMessage: string
  lastTimestamp: string
  unreadCount: number
  messages: Message[]
}
