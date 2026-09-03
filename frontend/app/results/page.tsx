'use client'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { examApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Printer, RefreshCw, Pencil } from 'lucide-react'

const GRADING_SCALE = [
  { grade: 'A+', range: '90 – 100', color: '#C9A020' },
  { grade: 'A',  range: '80 – 89', color: '#10B981' },
  { grade: 'B',  range: '70 – 79', color: '#3B82F6' },
  { grade: 'C',  range: '60 – 69', color: '#8B5CF6' },
  { grade: 'D',  range: '50 – 59', color: '#F59E0B' },
  { grade: 'F',  range: '0 – 49', color: '#EF4444' },
]

const MOCK_STUDENTS = [
  { id: '101', name: '[Student Name 1]', math: 85, science: 92, english: 78 },
  { id: '102', name: '[Student Name 2]', math: 45, science: 50, english: 38 },
  { id: '103', name: '[Student Name 3]', math: null, science: null, english: null },
]

function calcGrade(score: number | null): { grade: string; color: string } {
  if (score === null) return { grade: '-', color: '#6B6660' }
  if (score >= 90) return { grade: 'A+', color: '#C9A020' }
  if (score >= 80) return { grade: 'A', color: '#10B981' }
  if (score >= 70) return { grade: 'B', color: '#3B82F6' }
  if (score >= 60) return { grade: 'C', color: '#8B5CF6' }
  if (score >= 50) return { grade: 'D', color: '#F59E0B' }
  return { grade: 'F', color: '#EF4444' }
}

