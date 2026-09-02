'use client'

import { BORDER, TEXT3 } from '@/constants'

interface CardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Card({ children, className = '', style = {} }: CardProps) {
  return (
    <div
      className={className}
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

export function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: '0 0 14px',
        fontSize: 11,
        color: TEXT3,
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
