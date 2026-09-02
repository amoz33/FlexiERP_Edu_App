'use client'

import { GOLD, GOLD_DIM, BLACK } from '@/constants'

interface AvatarProps {
  initials: string
  size?: number
}

export default function Avatar({ initials, size = 36 }: AvatarProps) {
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
      {initials.substring(0, 2).toUpperCase()}
    </div>
  )
}
