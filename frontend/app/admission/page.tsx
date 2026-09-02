'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { admissionApi } from '@/lib/api'
import { getStatusColor } from '@/lib/utils'
import { MoreVertical, ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react'

const TABS = ['New Applications', 'Shortlisted', 'Enrolled']

const MOCK_ADMISSIONS = {
  data: [
    { id: 'APP-25-001', student_name: 'Eleanor Vance', program: 'Computer Science', date_applied: 'Oct 12, 2024', status: 'Approved' },
    { id: 'APP-25-002', student_name: 'Theodore Crain', program: 'Business Admin', date_applied: 'Oct 14, 2024', status: 'Pending Review' },
    { id: 'APP-25-003', student_name: 'Shirley Jackson', program: 'Literature', date_applied: 'Oct 15, 2024', status: 'Under Evaluation' },
    { id: 'APP-25-004', student_name: 'Luke Crain', program: 'Engineering', date_applied: 'Oct 18, 2024', status: 'Approved' },
    { id: 'APP-25-005', student_name: 'Steven Crain', program: 'Architecture', date_applied: 'Oct 20, 2024', status: 'Waitlisted' },
  ],
  total: 124, current_page: 1, last_page: 25
}

export default function AdmissionPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(1)
  const [dateFrom, setDateFrom] = useState('2025-01-01')
  const [dateTo, setDateTo] = useState('2025-03-31')
  const [program, setProgram] = useState('')

  const statusMap = ['', 'shortlisted', 'enrolled']

  const { data = MOCK_ADMISSIONS } = useQuery({
    queryKey: ['admissions', page, activeTab, dateFrom, dateTo, program],
    queryFn: () => admissionApi.list({
      status: statusMap[activeTab],
      date_from: dateFrom, date_to: dateTo,
      program: program || undefined, page, per_page: 10
    }).then(r => r.data),
    placeholderData: MOCK_ADMISSIONS,
  })

  return (
    <AppLayout>
      <Topbar action={{ label: 'New Admission', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Admission Portal</h1>
        <p className="page-subtitle">Manage incoming applications and enrollments.</p>
      </div>

      <div className="px-6 pb-8">
        {/* Tabs */}
        <div className="flex gap-0 mb-5 border-b" style={{ borderColor: '#E4E1D8' }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => { setActiveTab(i); setPage(1) }}
                    className="px-5 py-2.5 text-sm font-medium transition-all relative"
                    style={{ color: activeTab === i ? '#C9A020' : '#6B6660', background: 'none', border: 'none', cursor: 'pointer' }}>
              {tab}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                      style={{ background: '#C9A020' }} />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="card mb-5 animate-in stagger-1">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-40">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Date Range</label>
              <div className="flex gap-2">
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input flex-1" />
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input flex-1" />
              </div>
            </div>
            <div className="min-w-44">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Program</label>
              <select value={program} onChange={e => setProgram(e.target.value)} className="select">
                <option value="">All Programs</option>
                <option>Computer Science</option>
                <option>Business Admin</option>
                <option>Engineering</option>
                <option>Literature</option>
                <option>Architecture</option>
              </select>
            </div>
            <button className="btn-outline flex items-center gap-1.5">
              <Filter size={14} /> More Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card animate-in stagger-2 p-0 overflow-hidden">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Student Name</th>
                  <th>Program</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((row: typeof MOCK_ADMISSIONS['data'][0]) => (
                  <tr key={row.id}>
                    <td className="font-mono text-sm" style={{ color: '#6B6660' }}>{row.id}</td>
                    <td className="font-semibold">{row.student_name}</td>
                    <td style={{ color: '#6B6660' }}>{row.program}</td>
                    <td style={{ color: '#6B6660' }}>{row.date_applied}</td>
                    <td>
                      <span className={`badge ${getStatusColor(row.status)}`}>{row.status}</span>
                    </td>
                    <td>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical size={15} style={{ color: '#6B6660' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: '#E4E1D8' }}>
            <span className="text-sm" style={{ color: '#6B6660' }}>
              Showing 1 to {data.data.length} of {data.total} entries
            </span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm border transition-colors hover:border-gold-500"
                      style={{ borderColor: '#E4E1D8' }}>
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map(n => (
                <button key={n} onClick={() => setPage(n)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                        style={{
                          background: page === n ? '#C9A020' : 'transparent',
                          color: page === n ? 'white' : '#0D0D0D',
                          border: page === n ? 'none' : '1px solid #E4E1D8'
                        }}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm border transition-colors"
                      style={{ borderColor: '#E4E1D8' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
