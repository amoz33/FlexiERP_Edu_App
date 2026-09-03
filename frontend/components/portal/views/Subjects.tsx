'use client'
import { mockData, getGrade, GOLD, BORDER, BLUE, GREEN, RED } from '../portalData'
import { Card, CardLabel } from '../portalUi'

export function Subjects() {
  const subjects = mockData.student.subjects
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>Subjects & Scores</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>{mockData.term} · {mockData.session} · {mockData.student.class}</p>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <CardLabel>Score Breakdown — All Subjects</CardLabel>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${BORDER}`, background: '#FAFAF8' }}>
                {['Subject', 'Teacher', 'CA1 /20', 'CA2 /20', 'Mid-Term /40', 'Exam /100', 'Total /100', 'Grade'].map((header) => (
                  <th key={header} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, color: '#9B9590', fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => {
                const caTotal = subject.ca1 + subject.ca2
                const composite = Math.round(((caTotal / 40) + (subject.midterm / 40)) * 50)
                const grade = getGrade(composite)
                return (
                  <tr key={index} style={{ borderBottom: `1px solid ${BORDER}`, background: index % 2 === 0 ? '#FAFAF8' : '#FFFFFF' }}>
                    <td style={{ padding: '10px 10px', fontWeight: 600, color: '#0D0D0D' }}>{subject.name}</td>
                    <td style={{ padding: '10px 10px', color: '#9B9590', fontSize: 12 }}>{subject.teacher}</td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', textAlign: 'center', color: '#0D0D0D' }}>{subject.ca1}</td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', textAlign: 'center', color: '#0D0D0D' }}>{subject.ca2}</td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', textAlign: 'center', color: '#0D0D0D' }}>{subject.midterm}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'center', color: '#9B9590', fontSize: 12 }}>Pending</td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, color: grade.color }}>{composite}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                      <span style={{ background: `${grade.color}18`, color: grade.color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `1px solid ${grade.color}33` }}>{grade.grade}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <CardLabel>Nigerian Grading Scale (WAEC / NECO)</CardLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { range: '75–100', grade: 'A1', color: GOLD },
            { range: '70–74', grade: 'B2', color: GREEN },
            { range: '65–69', grade: 'B3', color: GREEN },
            { range: '60–64', grade: 'C4', color: BLUE },
            { range: '55–59', grade: 'C5', color: BLUE },
            { range: '50–54', grade: 'C6', color: BLUE },
            { range: '45–49', grade: 'D7', color: '#E8A020' },
            { range: '40–44', grade: 'E8', color: '#E8A020' },
            { range: '0–39', grade: 'F9', color: RED },
          ].map((item, index) => (
            <div key={index} style={{ background: `${item.color}12`, border: `1px solid ${item.color}33`, borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>{item.grade}</p>
              <p style={{ margin: '1px 0 0', fontSize: 10, color: '#9B9590' }}>{item.range}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

