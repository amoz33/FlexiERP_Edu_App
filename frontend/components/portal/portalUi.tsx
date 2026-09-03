import { ReactNode, CSSProperties } from 'react'
import { BORDER, GOLD, GOLD_DIM, BLACK } from './portalData'

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${GOLD_DIM}, ${GOLD})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Georgia',serif",
        fontWeight: 700,
        fontSize: size * 0.33,
        color: BLACK,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

export function GoldBadge({ children, color }: { children: ReactNode; color?: string }) {
  const c = color || GOLD
  return (
    <span
      style={{
        background: `${c}18`,
        color: c,
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 9px',
        borderRadius: 20,
        border: `1px solid ${c}44`,
        letterSpacing: 0.4,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

export function Card({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: '0 0 14px',
        fontSize: 11,
        color: '#9B9590',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontFamily: 'monospace',
        fontWeight: 600,
      }}
    >
      {children}
    </p>
  )
}

export function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: '16px 20px',
        borderLeft: `3px solid ${color || GOLD}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 10,
          color: '#9B9590',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: '6px 0 2px',
          fontSize: 24,
          fontWeight: 700,
          color: color || GOLD,
          fontFamily: "'Georgia',serif",
        }}
      >
        {value}
      </p>
      {sub && <p style={{ margin: 0, fontSize: 12, color: '#5C5750' }}>{sub}</p>}
    </div>
  )
}
