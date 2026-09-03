'use client'
import { useState } from 'react'
import { mockData, GOLD, BORDER, GREEN, RED } from '../portalData'
import { Card, CardLabel, StatCard } from '../portalUi'

export function Attendance() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const att = mockData.student.attendance
  const totalPresent = att.reduce((sum, item) => sum + item.present, 0)
  const totalAbsent = att.reduce((sum, item) => sum + item.absent, 0)
  const totalLate = att.reduce((sum, item) => sum + item.late, 0)
  const overall = Math.round((totalPresent / att.reduce((sum, item) => sum + item.total, 0)) * 100)
  const calDays = Array.from({ length: 31 }, (_, index) => {
    if ([0, 6].includes(index % 7)) return 'weekend'
    const random = Math.random()
    return random > 0.88 ? 'absent' : random > 0.76 ? 'late' : 'present'
  })

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>Attendance Record</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>{mockData.term} · {mockData.session}</p>
      </div>
      {overall < 75 && (
        <div style={{ background: `${RED}10`, border: `1px solid ${RED}44`, borderRadius: 10, padding: '12px 18px', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: RED, fontWeight: 600 }}>⚠️ Attendance below 75% minimum. Students below this threshold may be barred from sitting examinations.</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label='Overall' value={`${overall}%`} sub='Attendance rate' color={overall >= 75 ? GOLD : RED} />
        <StatCard label='Present' value={`${totalPresent}`} sub='Days attended' color={GREEN} />
        <StatCard label='Absent' value={`${totalAbsent}`} sub='Days missed' color={RED} />
        <StatCard label='Late' value={`${totalLate}`} sub='Late arrivals' color='#E8A020' />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['list', 'calendar'].map((item) => (
          <button
            key={item}
            onClick={() => setView(item as 'list' | 'calendar')}
            style={{
              padding: '7px 18px',
              borderRadius: 7,
              background: view === item ? GOLD : '#FFFFFF',
              border: `1px solid ${view === item ? GOLD : BORDER}`,
              color: view === item ? '#0D0D0D' : '#5C5750',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {item === 'list' ? 'By Subject' : 'Calendar View'}
          </button>
        ))}
      </div>
      {view === 'list' ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {att.map((item, index) => {
            const pct = Math.round((item.present / item.total) * 100)
            return (
              <Card key={index} style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{item.subject}</p>
                  <span style={{ fontSize: 14, fontWeight: 700, color: pct >= 75 ? GREEN : RED, fontFamily: 'monospace' }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: BORDER, borderRadius: 3, marginBottom: 8 }}>
                  <div style={{ height: 5, borderRadius: 3, width: `${pct}%`, background: pct >= 75 ? GREEN : RED }} />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: 12, color: GREEN }}>● Present: {item.present}</span>
                  <span style={{ fontSize: 12, color: RED }}>● Absent: {item.absent}</span>
                  <span style={{ fontSize: 12, color: '#E8A020' }}>● Late: {item.late}</span>
                  <span style={{ fontSize: 12, color: '#9B9590' }}>Total: {item.total} days</span>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardLabel>February 2026 — School Calendar</CardLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => (
              <p key={day} style={{ margin: '0 0 6px', fontSize: 10, color: '#9B9590', textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>{day}</p>
            ))}
            {calDays.map((status, index) => (
              <div
                key={index}
                style={{
                  height: 34,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  background: status === 'weekend' ? '#F0EFE8' : status === 'present' ? `${GREEN}18` : status === 'absent' ? `${RED}18` : '#E8A02018',
                  border: `1px solid ${status === 'weekend' ? BORDER : status === 'present' ? GREEN + '44' : status === 'absent' ? RED + '44' : '#E8A02044'}`,
                  color: status === 'weekend' ? '#9B9590' : status === 'present' ? GREEN : status === 'absent' ? RED : '#E8A020',
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
            <span style={{ fontSize: 11, color: GREEN }}>■ Present</span>
            <span style={{ fontSize: 11, color: RED }}>■ Absent</span>
            <span style={{ fontSize: 11, color: '#E8A020' }}>■ Late</span>
            <span style={{ fontSize: 11, color: '#9B9590' }}>■ Weekend</span>
          </div>
        </Card>
      )}
    </div>
  )
}

