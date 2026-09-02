'use client'

import { useEffect, useState } from 'react'

interface AppFooterProps {
  compact?: boolean
}

export default function AppFooter({ compact = false }: AppFooterProps) {
  const [year, setYear] = useState(2026)

  useEffect(() => {
    const updateYear = () => setYear(new Date().getFullYear())

    updateYear()
    const timer = window.setInterval(updateYear, 60 * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <footer
      style={{
        width: '100%',
        padding: compact ? '18px 18px 24px' : '24px 24px 28px',
        color: '#5C5750',
      }}
    >
      <div
        style={{
          maxWidth: compact ? 540 : 1300,
          margin: '0 auto',
          borderTop: '1px solid #E8E4DC',
          paddingTop: compact ? 14 : 18,
          textAlign: 'center',
          fontSize: compact ? 12 : 13,
          lineHeight: 1.7,
          position: 'relative',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -1,
            left: '50%',
            width: compact ? 84 : 120,
            height: 2,
            borderRadius: 999,
            background: '#C9A020',
            transform: 'translateX(-50%)',
          }}
        />
        <p style={{ margin: 0, color: '#0D0D0D', fontWeight: 400 }}>
          Copyright &copy; {year} FlexiSoftware by GWPL. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
