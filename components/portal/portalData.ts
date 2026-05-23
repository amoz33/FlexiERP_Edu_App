import { LayoutDashboard, BookOpen, Banknote, CalendarCheck, FileText, Users, Bell, ClipboardList } from 'lucide-react'
import { NavItem } from './portalTypes'

export const GOLD = '#C9A020'
export const GOLD_LIGHT = '#E8C547'
export const GOLD_DIM = '#9B7A18'
export const BLACK = '#0D0D0D'
export const SURFACE = '#161616'
export const BORDER = '#E8E4DC'
export const TEXT = '#0D0D0D'
export const TEXT2 = '#5C5750'
export const TEXT3 = '#9B9590'
export const GREEN = '#1D9E75'
export const RED = '#E24B4A'
export const BLUE = '#378ADD'

export function getGrade(score: number) {
  if (score >= 75) return { grade: 'A1', label: 'Excellent', color: GOLD }
  if (score >= 70) return { grade: 'B2', label: 'Very Good', color: GREEN }
  if (score >= 65) return { grade: 'B3', label: 'Good', color: GREEN }
  if (score >= 60) return { grade: 'C4', label: 'Credit', color: BLUE }
  if (score >= 55) return { grade: 'C5', label: 'Credit', color: BLUE }
  if (score >= 50) return { grade: 'C6', label: 'Credit', color: BLUE }
  if (score >= 45) return { grade: 'D7', label: 'Pass', color: '#E8A020' }
  if (score >= 40) return { grade: 'E8', label: 'Pass', color: '#E8A020' }
  return { grade: 'F9', label: 'Fail', color: RED }
}

