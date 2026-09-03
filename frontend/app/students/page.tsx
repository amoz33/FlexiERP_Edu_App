'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { studentApi } from '@/lib/api'
import { getInitials } from '@/lib/utils'
import { Eye, Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

const MOCK_STUDENTS = {
  data: [
    { id: '10001', name: 'Eleanor Vance', grade: 'Grade 12', section: 'Section A', admission_no: 'ADM-2023-001', parent: 'Mr. & Mrs. Vance', status: 'Active' },
    { id: '10002', name: 'Luke Crain', grade: 'Grade 11', section: 'Section B', admission_no: 'ADM-2023-002', parent: 'Mr. Stephen Crain', status: 'Active' },
    { id: '10003', name: 'Shirley Crain', grade: 'Grade 12', section: 'Section A', admission_no: 'ADM-2022-045', parent: 'Mr. Stephen Crain', status: 'Active' },
    { id: '10004', name: 'Theodora Crain', grade: 'Grade 10', section: 'Section A', admission_no: 'ADM-2024-012', parent: 'Mr. Stephen Crain', status: 'Active' },
    { id: '10005', name: 'Steven Crain', grade: 'Grade 9', section: 'Section B', admission_no: 'ADM-2024-089', parent: 'Mr. Stephen Crain', status: 'Inactive' },
  ],
  total: 2451, current_page: 1, last_page: 490
}

export default function StudentsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [grade, setGrade] = useState('')

  const { data = MOCK_STUDENTS } = useQuery({
    queryKey: ['students', page, search, grade],
    queryFn: () => studentApi.list({ page, search, grade, per_page: 20 }).then(r => r.data),
    placeholderData: MOCK_STUDENTS,
  })

  return (
    <AppLayout>
      <Topbar action={{ label: 'Add Student', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Student Information System</h1>
        <p className="page-subtitle">Manage student records, personal details, and academic history.</p>
      </div>

      <div className="px-6 pb-8 space-y-4">
        {/* Filters */}
        <div className="card animate-in stagger-1">
          <div className="flex flex-wrap gap-3">
            <input placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)}
                   className="input w-56" />
            <select value={grade} onChange={e => setGrade(e.target.value)} className="select w-36">
              <option value="">All Grades</option>
              {['Grade 9','Grade 10','Grade 11','Grade 12'].map(g => <option key={g}>{g}</option>)}
            </select>
            <select className="select w-36">
              <option value="">All Status</option>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden animate-in stagger-2">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission No.</th>
                <th>Grade / Section</th>
                <th>Parent/Guardian</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((st: typeof MOCK_STUDENTS['data'][0]) => (
                <tr key={st.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                           style={{ background: 'linear-gradient(135deg, #C9A020, #8B6E10)' }}>
                        {getInitials(st.name)}
                      </div>
                      <div>
                        <p className="font-semibold">{st.name}</p>
                        <p className="text-xs" style={{ color: '#A09080' }}>ID: {st.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm" style={{ color: '#6B6660' }}>{st.admission_no}</td>
                  <td style={{ color: '#6B6660' }}>{st.grade} / {st.section}</td>
                  <td style={{ color: '#6B6660' }}>{st.parent}</td>
                  <td>
                    <span className={`badge ${st.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>
                      {st.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-gray-100"><Eye size={14} style={{ color: '#C9A020' }} /></button>
                      <button className="p-1.5 rounded hover:bg-gray-100"><Pencil size={14} style={{ color: '#6B6660' }} /></button>
                      <button className="p-1.5 rounded hover:bg-red-50"><Trash2 size={14} style={{ color: '#EF4444' }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: '#E4E1D8' }}>
            <span className="text-sm" style={{ color: '#6B6660' }}>
              Showing {data.data.length} of {data.total?.toLocaleString()} students
            </span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border" style={{ borderColor: '#E4E1D8' }}>
                <ChevronLeft size={14} />
              </button>
              {[page - 1, page, page + 1].filter(n => n > 0).slice(0, 3).map(n => (
                <button key={n} onClick={() => setPage(n)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                        style={{ background: page === n ? '#C9A020' : 'transparent', color: page === n ? 'white' : '#0D0D0D', border: page === n ? 'none' : '1px solid #E4E1D8' }}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(data.last_page, p + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border" style={{ borderColor: '#E4E1D8' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
