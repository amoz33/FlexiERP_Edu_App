'use client'

interface StudentAvatarProps {
  initials: string
  size?: 'sm' | 'md'
}

export default function StudentAvatar({ initials, size = 'md' }: StudentAvatarProps) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-xs'
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: '#C9A020' }}
    >
      {initials}
    </div>
  )
}
