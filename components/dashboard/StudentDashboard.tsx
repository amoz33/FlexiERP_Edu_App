'use client'

import { useMemo } from 'react'
import { GOLD, BORDER, TEXT, TEXT2, TEXT3, GREEN, BLUE, RED, getGrade } from '@/constants'
import Avatar from '@/components/ui/Avatar'
import Card, { CardLabel } from '@/components/ui/Card'
import GoldBadge from '@/components/ui/GoldBadge'
import StatCard from '@/components/ui/StatCard'

const mockData = {
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
    ],
    subjects: [
      { name: 'Mathematics', teacher: 'Mr. Abiodun', ca1: 18, ca2: 17, midterm: 35 },
      { name: 'English Language', teacher: 'Mrs. Nwosu', ca1: 19, ca2: 18, midterm: 38 },
      { name: 'Biology', teacher: 'Mr. Emeka', ca1: 17, ca2: 16, midterm: 32 },
    ],
    attendance: [
      { subject: 'Mathematics', present: 28, absent: 2, late: 1, total: 31 },
      { subject: 'English Language', present: 30, absent: 1, late: 0, total: 31 },
    ],
    fees: {
      structure: [
        { label: 'School Fees (2nd Term)', amount: 85000 },
        { label: 'PTA Levy', amount: 5000 },
      ],
      history: [
        { date: 'Sep 12, 2025', desc: '1st Term School Fees', amount: 85000, method: 'Bank Transfer', ref: 'GT-20250912-001' },
      ],
    },
    reportCard: {
      classSize: 38,
      position: 4,
      prevPosition: 6,
      principalRemark: 'An excellent student who demonstrates diligence and commitment. Keep it up!',
      formTeacherRemark: 'Chidinma is a joy to teach. Her performance this term has been outstanding.',
    },
  },
}

const subjectTeachers = [
  { subject: 'Mathematics', teacher: 'Mr. Abiodun', email: 'abiodun.m@edumanage.sch', phone: '+234 803 210 4455' },
  { subject: 'English Language', teacher: 'Mrs. Nwosu', email: 'nwosu.e@edumanage.sch', phone: '+234 806 118 9021' },
  { subject: 'Biology', teacher: 'Dr. Eze', email: 'eze.b@edumanage.sch', phone: '+234 805 441 7780' },
  { subject: 'Physics', teacher: 'Mr. Okafor', email: 'okafor.p@edumanage.sch', phone: '+234 807 339 6244' },
  { subject: 'Chemistry', teacher: 'Mrs. Bello', email: 'bello.c@edumanage.sch', phone: '+234 809 552 0138' },
]

