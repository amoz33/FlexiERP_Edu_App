'use client'

import Card from '@/components/ui/Card'

const attendanceRecords = [
  { subject: 'Mathematics', present: 28, absent: 2, late: 1, total: 31 },
  { subject: 'English Language', present: 30, absent: 1, late: 0, total: 31 },
  { subject: 'Biology', present: 27, absent: 3, late: 1, total: 31 },
]

export default function AttendanceView() {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div>
        <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#9B9590' }}>Attendance</p>
        <h2 style={{ margin: '10px 0 0', fontSize: 28, color: '#0D0D0D', fontFamily: "'Georgia',serif" }}>Attendance Summary</h2>
      </div>

      <Card>
        <div style={{ display: 'grid', gap: 14 }}>
          {attendanceRecords.map((item, index) => (
            <div key={index} style={{ display: 'grid', gap: 6, padding: 12, borderRadius: 14, background: index % 2 === 0 ? '#FAFAFA' : 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#0D0D0D' }}>{item.subject}</span>
                <span style={{ color: '#5C5750', fontSize: 12 }}>{item.present}/{item.total} present</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 10 }}>
                <div style={{ padding: 12, borderRadius: 14, background: '#ECFDF5' }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#065F46' }}>Present</p>
                  <p style={{ margin: '8px 0 0', fontWeight: 700 }}>{item.present}</p>
                </div>
                <div style={{ padding: 12, borderRadius: 14, background: '#FEF2F2' }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#991B1B' }}>Absent</p>
                  <p style={{ margin: '8px 0 0', fontWeight: 700 }}>{item.absent}</p>
                </div>
                <div style={{ padding: 12, borderRadius: 14, background: '#FFF7ED' }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#9A3412' }}>Late</p>
                  <p style={{ margin: '8px 0 0', fontWeight: 700 }}>{item.late}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
