'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { settingsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Plus, Pencil, Megaphone } from 'lucide-react'

const MOCK_CLASSES = [
  { id: '1', level: 'Nursery', sections: 'A, B', capacity_used: 40, capacity_total: 50, lead_faculty: 'Sarah Jenkins' },
  { id: '2', level: 'Grade 1', sections: 'A, B, C', capacity_used: 85, capacity_total: 90, lead_faculty: 'Michael Chen' },
  { id: '3', level: 'Grade 10', sections: 'Science, Arts', capacity_used: 110, capacity_total: 120, lead_faculty: 'Dr. Robert Vance' },
]
const MOCK_TERMS = [
  { id: '1', name: 'Fall Term 2023', start: 'Sept 1', end: 'Dec 15', weeks: 14, status: 'Active' },
  { id: '2', name: 'Spring Term 2024', start: 'Jan 10', end: 'May 20', weeks: 18, status: 'Upcoming' },
]
const MOCK_NOTICES = [
  { id: '1', title: 'Emergency Weather Protocol', audience: 'ALL STAFF & STUDENTS', body: 'Please review the updated winter weather protocols. In case of heavy snow, school…', date: 'Today', highlight: true },
  { id: '2', title: 'Faculty Meeting Rescheduled', audience: 'FACULTY ONLY', body: 'The monthly departmental review has been moved from Tuesday to Thursday afterno…', date: 'Yesterday', highlight: false },
  { id: '3', title: 'End of Term Examinations Schedule', audience: 'GRADE 9-12', body: 'The preliminary schedule for the Fall term finals has been posted. Please ensure all…', date: 'Oct 12', highlight: false },
]

export default function SettingsPage() {
  const [year, setYear] = useState('2023 - 2024')
  const qc = useQueryClient()

  const { data: classes = MOCK_CLASSES } = useQuery({
    queryKey: ['settings-classes'],
    queryFn: () => settingsApi.getClasses().then(r => r.data),
    placeholderData: MOCK_CLASSES,
  })
  const { data: notices = MOCK_NOTICES } = useQuery({
    queryKey: ['settings-notices'],
    queryFn: () => settingsApi.getNotices().then(r => r.data),
    placeholderData: MOCK_NOTICES,
  })

  return (
    <AppLayout>
      <Topbar />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Class & Term Settings</h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="page-subtitle">Manage academic structures and broadcast institutional notices.</p>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B6660' }}>Academic Year</span>
            <select value={year} onChange={e => setYear(e.target.value)} className="select text-sm py-1.5 w-32">
              <option>2023 - 2024</option><option>2024 - 2025</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Class Directory */}
            <div className="card animate-in stagger-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Class Directory</h2>
                <button className="btn-gold text-sm px-3 py-1.5 flex items-center gap-1.5">
                  <Plus size={14} /> Add Class
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Sections</th>
                    <th>Capacity</th>
                    <th>Lead Faculty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls: typeof MOCK_CLASSES[0]) => (
                    <tr key={cls.id}>
                      <td className="font-semibold">{cls.level}</td>
                      <td style={{ color: '#6B6660' }}>{cls.sections}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cls.capacity_used} / {cls.capacity_total}</span>
                        </div>
                      </td>
                      <td style={{ color: '#6B6660' }}>{cls.lead_faculty}</td>
                      <td>
                        <button className="p-1.5 rounded hover:bg-gray-100">
                          <Pencil size={14} style={{ color: '#6B6660' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a href="#" className="block mt-3 text-sm font-medium" style={{ color: '#C9A020' }}>
                View All Classes →
              </a>
            </div>

            {/* Academic Terms */}
            <div className="card animate-in stagger-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Academic Terms</h2>
                <button className="btn-outline text-sm px-3 py-1.5 flex items-center gap-1.5">
                  <Plus size={14} /> Add Term
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {MOCK_TERMS.map(term => (
                  <div key={term.id} className="rounded-xl p-4 transition-all"
                       style={{
                         border: `2px solid ${term.status === 'Active' ? '#C9A020' : '#E4E1D8'}`,
                         background: term.status === 'Active' ? 'rgba(201,160,32,0.04)' : '#F7F6F3',
                       }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm">{term.name}</h3>
                      <span className="badge text-xs"
                            style={{ background: term.status === 'Active' ? '#ECFDF5' : '#F3F4F6',
                                     color: term.status === 'Active' ? '#059669' : '#4B5563' }}>
                        {term.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs" style={{ color: '#6B6660' }}>
                      <p>📅 {term.start} – {term.end}</p>
                      <p>🎓 {term.weeks} Weeks</p>
                    </div>
                    <button className="mt-3 w-full text-xs py-1.5 rounded-lg border transition-all hover:border-gold"
                            style={{ borderColor: '#E4E1D8', color: '#0D0D0D' }}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notice Board */}
          <div className="card animate-in stagger-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone size={18} style={{ color: '#C9A020' }} />
                <h2 className="font-bold">Notice Board</h2>
              </div>
              <button className="btn-dark text-sm px-3 py-1.5 flex items-center gap-1.5">
                Post Notice
              </button>
            </div>
            <div className="space-y-3">
              {notices.map((n: typeof MOCK_NOTICES[0]) => (
                <div key={n.id} className="rounded-xl p-4"
                     style={{
                       background: n.highlight ? 'rgba(201,160,32,0.06)' : '#F7F6F3',
                       border: `1px solid ${n.highlight ? 'rgba(201,160,32,0.25)' : '#E4E1D8'}`,
                       borderLeft: n.highlight ? '4px solid #C9A020' : '1px solid #E4E1D8',
                     }}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm">{n.title}</h3>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: '#A09080' }}>{n.date}</span>
                  </div>
                  <p className="text-xs font-semibold tracking-wider mb-1.5"
                     style={{ color: '#C9A020' }}>{n.audience}</p>
                  <p className="text-sm" style={{ color: '#6B6660' }}>{n.body}</p>
                </div>
              ))}
            </div>
            <a href="#" className="block mt-4 text-sm text-center font-medium" style={{ color: '#6B6660' }}>
              View Notice Archive
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