export const mockData = {
  schoolName: 'Greenfield Academy',
  term: '2nd Term',
  session: '2025/2026',
  student: {
    name: 'Chidinma Okafor',
    id: 'GFA-SS2-0047',
    class: 'SS2A',
    level: 'Senior Secondary',
    formTeacher: 'Mrs. Adeyemi',
    avatar: 'CO',
    house: 'Eagles House',
    timetable: [
      { subject: 'Mathematics', time: '8:00 AM', teacher: 'Mr. Abiodun', day: 'Mon', room: 'Block A' },
      { subject: 'English Language', time: '9:00 AM', teacher: 'Mrs. Nwosu', day: 'Mon', room: 'Block B' },
      { subject: 'Biology', time: '11:00 AM', teacher: 'Mr. Emeka', day: 'Tue', room: 'Science Lab' },
      { subject: 'Chemistry', time: '8:00 AM', teacher: 'Mrs. Bello', day: 'Tue', room: 'Chem Lab' },
      { subject: 'Physics', time: '10:00 AM', teacher: 'Mr. Lawal', day: 'Wed', room: 'Physics Lab' },
      { subject: 'Economics', time: '1:00 PM', teacher: 'Mrs. Adegoke', day: 'Thu', room: 'Block C' },
    ],
    subjects: [
      { name: 'Mathematics', teacher: 'Mr. Abiodun', ca1: 18, ca2: 17, midterm: 35 },
      { name: 'English Language', teacher: 'Mrs. Nwosu', ca1: 19, ca2: 18, midterm: 38 },
      { name: 'Biology', teacher: 'Mr. Emeka', ca1: 17, ca2: 16, midterm: 32 },
      { name: 'Chemistry', teacher: 'Mrs. Bello', ca1: 15, ca2: 14, midterm: 30 },
      { name: 'Physics', teacher: 'Mr. Lawal', ca1: 16, ca2: 17, midterm: 34 },
      { name: 'Economics', teacher: 'Mrs. Adegoke', ca1: 19, ca2: 18, midterm: 36 },
      { name: 'Civic Education', teacher: 'Mr. Okonkwo', ca1: 18, ca2: 17, midterm: 37 },
      { name: 'Geography', teacher: 'Mrs. Fatima', ca1: 16, ca2: 15, midterm: 33 },
      { name: 'Literature in English', teacher: 'Mrs. Nwosu', ca1: 20, ca2: 19, midterm: 39 },
    ],
    attendance: [
      { subject: 'Mathematics', present: 28, absent: 2, late: 1, total: 31 },
      { subject: 'English Language', present: 30, absent: 1, late: 0, total: 31 },
      { subject: 'Biology', present: 25, absent: 4, late: 2, total: 31 },
      { subject: 'Chemistry', present: 27, absent: 3, late: 1, total: 31 },
      { subject: 'Physics', present: 29, absent: 2, late: 0, total: 31 },
      { subject: 'Economics', present: 30, absent: 1, late: 0, total: 31 },
    ],
    fees: {
      structure: [
        { label: 'School Fees (2nd Term)', amount: 85000 },
        { label: 'PTA Levy', amount: 5000 },
        { label: 'Development Levy', amount: 10000 },
        { label: 'Sports Levy', amount: 3000 },
        { label: 'ICT / Computer Levy', amount: 5000 },
        { label: 'WAEC Examination Levy', amount: 15000 },
      ],
      history: [
        { date: 'Sep 12, 2025', desc: '1st Term School Fees', amount: 85000, method: 'Bank Transfer', ref: 'GT-20250912-001' },
        { date: 'Sep 12, 2025', desc: '1st Term PTA Levy', amount: 5000, method: 'Bank Transfer', ref: 'GT-20250912-002' },
        { date: 'Jan 15, 2026', desc: '2nd Term Fees (Part Payment)', amount: 50000, method: 'Paystack', ref: 'PS-20260115-003' },
      ],
    },
    reportCard: {
      classSize: 38,
      position: 4,
      prevPosition: 6,
      principalRemark: 'An excellent student who demonstrates diligence and commitment. Keep it up!',
      formTeacherRemark: 'Chidinma is a joy to teach. Her performance this term has been outstanding.',
    },
    projects: [
      {
        title: 'Solar-Powered School Garden',
        subject: 'Physics',
        teacher: 'Mr. Lawal',
        dueDate: 'Mar 8, 2026',
        status: 'In Progress',
        progress: 68,
        brief: 'Build a small garden irrigation model that uses a solar cell to trigger water flow.',
      },
      {
        title: 'Community Health Awareness Poster',
        subject: 'Biology',
        teacher: 'Mr. Emeka',
        dueDate: 'Mar 12, 2026',
        status: 'Draft Review',
        progress: 42,
        brief: 'Create a visual guide that explains malaria prevention steps for younger students.',
      },
      {
        title: 'Nigerian Literature Reflection',
        subject: 'Literature in English',
        teacher: 'Mrs. Nwosu',
        dueDate: 'Mar 18, 2026',
        status: 'Not Started',
        progress: 12,
        brief: 'Write a short reflective essay on character growth in the assigned novel.',
      },
    ],
  },
  parentNotifications: [
    {
      title: 'Second term PTA meeting',
      child: 'All children',
      category: 'Meeting',
      time: 'Today, 9:30 AM',
      priority: 'High',
      message: 'Parents are invited for the second term PTA meeting in the school hall this Friday by 2:00 PM.',
    },
    {
      title: 'Fee balance reminder',
      child: 'Chidinma Okafor',
      category: 'Fees',
      time: 'Yesterday, 4:12 PM',
      priority: 'High',
      message: 'A balance remains on the current term invoice. Kindly complete payment before examination clearance.',
    },
    {
      title: 'Science project approval',
      child: 'Chidinma Okafor',
      category: 'Academics',
      time: 'Mon, 11:05 AM',
      priority: 'Normal',
      message: 'The Physics project topic has been approved by Mr. Lawal and can now move to prototype stage.',
    },
    {
      title: 'Attendance commendation',
      child: 'Blessing Okafor',
      category: 'Attendance',
      time: 'Fri, 8:00 AM',
      priority: 'Normal',
      message: 'Blessing maintained perfect attendance last week. Thank you for supporting punctual arrival.',
    },
  ],
  children: [
    { name: 'Chidinma Okafor', id: 'GFA-SS2-0047', class: 'SS2A', level: 'Senior Secondary', avatar: 'CO' },
    { name: 'Emeka Okafor', id: 'GFA-JSS1-0112', class: 'JSS1B', level: 'Junior Secondary', avatar: 'EO' },
    { name: 'Blessing Okafor', id: 'GFA-PRI4-0203', class: 'Primary 4', level: 'Primary School', avatar: 'BO' },
  ],
}

export const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'projects', label: 'Assignments/Projects', Icon: ClipboardList },
  { id: 'scheme', label: 'Scheme of Work', Icon: BookOpen },
  { id: 'subjects', label: 'Subjects & Scores', Icon: BookOpen },
  { id: 'fees', label: 'School Fees', Icon: Banknote },
  { id: 'attendance', label: 'Attendance', Icon: CalendarCheck },
  { id: 'reportcard', label: 'Report Card', Icon: FileText },
]

export const PARENT_NAV: NavItem[] = [
  { id: 'switch', label: 'My Children', Icon: Users },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
]
