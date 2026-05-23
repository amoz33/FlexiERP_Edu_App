'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bell, BookOpen, ChevronDown, LogOut, Settings } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { getInitials } from '@/lib/utils'

const GOLD = '#C9A020'
const BORDER = '#E8E4DC'

const notifications = [
  { id: 1, title: 'Fee Payment Reminder', message: '2nd Term fees due March 15', time: '2 hours ago', isRead: false, type: 'fee' },
  { id: 2, title: 'Result Published', message: '1st term results available', time: '1 day ago', isRead: false, type: 'result' },
  { id: 3, title: 'Attendance Alert', message: 'Attendance below 75%', time: '3 days ago', isRead: true, type: 'attendance' },
]

const typeColor: Record<string, string> = {
  fee: GOLD,
  result: '#10B981',
  attendance: '#EF4444',
}

interface NavbarProps {
  userName?: string
  userRole?: string
  userEmail?: string
  settingsHref?: string
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function Navbar({ userName, userRole, userEmail, settingsHref = '/settings' }: NavbarProps) {
  const { user, role, logout } = useAuthStore()
  const [now, setNow] = useState(() => new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const unreadCount = notifications.filter((notification) => !notification.isRead).length
  const displayName = userName || user?.name || 'Admin User'
  const displayRole = userRole || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Administrator')
  const displayEmail = userEmail || user?.email || 'admin@school.edu'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setShowNotifications(false)
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const soften = (element: HTMLElement) => {
    element.style.background = '#F7F6F3'
    element.style.borderColor = 'rgba(201,160,32,0.35)'
  }

  const restore = (element: HTMLElement) => {
    element.style.background = 'white'
    element.style.borderColor = BORDER
  }

  return (
    <header
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        height: 64,
        padding: '0 24px',
        background: 'white',
        borderBottom: `1px solid ${BORDER}`,
        boxShadow: '0 1px 0 rgba(201,160,32,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'rgba(201,160,32,0.12)',
            border: '1px solid rgba(201,160,32,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {!logoFailed ? (
            <Image
              src="/assets/logo.png"
              alt="School logo"
              width={40}
              height={40}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <BookOpen size={19} style={{ color: GOLD }} />
          )}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D', lineHeight: 1.1 }}>EduManage</div>
          <div style={{ fontSize: 12, color: '#6B6660', lineHeight: 1.2 }}>School Administration</div>
        </div>
      </div>

      <div style={{ color: '#4B4640', fontSize: 14, fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap', flex: 1 }}>
        {formatDateTime(now)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, minWidth: 290 }}>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications((value) => !value)
              setShowProfile(false)
            }}
            onMouseEnter={(event) => soften(event.currentTarget)}
            onMouseLeave={(event) => restore(event.currentTarget)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              background: 'white',
              color: '#0D0D0D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.18s ease',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  minWidth: 18,
                  height: 18,
                  padding: '0 5px',
                  borderRadius: 999,
                  background: '#EF4444',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: '18px',
                  textAlign: 'center',
                  border: '2px solid white',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 48,
                width: 340,
                background: 'white',
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                boxShadow: '0 16px 36px rgba(13,13,13,0.14)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>Notifications</div>
                <div style={{ fontSize: 12, color: '#6B6660', marginTop: 2 }}>{unreadCount} unread updates</div>
              </div>
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  onMouseEnter={(event) => { event.currentTarget.style.background = '#F7F6F3' }}
                  onMouseLeave={(event) => { event.currentTarget.style.background = notification.isRead ? 'white' : 'rgba(201,160,32,0.05)' }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderBottom: `1px solid ${BORDER}`,
                    background: notification.isRead ? 'white' : 'rgba(201,160,32,0.05)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 10,
                    fontFamily: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ width: 8, height: 8, marginTop: 6, borderRadius: 999, background: typeColor[notification.type] || GOLD, flexShrink: 0 }} />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>{notification.title}</span>
                    <span style={{ display: 'block', fontSize: 13, color: '#6B6660', marginTop: 2 }}>{notification.message}</span>
                    <span style={{ display: 'block', fontSize: 12, color: '#A09080', marginTop: 5 }}>{notification.time}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => {
              setShowProfile((value) => !value)
              setShowNotifications(false)
            }}
            onMouseEnter={(event) => soften(event.currentTarget)}
            onMouseLeave={(event) => restore(event.currentTarget)}
            style={{
              height: 40,
              padding: '0 10px 0 8px',
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ width: 28, height: 28, borderRadius: 999, background: GOLD, color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getInitials(displayName)}
            </span>
            <span style={{ textAlign: 'left', lineHeight: 1.15 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>{displayName}</span>
              <span style={{ display: 'block', fontSize: 11, color: '#6B6660' }}>{displayRole}</span>
            </span>
            <ChevronDown size={14} style={{ color: '#6B6660' }} />
          </button>

          {showProfile && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 48,
                width: 240,
                background: 'white',
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                boxShadow: '0 16px 36px rgba(13,13,13,0.14)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: 16, borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>{displayName}</div>
                <div style={{ fontSize: 12, color: '#6B6660', marginTop: 2 }}>{displayEmail}</div>
                <div style={{ fontSize: 12, color: GOLD, marginTop: 6, fontWeight: 700 }}>{displayRole}</div>
              </div>
              <Link
                href={settingsHref}
                onClick={() => setShowProfile(false)}
                onMouseEnter={(event) => { event.currentTarget.style.background = '#F7F6F3' }}
                onMouseLeave={(event) => { event.currentTarget.style.background = 'white' }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', color: '#0D0D0D', textDecoration: 'none', fontSize: 14, transition: 'background 0.18s ease' }}
              >
                <Settings size={16} style={{ color: GOLD }} />
                Settings
              </Link>
              <button
                type="button"
                onClick={logout}
                onMouseEnter={(event) => { event.currentTarget.style.background = '#FEF2F2' }}
                onMouseLeave={(event) => { event.currentTarget.style.background = 'white' }}
                style={{
                  width: '100%',
                  border: 'none',
                  borderTop: `1px solid ${BORDER}`,
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  color: '#991B1B',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  textAlign: 'left',
                  transition: 'background 0.18s ease',
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
