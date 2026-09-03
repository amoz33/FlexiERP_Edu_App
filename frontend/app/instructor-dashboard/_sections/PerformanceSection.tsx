'use client'
import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Award } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { PageHeader, StatCard } from '../_components'
import { MOCK_GROUPS, MOCK_SCORE_TRENDS, MOCK_ATTENDANCE_WEEKLY, MOCK_SUBJECT_PERFORMANCE, MOCK_TOP_PERFORMERS, MOCK_AT_RISK } from '../_mock-data'

export default function PerformanceSection() {
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [period, setPeriod] = useState('this-term')

  return (
    <div>
      <PageHeader title="Class Performance" subtitle="Analytics overview — average scores, attendance trends, and student insights." />

      <div className="px-6 pb-8 space-y-6">
        {/* Filters */}
        <div className="card animate-in stagger-1">
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Group</label>
              <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} className="select w-44">
                <option value="all">All My Groups</option>
                {MOCK_GROUPS.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Period</label>
              <select value={period} onChange={e => setPeriod(e.target.value)} className="select w-44">
                <option value="this-term">This Term</option><option value="last-term">Last Term</option><option value="this-year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in stagger-1">
          <StatCard icon={<BarChart3 size={18} style={{ color: '#C9A020' }} />} iconBg="rgba(201,160,32,0.12)" value="76.4" label="Avg Score" />
          <StatCard icon={<TrendingUp size={18} style={{ color: '#10B981' }} />} iconBg="rgba(16,185,129,0.12)" value="92%" label="Attendance Rate" />
          <StatCard icon={<Award size={18} style={{ color: '#3B82F6' }} />} iconBg="rgba(59,130,246,0.12)" value={5} label="Top Performers" />
          <StatCard icon={<TrendingDown size={18} style={{ color: '#EF4444' }} />} iconBg="rgba(239,68,68,0.12)" value={3} label="At Risk" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card animate-in stagger-2">
            <h3 className="font-bold text-base mb-4">Score & Attendance Trends</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={MOCK_SCORE_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D8" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B6660' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B6660' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgScore" stroke="#C9A020" strokeWidth={2} name="Avg Score" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance %" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card animate-in stagger-3">
            <h3 className="font-bold text-base mb-4">Weekly Attendance Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MOCK_ATTENDANCE_WEEKLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D8" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B6660' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B6660' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#C9A020" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Subject Performance */}
          <div className="card animate-in stagger-3">
            <h3 className="font-bold text-base mb-4">Subject-wise Performance</h3>
            <div className="space-y-3">
              {MOCK_SUBJECT_PERFORMANCE.map((sub, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{sub.subject}</span>
                    <span className="text-sm font-bold" style={{ color: '#C9A020' }}>{sub.avgScore}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: '#F3F4F6' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${sub.avgScore}%`, background: sub.avgScore >= 75 ? '#10B981' : sub.avgScore >= 60 ? '#C9A020' : '#EF4444' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="card animate-in stagger-4">
            <h3 className="font-bold text-base mb-4">Top Performers</h3>
            <div className="space-y-3">
              {MOCK_TOP_PERFORMERS.map((student, idx) => (
                <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: idx === 0 ? 'rgba(201,160,32,0.06)' : 'transparent' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: idx === 0 ? '#C9A020' : idx === 1 ? '#9CA3AF' : idx === 2 ? '#B45309' : '#F3F4F6', color: idx < 3 ? 'white' : '#6B6660' }}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs" style={{ color: '#6B6660' }}>{student.group}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{student.avgScore}%</span>
                    {student.trend === 'up' && <TrendingUp size={12} style={{ color: '#10B981' }} />}
                    {student.trend === 'down' && <TrendingDown size={12} style={{ color: '#EF4444' }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* At Risk */}
          <div className="card animate-in stagger-4">
            <h3 className="font-bold text-base mb-4">
              <span className="flex items-center gap-2">Students at Risk <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#FEF2F2', color: '#991B1B' }}>{MOCK_AT_RISK.length}</span></span>
            </h3>
            <div className="space-y-3">
              {MOCK_AT_RISK.map(student => (
                <div key={student.id} className="p-3 rounded-lg" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{student.name}</p>
                    <span className="text-xs" style={{ color: '#6B6660' }}>{student.group}</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#991B1B' }}>{student.issue}</p>
                  <div className="flex gap-4 text-xs" style={{ color: '#6B6660' }}>
                    <span>Score: <strong>{student.avgScore}%</strong></span>
                    <span>Attendance: <strong>{student.attendanceRate}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
