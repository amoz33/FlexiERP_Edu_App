'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { staffApi } from '@/lib/api'
import { getInitials } from '@/lib/utils'
import { Users, UserCheck, UserX, LayoutGrid, List, Eye, Pencil, Plus } from 'lucide-react'

const MOCK_STAFF = {
  total: 142, active: 138, on_leave: 4,
  members: [
    { id: '1', name: 'Dr. Sarah Jenkins', role: 'Head of Mathematics', department: 'Mathematics Dept.', email: 's.jenkins@edumanage.edu', status: 'Active', avatar: null },
    { id: '2', name: 'Prof. Robert Chen', role: 'Senior Lecturer', department: 'Physics Dept.', email: 'r.chen@edumanage.edu', status: 'Active', avatar: null },
    { id: '3', name: 'Elena Rostova', role: 'Academic Coordinator', department: 'Administration', email: 'e.rostova@edumanage.edu', status: 'On Leave', avatar: null },
    { id: '4', name: 'David Kim', role: 'Adjunct Professor', department: 'Humanities Dept.', email: 'd.kim@edumanage.edu', status: 'Active', avatar: null },
    { id: '5', name: 'Prof. Alan Smith', role: 'Senior Lecturer', department: 'English Dept.', email: 'a.smith@edumanage.edu', status: 'Active', avatar: null },
    { id: '6', name: 'Dr. Maria Santos', role: 'Lab Instructor', department: 'Science Dept.', email: 'm.santos@edumanage.edu', status: 'Active', avatar: null },
  ]
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#ECFDF5', text: '#059669' },
  'On Leave': { bg: '#FFF7ED', text: '#C2410C' },
}

export default function StaffPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [dept, setDept] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const { data = MOCK_STAFF } = useQuery({
    queryKey: ['staff', dept, role, status],
    queryFn: () => staffApi.list({ department: dept, role, status }).then(r => r.data),
    placeholderData: MOCK_STAFF,
  })

  return (
    <AppLayout>
      <Topbar action={{ label: 'Add Staff Member', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Faculty Directory</h1>
        <p className="page-subtitle">Manage institutional staff, roles, and departmental assignments.</p>
      </div>

      <div className="px-6 pb-8 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 animate-in stagger-1">
          {[
            { label: 'Total Staff', value: data.total, icon: Users, color: '#C9A020' },
            { label: 'Active Today', value: data.active, icon: UserCheck, color: '#10B981' },
            { label: 'On Leave', value: data.on_leave, icon: UserX, color: '#F59E0B' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="stat-label">{label}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <div className="stat-value">{value}</div>
            </div>
          ))}
        </div>

        {/* Filters + View Toggle */}
        <div className="flex flex-wrap gap-3 items-end justify-between animate-in stagger-2">
          <div className="flex gap-2 flex-wrap">
            <select value={dept} onChange={e => setDept(e.target.value)} className="select w-44">
              <option value="">All Departments</option>
              <option>Mathematics Dept.</option><option>Physics Dept.</option>
              <option>Administration</option><option>Humanities Dept.</option>
            </select>
            <select value={role} onChange={e => setRole(e.target.value)} className="select w-36">
              <option value="">All Roles</option>
              <option>Head of Department</option><option>Senior Lecturer</option>
              <option>Adjunct Professor</option><option>Lab Instructor</option>
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} className="select w-36">
              <option value="">All Status</option>
              <option>Active</option><option>On Leave</option>
            </select>
          </div>
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#F7F6F3', border: '1px solid #E4E1D8' }}>
            <button onClick={() => setViewMode('grid')} className="p-2 rounded-md transition-all"
                    style={{ background: viewMode === 'grid' ? 'white' : 'transparent', boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              <LayoutGrid size={16} style={{ color: viewMode === 'grid' ? '#C9A020' : '#6B6660' }} />
            </button>
            <button onClick={() => setViewMode('list')} className="p-2 rounded-md transition-all"
                    style={{ background: viewMode === 'list' ? 'white' : 'transparent', boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              <List size={16} style={{ color: viewMode === 'list' ? '#C9A020' : '#6B6660' }} />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in stagger-3">
            {data.members.map((member: typeof MOCK_STAFF['members'][0]) => {
              const sc = statusColors[member.status] || { bg: '#F3F4F6', text: '#4B5563' }
              return (
                <div key={member.id} className="card-hover">
                  <div className="flex justify-end mb-3">
                    <span className="badge text-xs px-2.5 py-0.5 rounded-full font-medium"
                          style={{ background: sc.bg, color: sc.text }}>
                      {member.status}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-3"
                         style={{ background: 'linear-gradient(135deg, #C9A020, #8B6E10)' }}>
                      {getInitials(member.name)}
                    </div>
                    <h3 className="font-bold text-base">{member.name}</h3>
                    <p className="text-sm font-medium" style={{ color: '#C9A020' }}>{member.role}</p>
                  </div>
                  <div className="space-y-1.5 mb-4 text-sm">
                    <div className="flex items-center gap-2" style={{ color: '#6B6660' }}>
                      <span>🏛</span> {member.department}
                    </div>
                    <div className="flex items-center gap-2 truncate" style={{ color: '#6B6660' }}>
                      <span>✉</span> {member.email}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 btn-outline text-xs py-1.5 flex items-center justify-center gap-1">
                      <Eye size={13} /> View
                    </button>
                    <button className="btn-outline px-3 py-1.5 text-xs">
                      <Pencil size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card p-0 overflow-hidden animate-in stagger-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.members.map((m: typeof MOCK_STAFF['members'][0]) => {
                  const sc = statusColors[m.status] || { bg: '#F3F4F6', text: '#4B5563' }
                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                               style={{ background: 'linear-gradient(135deg, #C9A020, #8B6E10)' }}>
                            {getInitials(m.name)}
                          </div>
                          <span className="font-semibold">{m.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#6B6660' }}>{m.role}</td>
                      <td style={{ color: '#6B6660' }}>{m.department}</td>
                      <td style={{ color: '#6B6660' }}>{m.email}</td>
                      <td><span className="badge text-xs px-2.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{m.status}</span></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn-outline text-xs px-2.5 py-1.5 flex items-center gap-1"><Eye size={12} /> View</button>
                          <button className="btn-outline text-xs px-2.5 py-1.5"><Pencil size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
