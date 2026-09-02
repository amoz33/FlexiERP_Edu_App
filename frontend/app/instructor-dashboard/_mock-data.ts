import type { ScheduleSlot, ScheduleEntry, Assessment, StudentGrade, Group, Student, AttendanceStatus, Day, Period, LessonPlan, Conversation, Message } from './_types'

export const MOCK_TODAY_SCHEDULE: ScheduleSlot[] = [
  { id: '1', time: '08:00 AM', subject: 'Advanced Physics', group: 'Class 10A', room: 'Lab 4A', status: 'completed' },
  { id: '2', time: '09:00 AM', subject: 'Physics Fundamentals', group: 'Class 11A', room: 'Room 302', status: 'live' },
  { id: '3', time: '10:30 AM', subject: 'Advanced Physics', group: 'Class 12A', room: 'Lab 4A', status: 'upcoming' },
  { id: '4', time: '11:30 AM', subject: 'Physics Lab', group: 'Class 10B', room: 'Lab 4A', status: 'upcoming' },
  { id: '5', time: '01:00 PM', subject: 'Physics Fundamentals', group: 'Class 11B', room: 'Room 210', status: 'upcoming' },
]

export const MOCK_PENDING_ATTENDANCE = [
  { id: '1', group: 'Class 10A', subject: 'Advanced Physics', date: '2025-05-14', students: 32 },
  { id: '2', group: 'Class 11A', subject: 'Physics Fundamentals', date: '2025-05-14', students: 28 },
]

export const MOCK_UPCOMING_ASSESSMENTS = [
  { id: '1', title: 'Mid-Term Physics Exam', group: 'Class 10A', date: '2025-05-20', maxMarks: 100, type: 'Exam' },
  { id: '2', title: 'Lab Report: Optics', group: 'Class 12A', date: '2025-05-18', maxMarks: 50, type: 'Assignment' },
  { id: '3', title: 'Weekly Quiz #8', group: 'Class 11A', date: '2025-05-16', maxMarks: 20, type: 'Quiz' },
]

export const MOCK_ATTENDANCE_STUDENTS: { id: string; name: string; avatar: string; status: AttendanceStatus }[] = [
  { id: '101', name: 'Alexander Hamilton', avatar: 'AH', status: 'P' },
  { id: '102', name: 'Eleanor Roosevelt', avatar: 'ER', status: 'P' },
  { id: '103', name: 'Frank Lloyd Wright', avatar: 'FL', status: 'A' },
  { id: '104', name: 'Marie Curie', avatar: 'MC', status: 'L' },
  { id: '105', name: 'Ada Lovelace', avatar: 'AL', status: 'P' },
  { id: '106', name: 'Isaac Newton', avatar: 'IN', status: 'P' },
  { id: '107', name: 'Nikola Tesla', avatar: 'NT', status: 'P' },
  { id: '108', name: 'Rosalind Franklin', avatar: 'RF', status: 'A' },
]