const schemeWeeks = [
  {
    week: 'Week 1',
    theme: 'Foundations & Review',
    topics: [
      { subject: 'Mathematics', topic: 'Revision of Quadratic Expressions & factorization', teacher: 'Mr. Abiodun' },
      { subject: 'English Language', topic: 'Essay Writing: Narrative & Descriptive', teacher: 'Mrs. Nwosu' },
      { subject: 'Biology', topic: 'Cell Structure & Organelles (Detailed)', teacher: 'Dr. Eze' },
      { subject: 'Physics', topic: 'Motion in a Straight Line (Graphs)', teacher: 'Mr. Okafor' },
      { subject: 'Chemistry', topic: 'Introduction to Periodic Table', teacher: 'Mrs. Bello' },
    ],
  },
  {
    week: 'Week 2',
    theme: 'Algebra & Literary Devices',
    topics: [
      { subject: 'Mathematics', topic: 'Simultaneous Equations (Elimination & Substitution)', teacher: 'Mr. Abiodun' },
      { subject: 'English Language', topic: 'Comprehension & Summary Skills', teacher: 'Mrs. Nwosu' },
      { subject: 'Biology', topic: 'Transport System in Plants (Xylem & Phloem)', teacher: 'Dr. Eze' },
      { subject: 'Physics', topic: 'Work, Energy and Power', teacher: 'Mr. Okafor' },
      { subject: 'Chemistry', topic: 'Chemical Bonding (Ionic, Covalent, Metallic)', teacher: 'Mrs. Bello' },
    ],
  },
  {
    week: 'Week 3',
    theme: 'Trigonometry & Grammar',
    topics: [
      { subject: 'Mathematics', topic: 'Trigonometric Ratios & Applications', teacher: 'Mr. Abiodun' },
      { subject: 'English Language', topic: 'Parts of Speech & Sentence Structure', teacher: 'Mrs. Nwosu' },
      { subject: 'Biology', topic: 'Digestive System in Humans', teacher: 'Dr. Eze' },
      { subject: 'Physics', topic: 'Heat Transfer (Conduction, Convection, Radiation)', teacher: 'Mr. Okafor' },
      { subject: 'Chemistry', topic: 'Stoichiometry and Mole Concept', teacher: 'Mrs. Bello' },
    ],
  },
  {
    week: 'Week 4',
    theme: 'Geometry & Oral English',
    topics: [
      { subject: 'Mathematics', topic: 'Mensuration: Area and Volume of Solids', teacher: 'Mr. Abiodun' },
      { subject: 'English Language', topic: 'Oral English: Vowel and Consonant Sounds', teacher: 'Mrs. Nwosu' },
      { subject: 'Biology', topic: 'Respiratory System & Mechanism', teacher: 'Dr. Eze' },
      { subject: 'Physics', topic: 'Light Waves & Reflection (Mirrors)', teacher: 'Mr. Okafor' },
      { subject: 'Chemistry', topic: 'Acids, Bases and Salts', teacher: 'Mrs. Bello' },
    ],
  },
  {
    week: 'Week 5',
    theme: 'Statistics & Literature',
    topics: [
      { subject: 'Mathematics', topic: 'Data Presentation (Mean, Median, Mode)', teacher: 'Mr. Abiodun' },
      { subject: 'English Language', topic: 'Poetry Analysis & Figures of Speech', teacher: 'Mrs. Nwosu' },
      { subject: 'Biology', topic: 'Excretory System & Osmoregulation', teacher: 'Dr. Eze' },
      { subject: 'Physics', topic: 'Sound Waves & Echo (Acoustics)', teacher: 'Mr. Okafor' },
      { subject: 'Chemistry', topic: 'Rate of Chemical Reactions (Factors)', teacher: 'Mrs. Bello' },
    ],
  },
  {
    week: 'Week 6',
    theme: 'Mid-Term Assessment & Revision',
    topics: [
      { subject: 'All Subjects', topic: 'Mid-Term Quiz & Practical Sessions', teacher: 'Subject Teachers (Abiodun, Nwosu, Eze, Okafor, Bello)' },
    ],
  },
  {
    week: 'Week 7',
    theme: 'Vectors & Drama',
    topics: [
      { subject: 'Mathematics', topic: 'Vectors and Scalars (Addition & Resolution)', teacher: 'Mr. Abiodun' },
      { subject: 'English Language', topic: "Drama: 'The Lion and the Jewel' Analysis", teacher: 'Mrs. Nwosu' },
      { subject: 'Biology', topic: 'Nervous Coordination & Reflex Arc', teacher: 'Dr. Eze' },
      { subject: 'Physics', topic: "Electric Circuits (Ohm's Law & Resistivity)", teacher: 'Mr. Okafor' },
      { subject: 'Chemistry', topic: 'Electrolysis (Principles & Applications)', teacher: 'Mrs. Bello' },
    ],
  },
  {
    week: 'Week 8',
    theme: 'Probability & Formal Writing',
    topics: [
      { subject: 'Mathematics', topic: 'Probability of Simple Events', teacher: 'Mr. Abiodun' },
      { subject: 'English Language', topic: 'Formal & Informal Letters (Structure)', teacher: 'Mrs. Nwosu' },
      { subject: 'Biology', topic: 'Sense Organs (Eye & Ear)', teacher: 'Dr. Eze' },
      { subject: 'Physics', topic: 'Magnetism & Electromagnetic Fields', teacher: 'Mr. Okafor' },
      { subject: 'Chemistry', topic: 'Organic Chemistry Intro (Hydrocarbons)', teacher: 'Mrs. Bello' },
    ],
  },
  {
    week: 'Week 9',
    theme: 'Mock & Intensive Revision',
    topics: [
      { subject: 'Mathematics', topic: 'Past Questions & Problem Solving', teacher: 'Mr. Abiodun' },
      { subject: 'English Language', topic: 'Revision of Comprehension & Lexis', teacher: 'Mrs. Nwosu' },
      { subject: 'Biology', topic: 'Ecology & Environmental Adaptation', teacher: 'Dr. Eze' },
      { subject: 'Physics', topic: 'Revision of Mechanics & Optics', teacher: 'Mr. Okafor' },
      { subject: 'Chemistry', topic: 'Balancing Equations & Theory', teacher: 'Mrs. Bello' },
    ],
  },
  {
    week: 'Week 10',
    theme: 'End of Term Examination',
    topics: [
      { subject: 'All Subjects', topic: 'Second Term Theory & Objective Exams', teacher: 'Examination Committee / Subject Teachers' },
    ],
  },
]

