'use client'

import { useState, useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Card, { CardLabel } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import GoldBadge from '@/components/ui/GoldBadge'
import { BLUE, GOLD, BORDER, GREEN, RED, TEXT, TEXT2, TEXT3 } from '@/constants'

const mockParentData = {
  term: '2nd Term',
  session: '2025/2026',
  children: [
    { id: 'child-1', name: 'Chidinma Okafor', class: 'SS2A', level: 'Senior Secondary', avatar: 'CO', attendance: 92, feesDue: 35000, position: 4 },
    { id: 'child-2', name: 'Emeka Okafor', class: 'JSS1B', level: 'Junior Secondary', avatar: 'EO', attendance: 87, feesDue: 28000, position: 8 },
    { id: 'child-3', name: 'Blessing Okafor', class: 'PRI4', level: 'Primary School', avatar: 'BO', attendance: 95, feesDue: 25000, position: 2 },
  ],
}

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState(mockParentData.children[0])

  const quickActions = useMemo(
    () => [
      { label: 'Report Card', color: GOLD },
      { label: 'Pay Fees', color: RED },
      { label: 'Attendance', color: BLUE },
    ],
    []
  )

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: TEXT3, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
          {mockParentData.term} / {mockParentData.session}
        </p>
        <h1 style={{ margin: '10px 0 0', fontSize: 32, fontFamily: "'Georgia',serif", fontWeight: 700, color: TEXT }}>
          Parent Dashboard
        </h1>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <GoldBadge>Current child: {selectedChild.name}</GoldBadge>
          <GoldBadge color={BLUE}>{selectedChild.class}</GoldBadge>
          <GoldBadge color={TEXT3}>{selectedChild.level}</GoldBadge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
        {mockParentData.children.map(child => (
          <button
            key={child.id}
            type="button"
            onClick={() => setSelectedChild(child)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: 18,
              borderRadius: 18,
              border: `2px solid ${selectedChild.id === child.id ? GOLD : BORDER}`,
              background: '#FFFFFF',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Avatar initials={child.avatar} size={44} />
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>{child.name}</p>
              <p style={{ margin: '4px 0 0', color: TEXT2, fontSize: 12 }}>{child.class} / {child.level}</p>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
        <StatCard label="Attendance" value={`${selectedChild.attendance}%`} sub="This term" color={GREEN} />
        <StatCard label="Fees Due" value={`NGN ${selectedChild.feesDue.toLocaleString()}`} sub="Balance" color={RED} />
        <StatCard label="Class Position" value={`${selectedChild.position}th`} sub="In class" color={BLUE} />
        <StatCard label="Child ID" value={selectedChild.id} sub={selectedChild.level} color={GOLD} />
      </div>

      <Card>
        <CardLabel>Quick Links</CardLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
          {quickActions.map(action => (
            <button key={action.label} type="button" style={{ padding: '14px 16px', borderRadius: 14, border: `1px solid ${action.color}33`, background: `${action.color}10`, color: action.color, fontWeight: 700, cursor: 'pointer' }}>
              {action.label}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
