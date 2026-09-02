'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import { messagingApi } from '@/lib/api'
import { getInitials } from '@/lib/utils'
import {
  Pencil, Inbox, Send, FileText, Users,
  Bell, Mail, Calendar, Trash2, Reply, Forward,
  AlertCircle, CheckCircle, User
} from 'lucide-react'

const MOCK_INBOX = [
  { id: '1', sender: 'Dr. Emily Chen', subject: 'Q3 Syllabus Updates Needed', preview: 'Please review the attached changes for t…', time: '09:42 AM', read: false, label: 'Faculty' },
  { id: '2', sender: 'Admissions Office', subject: 'Incoming Freshman Orientation', preview: 'The schedule for next week\'s orientation i…', time: 'Yesterday', read: true, label: null },
  { id: '3', sender: 'Prof. Marcus Johnson', subject: 'Lab Equipment Requisition', preview: 'I have submitted the forms for the new mi…', time: 'Mon', read: true, label: 'Urgent' },
]

const MOCK_MESSAGE = {
  id: '2',
  sender: 'Admissions Office',
  senderEmail: 'admissions@edumanage.edu',
  to: 'admin@edumanage.edu',
  subject: 'Incoming Freshman Orientation',
  date: 'Oct 24, 2023, 2:30 PM',
  body: `Hello Administration Team,\n\nThe schedule for next week's incoming freshman orientation has been finalized and approved by the Dean's office. We are expecting approximately 450 new students to attend across the three-day event.\n\nKey highlights that require your attention:\n\n• The opening keynote is scheduled for Monday at 9:00 AM in the Main Auditorium. Please ensure AV setup is completed by 8:00 AM.\n\n• Registration packets are currently being assembled in Room 104 and will be ready for distribution on Sunday evening.\n\n• We need final confirmation on the departmental breakout room assignments. Please review the attached spreadsheet.\n\nLet's schedule a brief 15-minute sync call before the weekend to align on any last-minute logistics.`,
}

const LABELS = ['Urgent', 'Faculty', 'Students']
const labelColors: Record<string, string> = {
  Urgent: '#EF4444', Faculty: '#10B981', Students: '#3B82F6'
}

const BULK_TEMPLATES = ['Tuition Reminder', 'Faculty Handbook', 'Campus Alert']