export default function ResultsPage() {
  const [examType, setExamType] = useState('Mid Terms')
  const [cls, setCls] = useState('Grade 10')
  const [section, setSection] = useState('Section A')
  const [term, setTerm] = useState('2025 - Spring Term')
  const [marks, setMarks] = useState<Record<string, Record<string, string>>>({})
  const [quickScore, setQuickScore] = useState('')
  const [published, setPublished] = useState(false)

  const setMark = (sid: string, subj: string, val: string) =>
    setMarks(prev => ({ ...prev, [sid]: { ...(prev[sid] || {}), [subj]: val } }))

  const getMark = (sid: string, subj: string, fallback: number | null): string => {
    const v = marks[sid]?.[subj]
    if (v !== undefined) return v
    return fallback !== null ? String(fallback) : ''
  }

  const saveMutation = useMutation({
    mutationFn: () => examApi.saveMarks({ exam_type: examType, class_id: cls, section_id: section, marks }),
    onSuccess: () => toast.success('All marks saved!'),
    onError: () => toast.error('Failed to save marks.'),
  })

  const quickGrade = quickScore ? calcGrade(Number(quickScore)) : null

  return (
    <AppLayout>
      <Topbar action={{ label: 'New Exam', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Examination & Result Processing</h1>
      </div>

      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main Area */}
          <div className="xl:col-span-3 space-y-4">
            {/* Filter & Select */}
            <div className="card animate-in stagger-1">
              <h2 className="font-bold mb-4">Filter & Select</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Exam Type</label>
                  <select value={examType} onChange={e => setExamType(e.target.value)} className="select">
                    <option>Mid Terms</option><option>Final Exams</option><option>Unit Test</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Class</label>
                  <select value={cls} onChange={e => setCls(e.target.value)} className="select">
                    <option>Grade 10</option><option>Grade 11</option><option>Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Section</label>
                  <select value={section} onChange={e => setSection(e.target.value)} className="select">
                    <option>Section A</option><option>Section B</option>
                  </select>
                </div>
              </div>
              <button className="btn-outline flex items-center gap-2">
                <RefreshCw size={14} /> Load Students
              </button>
            </div>

            {/* Marks Entry */}
            <div className="card animate-in stagger-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Marks Entry</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: '#6B6660' }}>Progress</span>
                  <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: '#E4E1D8' }}>
                    <div className="h-full rounded-full" style={{ width: '45%', background: '#C9A020' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#C9A020' }}>45%</span>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <button className="btn-outline text-xs px-3 py-1.5">Fill Default Marks</button>
                <button className="btn-dark text-xs px-3 py-1.5">Apply Grading</button>
              </div>

              <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#E4E1D8' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Roll</th>
                      <th>Student Name</th>
                      <th>Math</th>
                      <th>Science</th>
                      <th>English</th>
                      <th>Total</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_STUDENTS.map(st => {
                      const m = Number(getMark(st.id, 'math', st.math)) || 0
                      const s = Number(getMark(st.id, 'science', st.science)) || 0
                      const e = Number(getMark(st.id, 'english', st.english)) || 0
                      const isPending = st.math === null
                      const total = isPending ? 0 : m + s + e
                      const avg = isPending ? null : Math.round(total / 3)
                      const { grade, color } = calcGrade(avg)
                      const pass = avg !== null && avg >= 50

                      return (
                        <tr key={st.id}>
                          <td className="font-mono text-sm" style={{ color: '#6B6660' }}>{st.id}</td>
                          <td className="font-medium">{st.name}</td>
                          {(['math', 'science', 'english'] as const).map(subj => {
                            const val = getMark(st.id, subj, st[subj])
                            const numVal = Number(val)
                            const isLow = !isPending && val && numVal < 50
                            return (
                              <td key={subj}>
                                <input
                                  type="number" min="0" max="100"
                                  value={val}
                                  onChange={e => setMark(st.id, subj, e.target.value)}
                                  placeholder="--"
                                  className="w-16 px-2 py-1.5 rounded-lg text-sm text-center border outline-none transition-all"
                                  style={{
                                    borderColor: isLow ? '#EF4444' : '#E4E1D8',
                                    background: isLow ? '#FEF2F2' : 'white',
                                    fontFamily: 'inherit',
                                  }}
                                />
                              </td>
                            )
                          })}
                          <td className="font-bold">{isPending ? 0 : total}</td>
                          <td className="font-bold" style={{ color }}>{grade}</td>
                          <td>
                            {isPending ? (
                              <span className="badge badge-gray">Pending</span>
                            ) : pass ? (
                              <span className="badge badge-green">Pass</span>
                            ) : (
                              <span className="badge badge-red">Fail</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
                        className="btn-gold flex items-center gap-2">
                  💾 {saveMutation.isPending ? 'Saving…' : 'Save All Marks'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Final Actions */}
            <div className="card animate-in stagger-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6660' }}>Final Actions</h3>
              <div className="flex items-center justify-between p-3 rounded-xl mb-3"
                   style={{ background: '#F7F6F3', border: '1px solid #E4E1D8' }}>
                <div>
                  <p className="font-semibold text-sm">Publish Results</p>
                  <p className="text-xs" style={{ color: '#6B6660' }}>Visible to students</p>
                </div>
                <button onClick={() => setPublished(!published)}
                        className="relative w-12 h-6 rounded-full transition-all"
                        style={{ background: published ? '#C9A020' : '#E4E1D8' }}>
                  <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                        style={{ left: published ? '28px' : '4px' }} />
                </button>
              </div>
              <button className="w-full btn-outline flex items-center justify-center gap-2 text-sm"
                      style={{ color: '#C9A020', borderColor: '#C9A020' }}>
                <Printer size={14} /> Generate Report Card
              </button>
            </div>

            {/* Grading Scale */}
            <div className="card animate-in stagger-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B6660' }}>Grading Scale</h3>
                <button className="p-1 rounded hover:bg-gray-100"><Pencil size={12} style={{ color: '#6B6660' }} /></button>
              </div>
              <div className="space-y-2">
                {GRADING_SCALE.map(({ grade, range, color }) => (
                  <div key={grade} className="flex justify-between items-center py-1.5 border-b last:border-0 text-sm"
                       style={{ borderColor: '#E4E1D8' }}>
                    <span className="font-bold w-8" style={{ color }}>{grade}</span>
                    <span style={{ color: '#6B6660' }}>{range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Grade Calc */}
            <div className="rounded-xl p-4 animate-in stagger-3" style={{ background: '#0D0D0D' }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 text-white/60">Quick Grade Calc</h3>
              <div className="flex gap-2 items-center mb-3">
                <input type="number" placeholder="Score" value={quickScore}
                       onChange={e => setQuickScore(e.target.value)}
                       className="flex-1 px-3 py-2 rounded-lg text-sm text-center text-white outline-none"
                       style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'inherit' }} />
                <span className="text-white/40 text-sm">/</span>
                <div className="w-14 px-3 py-2 rounded-lg text-sm text-center text-white"
                     style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>100</div>
              </div>
              {quickGrade && (
                <div className="text-sm text-white/60">
                  Calculated: <span className="text-xl font-bold ml-2" style={{ color: quickGrade.color }}>
                    {quickGrade.grade}
                  </span>
                  <span className="ml-1 text-white/40">({quickScore}%)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
