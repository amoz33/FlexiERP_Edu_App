'use client'
import { useMemo } from 'react'
import { NavItem, PageType, RoleType } from './portalTypes'
import { NAV, PARENT_NAV } from './portalData'

interface SidebarProps {
  page: PageType
  role: RoleType
  setPage: (page: PageType) => void
  setRole: (role: RoleType) => void
}

export default function PortalSidebar({ page, role, setPage, setRole }: SidebarProps) {
  const allNav: NavItem[] = useMemo(() => (role === 'parent' ? [...PARENT_NAV, ...NAV] : NAV), [role])

  return (
    <div style={{ width: 240, background: '#161616', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, background: '#C9A020', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: '#0D0D0D', fontFamily: "'Georgia',serif" }}>G</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#F5F0E8' }}>GWPL</p>
            <p style={{ margin: 0, fontSize: 9, color: '#C9A020', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'monospace' }}>Flexi Cloud ERP</p>
          </div>
        </div>
        <div style={{ background: '#1E1E1E', borderRadius: 8, padding: '8px 12px' }}>
          <p style={{ margin: '0 0 1px', fontSize: 10, color: '#666', fontFamily: 'monospace' }}>School</p>
          <p style={{ margin: 0, fontSize: 12, color: '#C9A020', fontWeight: 600 }}>Greenfield Academy</p>
        </div>
      </div>

      <div style={{ padding: '14px 16px', borderBottom: '1px solid #222' }}>
        <p style={{ margin: '0 0 6px 10px', fontSize: 10, color: '#444', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace' }}>Portal Mode</p>
        <div style={{ display: 'flex', background: '#1E1E1E', borderRadius: 8, padding: 3, gap: 3 }}>
          {(['student', 'parent'] as RoleType[]).map((value) => (
            <button
              key={value}
              onClick={() => {
                setRole(value)
                setPage(value === 'parent' ? 'switch' : 'dashboard')
              }}
              style={{
                flex: 1,
                padding: '5px 0',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: role === value ? '#C9A020' : 'transparent',
                color: role === value ? '#0D0D0D' : '#666',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'capitalize',
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 16px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#C9A020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0D0D0D' }}>
          {role === 'parent' ? 'PO' : 'CO'}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#F5F0E8', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {role === 'parent' ? 'Mr. Chukwudi Okafor' : 'Chidinma Okafor'}
          </p>
          <p style={{ margin: 0, fontSize: 10, color: '#C9A020', fontFamily: 'monospace' }}>
            {role === 'student' ? 'SS2A · ' : ''}{role.toUpperCase()}
          </p>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <p style={{ margin: '0 0 6px 10px', fontSize: 10, color: '#444', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace' }}>Menu</p>
        {allNav.map((item) => {
          const active = page === item.id

          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id as PageType)}
              onMouseEnter={(event) => {
                event.currentTarget.style.color = '#C9A020'
                if (!active) {
                  event.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = active ? '#C9A020' : '#FFFFFF'
                event.currentTarget.style.background = active ? '#C9A02020' : 'transparent'
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: active ? '#C9A02020' : 'transparent',
                color: active ? '#C9A020' : '#FFFFFF',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                marginBottom: 2,
                textAlign: 'left',
                borderLeft: active ? '3px solid #C9A020' : '3px solid transparent',
                transition: 'background 0.18s ease, color 0.18s ease',
              }}
            >
              <item.Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '1px solid #222' }}>
        <div style={{ background: '#C9A02020', border: '1px solid #C9A02033', borderRadius: 8, padding: '8px 12px' }}>
          <p style={{ margin: '0 0 2px', fontSize: 10, color: '#C9A020', letterSpacing: 1, fontFamily: 'monospace', textTransform: 'uppercase' }}>Current Term</p>
          <p style={{ margin: 0, fontSize: 12, color: '#F5F0E8', fontWeight: 600 }}>2nd Term · 2025/2026</p>
        </div>
      </div>
    </div>
  )
}