export default function MessagingPage() {
  const [activeMsg, setActiveMsg] = useState(MOCK_MESSAGE)
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'drafts'>('inbox')

  return (
    <AppLayout>
      {/* Tri-pane layout */}
      <div className="flex h-screen overflow-hidden" style={{ fontFamily: '"Palatino Linotype", Palatino, serif' }}>
        {/* Left: Folders */}
        <div className="w-56 flex-shrink-0 border-r flex flex-col" style={{ borderColor: '#E4E1D8', background: 'white' }}>
          {/* Search */}
          <div className="p-3 border-b" style={{ borderColor: '#E4E1D8' }}>
            <input placeholder="Search messages…" className="input text-xs py-2" />
          </div>

          {/* Compose */}
          <div className="p-3">
            <button className="btn-gold w-full flex items-center justify-center gap-2">
              <Pencil size={14} /> Compose
            </button>
          </div>

          {/* Folders */}
          <nav className="flex-1 px-2 space-y-0.5">
            {[
              { id: 'inbox', label: 'Inbox', icon: Inbox, count: 12 },
              { id: 'sent', label: 'Sent', icon: Send },
              { id: 'drafts', label: 'Drafts', icon: FileText, count: 4 },
              { id: 'bulk', label: 'Bulk Email', icon: Users },
            ].map(item => (
              <button key={item.id} onClick={() => setFolder(item.id as 'inbox' | 'sent' | 'drafts')}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all"
                      style={{
                        background: folder === item.id ? 'rgba(201,160,32,0.08)' : 'transparent',
                        color: folder === item.id ? '#C9A020' : '#0D0D0D',
                      }}>
                <div className="flex items-center gap-2.5">
                  <item.icon size={15} />
                  {item.label}
                </div>
                {item.count && (
                  <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                        style={{ background: '#C9A020' }}>{item.count}</span>
                )}
              </button>
            ))}

            <div className="pt-3">
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: '#A09080' }}>Labels</p>
              {LABELS.map(l => (
                <div key={l} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: labelColors[l] }} />
                  <span className="text-sm">{l}</span>
                </div>
              ))}
            </div>
          </nav>

          {/* Bottom */}
          <div className="p-3 border-t" style={{ borderColor: '#E4E1D8' }}>
            <div className="flex items-center gap-3">
              <Bell size={16} style={{ color: '#6B6660' }} />
              <Mail size={16} style={{ color: '#6B6660' }} />
              <Calendar size={16} style={{ color: '#6B6660' }} />
              <div className="ml-auto flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                     style={{ background: '#C9A020' }}>AD</div>
                <span className="text-sm font-medium">Profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Message List */}
        <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ borderColor: '#E4E1D8', background: '#F7F6F3' }}>
          <div className="flex items-center justify-between px-4 py-3.5 border-b bg-white" style={{ borderColor: '#E4E1D8' }}>
            <h2 className="font-bold">Inbox</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MOCK_INBOX.map(msg => (
              <div key={msg.id} onClick={() => {}}
                   className="px-4 py-3.5 border-b cursor-pointer transition-colors hover:bg-white"
                   style={{
                     borderColor: '#E4E1D8',
                     background: msg.id === activeMsg.id ? 'white' : 'transparent',
                     borderLeft: msg.id === activeMsg.id ? `3px solid #C9A020` : '3px solid transparent',
                   }}>
                <div className="flex justify-between mb-1">
                  <p className="font-semibold text-sm truncate">{msg.sender}</p>
                  <span className="text-xs flex-shrink-0 ml-2" style={{ color: msg.read ? '#A09080' : '#C9A020' }}>{msg.time}</span>
                </div>
                <p className="text-sm font-medium truncate" style={{ color: '#0D0D0D' }}>{msg.subject}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: '#6B6660' }}>{msg.preview}</p>
                {msg.label && (
                  <div className="mt-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${labelColors[msg.label]}18`, color: labelColors[msg.label] }}>
                      {msg.label}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Message Detail */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Actions bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: '#E4E1D8' }}>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Trash2 size={15} style={{ color: '#6B6660' }} /></button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><CheckCircle size={15} style={{ color: '#6B6660' }} /></button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><User size={15} style={{ color: '#6B6660' }} /></button>
            <button className="btn-outline text-sm px-4 py-1.5 flex items-center gap-1.5">
              <Reply size={14} /> Reply
            </button>
            <button className="btn-outline text-sm px-4 py-1.5 flex items-center gap-1.5">
              <Forward size={14} /> Forward
            </button>
          </div>

          {/* Message Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl font-bold mb-5">{activeMsg.subject}</h1>
            <div className="flex items-start gap-3 mb-6 pb-5 border-b" style={{ borderColor: '#E4E1D8' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                   style={{ background: '#C9A020' }}>
                {getInitials(activeMsg.sender)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{activeMsg.sender}</p>
                <p className="text-sm" style={{ color: '#6B6660' }}>&lt;{activeMsg.senderEmail}&gt;</p>
                <p className="text-sm" style={{ color: '#6B6660' }}>To: {activeMsg.to}</p>
              </div>
              <span className="text-sm" style={{ color: '#A09080' }}>{activeMsg.date}</span>
            </div>
            <div className="prose prose-sm max-w-none">
              {activeMsg.body.split('\n').map((line, i) => (
                <p key={i} className={`text-sm leading-relaxed ${line === '' ? 'h-2' : ''}`}
                   style={{ color: line.startsWith('•') ? '#0D0D0D' : '#374151' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Far Right: Bulk Templates */}
        <div className="w-48 flex-shrink-0 border-l p-4 bg-white" style={{ borderColor: '#E4E1D8' }}>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6660' }}>Bulk Templates</h3>
          <div className="space-y-2">
            {BULK_TEMPLATES.map(t => (
              <div key={t} className="rounded-lg p-3 cursor-pointer hover:border-gold transition-colors"
                   style={{ background: '#F7F6F3', border: '1px solid #E4E1D8' }}>
                <p className="text-xs font-semibold mb-1">{t}</p>
                <div className="h-8 rounded" style={{ background: '#E4E1D8' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
