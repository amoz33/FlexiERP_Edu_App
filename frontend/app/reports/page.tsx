'use client'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { reportApi } from '@/lib/api'
import { useState } from 'react'
import { BarChart2, Download } from 'lucide-react'

const MOCK_ANALYTICS = {
  enrollment: [
    { q: 'Q1', current: 1200, prev: 900 },
    { q: 'Q2', current: 1800, prev: 1400 },
    { q: 'Q3', current: 3200, prev: 2000 },
    { q: 'Q4', current: 3600, prev: 2400 },
  ],
  fee_collected_pct: 82,
  top_performers: [
    { name: 'Eleanor Vance', grade: '12th Grade', score: 98.5 },
    { name: 'Luke Crain', grade: '11th Grade', score: 97.2 },
    { name: 'Theodora Crain', grade: '10th Grade', score: 96.8 },
    { name: 'Shirley Crain', grade: '12th Grade', score: 95.0 },
  ],
  student_staff_ratio: '1:24',
  attendance: { students: 94, faculty: 98, support: 92 },
}

export default function ReportsPage() {
  const { data = MOCK_ANALYTICS } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => reportApi.getAnalytics().then(r => r.data),
    placeholderData: MOCK_ANALYTICS,
  })

  const [format, setFormat] = useState('Comprehensive PDF')
  const [dateFrom, setDateFrom] = useState('2023-10-01')
  const [dateTo, setDateTo] = useState('2023-10-31')
  const [modules, setModules] = useState({ enrollment: true, financial: true, academic: true })

  const maxVal = Math.max(...data.enrollment.map((d: typeof MOCK_ANALYTICS['enrollment'][0]) => Math.max(d.current, d.prev)))

  return (
    <AppLayout>
      <Topbar />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Reporting & Analytics</h1>
        <p className="page-subtitle">Institutional performance at a glance.</p>
      </div>

      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Charts Area (3 cols) */}
          <div className="xl:col-span-3 space-y-4">
            {/* Row 1: Enrollment + Fee */}
            <div className="grid grid-cols-2 gap-4 animate-in stagger-1">
              {/* Enrollment Trends */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Enrollment Trends</h3>
                  <button className="p-1.5 rounded hover:bg-gray-100"><BarChart2 size={15} style={{ color: '#6B6660' }} /></button>
                </div>
                {/* Bar Chart */}
                <div className="relative h-40">
                  <div className="flex items-end justify-around h-full gap-4 pb-6">
                    {data.enrollment.map((d: typeof MOCK_ANALYTICS['enrollment'][0]) => (
                      <div key={d.q} className="flex flex-col items-center gap-1 flex-1">
                        <div className="flex gap-1 items-end w-full justify-center">
                          <div className="w-4 rounded-t-md transition-all"
                               style={{ height: `${(d.prev / maxVal) * 100}px`, background: '#E4E1D8' }} />
                          <div className="w-4 rounded-t-md transition-all"
                               style={{ height: `${(d.current / maxVal) * 100}px`, background: '#C9A020' }} />
                        </div>
                        <span className="text-xs" style={{ color: '#6B6660' }}>{d.q}</span>
                      </div>
                    ))}
                  </div>
                  {/* Y axis labels */}
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between">
                    {['4k','3k','2k','1k','0'].map(v => (
                      <span key={v} className="text-xs" style={{ color: '#A09080' }}>{v}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fee Collection */}
              <div className="card flex flex-col items-center justify-center">
                <h3 className="font-bold mb-4 self-start">Fee Collection</h3>
                <div className="relative w-32 h-32 mb-4">
                  <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0D0D0D" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#C9A020" strokeWidth="4"
                            strokeDasharray={`${data.fee_collected_pct} ${100 - data.fee_collected_pct}`}
                            strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{data.fee_collected_pct}%</span>
                    <span className="text-xs" style={{ color: '#6B6660' }}>Collected</span>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#0D0D0D' }} /> Paid
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#C9A020' }} /> Pending
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Top Performers + Ratio + Attendance */}
            <div className="grid grid-cols-3 gap-4 animate-in stagger-2">
              {/* Top Performers */}
              <div className="card col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Top Performers</h3>
                  <a href="#" className="text-xs" style={{ color: '#C9A020' }}>View All</a>
                </div>
                <div className="space-y-0">
                  <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wider pb-2 border-b mb-2" style={{ color: '#6B6660', borderColor: '#E4E1D8' }}>
                    <span>Student</span><span>Grade</span><span>Score</span>
                  </div>
                  {data.top_performers.map((p: typeof MOCK_ANALYTICS['top_performers'][0], i: number) => (
                    <div key={p.name} className={`grid grid-cols-3 text-sm py-2.5 ${i < data.top_performers.length - 1 ? 'border-b' : ''}`}
                         style={{ borderColor: '#E4E1D8' }}>
                      <span className="font-medium truncate">{p.name}</span>
                      <span style={{ color: '#6B6660' }}>{p.grade}</span>
                      <span className="font-bold" style={{ color: i === 0 ? '#C9A020' : '#0D0D0D' }}>{p.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student/Staff Ratio */}
              <div className="card flex flex-col items-center justify-center text-center">
                <h3 className="font-bold mb-4 self-start">Student/Staff Ratio</h3>
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                     style={{ background: 'linear-gradient(135deg, #0D0D0D 60%, #C9A020)', position: 'relative' }}>
                  <div className="w-16 h-16 rounded-full bg-white" />
                </div>
                <p className="text-3xl font-bold">{data.student_staff_ratio}</p>
                <p className="text-xs mt-1" style={{ color: '#6B6660' }}>Optimal is 1:20</p>
              </div>

              {/* Attendance */}
              <div className="card">
                <h3 className="font-bold mb-4">Attendance</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Students', pct: data.attendance.students },
                    { label: 'Faculty', pct: data.attendance.faculty },
                    { label: 'Support Staff', pct: data.attendance.support },
                  ].map(({ label, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span>{label}</span>
                        <span className="font-bold" style={{ color: '#C9A020' }}>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E4E1D8' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#C9A020' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Report Builder */}
          <div className="card animate-in stagger-3 h-fit">
            <h3 className="font-bold mb-1">Report Builder</h3>
            <p className="text-xs mb-4" style={{ color: '#6B6660' }}>Configure export parameters.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Report Format</label>
                <select value={format} onChange={e => setFormat(e.target.value)} className="select">
                  <option>Comprehensive PDF</option>
                  <option>Excel Spreadsheet</option>
                  <option>CSV Export</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Date Range</label>
                <div className="flex gap-1.5">
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input text-xs" />
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6B6660' }}>Include Modules</label>
                <div className="space-y-2">
                  {[
                    { key: 'enrollment', label: 'Enrollment Metrics' },
                    { key: 'financial', label: 'Financial Summaries' },
                    { key: 'academic', label: 'Academic Performance' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox"
                             checked={modules[key as keyof typeof modules]}
                             onChange={e => setModules(prev => ({ ...prev, [key]: e.target.checked }))}
                             className="w-4 h-4 rounded" style={{ accentColor: '#C9A020' }} />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn-gold w-full flex items-center justify-center gap-2">
                <BarChart2 size={14} /> Generate Report
              </button>
              <button className="btn-outline w-full flex items-center justify-center gap-2">
                <Download size={14} /> Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
