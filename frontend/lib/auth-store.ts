import { create } from 'zustand'
import { authApi } from './api'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'teacher' | 'parent' | 'student'
  avatar?: string
}

interface AuthState {
  user: User | null
  role: User['role'] | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setRole: (role: User['role']) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

const getStoredRole = () => {
  if (typeof window === 'undefined') return null
  const value = localStorage.getItem('edu_user_role')
  if (value === 'admin' || value === 'staff' || value === 'teacher' || value === 'parent' || value === 'student') {
    return value
  }
  return null
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: getStoredRole(),
  token: typeof window !== 'undefined' ? localStorage.getItem('edu_token') : null,
  isAuthenticated: false,
  isLoading: false,
  setRole: (role) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edu_user_role', role)
    }
    set({ role })
  },

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await authApi.login(email, password)
      const { token, user } = res.data
      localStorage.setItem('edu_token', token)
      const role = user?.role ?? getStoredRole()
      if (typeof window !== 'undefined' && role) {
        localStorage.setItem('edu_user_role', role)
      }
      set({ token, user, role, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  logout: async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('edu_token')
    set({ user: null, token: null, isAuthenticated: false })
    window.location.href = '/login'
  },

  fetchMe: async () => {
    try {
      const res = await authApi.me()
      const role = res.data?.role ?? getStoredRole()
      set({ user: res.data, role, isAuthenticated: true })
      if (typeof window !== 'undefined' && role) {
        localStorage.setItem('edu_user_role', role)
      }
    } catch {
      localStorage.removeItem('edu_token')
      localStorage.removeItem('edu_user_role')
      set({ user: null, token: null, role: null, isAuthenticated: false })
    }
  },
}))
