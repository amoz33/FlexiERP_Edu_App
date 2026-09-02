'use client'

import { BORDER, TEXT2, TEXT3 } from '@/constants'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: string
}

export default function StatCard({ label, value, sub, color = '#C9A020' }: StatCardProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: '16px 20px',
        borderLeft: `3px solid ${color}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 10,
          color: TEXT3,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: '6px 0 2px',
          fontSize: 24,
          fontWeight: 700,
          color,
          fontFamily: "'Georgia',serif",
        }}
      >
        {value}
      </p>
      {sub && <p style={{ margin: 0, fontSize: 12, color: TEXT2 }}>{sub}</p>}
    </div>
  )
}
