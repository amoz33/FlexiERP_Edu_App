'use client'
import { mockData, GOLD, BORDER, BLUE, GREEN, RED } from '../portalData'
import { Avatar, Card, CardLabel, GoldBadge, StatCard } from '../portalUi'

export function ParentSwitch({ activeChild, setActiveChild }: { activeChild: number; setActiveChild: (index: number) => void }) {
  const levelColor: Record<string, string> = { 'Senior Secondary': GOLD, 'Junior Secondary': BLUE, 'Primary School': GREEN }
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>My Children</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>{mockData.schoolName} · {mockData.session}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {mockData.children.map((child, index) => (
          <div
            key={index}
            onClick={() => setActiveChild(index)}
            style={{
              background: '#FFFFFF',
              border: `2px solid ${activeChild === index ? GOLD : BORDER}`,
              borderRadius: 14,
              padding: '22px 18px',
              cursor: 'pointer',
              boxShadow: activeChild === index ? `0 4px 20px ${GOLD}22` : '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'all 0.2s',
            }}
          >
            <Avatar initials={child.avatar} size={48} />
            <p style={{ margin: '12px 0 3px', fontSize: 16, color: '#0D0D0D', fontFamily: "'Georgia',serif" }}>{child.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: '#9B9590', fontFamily: 'monospace' }}>{child.id}</p>
            <GoldBadge color={levelColor[child.level] || GOLD}>{child.class}</GoldBadge>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: '#5C5750' }}>{child.level}</p>
            {activeChild === index && (
              <div style={{ marginTop: 12, padding: '6px 12px', background: `${GOLD}14`, borderRadius: 6, border: `1px solid ${GOLD}44` }}>
                <p style={{ margin: 0, fontSize: 11, color: GOLD, fontWeight: 700 }}>✓ CURRENTLY VIEWING</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <Card>
        <CardLabel>Quick Summary — {mockData.children[activeChild].name}</CardLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          <StatCard label='Class' value={mockData.children[activeChild].class} sub={mockData.children[activeChild].level} color={GOLD} />
          <StatCard label='Attendance' value='87%' sub='This term' color={GREEN} />
          <StatCard label='Fees Due' value='₦35k' sub='Balance' color={RED} />
          <StatCard label='Position' value='4th' sub='In class' color={BLUE} />
        </div>
      </Card>
    </div>
  )
}