function TeacherMentorBox() {
  const classTeacherInfo = [
    ['Email', 'adeyemi.t@edumanage.sch'],
    ['Phone', '+234 802 345 6789'],
    ['Office', 'Staff Wing, Room 204'],
    ['Consultation', 'Wed 2pm - 4pm'],
  ]

  return (
    <Card style={{ boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)', borderRadius: 16 }}>
      <CardLabel>Academic & Class Mentors</CardLabel>

      <details className="teacher-info-dropdown">
        <summary>
          <span>
            <span className="teacher-info-label">Class Teacher</span>
            <span className="teacher-info-name">Mrs. Adeyemi</span>
            <span className="teacher-info-role">SS2A Form Teacher</span>
          </span>
          <span className="teacher-info-chevron">⌄</span>
        </summary>

        <div className="teacher-info-details">
          {classTeacherInfo.map(([label, value]) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</p>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: TEXT, lineHeight: 1.45 }}>{value}</p>
            </div>
          ))}
        </div>
      </details>

      <div style={{ height: 1, background: BORDER, margin: '16px 0' }} />

      <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: TEXT2 }}>Subject Teachers</p>
      <div style={{ display: 'grid', gap: 9 }}>
        {subjectTeachers.map((item) => (
          <div key={item.subject} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, color: TEXT2 }}>{item.subject}</span>
            <span style={{ fontSize: 13, color: TEXT, fontWeight: 700, textAlign: 'right' }}>{item.teacher}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ClassTeacherContactBox() {
  return (
    <Card style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}33`, borderRadius: 16, boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)' }}>
      <p style={{ margin: '0 0 8px', color: GOLD, fontSize: 11, fontWeight: 900, letterSpacing: 0.8, textTransform: 'uppercase' }}>Class Teacher Contact</p>
      <p style={{ margin: 0, color: TEXT, fontSize: 16, fontWeight: 800 }}>Mrs. Adeyemi</p>
      <p style={{ margin: '4px 0 12px', color: TEXT2, fontSize: 12 }}>SS2A Form Teacher</p>
      <div style={{ display: 'grid', gap: 7, color: TEXT2, fontSize: 12, lineHeight: 1.45 }}>
        <span><strong style={{ color: TEXT }}>Email:</strong> adeyemi.t@edumanage.sch</span>
        <span><strong style={{ color: TEXT }}>Phone:</strong> +234 802 345 6789</span>
        <span><strong style={{ color: TEXT }}>Office:</strong> Staff Wing, Room 204</span>
        <span><strong style={{ color: TEXT }}>Consultation:</strong> Wed 2pm - 4pm</span>
      </div>
    </Card>
  )
}

function getSchemeTopicDetails(subject: string, topic: string) {
  const subjectFocus: Record<string, { objective: string; activity: string; resources: string; assessment: string }> = {
    Mathematics: {
      objective: 'Solve problems accurately, show full working steps, and connect each topic to WAEC-style applications.',
      activity: 'Guided examples, paired class drills, board practice, and independent problem-solving exercises.',
      resources: 'New General Mathematics, graph sheets, calculator, ruler set, and past-question booklet.',
      assessment: 'Classwork checks, weekly problem set, correction notebook, and short quiz.',
    },
    'English Language': {
      objective: 'Build clear expression, reading accuracy, grammar control, and confident written communication.',
      activity: 'Reading practice, guided writing, peer review, oral drills, and teacher-led corrections.',
      resources: 'English textbook, comprehension passages, dictionary, literature text, and writing notebook.',
      assessment: 'Essay draft, comprehension task, vocabulary drill, oral response, and grammar test.',
    },
    Biology: {
      objective: 'Explain biological processes, identify structures, and apply concepts to everyday living systems.',
      activity: 'Labelled diagrams, practical observation, group explanation, and short laboratory demonstration.',
      resources: 'Biology textbook, charts, microscope slides where available, specimen images, and practical notebook.',
      assessment: 'Diagram labelling, practical notes, objective questions, and oral questioning.',
    },
    Physics: {
      objective: 'Understand core principles, interpret data/graphs, and solve numerical problems with correct units.',
      activity: 'Teacher demonstration, graph interpretation, calculation practice, and simple experiments.',
      resources: 'Physics textbook, graph book, measuring instruments, formulas sheet, and practical manual.',
      assessment: 'Calculation task, practical observation note, graph exercise, and weekly quiz.',
    },
    Chemistry: {
      objective: 'Describe chemical concepts, write balanced equations, and connect theory with laboratory practice.',
      activity: 'Equation practice, teacher demonstration, group discussion, and structured note-taking.',
      resources: 'Chemistry textbook, periodic table, equation worksheet, lab apparatus, and practical notebook.',
      assessment: 'Balanced equations, theory questions, practical notes, and end-of-week test.',
    },
    'All Subjects': {
      objective: 'Review all covered topics, identify learning gaps, and prepare for formal assessment.',
      activity: 'Revision clinics, timed practice, teacher feedback, and practical/problem-solving sessions.',
      resources: 'Subject notebooks, past questions, revision sheets, textbooks, and teacher-prepared guides.',
      assessment: 'Quiz, mock task, correction review, and teacher feedback.',
    },
  }

  const details = subjectFocus[subject] || subjectFocus['All Subjects']
  return {
    ...details,
    homework: subject === 'All Subjects'
      ? 'Revise all notes and complete subject-specific practice questions.'
      : `Complete the workbook exercise related to ${topic.toLowerCase()}.`,
  }
}

export function SchemeOfWorkView() {
  const handleDownloadPdf = () => window.print()

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <div className='scheme-print-actions'>
        <Card style={{ borderRadius: 18, boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, color: TEXT, fontSize: 28, fontWeight: 800, lineHeight: 1.15 }}>Detailed Scheme of Work</h2>
            <p style={{ margin: '8px 0 0', color: TEXT2, fontSize: 14, lineHeight: 1.6, borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>
              SS2A / Second Term (2025/2026) - Full weekly topic guide, lesson focus, resources, assessment, and assigned teachers
            </p>
            <div style={{ display: 'inline-flex', width: 'fit-content', marginTop: 12, background: `${GOLD}18`, color: GOLD, fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 999 }}>
              10 Weeks Intensive Curriculum
            </div>
          </div>
          <button
            type='button'
            onClick={handleDownloadPdf}
            style={{ border: 'none', background: TEXT, color: '#FFFFFF', borderRadius: 10, padding: '11px 16px', fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 18px rgba(13,13,13,0.16)' }}
          >
            Download / Print PDF
          </button>
        </Card>
      </div>

      <div id='scheme-of-work-document' className='scheme-of-work-document' style={{ display: 'grid', gap: 16 }}>
        {schemeWeeks.map((week) => (
          <Card key={week.week} style={{ padding: 0, overflow: 'hidden', borderRadius: 16, boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ background: '#FAFAF8', padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: TEXT, fontSize: 17, fontWeight: 800 }}>{week.week}</h3>
              <span style={{ background: `${GOLD}14`, color: GOLD, fontSize: 12, fontWeight: 800, padding: '7px 12px', borderRadius: 999 }}>{week.theme}</span>
            </div>

            <div style={{ padding: 18 }}>
              {week.topics.map((topic) => {
                const details = getSchemeTopicDetails(topic.subject, topic.topic)
                return (
                  <div key={`${week.week}-${topic.subject}`} className="scheme-topic-row">
                    <div className='scheme-topic-main'>
                      <div style={{ fontWeight: 800, color: TEXT, minWidth: 130 }}>{topic.subject}</div>
                      <div style={{ flex: 1, color: TEXT2, lineHeight: 1.5 }}>
                        <p style={{ margin: 0, fontWeight: 700 }}>{topic.topic}</p>
                        <div className='scheme-topic-details'>
                          <div><strong>Learning Objective:</strong> {details.objective}</div>
                          <div><strong>Class Activities:</strong> {details.activity}</div>
                          <div><strong>Resources:</strong> {details.resources}</div>
                          <div><strong>Assessment:</strong> {details.assessment}</div>
                          <div><strong>Homework:</strong> {details.homework}</div>
                        </div>
                      </div>
                      <div style={{ background: `${GOLD}14`, color: GOLD, fontSize: 12, fontWeight: 700, padding: '7px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{topic.teacher}</div>
                    </div>
                  </div>
                )
              })}

              <div style={{ marginTop: 14, color: TEXT2, background: '#FAFAF8', padding: 12, borderRadius: 12, fontSize: 12, lineHeight: 1.55 }}>
                Class Teacher: Mrs. Adeyemi coordinates with subject teachers for scheme delivery.
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ borderRadius: 16, display: 'grid', gap: 16, boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)' }}>
        <div>
          <p style={{ margin: 0, color: TEXT, fontSize: 15, fontWeight: 800 }}>Form Teacher & Subject Guidance</p>
          <p style={{ margin: '5px 0 0', color: TEXT2, fontSize: 13, lineHeight: 1.55 }}>Mrs. Adeyemi oversees academic progress. All listed teachers are available for extra lessons.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px,0.8fr) minmax(280px,1.2fr)', gap: 14, alignItems: 'start' }}>
          <div style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}33`, borderRadius: 12, padding: 14 }}>
            <p style={{ margin: '0 0 8px', color: GOLD, fontSize: 11, fontWeight: 900, letterSpacing: 0.8, textTransform: 'uppercase' }}>Class Teacher Contact</p>
            <p style={{ margin: 0, color: TEXT, fontSize: 14, fontWeight: 800 }}>Mrs. Adeyemi</p>
            <p style={{ margin: '4px 0 10px', color: TEXT2, fontSize: 12 }}>SS2A Form Teacher</p>
            <div style={{ display: 'grid', gap: 6, color: TEXT2, fontSize: 12, lineHeight: 1.45 }}>
              <span><strong style={{ color: TEXT }}>Email:</strong> adeyemi.t@edumanage.sch</span>
              <span><strong style={{ color: TEXT }}>Phone:</strong> +234 802 345 6789</span>
              <span><strong style={{ color: TEXT }}>Office:</strong> Staff Wing, Room 204</span>
              <span><strong style={{ color: TEXT }}>Consultation:</strong> Wed 2pm - 4pm</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <p style={{ margin: 0, color: TEXT, fontSize: 12, fontWeight: 900, letterSpacing: 0.8, textTransform: 'uppercase' }}>Subject Teacher Contacts</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 8 }}>
              {subjectTeachers.map((item) => (
                <div key={item.subject} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: 11, background: '#FAFAF8' }}>
                  <p style={{ margin: 0, color: TEXT, fontSize: 13, fontWeight: 800 }}>{item.subject}</p>
                  <p style={{ margin: '3px 0 7px', color: GOLD, fontSize: 12, fontWeight: 800 }}>{item.teacher}</p>
                  <p style={{ margin: 0, color: TEXT2, fontSize: 11, lineHeight: 1.45 }}>{item.email}</p>
                  <p style={{ margin: '2px 0 0', color: TEXT2, fontSize: 11 }}>{item.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <style jsx>{`
        .scheme-of-work-document {
          background: #ffffff;
        }

        .scheme-topic-row {
          padding: 12px 0;
          border-bottom: 1px dashed #edf2f7;
        }

        .scheme-topic-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .scheme-topic-details {
          display: grid;
          gap: 6px;
          margin-top: 10px;
          padding: 12px;
          border-radius: 12px;
          background: #fafaf8;
          color: ${TEXT2};
          font-size: 12px;
          line-height: 1.55;
        }

        .scheme-topic-row:last-child {
          border-bottom: 0;
        }

        @media (max-width: 900px) {
          .scheme-topic-main {
            display: grid;
            grid-template-columns: 1fr;
          }
        }

        @media print {
          .scheme-print-actions {
            display: none !important;
          }

          .scheme-of-work-document {
            display: block !important;
          }
        }
      `}</style>
    </section>
  )
}

