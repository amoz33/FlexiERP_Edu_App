'use client'

import { useMemo } from 'react'

export function useDashboard() {
  const section = useMemo(() => 'A', [])

  return {
    term: '2nd Term',
    session: '2025/2026',
    section,
  }
}
