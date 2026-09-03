'use client'

import { useMemo } from 'react'
import { GOLD, BORDER, TEXT, TEXT2, TEXT3, GREEN, BLUE, RED, getGrade } from '@/constants'
import Avatar from '@/components/ui/Avatar'
import Card, { CardLabel } from '@/components/ui/Card'
import GoldBadge from '@/components/ui/GoldBadge'
import StatCard from '@/components/ui/StatCard'
import { subjectTeachers } from './dashboardData'

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
            <CardLabel>Today&apos;s Schedule</CardLabel>
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
