'use client'
import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Save, BookOpen, Clock, CheckCircle2, FileText, Eye } from 'lucide-react'
import { PageHeader } from '../_components'
import { MOCK_LESSON_PLANS, MOCK_GROUPS } from '../_mock-data'
import type { LessonPlan, Day, DAYS } from '../_types'

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: '#F3F4F6', text: '#4B5563', label: 'Draft' },
  published: { bg: '#FEF3C7', text: '#92400E', label: 'Published' },
  completed: { bg: '#ECFDF5', text: '#065F46', label: 'Completed' },
}

const DAYS_LIST: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function LessonPlanSection() {
  const [plans, setPlans] = useState<LessonPlan[]>(MOCK_LESSON_PLANS)
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'weekly'>('grid')
  const [filterGroup, setFilterGroup] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null)

  const [form, setForm] = useState({
    title: '', subject: 'Advanced Physics', group: 'Class 10A',
    week: 'Week 21 (May 19-23)', day: 'Monday' as Day, period: 1,
    duration: '45 mins', objectives: [''], activities: [''], resources: [''],
    homework: '', status: 'draft' as LessonPlan['status'],
  })

  const addListItem = (field: 'objectives' | 'activities' | 'resources') => {
    setForm(f => ({ ...f, [field]: [...f[field], ''] }))
  }

  const updateListItem = (field: 'objectives' | 'activities' | 'resources', idx: number, value: string) => {
    setForm(f => ({ ...f, [field]: f[field].map((item, i) => i === idx ? value : item) }))
  }

  const removeListItem = (field: 'objectives' | 'activities' | 'resources', idx: number) => {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }))
  }

  const handleCreate = () => {
    const newPlan: LessonPlan = {
      id: String(Date.now()), ...form,
      objectives: form.objectives.filter(o => o.trim()),
      activities: form.activities.filter(a => a.trim()),
      resources: form.resources.filter(r => r.trim()),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setPlans(prev => [newPlan, ...prev])
    setShowCreateModal(false)
    resetForm()
  }

  const handleUpdate = () => {
    if (!editingPlan) return
    setPlans(prev => prev.map(p => p.id === editingPlan.id ? {
      ...editingPlan, ...form,
      objectives: form.objectives.filter(o => o.trim()),
      activities: form.activities.filter(a => a.trim()),
      resources: form.resources.filter(r => r.trim()),
    } : p))
    setEditingPlan(null)
    setShowCreateModal(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id))
    if (selectedPlan?.id === id) setSelectedPlan(null)
  }

  const openEdit = (plan: LessonPlan) => {
    setEditingPlan(plan)
    setForm({
      title: plan.title, subject: plan.subject, group: plan.group,
      week: plan.week, day: plan.day, period: plan.period,
      duration: plan.duration, objectives: [...plan.objectives],
      activities: [...plan.activities], resources: [...plan.resources],
      homework: plan.homework, status: plan.status,
    })
    setShowCreateModal(true)
  }

  const resetForm = () => {
    setForm({ title: '', subject: 'Advanced Physics', group: 'Class 10A', week: 'Week 21 (May 19-23)', day: 'Monday', period: 1, duration: '45 mins', objectives: [''], activities: [''], resources: [''], homework: '', status: 'draft' })
    setEditingPlan(null)
  }

  const publishPlan = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: 'published' as const } : p))
  }

  const completePlan = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: 'completed' as const } : p))
  }

  const filtered = plans.filter(p => {
    if (filterGroup !== 'all' && p.group !== filterGroup) return false
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    return true
  })

  // Group plans by day for weekly view
  const weeklyPlans: Record<Day, LessonPlan[]> = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] }
  filtered.forEach(p => { if (weeklyPlans[p.day]) weeklyPlans[p.day].push(p) })

  return (
    <div>
      <PageHeader title="Lesson Plans" subtitle="Create weekly and unit lesson plans aligned to the curriculum."
        action={{ label: 'New Lesson Plan', icon: <Plus size={14} />, onClick: () => { resetForm(); setShowCreateModal(true) } }} />

      <div className="px-6 pb-8 space-y-4">
        {/* Filters & View Toggle */}
        <div className="card animate-in">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Class</label>
              <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)} className="select w-36">
                <option value="all">All Classes</option>
                {MOCK_GROUPS.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select w-36">
                <option value="all">All Status</option><option value="draft">Draft</option><option value="published">Published</option><option value="completed">Completed</option>
              </select>
            </div>
            <div className="ml-auto">
              <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#E4E1D8' }}>
                <button onClick={() => setViewMode('grid')} className="px-3 py-2 text-xs font-medium" style={{ background: viewMode === 'grid' ? '#C9A020' : 'white', color: viewMode === 'grid' ? 'white' : '#6B6660' }}>Grid</button>
                <button onClick={() => setViewMode('weekly')} className="px-3 py-2 text-xs font-medium" style={{ background: viewMode === 'weekly' ? '#C9A020' : 'white', color: viewMode === 'weekly' ? 'white' : '#6B6660', borderLeft: '1px solid #E4E1D8' }}>Weekly</button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail View */}
        {selectedPlan ? (
          <div className="card animate-in stagger-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-lg">{selectedPlan.title}</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: statusStyle[selectedPlan.status].bg, color: statusStyle[selectedPlan.status].text }}>{statusStyle[selectedPlan.status].label}</span>
                </div>
                <p className="text-sm" style={{ color: '#6B6660' }}>{selectedPlan.group} · {selectedPlan.subject} · {selectedPlan.day}, Period {selectedPlan.period} · {selectedPlan.duration}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(selectedPlan)} className="btn-outline text-sm"><Edit2 size={14} /> Edit</button>
                <button onClick={() => setSelectedPlan(null)} className="btn-outline text-sm"><X size={14} /> Close</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6660' }}>Learning Objectives</h3>
                <ul className="space-y-2">
                  {selectedPlan.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6660' }}>Activities</h3>
                <ul className="space-y-2">
                  {selectedPlan.activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'rgba(201,160,32,0.15)', color: '#C9A020' }}>{i + 1}</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6660' }}>Resources Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPlan.resources.map((res, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#F7F6F3', border: '1px solid #E4E1D8' }}>{res}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6660' }}>Homework / Assignment</h3>
                <p className="text-sm p-3 rounded-lg" style={{ background: '#F7F6F3', border: '1px solid #E4E1D8' }}>{selectedPlan.homework || 'None assigned'}</p>
              </div>
            </div>

            {selectedPlan.status === 'draft' && (
              <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: '1px solid #E4E1D8' }}>
                <button onClick={() => publishPlan(selectedPlan.id)} className="btn-gold"><FileText size={14} /> Publish Plan</button>
              </div>
            )}
            {selectedPlan.status === 'published' && (
              <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: '1px solid #E4E1D8' }}>
                <button onClick={() => completePlan(selectedPlan.id)} className="btn-gold"><CheckCircle2 size={14} /> Mark Completed</button>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in stagger-2">
            {filtered.map(plan => {
              const sStyle = statusStyle[plan.status]
              return (
                <div key={plan.id} className="card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: sStyle.bg, color: sStyle.text }}>{sStyle.label}</span>
                    <span className="text-xs ml-auto" style={{ color: '#6B6660' }}>{plan.week}</span>
                  </div>
                  <h3 className="font-bold text-base mb-2">{plan.title}</h3>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6B6660' }}><BookOpen size={12} /> {plan.group} · {plan.subject}</div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6B6660' }}><Clock size={12} /> {plan.day}, Period {plan.period} · {plan.duration}</div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6B6660' }}><CheckCircle2 size={12} /> {plan.objectives.length} objectives</div>
                  </div>
                  <div className="h-px mb-3" style={{ background: '#E4E1D8' }} />
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedPlan(plan)} className="btn-gold text-xs flex-1 justify-center"><Eye size={12} /> View</button>
                    <button onClick={() => openEdit(plan)} className="btn-outline text-xs px-3"><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(plan.id)} className="btn-outline text-xs px-3" style={{ borderColor: '#FCA5A5', color: '#EF4444' }}><Trash2 size={12} /></button>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen size={32} className="mx-auto mb-2" style={{ color: '#6B6660' }} />
                <p className="text-sm" style={{ color: '#6B6660' }}>No lesson plans found. Create your first one!</p>
              </div>
            )}
          </div>
        ) : (
          /* Weekly View */
          <div className="grid grid-cols-5 gap-3 animate-in stagger-2">
            {DAYS_LIST.map(day => (
              <div key={day} className="card" style={{ minHeight: 200 }}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3 pb-2" style={{ color: '#6B6660', borderBottom: '1px solid #E4E1D8' }}>{day}</h3>
                <div className="space-y-2">
                  {weeklyPlans[day].sort((a, b) => a.period - b.period).map(plan => {
                    const sStyle = statusStyle[plan.status]
                    return (
                      <button key={plan.id} onClick={() => setSelectedPlan(plan)}
                        className="w-full text-left p-2 rounded-lg transition-all hover:shadow-sm"
                        style={{ background: '#F7F6F3', border: '1px solid #E4E1D8' }}>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] font-bold" style={{ color: '#C9A020' }}>P{plan.period}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: sStyle.bg, color: sStyle.text }}>{sStyle.label}</span>
                        </div>
                        <p className="text-xs font-semibold truncate">{plan.title}</p>
                        <p className="text-[10px] truncate" style={{ color: '#6B6660' }}>{plan.group}</p>
                      </button>
                    )
                  })}
                  {weeklyPlans[day].length === 0 && (
                    <p className="text-[10px] text-center py-4" style={{ color: '#6B6660' }}>No plans</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="card w-full max-w-2xl mx-4 animate-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">{editingPlan ? 'Edit Lesson Plan' : 'Create Lesson Plan'}</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm() }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder="e.g. Introduction to Electromagnetic Waves" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Subject</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="select">
                    <option>Advanced Physics</option><option>Physics Fundamentals</option><option>Physics Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Class / Group</label>
                  <select value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value }))} className="select">
                    {MOCK_GROUPS.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Week</label>
                  <select value={form.week} onChange={e => setForm(f => ({ ...f, week: e.target.value }))} className="select">
                    <option>Week 20 (May 12-16)</option><option>Week 21 (May 19-23)</option><option>Week 22 (May 26-30)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Day</label>
                  <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value as Day }))} className="select">
                    {DAYS_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Period</label>
                  <input type="number" min={1} max={8} value={form.period} onChange={e => setForm(f => ({ ...f, period: Number(e.target.value) }))} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Duration</label>
                  <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="select">
                    <option>45 mins</option><option>60 mins</option><option>90 mins</option>
                  </select>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B6660' }}>Learning Objectives</label>
                  <button onClick={() => addListItem('objectives')} className="text-xs font-medium" style={{ color: '#C9A020' }}>+ Add</button>
                </div>
                <div className="space-y-2">
                  {form.objectives.map((obj, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={obj} onChange={e => updateListItem('objectives', i, e.target.value)} className="input flex-1" placeholder={`Objective ${i + 1}`} />
                      {form.objectives.length > 1 && <button onClick={() => removeListItem('objectives', i)} className="text-red-400 hover:text-red-600"><X size={16} /></button>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B6660' }}>Activities</label>
                  <button onClick={() => addListItem('activities')} className="text-xs font-medium" style={{ color: '#C9A020' }}>+ Add</button>
                </div>
                <div className="space-y-2">
                  {form.activities.map((act, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={act} onChange={e => updateListItem('activities', i, e.target.value)} className="input flex-1" placeholder={`Activity ${i + 1}`} />
                      {form.activities.length > 1 && <button onClick={() => removeListItem('activities', i)} className="text-red-400 hover:text-red-600"><X size={16} /></button>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B6660' }}>Resources</label>
                  <button onClick={() => addListItem('resources')} className="text-xs font-medium" style={{ color: '#C9A020' }}>+ Add</button>
                </div>
                <div className="space-y-2">
                  {form.resources.map((res, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={res} onChange={e => updateListItem('resources', i, e.target.value)} className="input flex-1" placeholder={`Resource ${i + 1}`} />
                      {form.resources.length > 1 && <button onClick={() => removeListItem('resources', i)} className="text-red-400 hover:text-red-600"><X size={16} /></button>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Homework / Assignment</label>
                <textarea value={form.homework} onChange={e => setForm(f => ({ ...f, homework: e.target.value }))} className="input" rows={3} placeholder="Describe the homework or assignment..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowCreateModal(false); resetForm() }} className="btn-outline">Cancel</button>
              <button onClick={editingPlan ? handleUpdate : handleCreate} className="btn-gold" disabled={!form.title}>
                <Save size={14} /> {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
