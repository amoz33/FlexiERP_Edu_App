'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { timetableApi } from '@/lib/api'
import { Sparkles, MapPin } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
type Day = typeof DAYS[number]

const MOCK_TIMETABLE: Record<string, Array<{ time: string; subject: string; teacher: string; room: string; live?: boolean } | { time: string; type: 'break' | 'free'; label: string }>> = {
  Monday: [
    { time: '08:00 AM', subject: 'Advanced Physics', teacher: 'Dr. R. Feynman', room: 'Lab 4A', live: true },
    { time: '09:00 AM', subject: 'Chemistry', teacher: 'Dr. M. Curie', room: 'Lab 1C', live: true },
    { time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { time: '10:30 AM', subject: 'Physical Ed.', teacher: 'Coach Carter', room: 'Gymnasium' },
  ],
  Tuesday: [
    { time: '08:00 AM', subject: 'Mathematics II', teacher: 'Prof. A. Turing', room: 'Room 302' },
    { time: '09:00 AM', subject: 'World History', teacher: 'Mr. H. Zinn', room: 'Room 210' },
    { time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { time: '10:30 AM', type: 'free', label: 'Study Hall' },
  ],
  Wednesday: [
    { time: '08:00 AM', subject: 'Literature', teacher: 'Ms. V. Woolf', room: 'Room 105' },
    { time: '09:00 AM', type: 'free', label: 'Free Period' },
    { time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { time: '10:30 AM', subject: 'Biology', teacher: 'Dr. C. Darwin', room: 'Lab 3B' },
  ],
  Thursday: [
    { time: '08:00 AM', subject: 'Advanced Physics', teacher: 'Dr. R. Feynman', room: 'Lab 4A' },
    { time: '09:00 AM', subject: 'Chemistry', teacher: 'Dr. M. Curie', room: 'Lab 1C' },
    { time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { time: '10:30 AM', subject: 'Physical Ed.', teacher: 'Coach Carter', room: 'Gymnasium' },
  ],
  Friday: [
    { time: '08:00 AM', subject: 'Computer Sci', teacher: 'Mr. C. Babbage', room: 'Lab 2B' },
    { time: '09:00 AM', subject: 'Mathematics II', teacher: 'Prof. A. Turing', room: 'Room 302' },
    { time: '10:00 AM', type: 'break', label: 'Morning Break' },
    { time: '10:30 AM', subject: 'Literature', teacher: 'Ms. V. Woolf', room: 'Room 105' },
  ],
}

function isBreak(e: typeof MOCK_TIMETABLE['Monday'][0]): e is { time: string; type: 'break' | 'free'; label: string } {
  return 'type' in e
}

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState<Day>('Monday')
  const [cls, setCls] = useState('Grade 10')
  const [section, setSection] = useState('Section A (Science)')

  return (
    <AppLayout>
      <Topbar action={{ label: 'New Entry', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Master Timetable</h1>
        <p className="page-subtitle">Manage and view schedules across all departments.</p>
      </div>

      <div className="px-6 pb-8 space-y-4">
        {/* Filter + Day Selector */}
        <div className="card animate-in stagger-1">
          <div className="flex flex-wrap gap-3 items-end justify-between">
            <div className="flex gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Class</label>
                <select value={cls} onChange={e => setCls(e.target.value)} className="select w-36">
                  <option>Grade 10</option><option>Grade 11</option><option>Grade 12</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Section</label>
                <select value={section} onChange={e => setSection(e.target.value)} className="select w-48">
                  <option>Section A (Science)</option><option>Section B (Arts)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              {DAYS.map(day => (
                <button key={day} onClick={() => setActiveDay(day)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          background: activeDay === day ? '#C9A020' : 'transparent',
                          color: activeDay === day ? 'white' : '#6B6660',
                          border: activeDay === day ? 'none' : '1px solid #E4E1D8',
                        }}>
                  {day}
                </button>
              ))}
            </div>
            <button className="btn-gold flex items-center gap-1.5">
              <Sparkles size={14} /> Generate Timetable
            </button>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="card p-0 overflow-hidden animate-in stagger-2">
          <div className="overflow-x-auto">
            <table style={{ minWidth: 900, width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#F7F6F3' }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B6660', width: 90, borderBottom: '1px solid #E4E1D8' }}>Time</th>
                  {DAYS.map(d => (
                    <th key={d} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B6660', borderBottom: '1px solid #E4E1D8' }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['08:00 AM', '09:00 AM', '10:00 AM', '10:30 AM'].map((time, ri) => {
                  // Check if this row is a special row in Monday's data
                  const mondayEntry = MOCK_TIMETABLE.Monday.find(e => e.time === time)
                  const isBreakRow = mondayEntry && isBreak(mondayEntry) && mondayEntry.type === 'break'

                  if (isBreakRow) {
                    return (
                      <tr key={time} style={{ background: '#F7F6F3' }}>
                        <td className="px-4 py-2 text-xs font-mono" style={{ color: '#A09080', borderBottom: '1px solid #E4E1D8' }}>{time}</td>
                        <td colSpan={5} className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B6660', borderBottom: '1px solid #E4E1D8' }}>
                          ☕ Morning Break
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={time} style={{ borderBottom: '1px solid #E4E1D8' }}>
                      <td className="px-4 py-3 text-xs font-mono align-top pt-4" style={{ color: '#A09080' }}>{time}</td>
                      {DAYS.map(day => {
                        const entry = MOCK_TIMETABLE[day].find(e => e.time === time)
                        if (!entry) return <td key={day} className="px-3 py-3" />
                        if (isBreak(entry)) {
                          return (
                            <td key={day} className="px-3 py-3">
                              <div className="rounded-lg px-3 py-2.5 text-center text-xs" style={{ background: '#F7F6F3', color: '#6B6660' }}>
                                {entry.label}
                              </div>
                            </td>
                          )
                        }
                        return (
                          <td key={day} className="px-3 py-3">
                            <div className="rounded-xl p-3 transition-all hover:shadow-md cursor-pointer relative"
                                 style={{ background: 'white', border: '1px solid #E4E1D8' }}>
                              {entry.live && (
                                <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                                      style={{ background: '#ECFDF5', color: '#059669' }}>LIVE</span>
                              )}
                              <p className="font-bold text-sm mb-1">{entry.subject}</p>
                              <p className="text-xs mb-1.5" style={{ color: '#6B6660' }}>{entry.teacher}</p>
                              <div className="flex items-center gap-1 text-xs" style={{ color: '#A09080' }}>
                                <MapPin size={10} /> {entry.room}
                              </div>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
