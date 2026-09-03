'use client'

interface GoldBadgeProps {
  children: React.ReactNode
  color?: string
}

export default function GoldBadge({ children, color = '#C9A020' }: GoldBadgeProps) {
  return (
    <span
      style={{
        background: `${color}18`,
        color,
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 9px',
        borderRadius: 20,
        border: `1px solid ${color}44`,
        letterSpacing: 0.4,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
