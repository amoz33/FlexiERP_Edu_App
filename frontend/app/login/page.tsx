'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import AppFooter from '@/components/layout/AppFooter'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, role } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem('edu_remember_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRemember(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      if (remember) {
        localStorage.setItem('edu_remember_email', email)
      } else {
        localStorage.removeItem('edu_remember_email')
      }
      toast.success('Welcome back!')
      if (role === 'parent' || role === 'student') {
        router.push('/portal')
      } else {
        router.push('/dashboard')
      }
    } catch {
      toast.error('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: '#F7F6F3', fontFamily: '"Palatino Linotype", Palatino, serif' }}>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
             style={{ background: 'rgba(201,160,32,0.15)', border: '2px solid rgba(201,160,32,0.4)' }}>
          <BookOpen size={20} style={{ color: '#C9A020' }} />
        </div>
        <div>
          <span className="text-2xl font-bold" style={{ color: '#0D0D0D' }}>EduManage</span>
          <span className="text-2xl font-bold" style={{ color: '#C9A020' }}>.</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8"
           style={{ border: '1px solid #E4E1D8', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

        <h1 className="text-2xl font-bold text-center mb-1" style={{ color: '#0D0D0D' }}>Welcome Back</h1>
        <p className="text-sm text-center mb-7" style={{ color: '#6B6660' }}>Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                   style={{ color: '#6B6660' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@school.com"
              required
              className="input"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold tracking-widest uppercase"
                     style={{ color: '#6B6660' }}>Password</label>
              <button
                type="button"
                onClick={() => toast('Password reset is not configured yet.')}
                className="text-xs font-medium"
                style={{ color: '#C9A020' }}>
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input pr-11"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: '#6B6660' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                   className="rounded" style={{ accentColor: '#C9A020' }} />
            <span className="text-sm" style={{ color: '#6B6660' }}>Remember me</span>
          </label>

          <button type="submit" disabled={isLoading}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200"
                  style={{ background: isLoading ? '#A08018' : '#C9A020' }}>
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm font-medium" style={{ color: '#C9A020' }}>
            Try demo version
          </a>
        </div>
      </div>

      </main>
      <AppFooter compact />
    </div>
  )
}