export default function StudentDashboard() {
  const d = mockData.student
  const totalFeesDue = useMemo(
    () => d.fees.structure.reduce((sum, fee) => sum + fee.amount, 0),
    [d.fees.structure]
  )
  const avgAttendance = useMemo(
    () => Math.round(d.attendance.reduce((sum, item) => sum + (item.present / item.total) * 100, 0) / d.attendance.length),
    [d.attendance]
  )

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div className="student-dashboard-top-grid" style={{ display: 'grid', gap: 16, alignItems: 'start' }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: TEXT3, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {mockData.term} / {mockData.session}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
            <Avatar initials={d.avatar} size={56} />
            <div>
              <h1 style={{ margin: 0, fontSize: 32, fontFamily: "'Georgia',serif", fontWeight: 700, color: TEXT }}>{d.name}</h1>
              <p style={{ margin: '6px 0 0', color: TEXT2 }}>{d.level} / {d.class}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <GoldBadge>{d.class}</GoldBadge>
            <GoldBadge>{d.level}</GoldBadge>
            <GoldBadge color={BLUE}>Form Teacher: {d.formTeacher}</GoldBadge>
            <GoldBadge color={TEXT3}>{d.house}</GoldBadge>
          </div>
        </div>

        <ClassTeacherContactBox />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
        <StatCard label="Fees Balance" value={`NGN ${totalFeesDue.toLocaleString()}`} sub="This term outstanding" color={RED} />
        <StatCard label="Average Attendance" value={`${avgAttendance}%`} sub="Current term" color={GREEN} />
        <StatCard label="Class Position" value={`${d.reportCard.position}th`} sub={`of ${d.reportCard.classSize}`} color={BLUE} />
        <StatCard label="Subjects" value={d.subjects.length} sub="Active this term" color={GOLD} />
      </div>

      <div className="student-dashboard-main-grid" style={{ display: 'grid', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Card>
            <CardLabel>Today's Schedule</CardLabel>
            <div style={{ display: 'grid', gap: 12 }}>
              {d.timetable.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, border: `1px solid ${GOLD}33`, background: `${GOLD}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: GOLD }}>
                    {item.time}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>{item.subject}</h2>
                    <p style={{ margin: '4px 0 0', color: TEXT2, fontSize: 12 }}>{item.teacher} / {item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardLabel>Progress Overview</CardLabel>
            <div style={{ display: 'grid', gap: 12 }}>
              {d.subjects.map((subject, index) => {
                const total = subject.ca1 + subject.ca2 + subject.midterm
                const max = 100
                const grade = getGrade(Math.round((total / max) * 100))
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: TEXT }}>{subject.name}</span>
                      <span style={{ fontSize: 12, color: grade.color }}>{grade.grade}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: BORDER, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((total / max) * 100)}%`, height: '100%', background: grade.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <TeacherMentorBox />
      </div>

      <style jsx>{`
        .student-dashboard-top-grid {
          grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
        }

        .student-dashboard-main-grid {
          grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
        }

        .teacher-info-dropdown {
          border: 1px solid ${BLUE}22;
          border-radius: 12px;
          background: ${BLUE}0D;
          overflow: hidden;
        }

        .teacher-info-dropdown summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 14px;
          cursor: pointer;
          list-style: none;
        }

        .teacher-info-dropdown summary::-webkit-details-marker {
          display: none;
        }

        .teacher-info-label,
        .teacher-info-role {
          display: block;
          font-size: 11px;
          color: ${TEXT2};
        }

        .teacher-info-label {
          color: ${BLUE};
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .teacher-info-name {
          display: block;
          margin-top: 3px;
          font-size: 14px;
          font-weight: 800;
          color: ${TEXT};
        }

        .teacher-info-role {
          margin-top: 2px;
        }

        .teacher-info-chevron {
          color: ${BLUE};
          font-size: 18px;
          line-height: 1;
          transition: transform 0.2s ease;
        }

        .teacher-info-dropdown[open] .teacher-info-chevron {
          transform: rotate(180deg);
        }

        .teacher-info-details {
          display: grid;
          gap: 11px;
          padding: 0 14px 14px;
        }

        @media (max-width: 900px) {
          .student-dashboard-top-grid {
            grid-template-columns: 1fr;
          }

          .student-dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
