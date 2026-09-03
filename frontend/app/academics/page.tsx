'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { academicsApi } from '@/lib/api'
import { FolderOpen, Plus, User, Trophy } from 'lucide-react'

const MOCK_CLASSES = [
  { id: 'c10', name: 'Class 10', sections: [{ id: 's10a', name: 'Section A' }, { id: 's10b', name: 'Section B' }] },
  { id: 'c11', name: 'Class 11', sections: [{ id: 's11a', name: 'Section A' }] },
  { id: 'c12', name: 'Class 12', sections: [{ id: 's12a', name: 'Section A' }] },
]
const MOCK_SUBJECTS = [
  { id: 's1', code: 'MAT101', type: 'Core', name: 'Advanced Mathematics', teacher: 'Dr. Robert Chen', max_marks: '100 (Theory) / 50 (Practical)' },
  { id: 's2', code: 'PHY101', type: 'Core', name: 'Physics Fundamentals', teacher: 'Sarah Jenkins', max_marks: '100 (Theory)' },
  { id: 's3', code: 'ENG102', type: 'Language', name: 'English Literature', teacher: 'Prof. Alan Smith', max_marks: '100 (Theory)' },
]
const typeStyle: Record<string, string> = {
  Core: 'badge-green', Language: 'badge-gold', Elective: 'badge-blue',
}

export default function AcademicsPage() {
  const [selectedClass, setSelectedClass] = useState('c10')
  const [selectedSection, setSelectedSection] = useState('s10a')

  const { data: classes = MOCK_CLASSES } = useQuery({
    queryKey: ['classes'],
    queryFn: () => academicsApi.getClasses().then(r => r.data),
    placeholderData: MOCK_CLASSES,
  })

  const { data: subjects = MOCK_SUBJECTS } = useQuery({
    queryKey: ['subjects', selectedClass, selectedSection],
    queryFn: () => academicsApi.getSubjects(selectedClass, selectedSection).then(r => r.data),
    placeholderData: MOCK_SUBJECTS,
  })

  const currentClass = classes.find((c: typeof MOCK_CLASSES[0]) => c.id === selectedClass)

  return (
    <AppLayout>
      <Topbar action={{ label: 'New Entry', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Courses & Subjects</h1>
        <p className="page-subtitle">Manage curriculum hierarchy, assigned staff, and grading metrics.</p>
      </div>

      <div className="px-6 pb-8">
        <div className="flex gap-4">
          {/* Class Tree */}
          <div className="card w-56 flex-shrink-0 animate-in stagger-1 h-fit">
            <h3 className="font-bold mb-4">Class Structure</h3>
            <div className="space-y-1">
              {classes.map((cls: typeof MOCK_CLASSES[0]) => (
                <div key={cls.id}>
                  <button
                    onClick={() => { setSelectedClass(cls.id); setSelectedSection(cls.sections[0]?.id) }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm text-left hover:bg-gray-50 transition-colors">
                    <FolderOpen size={14} style={{ color: '#6B6660' }} />
                    <span className="font-medium">{cls.name}</span>
                  </button>
                  {selectedClass === cls.id && cls.sections.map((sec: typeof MOCK_CLASSES[0]['sections'][0]) => (
                    <button key={sec.id}
                      onClick={() => setSelectedSection(sec.id)}
                      className="flex items-center gap-2 w-full pl-7 py-1.5 rounded-lg text-sm text-left transition-all"
                      style={{
                        background: selectedSection === sec.id ? 'rgba(201,160,32,0.1)' : 'transparent',
                        color: selectedSection === sec.id ? '#C9A020' : '#6B6660',
                        fontWeight: selectedSection === sec.id ? 600 : 400,
                      }}>
                      <FolderOpen size={13} />
                      {sec.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="flex-1 animate-in stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                Subjects for {currentClass?.name} – {currentClass?.sections.find((s: typeof MOCK_CLASSES[0]['sections'][0]) => s.id === selectedSection)?.name}
              </h2>
              <span className="text-sm" style={{ color: '#6B6660' }}>{subjects.length} Active Subjects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((sub: typeof MOCK_SUBJECTS[0]) => (
                <div key={sub.id} className="card-hover">
                  <div className="flex gap-2 mb-3">
                    <span className="badge badge-gray text-xs font-mono">{sub.code}</span>
                    <span className={`badge ${typeStyle[sub.type] || 'badge-gray'}`}>{sub.type}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3">{sub.name}</h3>
                  <div className="h-px mb-3" style={{ background: '#E4E1D8' }} />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#6B6660' }}>Assigned Teacher</p>
                      <div className="flex items-center gap-1.5">
                        <User size={13} style={{ color: '#C9A020' }} />
                        <span className="font-medium">{sub.teacher}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#6B6660' }}>Max Marks</p>
                      <div className="flex items-center gap-1.5">
                        <Trophy size={13} style={{ color: '#C9A020' }} />
                        <span className="font-medium">{sub.max_marks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Subject */}
              <button className="card border-dashed flex flex-col items-center justify-center gap-2 py-8 hover:border-gold-500 transition-colors"
                      style={{ borderStyle: 'dashed', borderColor: '#C9A020' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                     style={{ background: 'rgba(201,160,32,0.1)' }}>
                  <Plus size={18} style={{ color: '#C9A020' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#C9A020' }}>Add Subject</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
