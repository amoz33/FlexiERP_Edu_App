'use client'

import { useState } from 'react'

export function useAuth() {
  const [role, setRole] = useState<'student' | 'parent'>('student')
  const [user, setUser] = useState({ name: 'Jane Doe' })

  return {
    user,
    role,
    setRole,
    login: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      setUser({ name: 'Jane Doe' })
      return { success: true }
    },
    logout: async () => {
      setUser({ name: '' })
      setRole('student')
    },
  }
}
