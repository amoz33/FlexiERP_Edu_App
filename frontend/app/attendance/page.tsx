'use client'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { attendanceApi } from '@/lib/api'
import toast from 'react-hot-toast'

type AttendanceStatus = 'P' | 'A' | 'L' | 'H'

const MOCK_STUDENTS = [
  { id: '101', name: 'Alexander Hamilton', avatar: 'AH', status: 'P' as AttendanceStatus },
  { id: '102', name: 'Eleanor Roosevelt', avatar: 'ER', status: 'P' as AttendanceStatus },
  { id: '103', name: 'Frank Lloyd Wright', avatar: 'FL', status: 'A' as AttendanceStatus },
  { id: '104', name: 'Marie Curie', avatar: 'MC', status: 'L' as AttendanceStatus },
  { id: '105', name: 'Ada Lovelace', avatar: 'AL', status: 'P' as AttendanceStatus },
]

const statusColors: Record<AttendanceStatus, { bg: string; text: string; active: string }> = {
  P: { bg: '#ECFDF5', text: '#065F46', active: '#10B981' },
  A: { bg: '#FEF2F2', text: '#991B1B', active: '#EF4444' },
  L: { bg: '#FFF7ED', text: '#9A3412', active: '#F59E0B' },
  H: { bg: '#F3F4F6', text: '#4B5563', active: '#9CA3AF' },
}

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('Grade 10')
  const [selectedSection, setSelectedSection] = useState('Section A - Science')
  const [selectedSubject, setSelectedSubject] = useState('Advanced Physics')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [view, setView] = useState<'Daily' | 'Monthly'>('Daily')
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(MOCK_STUDENTS.map(s => [s.id, s.status]))
  )

  const { data: students = MOCK_STUDENTS } = useQuery({
    queryKey: ['attendance-students', selectedClass, selectedSection, selectedSubject, date],
    queryFn: () => attendanceApi.getStudents({
      class_id: selectedClass, section_id: selectedSection,
      subject_id: selectedSubject, date
    }).then(r => r.data),
    placeholderData: MOCK_STUDENTS,
  })

  const saveMutation = useMutation({
    mutationFn: () => attendanceApi.saveAttendance({
      class_id: selectedClass, section_id: selectedSection,
      subject_id: selectedSubject, date,
      attendance: Object.entries(attendance).map(([student_id, status]) => ({ student_id, status }))
    }),
    onSuccess: () => toast.success('Attendance saved successfully!'),
    onError: () => toast.error('Failed to save attendance.'),
  })

  const setStatus = (id: string, s: AttendanceStatus) =>
    setAttendance(prev => ({ ...prev, [id]: s }))

  const markAll = (s: AttendanceStatus) =>
    setAttendance(Object.fromEntries(students.map((st: typeof MOCK_STUDENTS[0]) => [st.id, s])))

  const counts = { P: 0, A: 0, L: 0, H: 0 }
  Object.values(attendance).forEach(s => { if (s in counts) counts[s]++ })
  const presentPct = students.length ? Math.round((counts.P / students.length) * 100) : 0

  return (
    <AppLayout>
      <Topbar />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Record Attendance</h1>
        <p className="page-subtitle">Manage daily student attendance records with academic precision.</p>
      </div>

      <div className="px-6 pb-8 space-y-4">
        {/* Toggle + Filters */}
        <div className="flex justify-end mb-0">
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#E4E1D8' }}>
            {(['Daily', 'Monthly'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                      className="px-5 py-2 text-sm font-medium transition-all"
                      style={{
                        background: view === v ? '#C9A020' : 'white',
                        color: view === v ? 'white' : '#0D0D0D',
                      }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card animate-in stagger-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Class</label>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="select">
                <option>Grade 10</option><option>Grade 11</option><option>Grade 12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Section</label>
              <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="select">
                <option>Section A - Science</option><option>Section B - Arts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Subject</label>
              <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="select">
                <option>Advanced Physics</option><option>Mathematics</option><option>English Literature</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Student List */}
          <div className="card xl:col-span-2 animate-in stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base">Student List</h2>
              <div className="flex gap-2">
                <button onClick={() => markAll('P')} className="btn-outline text-xs px-3 py-1.5"
                        style={{ borderColor: '#10B981', color: '#10B981' }}>
                  Mark All Present
                </button>
                <button onClick={() => markAll('A')} className="btn-outline text-xs px-3 py-1.5"
                        style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                  Mark All Absent
                </button>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#E4E1D8' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Roll</th>
                    <th>Student</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st: typeof MOCK_STUDENTS[0]) => {
                    const cur = attendance[st.id] || 'P'
                    return (
                      <tr key={st.id}>
                        <td className="font-mono text-sm" style={{ color: '#6B6660' }}>{st.id}</td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                 style={{ background: '#C9A020' }}>
                              {st.avatar || st.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <span className="font-medium">{st.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            {(['P', 'A', 'L', 'H'] as AttendanceStatus[]).map(s => {
                              const c = statusColors[s]
                              const isActive = cur === s
                              return (
                                <button key={s} onClick={() => setStatus(st.id, s)}
                                        className="w-8 h-8 rounded-lg text-sm font-bold transition-all"
                                        style={{
                                          background: isActive ? c.active : c.bg,
                                          color: isActive ? 'white' : c.text,
                                          border: `1px solid ${isActive ? c.active : 'transparent'}`
                                        }}>
                                  {s}
                                </button>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4 animate-in stagger-3">
            <div className="card">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6B6660' }}>
                Daily Attendance Summary
              </h3>
              {/* Donut */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E4E1D8" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#C9A020" strokeWidth="3"
                            strokeDasharray={`${presentPct} ${100 - presentPct}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{presentPct}%</span>
                    <span className="text-xs" style={{ color: '#6B6660' }}>Present</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg p-2" style={{ background: '#F7F6F3' }}>
                  <p className="text-xl font-bold">{students.length}</p>
                  <p className="text-xs" style={{ color: '#6B6660' }}>Total Students</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: '#F7F6F3' }}>
                  <p className="text-xl font-bold" style={{ color: '#C9A020' }}>{counts.P}</p>
                  <p className="text-xs" style={{ color: '#6B6660' }}>Present Today</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6660' }}>Status Breakdown</h3>
              {([
                { label: 'Present', key: 'P', color: '#10B981' },
                { label: 'Absent', key: 'A', color: '#EF4444' },
                { label: 'Late', key: 'L', color: '#F59E0B' },
                { label: 'Holiday', key: 'H', color: '#9CA3AF' },
              ] as { label: string; key: AttendanceStatus; color: string }[]).map(({ label, key, color }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: '#E4E1D8' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="font-semibold text-sm">{counts[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button className="btn-outline">Reset Changes</button>
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-gold">
            {saveMutation.isPending ? 'Saving…' : '💾 Save Attendance'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
