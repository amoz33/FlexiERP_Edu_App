'use client'

import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import GoldBadge from '@/components/ui/GoldBadge'
import { getGrade } from '@/constants'

const subjects = [
  { subject: 'Mathematics', teacher: 'Mr. Abiodun', ca1: 18, ca2: 17, midterm: 35 },
  { subject: 'English Language', teacher: 'Mrs. Nwosu', ca1: 19, ca2: 18, midterm: 38 },
  { subject: 'Biology', teacher: 'Mr. Emeka', ca1: 17, ca2: 16, midterm: 32 },
  { subject: 'Chemistry', teacher: 'Mrs. Bello', ca1: 18, ca2: 19, midterm: 34 },
]

export default function SubjectsView() {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div>
        <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#9B9590' }}>Subjects & Scores</p>
        <h2 style={{ margin: '10px 0 0', fontSize: 28, color: '#0D0D0D', fontFamily: "'Georgia',serif" }}>Learning Progress</h2>
      </div>

      <Card>
        <div style={{ display: 'grid', gap: 14 }}>
          {subjects.map((item, index) => {
            const total = item.ca1 + item.ca2 + item.midterm
            const grade = getGrade(Math.round((total / 100) * 100))
            return (
              <div key={index} style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{item.subject}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#5C5750' }}>Teacher: {item.teacher}</p>
                  </div>
                  <GoldBadge color={grade.color}>{grade.grade}</GoldBadge>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: '#E8E4DC' }}>
                  <div style={{ width: `${Math.round((total / 100) * 100)}%`, height: '100%', borderRadius: 999, background: grade.color }} />
                </div>
                <p style={{ margin: 0, color: '#5C5750', fontSize: 12 }}>CA1: {item.ca1}, CA2: {item.ca2}, Midterm: {item.midterm}</p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
