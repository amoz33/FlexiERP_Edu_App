'use client'
import { useState } from 'react'
import { Search, UserPlus, UserMinus, Users, FolderOpen, X } from 'lucide-react'
import { PageHeader, StudentAvatar } from '../_components'
import { MOCK_GROUPS, MOCK_GROUP_STUDENTS } from '../_mock-data'
import type { Student } from '../_types'

export default function GroupsSection() {
  const [selectedGroup, setSelectedGroup] = useState('g10a')
  const [students, setStudents] = useState<Student[]>(MOCK_GROUP_STUDENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const currentGroup = MOCK_GROUPS.find(g => g.id === selectedGroup)

  const removeStudent = (id: string) => {
    if (confirm('Remove this student from the group?')) {
      setStudents(prev => prev.filter(s => s.id !== id))
    }
  }

  const addStudent = (name: string, avatar: string) => {
    const newStudent: Student = {
      id: String(Date.now()),
      name, avatar,
      rollNo: String(200 + students.length),
      email: `${name.toLowerCase().replace(' ', '.')}@school.edu`,
    }
    setStudents(prev => [...prev, newStudent])
    setShowAddModal(false)
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery)
  )

  return (
    <div>
      <PageHeader title="Student Groups" subtitle="View and manage your assigned class groups and student rosters." />

      <div className="px-6 pb-8">
        <div className="flex gap-4">
          {/* Group List */}
          <div className="card w-64 flex-shrink-0 animate-in stagger-1 h-fit">
            <h3 className="font-bold mb-4">My Groups</h3>
            <div className="space-y-1">
              {MOCK_GROUPS.map(group => (
                <button key={group.id} onClick={() => setSelectedGroup(group.id)}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-left transition-all"
                  style={{ background: selectedGroup === group.id ? 'rgba(201,160,32,0.1)' : 'transparent', border: selectedGroup === group.id ? '1px solid rgba(201,160,32,0.3)' : '1px solid transparent' }}>
                  <FolderOpen size={14} style={{ color: selectedGroup === group.id ? '#C9A020' : '#6B6660' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: selectedGroup === group.id ? '#C9A020' : '#0D0D0D' }}>{group.name}</p>
                    <p className="text-xs truncate" style={{ color: '#6B6660' }}>{group.subject}</p>
                  </div>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: '#F3F4F6', color: '#6B6660' }}>{group.studentCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Student List */}
          <div className="flex-1 animate-in stagger-2">
            {currentGroup && (
              <div className="card mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-lg">{currentGroup.name}</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#6B6660' }}>{currentGroup.section} · {currentGroup.subject} · {students.length} students</p>
                  </div>
                  <button onClick={() => setShowAddModal(true)} className="btn-gold text-sm"><UserPlus size={14} /> Add Student</button>
                </div>
              </div>
            )}

            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6660' }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or roll number..." className="input pl-9" />
            </div>

            <div className="card p-0 overflow-hidden">
              <table className="table">
                <thead><tr><th style={{ width: 60 }}>Roll</th><th>Student</th><th>Email</th><th style={{ width: 80 }}>Action</th></tr></thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td className="font-mono text-sm" style={{ color: '#6B6660' }}>{student.rollNo}</td>
                      <td><div className="flex items-center gap-2.5"><StudentAvatar initials={student.avatar} /><span className="font-medium">{student.name}</span></div></td>
                      <td className="text-sm" style={{ color: '#6B6660' }}>{student.email}</td>
                      <td>
                        <button onClick={() => removeStudent(student.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" title="Remove">
                          <UserMinus size={14} style={{ color: '#EF4444' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <Users size={32} style={{ color: '#E4E1D8' }} className="mx-auto mb-2" />
                  <p className="text-sm" style={{ color: '#6B6660' }}>No students found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="card w-full max-w-md mx-4 animate-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Add Student to {currentGroup?.name}</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={18} /></button>
            </div>
            <p className="text-sm mb-4" style={{ color: '#6B6660' }}>Select a student to add to this group.</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { name: 'Charles Darwin', avatar: 'CD' },
                { name: 'Grace Hopper', avatar: 'GH' },
                { name: 'Alan Turing', avatar: 'AT' },
                { name: 'Katherine Johnson', avatar: 'KJ' },
              ].map(s => (
                <button key={s.name} onClick={() => addStudent(s.name, s.avatar)}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left" style={{ border: '1px solid #E4E1D8' }}>
                  <StudentAvatar initials={s.avatar} />
                  <span className="font-medium text-sm">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
