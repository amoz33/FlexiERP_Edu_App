'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { Printer, BookOpen, Download } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { ReportCard as PortalReportCard } from '@/components/portal/PortalViews'

const GRADING_SCALE = [
  { grade: 'A+', range: '90 – 100' },
  { grade: 'A',  range: '80 – 89' },
  { grade: 'B+', range: '70 – 79' },
  { grade: 'B',  range: '60 – 69' },
  { grade: 'C',  range: '50 – 59' },
  { grade: 'D',  range: '40 – 49' },
  { grade: 'F',  range: '< 40', red: true },
]

const SUBJECTS = [
  { name: 'Mathematics',    maxMarks: 100, obtained: 95,  grade: 'A+', remarks: 'Excellent problem solving' },
  { name: 'Science',        maxMarks: 100, obtained: 88,  grade: 'A',  remarks: 'Good understanding of concepts' },
  { name: 'English',        maxMarks: 100, obtained: 92,  grade: 'A+', remarks: 'Strong communication skills' },
  { name: 'Social Studies', maxMarks: 100, obtained: 85,  grade: 'B+', remarks: 'Active participant in discussions' },
  { name: 'Computer',       maxMarks: 100, obtained: 98,  grade: 'A+', remarks: 'Outstanding practical skills' },
  { name: '[Elective]',     maxMarks: 100, obtained: 90,  grade: 'A+', remarks: 'Consistent performance' },
]

const TOTAL_MAX    = SUBJECTS.reduce((a, s) => a + s.maxMarks, 0)
const TOTAL_OBT    = SUBJECTS.reduce((a, s) => a + s.obtained, 0)
const PERCENTAGE   = ((TOTAL_OBT / TOTAL_MAX) * 100).toFixed(1)
const GRAND_GRADE  = 'A+'

