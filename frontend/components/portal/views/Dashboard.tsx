'use client'
import { useState } from 'react'
import { mockData, getGrade, GOLD, BORDER, BLUE, GREEN, RED } from '../portalData'
import { Card, CardLabel, GoldBadge, StatCard } from '../portalUi'
import { RoleType } from '../portalTypes'

export function Dashboard({ role }: { role: RoleType }) {
  const d = mockData.student
  const [showTeacherContact, setShowTeacherContact] = useState(false)
  const totalFeesDue = d.fees.structure.reduce((sum, fee) => sum + fee.amount, 0)
  const avgAtt = Math.round(
    d.attendance.reduce((sum, item) => sum + (item.present / item.total) * 100, 0) / d.attendance.length,
  )

  return (
    <div>
      <div className='portal-dashboard-top-grid' style={{ display: 'grid', gap: 16, alignItems: 'start', marginBottom: 24 }}>
        <div>
        <p style={{ margin: 0, fontSize: 11, color: '#9B9590', letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
          {mockData.term} · {mockData.session}
        </p>
        <h2 style={{ margin: '4px 0 10px', fontSize: 26, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>
          {role === 'parent' ? `Viewing: ${d.name}` : `Welcome, ${d.name.split(' ')[0]}`}
        </h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <GoldBadge>{d.class}</GoldBadge>
          <GoldBadge>{d.level}</GoldBadge>
          <GoldBadge color='#9B9590'>Form Teacher: {d.formTeacher}</GoldBadge>
          <GoldBadge color={BLUE}>{d.house}</GoldBadge>
        </div>
        </div>
        <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 14, boxShadow: '0 10px 26px rgba(13,13,13,0.08)' }}>
          <button
            type='button'
            onClick={() => setShowTeacherContact((value) => !value)}
            style={{ width: '100%', background: '#0D0D0D', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: GOLD, color: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontFamily: "'Georgia',serif" }}>MA</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, color: GOLD, fontSize: 10, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace' }}>Class Teacher Contact</p>
              <p style={{ margin: '3px 0 0', color: '#FFFFFF', fontSize: 16, fontWeight: 800 }}>Mrs. Adeyemi</p>
              <p style={{ margin: 0, color: '#D7D2CB', fontSize: 11 }}>SS2A Form Teacher</p>
            </div>
            <span style={{ color: GOLD, fontSize: 18, fontWeight: 900, transform: showTeacherContact ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>⌄</span>
          </button>
          {showTeacherContact && (
            <div style={{ padding: 16, display: 'grid', gap: 9, background: '#FFFFFF' }}>
              {[
                ['Email', 'adeyemi.t@edumanage.sch'],
                ['Phone', '+234 802 345 6789'],
                ['Office', 'Staff Wing, Room 204'],
                ['Consultation', 'Wed 2pm - 4pm'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '86px 1fr', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ color: '#9B9590', fontSize: 10, fontWeight: 900, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</span>
                  <span style={{ color: '#0D0D0D', fontSize: 12, fontWeight: 650, lineHeight: 1.35, minWidth: 0 }}>{value}</span>
                </div>
              ))}
              <div style={{ marginTop: 3, borderTop: `1px solid ${BORDER}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#5C5750', fontSize: 11 }}>Available for academic guidance</span>
                <span style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}33`, borderRadius: 999, padding: '4px 8px', fontSize: 10, fontWeight: 900 }}>Active</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <style jsx>{`
        .portal-dashboard-top-grid {
          grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
        }

        @media (max-width: 900px) {
          .portal-dashboard-top-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard label='Fees Balance' value={`₦${(totalFeesDue / 1000).toFixed(0)}k`} sub='This term outstanding' color={RED} />
        <StatCard label='Avg CA Score' value='72%' sub='2nd Term CAs' color={GOLD} />
        <StatCard label='Attendance' value={`${avgAtt}%`} sub='This term' color={GREEN} />
        <StatCard label='Class Position' value={`${d.reportCard.position}th`} sub={`of ${d.reportCard.classSize} students`} color={BLUE} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardLabel>Today&apos;s Timetable</CardLabel>
          {d.timetable.slice(0, 4).map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: index < 3 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: '#C9A02020', border: `1px solid #C9A02033`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 8, color: '#C9A020', fontFamily: 'monospace', lineHeight: 1 }}>{item.day}</span>
                <span style={{ fontSize: 10, color: '#0D0D0D', fontFamily: 'monospace', fontWeight: 700, lineHeight: 1.4 }}>{item.time.split(' ')[0]}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#0D0D0D', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subject}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#9B9590' }}>{item.teacher} · {item.room}</p>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <CardLabel>2nd Term CA Scores</CardLabel>
          {d.subjects.slice(0, 5).map((subject, index) => {
            const total = subject.ca1 + subject.ca2
            const pct = Math.round((total / 40) * 100)
            const grade = getGrade(pct)
            return (
              <div key={index} style={{ padding: '7px 0', borderBottom: index < 4 ? `1px solid ${BORDER}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#0D0D0D', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.name}</p>
                  <span style={{ fontSize: 12, color: grade.color, fontWeight: 700, marginLeft: 8, fontFamily: 'monospace' }}>{total}/40 <span style={{ fontSize: 10 }}>{grade.grade}</span></span>
                </div>
                <div style={{ height: 4, background: BORDER, borderRadius: 2 }}>
                  <div style={{ height: 4, borderRadius: 2, width: `${pct}%`, background: grade.color }} />
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}

