'use client'
import { useState } from 'react'
import { Plus, Edit2, Save, X, Users, Calendar, Award, Percent } from 'lucide-react'
import { PageHeader, StudentAvatar } from '../_components'
import { MOCK_ASSESSMENTS, MOCK_GRADING_STUDENTS, MOCK_GROUPS } from '../_mock-data'
import type { Assessment, AssessmentCategory, StudentGrade } from '../_types'

const typeStyle: Record<string, string> = { Exam: 'badge-red', Quiz: 'badge-gold', Assignment: 'badge-blue', Lab: 'badge-green', CTA: 'badge-gold' }
const statusStyle: Record<string, { bg: string; text: string }> = {
  upcoming: { bg: '#F3F4F6', text: '#4B5563' },
  grading: { bg: '#FEF3C7', text: '#92400E' },
  completed: { bg: '#ECFDF5', text: '#065F46' },
}

export default function AssessmentSection() {
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [grades, setGrades] = useState<StudentGrade[]>([])
  const [activeTab, setActiveTab] = useState<AssessmentCategory | 'all'>('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [gradesSaved, setGradesSaved] = useState(false)
  const [form, setForm] = useState({
    title: '', type: 'Exam' as Assessment['type'], category: 'CA' as AssessmentCategory,
    group_id: 'g10a', group: 'Class 10A', subject: 'Advanced Physics', date: '', maxMarks: 100, weight: 10,
  })

  const openGrading = (a: Assessment) => {
    setSelectedAssessment(a)
    setGrades(MOCK_GRADING_STUDENTS.map(s => ({ ...s })))
    setGradesSaved(false)
  }

  const updateGrade = (studentId: string, field: 'marks' | 'remarks', value: string | number | null) => {
    setGrades(prev => prev.map(g => g.student_id === studentId ? { ...g, [field]: value } : g))
    setGradesSaved(false)
  }

  const handleCreate = () => {
    const newAssessment: Assessment = {
      id: String(Date.now()), title: form.title, type: form.type, category: form.category,
      group: form.group, group_id: form.group_id, subject: form.subject,
      date: form.date, maxMarks: form.maxMarks, weight: form.weight, status: 'upcoming',
    }
    setAssessments(prev => [newAssessment, ...prev])
    setShowCreateModal(false)
    setForm({ title: '', type: 'Exam', category: 'CA', group_id: 'g10a', group: 'Class 10A', subject: 'Advanced Physics', date: '', maxMarks: 100, weight: 10 })
  }

  const filtered = assessments.filter(a => {
    if (activeTab !== 'all' && a.category !== activeTab) return false
    if (filterType !== 'all' && a.type !== filterType) return false
    if (filterStatus !== 'all' && a.status !== filterStatus) return false
    return true
  })

  // Calculate CA vs Exam weight totals per group
  const getWeightSummary = (groupId: string) => {
    const groupAssessments = assessments.filter(a => a.group_id === groupId)
    const caWeight = groupAssessments.filter(a => a.category === 'CA').reduce((sum, a) => sum + a.weight, 0)
    const examWeight = groupAssessments.filter(a => a.category === 'Exam').reduce((sum, a) => sum + a.weight, 0)
    return { caWeight, examWeight, total: caWeight + examWeight }
  }

  return (
    <div>
      <PageHeader title="Assessment & Grading" subtitle="Manage Continuous Assessment (CA) and Terminal Examinations separately."
        action={{ label: 'New Assessment', icon: <Plus size={14} />, onClick: () => setShowCreateModal(true) }} />

      <div className="px-6 pb-8 space-y-4">
        {/* CA vs Exam Tabs */}
        <div className="card animate-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#E4E1D8' }}>
              {([
                { id: 'all' as const, label: 'All Assessments' },
                { id: 'CA' as const, label: 'Continuous Assessment (CA)' },
                { id: 'Exam' as const, label: 'Terminal Examination' },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    background: activeTab === tab.id ? '#C9A020' : 'white',
                    color: activeTab === tab.id ? 'white' : '#6B6660',
                    borderLeft: tab.id !== 'all' ? '1px solid #E4E1D8' : 'none',
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Summary */}
          {activeTab !== 'all' && (
            <div className="p-3 rounded-lg mb-4" style={{ background: activeTab === 'CA' ? 'rgba(59,130,246,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${activeTab === 'CA' ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Percent size={14} style={{ color: activeTab === 'CA' ? '#3B82F6' : '#EF4444' }} />
                <span className="text-sm font-semibold" style={{ color: activeTab === 'CA' ? '#3B82F6' : '#EF4444' }}>
                  {activeTab === 'CA' ? 'CA contributes 40% to final grade' : 'Exam contributes 60% to final grade'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {MOCK_GROUPS.map(g => {
                  const summary = getWeightSummary(g.id)
                  const currentWeight = activeTab === 'CA' ? summary.caWeight : summary.examWeight
                  const maxWeight = activeTab === 'CA' ? 40 : 60
                  return (
                    <div key={g.id} className="text-center p-2 rounded-lg" style={{ background: 'white' }}>
                      <p className="text-xs font-medium" style={{ color: '#6B6660' }}>{g.name}</p>
                      <p className="text-sm font-bold" style={{ color: currentWeight > maxWeight ? '#EF4444' : '#1A1A1A' }}>
                        {currentWeight}% / {maxWeight}%
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="select w-40">
                <option value="all">All Types</option>
                {activeTab === 'CA' ? (
                  <><option value="Quiz">Quiz</option><option value="Assignment">Assignment</option><option value="Lab">Lab</option><option value="CTA">CA Test</option></>
                ) : activeTab === 'Exam' ? (
                  <option value="Exam">Exam</option>
                ) : (
                  <><option value="Exam">Exam</option><option value="Quiz">Quiz</option><option value="Assignment">Assignment</option><option value="Lab">Lab</option><option value="CTA">CA Test</option></>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select w-40">
                <option value="all">All Status</option><option value="upcoming">Upcoming</option><option value="grading">Needs Grading</option><option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {!selectedAssessment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in stagger-2">
            {filtered.map(assessment => {
              const sStyle = statusStyle[assessment.status]
              return (
                <div key={assessment.id} className="card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${typeStyle[assessment.type]}`}>{assessment.type}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: sStyle.bg, color: sStyle.text }}>{assessment.status}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full ml-auto"
                      style={{ background: assessment.category === 'CA' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)', color: assessment.category === 'CA' ? '#3B82F6' : '#EF4444' }}>
                      {assessment.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-2">{assessment.title}</h3>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6B6660' }}><Users size={12} /> {assessment.group} · {assessment.subject}</div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6B6660' }}><Calendar size={12} /> {new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6B6660' }}><Award size={12} /> Max: {assessment.maxMarks} · Weight: {assessment.weight}%</div>
                  </div>
                  <div className="h-px mb-3" style={{ background: '#E4E1D8' }} />
                  <button onClick={() => openGrading(assessment)} className="btn-gold text-xs w-full justify-center">
                    <Edit2 size={12} /> {assessment.status === 'completed' ? 'View Grades' : 'Enter Grades'}
                  </button>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-sm" style={{ color: '#6B6660' }}>No assessments found for the selected filters.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card animate-in stagger-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-lg">{selectedAssessment.title}</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: selectedAssessment.category === 'CA' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)', color: selectedAssessment.category === 'CA' ? '#3B82F6' : '#EF4444' }}>
                    {selectedAssessment.category === 'CA' ? 'Continuous Assessment' : 'Terminal Examination'}
                  </span>
                </div>
                <p className="text-sm mt-0.5" style={{ color: '#6B6660' }}>{selectedAssessment.group} · {selectedAssessment.subject} · Max: {selectedAssessment.maxMarks} · Weight: {selectedAssessment.weight}%</p>
              </div>
              <button onClick={() => setSelectedAssessment(null)} className="btn-outline text-sm"><X size={14} /> Close</button>
            </div>

            {/* Validation info */}
            <div className="p-3 rounded-lg mb-4" style={{ background: '#F7F6F3', border: '1px solid #E4E1D8' }}>
              <p className="text-xs" style={{ color: '#6B6660' }}>
                ⚠️ Marks must be between 0 and {selectedAssessment.maxMarks}. Entries exceeding the maximum will be flagged.
              </p>
            </div>

            <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#E4E1D8' }}>
              <table className="table">
                <thead><tr><th style={{ width: 50 }}>#</th><th>Student</th><th style={{ width: 120 }}>Marks (/{selectedAssessment.maxMarks})</th><th style={{ width: 80 }}>%</th><th>Remarks</th></tr></thead>
                <tbody>
                  {grades.map((student, idx) => {
                    const pct = student.marks !== null ? Math.round((student.marks / selectedAssessment.maxMarks) * 100) : null
                    const isOverMax = student.marks !== null && student.marks > selectedAssessment.maxMarks
                    return (
                      <tr key={student.student_id}>
                        <td className="font-mono text-sm" style={{ color: '#6B6660' }}>{idx + 1}</td>
                        <td><div className="flex items-center gap-2.5"><StudentAvatar initials={student.avatar} /><span className="font-medium">{student.name}</span></div></td>
                        <td>
                          <input type="number" min={0} max={selectedAssessment.maxMarks}
                            value={student.marks ?? ''} onChange={e => updateGrade(student.student_id, 'marks', e.target.value === '' ? null : Number(e.target.value))}
                            className="input w-20 text-center" placeholder="—"
                            style={{ borderColor: isOverMax ? '#EF4444' : undefined }} />
                        </td>
                        <td>
                          <span className="text-sm font-medium" style={{ color: pct !== null ? (pct >= 70 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444') : '#6B6660' }}>
                            {pct !== null ? `${pct}%` : '—'}
                          </span>
                        </td>
                        <td><input type="text" value={student.remarks} onChange={e => updateGrade(student.student_id, 'remarks', e.target.value)} className="input" placeholder="Optional" /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Grade Summary */}
            <div className="grid grid-cols-4 gap-3 mt-4 p-3 rounded-lg" style={{ background: '#F7F6F3' }}>
              <div className="text-center">
                <p className="text-xs" style={{ color: '#6B6660' }}>Graded</p>
                <p className="font-bold">{grades.filter(g => g.marks !== null).length}/{grades.length}</p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: '#6B6660' }}>Average</p>
                <p className="font-bold">{grades.filter(g => g.marks !== null).length > 0 ? Math.round(grades.filter(g => g.marks !== null).reduce((s, g) => s + (g.marks || 0), 0) / grades.filter(g => g.marks !== null).length) : '—'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: '#6B6660' }}>Highest</p>
                <p className="font-bold" style={{ color: '#10B981' }}>{grades.filter(g => g.marks !== null).length > 0 ? Math.max(...grades.filter(g => g.marks !== null).map(g => g.marks!)) : '—'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: '#6B6660' }}>Lowest</p>
                <p className="font-bold" style={{ color: '#EF4444' }}>{grades.filter(g => g.marks !== null).length > 0 ? Math.min(...grades.filter(g => g.marks !== null).map(g => g.marks!)) : '—'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setSelectedAssessment(null)} className="btn-outline">Cancel</button>
              <button onClick={() => setGradesSaved(true)} className="btn-gold"><Save size={14} /> {gradesSaved ? '✓ Saved' : 'Save Grades'}</button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="card w-full max-w-lg mx-4 animate-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Create Assessment</h2>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Category</label>
                <div className="flex gap-2">
                  <button onClick={() => setForm(f => ({ ...f, category: 'CA', type: 'Quiz' }))}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ background: form.category === 'CA' ? 'rgba(59,130,246,0.1)' : '#F7F6F3', color: form.category === 'CA' ? '#3B82F6' : '#6B6660', border: `1px solid ${form.category === 'CA' ? '#3B82F6' : '#E4E1D8'}` }}>
                    Continuous Assessment (40%)
                  </button>
                  <button onClick={() => setForm(f => ({ ...f, category: 'Exam', type: 'Exam', weight: 60 }))}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ background: form.category === 'Exam' ? 'rgba(239,68,68,0.1)' : '#F7F6F3', color: form.category === 'Exam' ? '#EF4444' : '#6B6660', border: `1px solid ${form.category === 'Exam' ? '#EF4444' : '#E4E1D8'}` }}>
                    Terminal Examination (60%)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder={form.category === 'CA' ? 'e.g. Weekly Quiz #9' : 'e.g. End of Term Exam'} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Assessment['type'] }))} className="select">
                    {form.category === 'CA' ? (
                      <><option value="Quiz">Quiz</option><option value="Assignment">Assignment</option><option value="Lab">Lab</option><option value="CTA">CA Test</option></>
                    ) : (
                      <option value="Exam">Exam</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Max Marks</label>
                  <input type="number" value={form.maxMarks} onChange={e => setForm(f => ({ ...f, maxMarks: Number(e.target.value) }))} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Weight (%)</label>
                  <input type="number" min={1} max={form.category === 'CA' ? 40 : 60} value={form.weight} onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))} className="input" />
                  <p className="text-[10px] mt-1" style={{ color: '#6B6660' }}>Max: {form.category === 'CA' ? '40' : '60'}% for {form.category}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Class / Group</label>
                  <select value={form.group_id} onChange={e => { const g = MOCK_GROUPS.find(x => x.id === e.target.value); setForm(f => ({ ...f, group_id: e.target.value, group: g?.name || '' })) }} className="select">
                    {MOCK_GROUPS.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Subject</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="select">
                    <option>Advanced Physics</option><option>Physics Fundamentals</option><option>Physics Lab</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="btn-outline">Cancel</button>
              <button onClick={handleCreate} className="btn-gold" disabled={!form.title || !form.date}><Plus size={14} /> Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