export default function ReportCardPage() {
  const [filter, setFilter] = useState({ examType: 'Mid Terms', class: 'Grade 10', section: 'Section A', student: 'Student Name 1' })
  const { role } = useAuthStore()

  const handlePrint = () => window.print()

  if (role === 'student' || role === 'parent') {
    return (
      <AppLayout>
        <div className="px-6 py-6">
          <PortalReportCard />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Topbar title="Report Card" />
      <div className="px-6 py-6">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="page-title">Student Report Card</h1>
            <p className="page-subtitle">Generate and print individual student report cards.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={handlePrint}>
              <Download size={14} /> Export PDF
            </button>
            <button className="btn-dark" onClick={handlePrint}>
              <Printer size={14} /> Print Report Card
            </button>
          </div>
        </div>

        {/* Filter row */}
        <div className="card mb-6 animate-in">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Exam Type</label>
              <select className="select" value={filter.examType} onChange={e => setFilter(f => ({...f, examType: e.target.value}))}>
                <option>Mid Terms</option><option>Final Exams</option><option>Unit Test</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[130px]">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Class</label>
              <select className="select" value={filter.class} onChange={e => setFilter(f => ({...f, class: e.target.value}))}>
                <option>Grade 10</option><option>Grade 11</option><option>Grade 12</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Section</label>
              <select className="select" value={filter.section} onChange={e => setFilter(f => ({...f, section: e.target.value}))}>
                <option>Section A</option><option>Section B</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Student</label>
              <select className="select" value={filter.student} onChange={e => setFilter(f => ({...f, student: e.target.value}))}>
                <option>Student Name 1</option><option>Student Name 2</option><option>Student Name 3</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-gold mt-auto">Load Report Card</button>
            </div>
          </div>
        </div>

        {/* Report Card Document */}
        <div id="report-card" className="bg-white rounded-xl border animate-in stagger-1" style={{ borderColor: 'var(--border)', maxWidth: 860, margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between pb-5 mb-6" style={{ borderBottom: '2px solid var(--border)' }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,160,32,0.15)', border: '2px solid rgba(201,160,32,0.3)' }}>
                  <BookOpen size={28} style={{ color: '#C9A020' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--dark)' }}>EduManage Academy</h2>
                  <div className="text-xs font-semibold tracking-[0.2em] uppercase mt-0.5" style={{ color: 'var(--gold)' }}>REPORT CARD</div>
                  <div className="w-10 h-0.5 mt-1 rounded" style={{ background: 'var(--gold)' }} />
                </div>
              </div>
              <div className="text-right text-sm" style={{ color: 'var(--text-muted)' }}>
                <div>Term: <span className="font-semibold" style={{ color: 'var(--dark)' }}>[2025 – Spring Term]</span></div>
                <div className="mt-1">Class: <span className="font-semibold" style={{ color: 'var(--dark)' }}>[Grade 10 – Section A]</span></div>
              </div>
            </div>

            {/* Student Info */}
            <div className="rounded-xl p-5 mb-6" style={{ border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)' }}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="font-semibold uppercase tracking-wider text-xs w-32 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Student Name:</span>
                  <span className="font-bold" style={{ color: 'var(--dark)' }}>[Student Name]</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold uppercase tracking-wider text-xs w-28 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Parent Name:</span>
                  <span>[Parent Name]</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold uppercase tracking-wider text-xs w-32 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Roll Number:</span>
                  <span>[Roll Number]</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold uppercase tracking-wider text-xs w-28 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Contact:</span>
                  <span>[Contact]</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold uppercase tracking-wider text-xs w-32 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Admission No:</span>
                  <span>[Admission No]</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold uppercase tracking-wider text-xs w-28 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Attendance:</span>
                  <span className="font-bold" style={{ color: 'var(--gold)' }}>[95%]</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold uppercase tracking-wider text-xs w-32 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Date of Birth:</span>
                  <span>[Date of Birth]</span>
                </div>
              </div>
            </div>

            {/* Marks Table */}
            <div className="mb-6 overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--surface)' }}>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Subject</th>
                    <th className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Max Marks</th>
                    <th className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Obtained Marks</th>
                    <th className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Grade</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--dark)' }}>{s.name}</td>
                      <td className="px-4 py-3 text-center" style={{ color: 'var(--text-muted)' }}>{s.maxMarks}</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--gold)' }}>[{s.obtained}]</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--dark)' }}>[{s.grade}]</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>[{s.remarks}]</td>
                    </tr>
                  ))}
                  {/* Grand Total Row */}
                  <tr style={{ background: 'var(--gold)', color: 'white' }}>
                    <td className="px-4 py-3 font-bold text-sm">GRAND TOTAL</td>
                    <td className="px-4 py-3 text-center font-bold text-sm">{TOTAL_MAX}</td>
                    <td className="px-4 py-3 text-center font-bold text-sm">[{TOTAL_OBT}]</td>
                    <td className="px-4 py-3 text-center font-bold text-sm">[{GRAND_GRADE}]</td>
                    <td className="px-4 py-3 font-bold text-sm">PERCENTAGE: [{PERCENTAGE}%]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Grading Scale */}
            <div className="rounded-xl p-4 mb-6" style={{ border: '1px solid var(--border)', background: 'rgba(201,160,32,0.04)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>Grading Scale</div>
              <div className="flex flex-wrap gap-4 text-sm">
                {GRADING_SCALE.map(g => (
                  <div key={g.grade} className="flex items-center gap-1.5">
                    <span className="font-bold" style={{ color: g.red ? '#DC2626' : 'var(--dark)' }}>{g.grade}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{g.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Remarks + Signatures */}
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>Teacher&apos;s Remarks:</div>
              <div className="italic text-sm mb-6" style={{ color: 'var(--dark)' }}>[An excellent student. Keep up the good work!]</div>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <div className="border-t-2 pt-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-widest text-center" style={{ color: 'var(--text-muted)' }}>Class Teacher</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center text-xs text-center border-2 border-dashed mb-2" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                    OFFICIAL<br/>SEAL
                  </div>
                </div>
                <div>
                  <div className="border-t-2 pt-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-widest text-center" style={{ color: 'var(--text-muted)' }}>Principal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                DATE OF ISSUE: <span className="font-semibold" style={{ color: 'var(--gold)' }}>[15 May 2025]</span>
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Generated by EduManage</div>
            </div>
          </div>

          {/* Print Button */}
          <div className="px-8 py-5" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm mx-auto"
              style={{ background: 'var(--dark)', color: 'white' }}>
              <Printer size={15} /> Print Report Card
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .sidebar, .topbar, .page-header, button { display: none !important; }
          .main-content { margin-left: 0 !important; }
          #report-card { box-shadow: none !important; border: none !important; }
          body { background: white; }
        }
      `}</style>
    </AppLayout>
  )
}
