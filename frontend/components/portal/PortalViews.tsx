'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AlertCircle, Award, Bell, BookMarked, BookOpen, CalendarDays, CheckCircle2, ClipboardList, Clock, Download, Printer, Target, TrendingUp, UserRound } from 'lucide-react'
import type { FeeItem } from '@/components/payment/PayStackModal'
import { mockData, getGrade, GOLD, BORDER, BLUE, GREEN, RED } from './portalData'
import { Avatar, Card, CardLabel, GoldBadge, StatCard } from './portalUi'
import { RoleType } from './portalTypes'

const PayStackModal = dynamic(() => import('@/components/payment/PayStackModal'), { ssr: false })

export function Dashboard({ role }: { role: RoleType }) {
  const d = mockData.student
  const [showTeacherContact, setShowTeacherContact] = useState(false)
  const totalFeesDue = d.fees.structure.reduce((sum, fee) => sum + fee.amount, 0)
  const avgAtt = Math.round(
    d.attendance.reduce((sum, item) => sum + (item.present / item.total) * 100, 0) / d.attendance.length,
  )

  return (
    <div>
      <div className='portal-dashboard-top-grid' style={{ display: 'grid', gap: 16, alignItems: 'start', marginBottom: 24 }}>
        <div>
        <p style={{ margin: 0, fontSize: 11, color: '#9B9590', letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
          {mockData.term} · {mockData.session}
        </p>
        <h2 style={{ margin: '4px 0 10px', fontSize: 26, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>
          {role === 'parent' ? `Viewing: ${d.name}` : `Welcome, ${d.name.split(' ')[0]}`}
        </h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <GoldBadge>{d.class}</GoldBadge>
          <GoldBadge>{d.level}</GoldBadge>
          <GoldBadge color='#9B9590'>Form Teacher: {d.formTeacher}</GoldBadge>
          <GoldBadge color={BLUE}>{d.house}</GoldBadge>
        </div>
        </div>
        <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 14, boxShadow: '0 10px 26px rgba(13,13,13,0.08)' }}>
          <button
            type='button'
            onClick={() => setShowTeacherContact((value) => !value)}
            style={{ width: '100%', background: '#0D0D0D', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: GOLD, color: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontFamily: "'Georgia',serif" }}>MA</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, color: GOLD, fontSize: 10, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace' }}>Class Teacher Contact</p>
              <p style={{ margin: '3px 0 0', color: '#FFFFFF', fontSize: 16, fontWeight: 800 }}>Mrs. Adeyemi</p>
              <p style={{ margin: 0, color: '#D7D2CB', fontSize: 11 }}>SS2A Form Teacher</p>
            </div>
            <span style={{ color: GOLD, fontSize: 18, fontWeight: 900, transform: showTeacherContact ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>⌄</span>
          </button>
          {showTeacherContact && (
            <div style={{ padding: 16, display: 'grid', gap: 9, background: '#FFFFFF' }}>
              {[
                ['Email', 'adeyemi.t@edumanage.sch'],
                ['Phone', '+234 802 345 6789'],
                ['Office', 'Staff Wing, Room 204'],
                ['Consultation', 'Wed 2pm - 4pm'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '86px 1fr', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ color: '#9B9590', fontSize: 10, fontWeight: 900, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</span>
                  <span style={{ color: '#0D0D0D', fontSize: 12, fontWeight: 650, lineHeight: 1.35, minWidth: 0 }}>{value}</span>
                </div>
              ))}
              <div style={{ marginTop: 3, borderTop: `1px solid ${BORDER}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#5C5750', fontSize: 11 }}>Available for academic guidance</span>
                <span style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}33`, borderRadius: 999, padding: '4px 8px', fontSize: 10, fontWeight: 900 }}>Active</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <style jsx>{`
        .portal-dashboard-top-grid {
          grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
        }

        @media (max-width: 900px) {
          .portal-dashboard-top-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard label='Fees Balance' value={`₦${(totalFeesDue / 1000).toFixed(0)}k`} sub='This term outstanding' color={RED} />
        <StatCard label='Avg CA Score' value='72%' sub='2nd Term CAs' color={GOLD} />
        <StatCard label='Attendance' value={`${avgAtt}%`} sub='This term' color={GREEN} />
        <StatCard label='Class Position' value={`${d.reportCard.position}th`} sub={`of ${d.reportCard.classSize} students`} color={BLUE} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardLabel>Today's Timetable</CardLabel>
          {d.timetable.slice(0, 4).map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: index < 3 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: '#C9A02020', border: `1px solid #C9A02033`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 8, color: '#C9A020', fontFamily: 'monospace', lineHeight: 1 }}>{item.day}</span>
                <span style={{ fontSize: 10, color: '#0D0D0D', fontFamily: 'monospace', fontWeight: 700, lineHeight: 1.4 }}>{item.time.split(' ')[0]}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#0D0D0D', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subject}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#9B9590' }}>{item.teacher} · {item.room}</p>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <CardLabel>2nd Term CA Scores</CardLabel>
          {d.subjects.slice(0, 5).map((subject, index) => {
            const total = subject.ca1 + subject.ca2
            const pct = Math.round((total / 40) * 100)
            const grade = getGrade(pct)
            return (
              <div key={index} style={{ padding: '7px 0', borderBottom: index < 4 ? `1px solid ${BORDER}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#0D0D0D', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.name}</p>
                  <span style={{ fontSize: 12, color: grade.color, fontWeight: 700, marginLeft: 8, fontFamily: 'monospace' }}>{total}/40 <span style={{ fontSize: 10 }}>{grade.grade}</span></span>
                </div>
                <div style={{ height: 4, background: BORDER, borderRadius: 2 }}>
                  <div style={{ height: 4, borderRadius: 2, width: `${pct}%`, background: grade.color }} />
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}

export function Subjects() {
  const subjects = mockData.student.subjects
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>Subjects & Scores</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>{mockData.term} · {mockData.session} · {mockData.student.class}</p>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <CardLabel>Score Breakdown — All Subjects</CardLabel>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${BORDER}`, background: '#FAFAF8' }}>
                {['Subject', 'Teacher', 'CA1 /20', 'CA2 /20', 'Mid-Term /40', 'Exam /100', 'Total /100', 'Grade'].map((header) => (
                  <th key={header} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, color: '#9B9590', fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => {
                const caTotal = subject.ca1 + subject.ca2
                const composite = Math.round(((caTotal / 40) + (subject.midterm / 40)) * 50)
                const grade = getGrade(composite)
                return (
                  <tr key={index} style={{ borderBottom: `1px solid ${BORDER}`, background: index % 2 === 0 ? '#FAFAF8' : '#FFFFFF' }}>
                    <td style={{ padding: '10px 10px', fontWeight: 600, color: '#0D0D0D' }}>{subject.name}</td>
                    <td style={{ padding: '10px 10px', color: '#9B9590', fontSize: 12 }}>{subject.teacher}</td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', textAlign: 'center', color: '#0D0D0D' }}>{subject.ca1}</td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', textAlign: 'center', color: '#0D0D0D' }}>{subject.ca2}</td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', textAlign: 'center', color: '#0D0D0D' }}>{subject.midterm}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'center', color: '#9B9590', fontSize: 12 }}>Pending</td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', textAlign: 'center', fontWeight: 700, color: grade.color }}>{composite}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                      <span style={{ background: `${grade.color}18`, color: grade.color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `1px solid ${grade.color}33` }}>{grade.grade}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <CardLabel>Nigerian Grading Scale (WAEC / NECO)</CardLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { range: '75–100', grade: 'A1', color: GOLD },
            { range: '70–74', grade: 'B2', color: GREEN },
            { range: '65–69', grade: 'B3', color: GREEN },
            { range: '60–64', grade: 'C4', color: BLUE },
            { range: '55–59', grade: 'C5', color: BLUE },
            { range: '50–54', grade: 'C6', color: BLUE },
            { range: '45–49', grade: 'D7', color: '#E8A020' },
            { range: '40–44', grade: 'E8', color: '#E8A020' },
            { range: '0–39', grade: 'F9', color: RED },
          ].map((item, index) => (
            <div key={index} style={{ background: `${item.color}12`, border: `1px solid ${item.color}33`, borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>{item.grade}</p>
              <p style={{ margin: '1px 0 0', fontSize: 10, color: '#9B9590' }}>{item.range}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function Fees() {
  const fees = mockData.student.fees
  const feeItems: FeeItem[] = fees.structure.map((fee, index) => ({ id: index + 1, ...fee }))
  const [selectedFeeIds, setSelectedFeeIds] = useState<number[]>(feeItems.map((fee) => fee.id))
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [paymentNotice, setPaymentNotice] = useState('')
  const [paymentHistory, setPaymentHistory] = useState(fees.history)
  const [currentTermPaid, setCurrentTermPaid] = useState(50000)
  const totalDue = feeItems.reduce((sum, fee) => sum + fee.amount, 0)
  const totalPaid = paymentHistory.reduce((sum, fee) => sum + fee.amount, 0)
  const balance = Math.max(totalDue - currentTermPaid, 0)
  const selectedFees = feeItems.filter((fee) => selectedFeeIds.includes(fee.id))
  const selectedTotal = selectedFees.reduce((sum, fee) => sum + fee.amount, 0)

  const toggleFee = (id: number) => {
    setSelectedFeeIds((current) => (current.includes(id) ? current.filter((feeId) => feeId !== id) : [...current, id]))
  }

  const handlePaymentSuccess = (reference: string) => {
    const amountPaid = selectedTotal
    setPaymentHistory((current) => [
      {
        date: new Date().toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
        desc: `${mockData.term} Fees Payment`,
        amount: amountPaid,
        method: 'PayStack',
        ref: reference,
      },
      ...current,
    ])
    setCurrentTermPaid((current) => Math.min(current + amountPaid, totalDue))
    setSelectedFeeIds([])
    setPaymentNotice(`Payment successful. Reference: ${reference}`)
  }

  const handlePaymentError = (error: string) => {
    setPaymentNotice(error)
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>School Fees</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>{mockData.term} / {mockData.session} / {mockData.student.class}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard label='Total Due' value={`NGN ${(totalDue / 1000).toFixed(0)}k`} sub='This term' color={RED} />
        <StatCard label='Amount Paid' value={`NGN ${(totalPaid / 1000).toFixed(0)}k`} sub='All payments' color={GREEN} />
        <StatCard label='Balance' value={`NGN ${(balance / 1000).toFixed(0)}k`} sub='Outstanding' color={GOLD} />
      </div>
      {balance > 0 && (
        <div style={{ background: `${RED}10`, border: `1px solid ${RED}44`, borderRadius: 10, padding: '12px 18px', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: RED, fontWeight: 600 }}>Outstanding balance of NGN {balance.toLocaleString()} - Please complete payment to avoid disruption to academic activities.</p>
        </div>
      )}
      {paymentNotice && (
        <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}44`, borderRadius: 10, padding: '12px 18px', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#5C5750', fontWeight: 600 }}>{paymentNotice}</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <CardLabel>Fee Structure - {mockData.term}</CardLabel>
            <button
              onClick={() => setIsPaymentOpen(true)}
              disabled={selectedFees.length === 0 || selectedTotal <= 0 || balance <= 0}
              style={{
                background: selectedFees.length === 0 || selectedTotal <= 0 || balance <= 0 ? '#E8E4DC' : GOLD,
                border: 'none',
                color: '#0D0D0D',
                fontSize: 12,
                padding: '8px 16px',
                borderRadius: 7,
                cursor: selectedFees.length === 0 || selectedTotal <= 0 || balance <= 0 ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              Pay Now
            </button>
          </div>
          {feeItems.map((fee, index) => (
            <div key={fee.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: index < feeItems.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0, fontSize: 13, color: '#0D0D0D', cursor: 'pointer' }}>
                <input
                  type='checkbox'
                  checked={selectedFeeIds.includes(fee.id)}
                  onChange={() => toggleFee(fee.id)}
                  disabled={balance <= 0}
                  style={{ accentColor: GOLD, width: 15, height: 15 }}
                />
                {fee.label}
              </label>
              <p style={{ margin: 0, fontSize: 13, color: '#0D0D0D', fontFamily: 'monospace', fontWeight: 600 }}>NGN {fee.amount.toLocaleString()}</p>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: `2px solid ${GOLD}55`, marginTop: 4 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0D0D0D' }}>Selected Total</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#C9A020', fontFamily: 'monospace' }}>NGN {selectedTotal.toLocaleString()}</p>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <CardLabel>Payment History</CardLabel>
            <button style={{ background: 'transparent', border: `1px solid ${GOLD}66`, color: GOLD, fontSize: 11, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Download</button>
          </div>
          {paymentHistory.map((item, index) => (
            <div key={index} style={{ padding: '10px 0', borderBottom: index < paymentHistory.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 13, color: '#0D0D0D', fontWeight: 500 }}>{item.desc}</p>
                  <p style={{ margin: '0 0 1px', fontSize: 11, color: '#9B9590' }}>{item.date} / {item.method}</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#9B9590', fontFamily: 'monospace' }}>{item.ref}</p>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: GREEN, fontFamily: 'monospace', fontWeight: 700 }}>NGN {item.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <PayStackModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        selectedFees={selectedFees}
        totalAmount={selectedTotal}
        studentName={mockData.student.name}
        studentEmail='parent.okafor@example.com'
        studentId={mockData.student.id}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  )
}
export function Attendance() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const att = mockData.student.attendance
  const totalPresent = att.reduce((sum, item) => sum + item.present, 0)
  const totalAbsent = att.reduce((sum, item) => sum + item.absent, 0)
  const totalLate = att.reduce((sum, item) => sum + item.late, 0)
  const overall = Math.round((totalPresent / att.reduce((sum, item) => sum + item.total, 0)) * 100)
  const calDays = Array.from({ length: 31 }, (_, index) => {
    if ([0, 6].includes(index % 7)) return 'weekend'
    const random = Math.random()
    return random > 0.88 ? 'absent' : random > 0.76 ? 'late' : 'present'
  })

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>Attendance Record</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>{mockData.term} · {mockData.session}</p>
      </div>
      {overall < 75 && (
        <div style={{ background: `${RED}10`, border: `1px solid ${RED}44`, borderRadius: 10, padding: '12px 18px', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: RED, fontWeight: 600 }}>⚠️ Attendance below 75% minimum. Students below this threshold may be barred from sitting examinations.</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label='Overall' value={`${overall}%`} sub='Attendance rate' color={overall >= 75 ? GOLD : RED} />
        <StatCard label='Present' value={`${totalPresent}`} sub='Days attended' color={GREEN} />
        <StatCard label='Absent' value={`${totalAbsent}`} sub='Days missed' color={RED} />
        <StatCard label='Late' value={`${totalLate}`} sub='Late arrivals' color='#E8A020' />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['list', 'calendar'].map((item) => (
          <button
            key={item}
            onClick={() => setView(item as 'list' | 'calendar')}
            style={{
              padding: '7px 18px',
              borderRadius: 7,
              background: view === item ? GOLD : '#FFFFFF',
              border: `1px solid ${view === item ? GOLD : BORDER}`,
              color: view === item ? '#0D0D0D' : '#5C5750',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {item === 'list' ? 'By Subject' : 'Calendar View'}
          </button>
        ))}
      </div>
      {view === 'list' ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {att.map((item, index) => {
            const pct = Math.round((item.present / item.total) * 100)
            return (
              <Card key={index} style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{item.subject}</p>
                  <span style={{ fontSize: 14, fontWeight: 700, color: pct >= 75 ? GREEN : RED, fontFamily: 'monospace' }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: BORDER, borderRadius: 3, marginBottom: 8 }}>
                  <div style={{ height: 5, borderRadius: 3, width: `${pct}%`, background: pct >= 75 ? GREEN : RED }} />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: 12, color: GREEN }}>● Present: {item.present}</span>
                  <span style={{ fontSize: 12, color: RED }}>● Absent: {item.absent}</span>
                  <span style={{ fontSize: 12, color: '#E8A020' }}>● Late: {item.late}</span>
                  <span style={{ fontSize: 12, color: '#9B9590' }}>Total: {item.total} days</span>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardLabel>February 2026 — School Calendar</CardLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => (
              <p key={day} style={{ margin: '0 0 6px', fontSize: 10, color: '#9B9590', textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>{day}</p>
            ))}
            {calDays.map((status, index) => (
              <div
                key={index}
                style={{
                  height: 34,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  background: status === 'weekend' ? '#F0EFE8' : status === 'present' ? `${GREEN}18` : status === 'absent' ? `${RED}18` : '#E8A02018',
                  border: `1px solid ${status === 'weekend' ? BORDER : status === 'present' ? GREEN + '44' : status === 'absent' ? RED + '44' : '#E8A02044'}`,
                  color: status === 'weekend' ? '#9B9590' : status === 'present' ? GREEN : status === 'absent' ? RED : '#E8A020',
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
            <span style={{ fontSize: 11, color: GREEN }}>■ Present</span>
            <span style={{ fontSize: 11, color: RED }}>■ Absent</span>
            <span style={{ fontSize: 11, color: '#E8A020' }}>■ Late</span>
            <span style={{ fontSize: 11, color: '#9B9590' }}>■ Weekend</span>
          </div>
        </Card>
      )}
    </div>
  )
}

function StudentFocusedResultCard() {
  const d = mockData.student
  const rc = d.reportCard
  const resultRows = d.subjects.map((subject) => {
    const caTotal = subject.ca1 + subject.ca2
    const score = Math.round(((caTotal + subject.midterm) / 80) * 100)
    const grade = getGrade(score)
    return {
      ...subject,
      caTotal,
      score,
      grade,
      focus: score >= 75 ? 'Keep stretching' : score >= 60 ? 'Practice corrections' : 'Ask for support',
    }
  })
  const averageScore = Math.round(resultRows.reduce((sum, row) => sum + row.score, 0) / resultRows.length)
  const strongestSubject = resultRows.reduce((best, row) => (row.score > best.score ? row : best), resultRows[0])
  const focusSubject = resultRows.reduce((lowest, row) => (row.score < lowest.score ? row : lowest), resultRows[0])
  const overallGrade = getGrade(averageScore)
  const totalScore = resultRows.reduce((sum, row) => sum + row.score, 0)
  const maxScore = resultRows.length * 100

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>My Result</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>{mockData.term} / {mockData.session} / {d.class}</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#5C5750', lineHeight: 1.55 }}>A clear view of your scores, strengths, and the next subjects to focus on.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: `1px solid ${BORDER}`, color: '#0D0D0D', fontSize: 12, padding: '8px 14px', borderRadius: 7, cursor: 'pointer', fontWeight: 700 }}>
            <Download size={14} /> Save PDF
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#C9A020', border: 'none', color: '#0D0D0D', fontSize: 12, padding: '8px 14px', borderRadius: 7, cursor: 'pointer', fontWeight: 700 }}>
            <Printer size={14} /> Print
          </button>
        </div>

        <Card style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}33`, borderRadius: 16, boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)' }}>
          <p style={{ margin: '0 0 8px', color: GOLD, fontSize: 11, fontWeight: 900, letterSpacing: 0.8, textTransform: 'uppercase' }}>Class Teacher Contact</p>
          <p style={{ margin: 0, color: '#0D0D0D', fontSize: 16, fontWeight: 800 }}>Mrs. Adeyemi</p>
          <p style={{ margin: '4px 0 12px', color: '#5C5750', fontSize: 12 }}>SS2A Form Teacher</p>
          <div style={{ display: 'grid', gap: 7, color: '#5C5750', fontSize: 12, lineHeight: 1.45 }}>
            <span><strong style={{ color: '#0D0D0D' }}>Email:</strong> adeyemi.t@edumanage.sch</span>
            <span><strong style={{ color: '#0D0D0D' }}>Phone:</strong> +234 802 345 6789</span>
            <span><strong style={{ color: '#0D0D0D' }}>Office:</strong> Staff Wing, Room 204</span>
            <span><strong style={{ color: '#0D0D0D' }}>Consultation:</strong> Wed 2pm - 4pm</span>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .portal-dashboard-top-grid {
          grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
        }

        @media (max-width: 900px) {
          .portal-dashboard-top-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Card style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        <div style={{ background: '#0D0D0D', padding: 22, color: '#FFFFFF', display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
            <Avatar initials={d.avatar} size={62} />
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 11, color: '#C9A020', letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}>Student Result Card</p>
              <h3 style={{ margin: '6px 0 8px', fontSize: 25, color: '#FFFFFF', fontFamily: "'Georgia',serif", fontWeight: 400, lineHeight: 1.15 }}>{d.name}</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <GoldBadge>{d.class}</GoldBadge>
                <GoldBadge color='#D7D2CB'>{d.id}</GoldBadge>
                <GoldBadge color={BLUE}>{mockData.schoolName}</GoldBadge>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(92px,1fr))', gap: 10, minWidth: 210 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: 12 }}>
              <p style={{ margin: 0, color: '#C9A020', fontSize: 24, fontWeight: 800, fontFamily: "'Georgia',serif" }}>{averageScore}%</p>
              <p style={{ margin: '2px 0 0', color: '#D7D2CB', fontSize: 11 }}>Average score</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: 12 }}>
              <p style={{ margin: 0, color: overallGrade.color, fontSize: 24, fontWeight: 800, fontFamily: "'Georgia',serif" }}>{overallGrade.grade}</p>
              <p style={{ margin: '2px 0 0', color: '#D7D2CB', fontSize: 11 }}>{overallGrade.label}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 18 }}>
            <StatCard label='Total Score' value={`${totalScore}/${maxScore}`} sub='Across all subjects' color={GOLD} />
            <StatCard label='Class Position' value={`${rc.position}th`} sub={`Improved from ${rc.prevPosition}th`} color={BLUE} />
            <StatCard label='Strongest' value={strongestSubject.grade.grade} sub={strongestSubject.name} color={GREEN} />
            <StatCard label='Next Focus' value={focusSubject.grade.grade} sub={focusSubject.name} color={RED} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, alignItems: 'start', marginBottom: 18 }}>
            <div>
              <CardLabel>Subject Results</CardLabel>
              <div style={{ overflowX: 'auto', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${BORDER}`, background: '#FAFAF8' }}>
                      {['Subject', 'Teacher', 'CA /40', 'Mid-Term /40', 'Result /100', 'Grade', 'Student Focus'].map((header) => (
                        <th key={header} style={{ padding: '9px 10px', textAlign: 'left', fontSize: 10, color: '#9B9590', fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultRows.map((subject, index) => (
                      <tr key={subject.name} style={{ borderBottom: index < resultRows.length - 1 ? `1px solid ${BORDER}` : 'none', background: index % 2 === 0 ? '#FAFAF8' : '#FFFFFF' }}>
                        <td style={{ padding: '10px', fontWeight: 700, color: '#0D0D0D' }}>{subject.name}</td>
                        <td style={{ padding: '10px', color: '#5C5750', fontSize: 12 }}>{subject.teacher}</td>
                        <td style={{ padding: '10px', fontFamily: 'monospace', textAlign: 'center' }}>{subject.caTotal}</td>
                        <td style={{ padding: '10px', fontFamily: 'monospace', textAlign: 'center' }}>{subject.midterm}</td>
                        <td style={{ padding: '10px', fontFamily: 'monospace', textAlign: 'center', fontWeight: 800, color: subject.grade.color }}>{subject.score}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <span style={{ background: `${subject.grade.color}18`, color: subject.grade.color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `1px solid ${subject.grade.color}33` }}>{subject.grade.grade}</span>
                        </td>
                        <td style={{ padding: '10px', fontSize: 12, color: subject.grade.color, fontWeight: 700 }}>{subject.focus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ border: `1px solid ${GREEN}33`, background: `${GREEN}10`, borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                  <Award size={17} color={GREEN} />
                  <p style={{ margin: 0, fontSize: 12, color: GREEN, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Celebrate this</p>
                </div>
                <p style={{ margin: 0, color: '#0D0D0D', fontSize: 14, fontWeight: 700 }}>{strongestSubject.name}</p>
                <p style={{ margin: '5px 0 0', color: '#5C5750', fontSize: 13, lineHeight: 1.55 }}>Your strongest score is {strongestSubject.score}%. Keep using the study habits that worked here.</p>
              </div>
              <div style={{ border: `1px solid ${RED}33`, background: `${RED}10`, borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                  <Target size={17} color={RED} />
                  <p style={{ margin: 0, fontSize: 12, color: RED, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Focus next</p>
                </div>
                <p style={{ margin: 0, color: '#0D0D0D', fontSize: 14, fontWeight: 700 }}>{focusSubject.name}</p>
                <p style={{ margin: '5px 0 0', color: '#5C5750', fontSize: 13, lineHeight: 1.55 }}>Review corrections with {focusSubject.teacher} and set one practice session before the next assessment.</p>
              </div>
              <div style={{ border: `1px solid ${BLUE}33`, background: `${BLUE}10`, borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                  <TrendingUp size={17} color={BLUE} />
                  <p style={{ margin: 0, fontSize: 12, color: BLUE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Momentum</p>
                </div>
                <p style={{ margin: 0, color: '#5C5750', fontSize: 13, lineHeight: 1.55 }}>You moved from {rc.prevPosition}th to {rc.position}th in a class of {rc.classSize}. Aim for one more place next term.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card>
          <CardLabel>Form Teacher's Remark</CardLabel>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: '#0D0D0D', lineHeight: 1.7, fontStyle: 'italic' }}>&quot;{rc.formTeacherRemark}&quot;</p>
          <p style={{ margin: 0, fontSize: 12, color: GOLD, fontWeight: 600 }}>{d.formTeacher}</p>
        </Card>
        <Card>
          <CardLabel>Principal's Remark</CardLabel>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: '#0D0D0D', lineHeight: 1.7, fontStyle: 'italic' }}>&quot;{rc.principalRemark}&quot;</p>
          <p style={{ margin: 0, fontSize: 12, color: GOLD, fontWeight: 600 }}>Mr. Babatunde Afolabi, Principal</p>
        </Card>
      </div>
    </div>
  )
}

export function ReportCard() {
  const d = mockData.student
  const rc = d.reportCard
  const termResults = [
    {
      id: '2025-2026-2nd',
      term: '2nd Term',
      session: '2025/2026',
      className: 'SS2A',
      label: '2nd Term 2025/2026',
      scoreAdjust: 0,
      position: rc.position,
      attendance: '95%',
      issueDate: '15 May 2026',
      remark: rc.formTeacherRemark,
    },
    {
      id: '2025-2026-1st',
      term: '1st Term',
      session: '2025/2026',
      className: 'SS2A',
      label: '1st Term 2025/2026',
      scoreAdjust: -4,
      position: rc.prevPosition,
      attendance: '92%',
      issueDate: '18 Dec 2025',
      remark: 'Chidinma performed well and showed steady improvement across core subjects.',
    },
    {
      id: '2024-2025-3rd',
      term: '3rd Term',
      session: '2024/2025',
      className: 'SS1A',
      label: '3rd Term 2024/2025',
      scoreAdjust: -7,
      position: 7,
      attendance: '90%',
      issueDate: '22 Jul 2025',
      remark: 'A good performance. More consistent revision will help strengthen exam confidence.',
    },
  ]
  const [selectedResultId, setSelectedResultId] = useState(termResults[0].id)
  const [classQuery, setClassQuery] = useState(termResults[0].className)
  const [termQuery, setTermQuery] = useState(termResults[0].term)
  const [queriedResultId, setQueriedResultId] = useState<string | null>(null)
  const classOptions = Array.from(new Set(termResults.map((result) => result.className)))
  const termOptions = Array.from(new Set(termResults.map((result) => result.term)))
  const filteredResults = termResults.filter((result) => {
    const classMatch = !classQuery || result.className === classQuery
    const termMatch = !termQuery || result.term === termQuery
    return classMatch && termMatch
  })
  const selectedResult = termResults.find((result) => result.id === selectedResultId) || termResults[0]
  const displayedResult = queriedResultId ? termResults.find((result) => result.id === queriedResultId) || null : null
  const reportResult = displayedResult || selectedResult
  const subjects = d.subjects.map((subject) => {
    const baseScore = Math.round(((subject.ca1 + subject.ca2 + subject.midterm) / 80) * 100)
    const obtained = Math.max(0, Math.min(100, baseScore + reportResult.scoreAdjust))
    const grade = getGrade(obtained)
    return {
      name: subject.name,
      maxMarks: 100,
      obtained,
      grade: grade.grade,
      remarks: grade.label,
      color: grade.color,
    }
  })
  const totalMax = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0)
  const totalObtained = subjects.reduce((sum, subject) => sum + subject.obtained, 0)
  const percentage = ((totalObtained / totalMax) * 100).toFixed(1)
  const overallGrade = getGrade(Number(percentage))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>Student Report Card</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>Search by class and term to display an official academic report.</p>
        </div>
        {displayedResult && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: `1px solid ${BORDER}`, color: '#0D0D0D', fontSize: 12, padding: '8px 14px', borderRadius: 7, cursor: 'pointer', fontWeight: 700 }}>
            <Download size={14} /> Export PDF
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#0D0D0D', border: 'none', color: '#FFFFFF', fontSize: 12, padding: '8px 14px', borderRadius: 7, cursor: 'pointer', fontWeight: 700 }}>
            <Printer size={14} /> Print Report Card
          </button>
        </div>}
      </div>

      <Card style={{ marginBottom: 18 }}>
        <CardLabel>Query Term Result</CardLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, alignItems: 'end' }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: '#5C5750', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Class</span>
            <select
              value={classQuery}
              onChange={(event) => {
                setClassQuery(event.target.value)
                setQueriedResultId(null)
              }}
              style={{ width: '100%', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', color: '#0D0D0D', fontSize: 13, background: '#FFFFFF', outlineColor: GOLD }}
            >
              <option value=''>All Classes</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: '#5C5750', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Term</span>
            <select
              value={termQuery}
              onChange={(event) => {
                setTermQuery(event.target.value)
                setQueriedResultId(null)
              }}
              style={{ width: '100%', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', color: '#0D0D0D', fontSize: 13, background: '#FFFFFF', outlineColor: GOLD }}
            >
              <option value=''>All Terms</option>
              {termOptions.map((term) => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: '#5C5750', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Matching Result</span>
            <select
              value={selectedResultId}
              onChange={(event) => {
                setSelectedResultId(event.target.value)
                setQueriedResultId(null)
              }}
              style={{ width: '100%', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', color: '#0D0D0D', fontSize: 13, background: '#FFFFFF', outlineColor: GOLD }}
            >
              {termResults.map((result) => (
                <option key={result.id} value={result.id}>{result.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {filteredResults.length ? filteredResults.map((result) => (
            <button
              key={result.id}
              type='button'
              onClick={() => {
                setSelectedResultId(result.id)
                setQueriedResultId(null)
              }}
              style={{
                border: `1px solid ${selectedResult.id === result.id ? GOLD : BORDER}`,
                background: selectedResult.id === result.id ? `${GOLD}18` : '#FFFFFF',
                color: selectedResult.id === result.id ? GOLD : '#5C5750',
                borderRadius: 999,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {result.className} / {result.label}
            </button>
          )) : (
            <span style={{ color: RED, fontSize: 12, fontWeight: 700 }}>No result found for this class and term.</span>
          )}
        </div>
        <button
          type='button'
          onClick={() => setQueriedResultId(selectedResultId)}
          disabled={!filteredResults.some((result) => result.id === selectedResultId)}
          style={{
            marginTop: 14,
            border: 'none',
            background: filteredResults.some((result) => result.id === selectedResultId) ? GOLD : '#E8E4DC',
            color: '#0D0D0D',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 900,
            cursor: filteredResults.some((result) => result.id === selectedResultId) ? 'pointer' : 'not-allowed',
          }}
        >
          Query Result
        </button>
      </Card>

      {!displayedResult ? (
        <Card style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', padding: 36 }}>
          <p style={{ margin: 0, color: GOLD, fontSize: 12, fontWeight: 900, letterSpacing: 1.2, textTransform: 'uppercase' }}>Result Hidden</p>
          <h3 style={{ margin: '8px 0 8px', color: '#0D0D0D', fontSize: 22, fontFamily: "'Georgia',serif", fontWeight: 400 }}>Query a class and term to view report card</h3>
          <p style={{ margin: 0, color: '#5C5750', fontSize: 13, lineHeight: 1.6 }}>Select the class, term, and matching result above, then click Query Result.</p>
        </Card>
      ) : (
      <div id='report-card' style={{ background: '#FFFFFF', borderRadius: 12, border: `1px solid ${BORDER}`, maxWidth: 860, margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, paddingBottom: 20, marginBottom: 24, borderBottom: `2px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,160,32,0.15)', border: '2px solid rgba(201,160,32,0.3)' }}>
                <BookOpen size={28} color={GOLD} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#0D0D0D', fontSize: 24, fontWeight: 800 }}>{mockData.schoolName}</h3>
                <p style={{ margin: '4px 0 0', color: GOLD, fontSize: 12, fontWeight: 800, letterSpacing: 2.4, textTransform: 'uppercase' }}>Report Card</p>
                <div style={{ width: 40, height: 2, marginTop: 6, borderRadius: 99, background: GOLD }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', color: '#5C5750', fontSize: 13, lineHeight: 1.8 }}>
              <div>Term: <strong style={{ color: '#0D0D0D' }}>{displayedResult.term}</strong></div>
              <div>Session: <strong style={{ color: '#0D0D0D' }}>{displayedResult.session}</strong></div>
              <div>Class: <strong style={{ color: '#0D0D0D' }}>{displayedResult.className}</strong></div>
            </div>
          </div>

          <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', columnGap: 32, rowGap: 10, fontSize: 13 }}>
              {[
                ['Student Name:', d.name],
                ['Parent Name:', 'Mr. Chukwudi Okafor'],
                ['Roll Number:', 'SS2A-047'],
                ['Contact:', '+234 802 345 6789'],
                ['Admission No:', d.id],
                ['Attendance:', displayedResult.attendance],
                ['Date of Birth:', '12 Aug 2009'],
                ['Class Position:', `${displayedResult.position} of ${rc.classSize}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ width: 112, flexShrink: 0, color: '#9B9590', fontSize: 11, fontWeight: 800, letterSpacing: 0.7, textTransform: 'uppercase' }}>{label}</span>
                  <span style={{ color: '#0D0D0D', fontWeight: label === 'Student Name:' ? 800 : 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24, overflow: 'hidden', borderRadius: 12, border: `1px solid ${BORDER}` }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F7F5F0' }}>
                    {['Subject', 'Max Marks', 'Obtained Marks', 'Grade', 'Remarks'].map((header) => (
                      <th key={header} style={{ padding: '12px 16px', textAlign: header === 'Subject' || header === 'Remarks' ? 'left' : 'center', color: '#9B9590', borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 800, letterSpacing: 0.7, textTransform: 'uppercase' }}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={subject.name} style={{ borderBottom: `1px solid ${BORDER}`, background: index % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                      <td style={{ padding: '12px 16px', color: '#0D0D0D', fontWeight: 700 }}>{subject.name}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#5C5750' }}>{subject.maxMarks}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: GOLD, fontWeight: 800 }}>{subject.obtained}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#0D0D0D', fontWeight: 800 }}>{subject.grade}</td>
                      <td style={{ padding: '12px 16px', color: '#5C5750' }}>{subject.remarks}</td>
                    </tr>
                  ))}
                  <tr style={{ background: GOLD, color: '#FFFFFF' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 900 }}>GRAND TOTAL</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900 }}>{totalMax}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900 }}>{totalObtained}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900 }}>{overallGrade.grade}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 900 }}>PERCENTAGE: {percentage}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ border: `1px solid ${BORDER}`, background: 'rgba(201,160,32,0.04)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <p style={{ margin: '0 0 12px', color: GOLD, fontSize: 12, fontWeight: 900, letterSpacing: 1.3, textTransform: 'uppercase' }}>Grading Scale</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', color: '#5C5750', fontSize: 13 }}>
              {[
                ['A1', '75-100'],
                ['B2', '70-74'],
                ['B3', '65-69'],
                ['C4', '60-64'],
                ['C5', '55-59'],
                ['C6', '50-54'],
                ['D7', '45-49'],
                ['E8', '40-44'],
                ['F9', '< 40'],
              ].map(([grade, range]) => (
                <span key={grade} style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                  <strong style={{ color: grade === 'F9' ? RED : '#0D0D0D' }}>{grade}</strong>
                  {range}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={{ margin: '0 0 8px', color: GOLD, fontSize: 12, fontWeight: 900, letterSpacing: 1.3, textTransform: 'uppercase' }}>Teacher&apos;s Remarks:</p>
            <p style={{ margin: '0 0 24px', color: '#0D0D0D', fontSize: 14, fontStyle: 'italic' }}>{displayedResult.remark}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'end' }}>
              <div style={{ borderTop: `2px solid ${BORDER}`, paddingTop: 8, textAlign: 'center', color: '#9B9590', fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase' }}>Class Teacher</div>
              <div style={{ width: 64, height: 64, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, border: `2px dashed ${GOLD}`, textAlign: 'center', fontSize: 11, lineHeight: 1.2 }}>OFFICIAL<br />SEAL</div>
              <div style={{ borderTop: `2px solid ${BORDER}`, paddingTop: 8, textAlign: 'center', color: '#9B9590', fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase' }}>Principal</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', paddingTop: 16, borderTop: `1px solid ${BORDER}`, color: '#9B9590', fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase' }}>
            <span>Date of Issue: <strong style={{ color: GOLD }}>{displayedResult.issueDate}</strong></span>
            <span style={{ color: GOLD }}>Generated by EduManage</span>
          </div>
        </div>

        <div style={{ padding: '20px 32px', borderTop: `1px solid ${BORDER}`, background: '#F7F5F0' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto', border: 'none', borderRadius: 8, background: '#0D0D0D', color: '#FFFFFF', padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <Printer size={15} /> Print Report Card
          </button>
        </div>
      </div>
      )}
    </div>
  )
}

export function ParentNotifications() {
  const notifications = mockData.parentNotifications
  const highPriority = notifications.filter((item) => item.priority === 'High').length
  const categoryColor: Record<string, string> = {
    Meeting: GOLD,
    Fees: RED,
    Academics: BLUE,
    Attendance: GREEN,
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>Parent Notifications</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>Important school updates for the Okafor family.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12, marginBottom: 18 }}>
        <StatCard label='Unread Alerts' value={`${notifications.length}`} sub='Family inbox' color={GOLD} />
        <StatCard label='Priority' value={`${highPriority}`} sub='Needs attention' color={RED} />
        <StatCard label='Children' value={`${mockData.children.length}`} sub='Linked profiles' color={BLUE} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 16, alignItems: 'start' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', background: '#0D0D0D', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <p style={{ margin: 0, color: '#C9A020', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}>Notification Center</p>
              <p style={{ margin: '4px 0 0', color: '#FFFFFF', fontSize: 18, fontFamily: "'Georgia',serif" }}>Latest from Greenfield Academy</p>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#C9A020', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={20} color='#0D0D0D' />
            </div>
          </div>

          <div style={{ padding: '6px 20px 18px' }}>
            {notifications.map((item, index) => {
              const color = categoryColor[item.category] || GOLD
              return (
                <div key={item.title} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, padding: '16px 0', borderBottom: index < notifications.length - 1 ? `1px solid ${BORDER}` : 'none', alignItems: 'start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}16`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.priority === 'High' ? <AlertCircle size={18} color={color} /> : <CheckCircle2 size={18} color={color} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 5 }}>
                      <p style={{ margin: 0, color: '#0D0D0D', fontSize: 15, fontWeight: 700 }}>{item.title}</p>
                      <GoldBadge color={color}>{item.category}</GoldBadge>
                    </div>
                    <p style={{ margin: '0 0 8px', color: '#5C5750', fontSize: 13, lineHeight: 1.55 }}>{item.message}</p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#9B9590', fontSize: 11 }}>
                        <UserRound size={13} /> {item.child}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#9B9590', fontSize: 11 }}>
                        <Clock size={13} /> {item.time}
                      </span>
                    </div>
                  </div>
                  <GoldBadge color={item.priority === 'High' ? RED : '#9B9590'}>{item.priority}</GoldBadge>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardLabel>Family Snapshot</CardLabel>
          <div style={{ display: 'grid', gap: 12 }}>
            {mockData.children.map((child, index) => (
              <div key={child.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: index < mockData.children.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <Avatar initials={child.avatar} size={38} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, color: '#0D0D0D', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{child.name}</p>
                  <p style={{ margin: '3px 0 0', color: '#9B9590', fontSize: 11 }}>{child.class} / {child.level}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: '#C9A02012', border: '1px solid #C9A02033' }}>
            <p style={{ margin: 0, color: '#8B6E10', fontSize: 13, lineHeight: 1.55, fontWeight: 600 }}>You have {highPriority} priority updates waiting for parent action this week.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function StudentProjects() {
  const projects = mockData.student.projects
  const featured = projects[0]
  const [expandedProject, setExpandedProject] = useState<string | null>(featured.title)
  const [submissionDrafts, setSubmissionDrafts] = useState<Record<string, { note: string; fileName: string }>>({})
  const [submittedProjects, setSubmittedProjects] = useState<Record<string, { note: string; fileName: string; submittedAt: string }>>({})
  const statusColor: Record<string, string> = {
    'In Progress': GOLD,
    'Draft Review': BLUE,
    'Not Started': '#9B9590',
  }

  const updateDraft = (title: string, field: 'note' | 'fileName', value: string) => {
    setSubmissionDrafts((current) => ({
      ...current,
      [title]: {
        note: current[title]?.note || '',
        fileName: current[title]?.fileName || '',
        [field]: value,
      },
    }))
  }

  const submitAssignment = (title: string) => {
    const draft = submissionDrafts[title]
    if (!draft?.note && !draft?.fileName) return

    setSubmittedProjects((current) => ({
      ...current,
      [title]: {
        note: draft.note,
        fileName: draft.fileName || 'No file attached',
        submittedAt: new Date().toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
    }))
    setSubmissionDrafts((current) => ({
      ...current,
      [title]: { note: '', fileName: '' },
    }))
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>Assignments/Projects</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>Assignments and projects from subject teachers for {mockData.student.name}.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
        <Card style={{ background: '#0D0D0D', borderColor: '#222', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -36, top: -36, width: 130, height: 130, borderRadius: '50%', border: '28px solid rgba(201,160,32,0.15)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 26 }}>
              <div>
                <p style={{ margin: 0, color: '#C9A020', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}>Featured Assignment</p>
                <h3 style={{ margin: '8px 0 0', color: '#FFFFFF', fontSize: 25, lineHeight: 1.15, fontFamily: "'Georgia',serif", fontWeight: 400 }}>{featured.title}</h3>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#C9A020', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ClipboardList size={22} color='#0D0D0D' />
              </div>
            </div>
            <p style={{ margin: '0 0 18px', color: '#F5F0E8', fontSize: 13, lineHeight: 1.65 }}>{featured.brief}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <GoldBadge>{featured.subject}</GoldBadge>
              <GoldBadge color={BLUE}>Teacher: {featured.teacher}</GoldBadge>
              <GoldBadge color={GREEN}>Due {featured.dueDate}</GoldBadge>
            </div>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
          <StatCard label='Total Work' value={`${projects.length}`} sub='Assigned this term' color={GOLD} />
          <StatCard label='Teachers' value='3' sub='Giving work' color={BLUE} />
          <StatCard label='Next Due' value='Mar 8' sub={featured.subject} color={RED} />
          <StatCard label='Submitted' value={`${Object.keys(submittedProjects).length}`} sub='Completed uploads' color={GREEN} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
        {projects.map((project) => {
          const color = statusColor[project.status] || GOLD
          const expanded = expandedProject === project.title
          const draft = submissionDrafts[project.title] || { note: '', fileName: '' }
          const submitted = submittedProjects[project.title]
          return (
            <Card key={project.title} style={{ display: 'flex', flexDirection: 'column', minHeight: 278 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}16`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookMarked size={19} color={color} />
                </div>
                <GoldBadge color={submitted ? GREEN : color}>{submitted ? 'Submitted' : project.status}</GoldBadge>
              </div>
              <h3 style={{ margin: 0, color: '#0D0D0D', fontSize: 18, lineHeight: 1.2, fontFamily: "'Georgia',serif", fontWeight: 400 }}>{project.title}</h3>
              <p style={{ margin: '10px 0 16px', color: '#5C5750', fontSize: 13, lineHeight: 1.6, flex: 1 }}>{project.brief}</p>
              <div style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#5C5750', fontSize: 12 }}>
                  <UserRound size={14} color={BLUE} /> {project.teacher}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#5C5750', fontSize: 12 }}>
                  <CalendarDays size={14} color={RED} /> Due {project.dueDate}
                </span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#9B9590', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase' }}>{project.subject}</span>
                  <span style={{ color, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{project.progress}%</span>
                </div>
                <div style={{ height: 7, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${project.progress}%`, height: '100%', background: color, borderRadius: 99 }} />
                </div>
              </div>
              <button
                type='button'
                onClick={() => setExpandedProject(expanded ? null : project.title)}
                style={{
                  marginTop: 14,
                  border: `1px solid ${BLUE}44`,
                  background: expanded ? `${BLUE}14` : '#FFFFFF',
                  color: BLUE,
                  borderRadius: 8,
                  padding: '9px 12px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {expanded ? 'Hide Details' : 'View More'}
              </button>

              {expanded && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}`, display: 'grid', gap: 12 }}>
                  <div style={{ background: '#FAFAF8', border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12 }}>
                    <p style={{ margin: '0 0 6px', color: '#0D0D0D', fontSize: 13, fontWeight: 800 }}>Assignment Details</p>
                    <p style={{ margin: 0, color: '#5C5750', fontSize: 12, lineHeight: 1.6 }}>
                      Submit your completed work before {project.dueDate}. Include your name, class, and subject on the first page. Your teacher will review the upload and update your status.
                    </p>
                  </div>

                  {submitted && (
                    <div style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}33`, borderRadius: 10, padding: 12 }}>
                      <p style={{ margin: 0, color: GREEN, fontSize: 12, fontWeight: 800 }}>Submitted on {submitted.submittedAt}</p>
                      <p style={{ margin: '5px 0 0', color: '#5C5750', fontSize: 12 }}>File: {submitted.fileName}</p>
                      {submitted.note && <p style={{ margin: '5px 0 0', color: '#5C5750', fontSize: 12, lineHeight: 1.5 }}>Note: {submitted.note}</p>}
                    </div>
                  )}

                  <div style={{ display: 'grid', gap: 9 }}>
                    <label style={{ display: 'grid', gap: 5 }}>
                      <span style={{ color: '#5C5750', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Submission Note</span>
                      <textarea
                        value={draft.note}
                        onChange={(event) => updateDraft(project.title, 'note', event.target.value)}
                        placeholder='Add a short note for your teacher...'
                        rows={3}
                        style={{ width: '100%', resize: 'vertical', border: `1px solid ${BORDER}`, borderRadius: 8, padding: 10, color: '#0D0D0D', fontSize: 13, outlineColor: BLUE }}
                      />
                    </label>
                    <label style={{ display: 'grid', gap: 5 }}>
                      <span style={{ color: '#5C5750', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>Attach File</span>
                      <input
                        type='file'
                        onChange={(event) => updateDraft(project.title, 'fileName', event.target.files?.[0]?.name || '')}
                        style={{ width: '100%', border: `1px solid ${BORDER}`, borderRadius: 8, padding: 9, color: '#5C5750', fontSize: 12, background: '#FFFFFF' }}
                      />
                    </label>
                    <button
                      type='button'
                      onClick={() => submitAssignment(project.title)}
                      disabled={!draft.note && !draft.fileName}
                      style={{
                        border: 'none',
                        background: !draft.note && !draft.fileName ? '#E8E4DC' : GOLD,
                        color: '#0D0D0D',
                        borderRadius: 8,
                        padding: '10px 12px',
                        fontSize: 12,
                        fontWeight: 900,
                        cursor: !draft.note && !draft.fileName ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Submit Assignment
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function ParentSwitch({ activeChild, setActiveChild }: { activeChild: number; setActiveChild: (index: number) => void }) {
  const levelColor: Record<string, string> = { 'Senior Secondary': GOLD, 'Junior Secondary': BLUE, 'Primary School': GREEN }
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, color: '#0D0D0D', fontFamily: "'Georgia',serif", fontWeight: 400 }}>My Children</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5C5750' }}>{mockData.schoolName} · {mockData.session}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {mockData.children.map((child, index) => (
          <div
            key={index}
            onClick={() => setActiveChild(index)}
            style={{
              background: '#FFFFFF',
              border: `2px solid ${activeChild === index ? GOLD : BORDER}`,
              borderRadius: 14,
              padding: '22px 18px',
              cursor: 'pointer',
              boxShadow: activeChild === index ? `0 4px 20px ${GOLD}22` : '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'all 0.2s',
            }}
          >
            <Avatar initials={child.avatar} size={48} />
            <p style={{ margin: '12px 0 3px', fontSize: 16, color: '#0D0D0D', fontFamily: "'Georgia',serif" }}>{child.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: '#9B9590', fontFamily: 'monospace' }}>{child.id}</p>
            <GoldBadge color={levelColor[child.level] || GOLD}>{child.class}</GoldBadge>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: '#5C5750' }}>{child.level}</p>
            {activeChild === index && (
              <div style={{ marginTop: 12, padding: '6px 12px', background: `${GOLD}14`, borderRadius: 6, border: `1px solid ${GOLD}44` }}>
                <p style={{ margin: 0, fontSize: 11, color: GOLD, fontWeight: 700 }}>✓ CURRENTLY VIEWING</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <Card>
        <CardLabel>Quick Summary — {mockData.children[activeChild].name}</CardLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          <StatCard label='Class' value={mockData.children[activeChild].class} sub={mockData.children[activeChild].level} color={GOLD} />
          <StatCard label='Attendance' value='87%' sub='This term' color={GREEN} />
          <StatCard label='Fees Due' value='₦35k' sub='Balance' color={RED} />
          <StatCard label='Position' value='4th' sub='In class' color={BLUE} />
        </div>
      </Card>
    </div>
  )
}