export const MOCK_WEEKLY_SCHEDULE: Record<Day, ScheduleEntry[]> = {
  Monday: [
    { id: 'm1', time: '08:00 AM', subject: 'Advanced Physics', group: 'Class 10A', room: 'Lab 4A', batch: 'Batch 1' },
    { id: 'm2', time: '09:00 AM', subject: 'Physics Fundamentals', group: 'Class 11A', room: 'Room 302' },
    { id: 'm3', time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { id: 'm4', time: '10:30 AM', subject: 'Advanced Physics', group: 'Class 12A', room: 'Lab 4A' },
    { id: 'm5', time: '11:30 AM', subject: 'Physics Lab', group: 'Class 10B', room: 'Lab 4A', batch: 'Batch 2' },
    { id: 'm6', time: '01:00 PM', subject: 'Physics Fundamentals', group: 'Class 11B', room: 'Room 210' },
  ],
  Tuesday: [
    { id: 't1', time: '08:00 AM', subject: 'Advanced Physics', group: 'Class 10A', room: 'Lab 4A' },
    { id: 't2', time: '09:00 AM', type: 'free', label: 'Free Period' },
    { id: 't3', time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { id: 't4', time: '10:30 AM', subject: 'Physics Fundamentals', group: 'Class 11A', room: 'Room 302' },
    { id: 't5', time: '11:30 AM', subject: 'Physics Lab', group: 'Class 12A', room: 'Lab 4A', batch: 'Batch 1' },
    { id: 't6', time: '01:00 PM', type: 'free', label: 'Free Period' },
  ],
  Wednesday: [
    { id: 'w1', time: '08:00 AM', subject: 'Physics Fundamentals', group: 'Class 11B', room: 'Room 210' },
    { id: 'w2', time: '09:00 AM', subject: 'Advanced Physics', group: 'Class 12A', room: 'Lab 4A' },
    { id: 'w3', time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { id: 'w4', time: '10:30 AM', subject: 'Advanced Physics', group: 'Class 10A', room: 'Lab 4A' },
    { id: 'w5', time: '11:30 AM', type: 'free', label: 'Free Period' },
    { id: 'w6', time: '01:00 PM', subject: 'Physics Lab', group: 'Class 10B', room: 'Lab 4A', batch: 'Batch 2' },
  ],
  Thursday: [
    { id: 'th1', time: '08:00 AM', subject: 'Advanced Physics', group: 'Class 10A', room: 'Lab 4A' },
    { id: 'th2', time: '09:00 AM', subject: 'Physics Fundamentals', group: 'Class 11A', room: 'Room 302' },
    { id: 'th3', time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { id: 'th4', time: '10:30 AM', subject: 'Advanced Physics', group: 'Class 12A', room: 'Lab 4A' },
    { id: 'th5', time: '11:30 AM', subject: 'Physics Lab', group: 'Class 10B', room: 'Lab 4A', batch: 'Batch 1' },
    { id: 'th6', time: '01:00 PM', subject: 'Physics Fundamentals', group: 'Class 11B', room: 'Room 210' },
  ],
  Friday: [
    { id: 'f1', time: '08:00 AM', subject: 'Physics Fundamentals', group: 'Class 11A', room: 'Room 302' },
    { id: 'f2', time: '09:00 AM', subject: 'Advanced Physics', group: 'Class 10A', room: 'Lab 4A' },
    { id: 'f3', time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { id: 'f4', time: '10:30 AM', type: 'free', label: 'Free Period' },
    { id: 'f5', time: '11:30 AM', subject: 'Physics Lab', group: 'Class 12A', room: 'Lab 4A', batch: 'Batch 2' },
    { id: 'f6', time: '01:00 PM', type: 'free', label: 'Free Period' },
  ],
}

export const MOCK_ASSESSMENTS: Assessment[] = [
  { id: '1', title: 'Mid-Term Physics Exam', type: 'Exam', category: 'Exam', group: 'Class 10A', group_id: 'g10a', subject: 'Advanced Physics', date: '2025-05-20', maxMarks: 100, weight: 60, status: 'upcoming' },
  { id: '2', title: 'Lab Report: Optics', type: 'Lab', category: 'CA', group: 'Class 12A', group_id: 'g12a', subject: 'Advanced Physics', date: '2025-05-18', maxMarks: 50, weight: 10, status: 'grading' },
  { id: '3', title: 'Weekly Quiz #7', type: 'Quiz', category: 'CA', group: 'Class 11A', group_id: 'g11a', subject: 'Physics Fundamentals', date: '2025-05-10', maxMarks: 20, weight: 5, status: 'completed' },
  { id: '4', title: 'Thermodynamics Assignment', type: 'Assignment', category: 'CA', group: 'Class 10A', group_id: 'g10a', subject: 'Advanced Physics', date: '2025-05-12', maxMarks: 30, weight: 10, status: 'grading' },
  { id: '5', title: 'Weekly Quiz #8', type: 'Quiz', category: 'CA', group: 'Class 11A', group_id: 'g11a', subject: 'Physics Fundamentals', date: '2025-05-16', maxMarks: 20, weight: 5, status: 'upcoming' },
  { id: '6', title: 'End of Term Exam', type: 'Exam', category: 'Exam', group: 'Class 11A', group_id: 'g11a', subject: 'Physics Fundamentals', date: '2025-06-10', maxMarks: 100, weight: 60, status: 'upcoming' },
  { id: '7', title: 'CA Test 2 - Mechanics', type: 'CTA', category: 'CA', group: 'Class 10A', group_id: 'g10a', subject: 'Advanced Physics', date: '2025-05-08', maxMarks: 40, weight: 10, status: 'completed' },
]

export const MOCK_GRADING_STUDENTS: StudentGrade[] = [
  { student_id: '101', name: 'Alexander Hamilton', avatar: 'AH', marks: 42, remarks: '' },
  { student_id: '102', name: 'Eleanor Roosevelt', avatar: 'ER', marks: 38, remarks: 'Good effort' },
  { student_id: '103', name: 'Frank Lloyd Wright', avatar: 'FL', marks: null, remarks: '' },
  { student_id: '104', name: 'Marie Curie', avatar: 'MC', marks: 47, remarks: 'Excellent' },
  { student_id: '105', name: 'Ada Lovelace', avatar: 'AL', marks: null, remarks: '' },
  { student_id: '106', name: 'Isaac Newton', avatar: 'IN', marks: 35, remarks: '' },
  { student_id: '107', name: 'Nikola Tesla', avatar: 'NT', marks: null, remarks: '' },
  { student_id: '108', name: 'Rosalind Franklin', avatar: 'RF', marks: 44, remarks: 'Well done' },
]

export const MOCK_GROUPS: Group[] = [
  { id: 'g10a', name: 'Class 10A', section: 'Section A', subject: 'Advanced Physics', studentCount: 32 },
  { id: 'g10b', name: 'Class 10B', section: 'Section B', subject: 'Physics Lab', studentCount: 28 },
  { id: 'g11a', name: 'Class 11A', section: 'Section A', subject: 'Physics Fundamentals', studentCount: 30 },
  { id: 'g11b', name: 'Class 11B', section: 'Section B', subject: 'Physics Fundamentals', studentCount: 26 },
  { id: 'g12a', name: 'Class 12A', section: 'Section A', subject: 'Advanced Physics', studentCount: 24 },
]

export const MOCK_GROUP_STUDENTS: Student[] = [
  { id: '101', name: 'Alexander Hamilton', avatar: 'AH', rollNo: '101', email: 'alex.h@school.edu' },
  { id: '102', name: 'Eleanor Roosevelt', avatar: 'ER', rollNo: '102', email: 'eleanor.r@school.edu' },
  { id: '103', name: 'Frank Lloyd Wright', avatar: 'FL', rollNo: '103', email: 'frank.w@school.edu' },
  { id: '104', name: 'Marie Curie', avatar: 'MC', rollNo: '104', email: 'marie.c@school.edu' },
  { id: '105', name: 'Ada Lovelace', avatar: 'AL', rollNo: '105', email: 'ada.l@school.edu' },
  { id: '106', name: 'Isaac Newton', avatar: 'IN', rollNo: '106', email: 'isaac.n@school.edu' },
  { id: '107', name: 'Nikola Tesla', avatar: 'NT', rollNo: '107', email: 'nikola.t@school.edu' },
  { id: '108', name: 'Rosalind Franklin', avatar: 'RF', rollNo: '108', email: 'rosalind.f@school.edu' },
]

export const MOCK_SCORE_TRENDS = [
  { month: 'Jan', avgScore: 72, attendance: 88 },
  { month: 'Feb', avgScore: 75, attendance: 91 },
  { month: 'Mar', avgScore: 68, attendance: 85 },
  { month: 'Apr', avgScore: 78, attendance: 92 },
  { month: 'May', avgScore: 82, attendance: 94 },
]

export const MOCK_ATTENDANCE_WEEKLY = [
  { week: 'W1', present: 145, absent: 11 },
  { week: 'W2', present: 148, absent: 8 },
  { week: 'W3', present: 140, absent: 16 },
  { week: 'W4', present: 150, absent: 6 },
  { week: 'W5', present: 147, absent: 9 },
]

export const MOCK_SUBJECT_PERFORMANCE = [
  { subject: 'Adv. Physics 10A', avgScore: 76 },
  { subject: 'Physics Fund. 11A', avgScore: 72 },
  { subject: 'Adv. Physics 12A', avgScore: 81 },
  { subject: 'Physics Lab 10B', avgScore: 85 },
  { subject: 'Physics Fund. 11B', avgScore: 69 },
]

export const MOCK_TOP_PERFORMERS = [
  { id: '1', name: 'Marie Curie', group: 'Class 10A', avgScore: 96, trend: 'up' as const },
  { id: '2', name: 'Ada Lovelace', group: 'Class 12A', avgScore: 94, trend: 'up' as const },
  { id: '3', name: 'Isaac Newton', group: 'Class 11A', avgScore: 91, trend: 'stable' as const },
  { id: '4', name: 'Nikola Tesla', group: 'Class 10A', avgScore: 89, trend: 'up' as const },
  { id: '5', name: 'Rosalind Franklin', group: 'Class 11B', avgScore: 87, trend: 'down' as const },
]

export const MOCK_AT_RISK = [
  { id: '1', name: 'Frank Lloyd Wright', group: 'Class 10A', avgScore: 42, attendanceRate: 68, issue: 'Low scores & attendance' },
  { id: '2', name: 'James Monroe', group: 'Class 11B', avgScore: 55, attendanceRate: 72, issue: 'Declining performance' },
  { id: '3', name: 'Thomas Edison', group: 'Class 12A', avgScore: 48, attendanceRate: 60, issue: 'Frequent absences' },
]

// Period Attendance mock data
export const MOCK_PERIODS: Period[] = [
  { id: 'p1', number: 1, time: '08:00 - 08:45', subject: 'Advanced Physics' },
  { id: 'p2', number: 2, time: '08:45 - 09:30', subject: 'Advanced Physics' },
  { id: 'p3', number: 3, time: '09:45 - 10:30', subject: 'Physics Fundamentals' },
  { id: 'p4', number: 4, time: '10:30 - 11:15', subject: 'Physics Lab' },
  { id: 'p5', number: 5, time: '11:30 - 12:15', subject: 'Physics Fundamentals' },
  { id: 'p6', number: 6, time: '01:00 - 01:45', subject: 'Advanced Physics' },
]

// Lesson Plans mock data
export const MOCK_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp1', title: 'Introduction to Electromagnetic Waves', subject: 'Advanced Physics',
    group: 'Class 10A', week: 'Week 20 (May 12-16)', day: 'Monday', period: 1, duration: '45 mins',
    objectives: ['Define electromagnetic waves and their properties', 'Identify the electromagnetic spectrum', 'Explain wave-particle duality'],
    activities: ['Interactive lecture with diagrams', 'Group discussion on real-world applications', 'Short video: EM spectrum visualization'],
    resources: ['Textbook Ch. 14', 'Projector', 'EM spectrum chart', 'Video link'],
    homework: 'Read Ch. 14 pages 201-210. Answer questions 1-5.',
    status: 'completed', createdAt: '2025-05-10',
  },
  {
    id: 'lp2', title: 'Properties of Light - Reflection', subject: 'Advanced Physics',
    group: 'Class 10A', week: 'Week 20 (May 12-16)', day: 'Wednesday', period: 3, duration: '45 mins',
    objectives: ['State the laws of reflection', 'Distinguish between regular and diffuse reflection', 'Solve problems involving plane mirrors'],
    activities: ['Demonstration with mirrors and laser pointer', 'Guided practice problems', 'Pair work: ray diagrams'],
    resources: ['Plane mirrors', 'Laser pointer', 'Protractor', 'Worksheet 14.2'],
    homework: 'Complete worksheet 14.2. Draw 3 ray diagrams.',
    status: 'published', createdAt: '2025-05-11',
  },
  {
    id: 'lp3', title: 'Refraction and Snell\'s Law', subject: 'Advanced Physics',
    group: 'Class 12A', week: 'Week 21 (May 19-23)', day: 'Monday', period: 1, duration: '45 mins',
    objectives: ['Define refraction and refractive index', 'Apply Snell\'s law to solve problems', 'Explain total internal reflection'],
    activities: ['Lab demonstration: light through glass block', 'Derivation of Snell\'s law', 'Practice calculations'],
    resources: ['Glass block', 'Ray box', 'Protractor', 'Calculator'],
    homework: 'Solve problems 1-8 on page 225.',
    status: 'draft', createdAt: '2025-05-14',
  },
  {
    id: 'lp4', title: 'Newton\'s Laws of Motion - Revision', subject: 'Physics Fundamentals',
    group: 'Class 11A', week: 'Week 20 (May 12-16)', day: 'Tuesday', period: 2, duration: '45 mins',
    objectives: ['Recall all three laws of motion', 'Apply F=ma to multi-body problems', 'Identify action-reaction pairs'],
    activities: ['Quick quiz (10 mins)', 'Problem-solving session', 'Group challenge: real-world scenarios'],
    resources: ['Quiz sheets', 'Whiteboard', 'Problem set 7'],
    homework: 'Complete problem set 7. Prepare for CA test.',
    status: 'completed', createdAt: '2025-05-09',
  },
  {
    id: 'lp5', title: 'Thermodynamics - First Law', subject: 'Advanced Physics',
    group: 'Class 10A', week: 'Week 21 (May 19-23)', day: 'Thursday', period: 1, duration: '45 mins',
    objectives: ['State the first law of thermodynamics', 'Distinguish between heat, work, and internal energy', 'Solve problems using ΔU = Q - W'],
    activities: ['Lecture with real-world examples', 'Worked examples on board', 'Individual practice'],
    resources: ['Textbook Ch. 16', 'Thermodynamics simulation software'],
    homework: 'Read Ch. 16 section 1-3. Attempt examples 16.1-16.4.',
    status: 'draft', createdAt: '2025-05-14',
  },
]

// Messages mock data
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1', parentId: 'par1', parentName: 'Mrs. Hamilton', parentAvatar: 'MH',
    studentName: 'Alexander Hamilton', studentGroup: 'Class 10A',
    lastMessage: 'Thank you for the update on Alexander\'s progress.',
    lastTimestamp: '2025-05-14T10:30:00', unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'teacher1', senderName: 'Dr. R. Feynman', senderRole: 'teacher', senderAvatar: 'RF', recipientId: 'par1', recipientName: 'Mrs. Hamilton', subject: 'Alexander\'s Physics Performance', body: 'Dear Mrs. Hamilton,\n\nI wanted to update you on Alexander\'s performance in Advanced Physics. He has been doing well in class participation but his last quiz score (72%) was below his usual standard. I recommend he spends more time on the optics chapter.\n\nBest regards,\nDr. Feynman', timestamp: '2025-05-13T14:00:00', read: true },
      { id: 'm2', senderId: 'par1', senderName: 'Mrs. Hamilton', senderRole: 'parent', senderAvatar: 'MH', recipientId: 'teacher1', recipientName: 'Dr. R. Feynman', subject: 'Re: Alexander\'s Physics Performance', body: 'Thank you for the update on Alexander\'s progress. We will ensure he dedicates more study time to optics this week. Is there any additional material you recommend?', timestamp: '2025-05-14T10:30:00', read: true },
    ],
  },
  {
    id: 'conv2', parentId: 'par2', parentName: 'Mr. Wright', parentAvatar: 'MW',
    studentName: 'Frank Lloyd Wright', studentGroup: 'Class 10A',
    lastMessage: 'Can we schedule a meeting to discuss Frank\'s attendance?',
    lastTimestamp: '2025-05-14T09:15:00', unreadCount: 1,
    messages: [
      { id: 'm3', senderId: 'par2', senderName: 'Mr. Wright', senderRole: 'parent', senderAvatar: 'MW', recipientId: 'teacher1', recipientName: 'Dr. R. Feynman', subject: 'Frank\'s Attendance', body: 'Good morning Dr. Feynman,\n\nCan we schedule a meeting to discuss Frank\'s attendance? He has been unwell recently but I want to ensure he doesn\'t fall behind in Physics.', timestamp: '2025-05-14T09:15:00', read: false },
    ],
  },
  {
    id: 'conv3', parentId: 'par3', parentName: 'Dr. Curie', parentAvatar: 'DC',
    studentName: 'Marie Curie', studentGroup: 'Class 10A',
    lastMessage: 'Marie is very excited about the upcoming science fair!',
    lastTimestamp: '2025-05-13T16:45:00', unreadCount: 0,
    messages: [
      { id: 'm4', senderId: 'teacher1', senderName: 'Dr. R. Feynman', senderRole: 'teacher', senderAvatar: 'RF', recipientId: 'par3', recipientName: 'Dr. Curie', subject: 'Marie\'s Science Fair Project', body: 'Dear Dr. Curie,\n\nI wanted to let you know that Marie\'s science fair project proposal on radioactive decay simulation has been approved. She will need some additional materials which I\'ve listed in the attached document.\n\nShe\'s one of our top performers and I\'m confident she\'ll do excellently.', timestamp: '2025-05-13T11:00:00', read: true },
      { id: 'm5', senderId: 'par3', senderName: 'Dr. Curie', senderRole: 'parent', senderAvatar: 'DC', recipientId: 'teacher1', recipientName: 'Dr. R. Feynman', subject: 'Re: Marie\'s Science Fair Project', body: 'Marie is very excited about the upcoming science fair! We will get the materials ready. Thank you for your support and encouragement.', timestamp: '2025-05-13T16:45:00', read: true },
    ],
  },
  {
    id: 'conv4', parentId: 'par4', parentName: 'Mrs. Lovelace', parentAvatar: 'ML',
    studentName: 'Ada Lovelace', studentGroup: 'Class 12A',
    lastMessage: 'Could you share the study guide for the upcoming exam?',
    lastTimestamp: '2025-05-14T11:20:00', unreadCount: 1,
    messages: [
      { id: 'm6', senderId: 'par4', senderName: 'Mrs. Lovelace', senderRole: 'parent', senderAvatar: 'ML', recipientId: 'teacher1', recipientName: 'Dr. R. Feynman', subject: 'Exam Preparation', body: 'Dear Dr. Feynman,\n\nCould you share the study guide for the upcoming end-of-term exam? Ada wants to start preparing early. Also, are there any extra credit opportunities available?', timestamp: '2025-05-14T11:20:00', read: false },
    ],
  },
]
