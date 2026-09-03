'use client'
import { AlertCircle, Bell, CheckCircle2, Clock, UserRound } from 'lucide-react'
import { mockData, GOLD, BORDER, BLUE, GREEN, RED } from '../portalData'
import { Avatar, Card, CardLabel, GoldBadge, StatCard } from '../portalUi'

export function ParentNotifications() {
  const notifications = mockData.parentNotifications
  const highPriority = notifications.filter((item) => item.priority === 'High').length
  const categoryColor: Record<string, string> = {
    Meeting: GOLD,
    Fees: RED,
    Academics: BLUE,
    Attendance: GREEN,
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>Parent Notifications</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>Important school updates for the Okafor family.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12, marginBottom: 18 }}>
        <StatCard label='Unread Alerts' value={`${notifications.length}`} sub='Family inbox' color={GOLD} />
        <StatCard label='Priority' value={`${highPriority}`} sub='Needs attention' color={RED} />
        <StatCard label='Children' value={`${mockData.children.length}`} sub='Linked profiles' color={BLUE} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 16, alignItems: 'start' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', background: '#0D0D0D', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <p style={{ margin: 0, color: '#C9A020', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}>Notification Center</p>
              <p style={{ margin: '4px 0 0', color: '#FFFFFF', fontSize: 18, fontFamily: "'Georgia',serif" }}>Latest from Greenfield Academy</p>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#C9A020', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={20} color='#0D0D0D' />
            </div>
          </div>

          <div style={{ padding: '6px 20px 18px' }}>
            {notifications.map((item, index) => {
              const color = categoryColor[item.category] || GOLD
              return (
                <div key={item.title} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, padding: '16px 0', borderBottom: index < notifications.length - 1 ? `1px solid ${BORDER}` : 'none', alignItems: 'start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}16`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.priority === 'High' ? <AlertCircle size={18} color={color} /> : <CheckCircle2 size={18} color={color} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 5 }}>
                      <p style={{ margin: 0, color: '#0D0D0D', fontSize: 15, fontWeight: 700 }}>{item.title}</p>
                      <GoldBadge color={color}>{item.category}</GoldBadge>
                    </div>
                    <p style={{ margin: '0 0 8px', color: '#5C5750', fontSize: 13, lineHeight: 1.55 }}>{item.message}</p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#9B9590', fontSize: 11 }}>
                        <UserRound size={13} /> {item.child}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#9B9590', fontSize: 11 }}>
                        <Clock size={13} /> {item.time}
                      </span>
                    </div>
                  </div>
                  <GoldBadge color={item.priority === 'High' ? RED : '#9B9590'}>{item.priority}</GoldBadge>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardLabel>Family Snapshot</CardLabel>
          <div style={{ display: 'grid', gap: 12 }}>
            {mockData.children.map((child, index) => (
              <div key={child.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: index < mockData.children.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <Avatar initials={child.avatar} size={38} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, color: '#0D0D0D', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{child.name}</p>
                  <p style={{ margin: '3px 0 0', color: '#9B9590', fontSize: 11 }}>{child.class} / {child.level}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: '#C9A02012', border: '1px solid #C9A02033' }}>
            <p style={{ margin: 0, color: '#8B6E10', fontSize: 13, lineHeight: 1.55, fontWeight: 600 }}>You have {highPriority} priority updates waiting for parent action this week.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

