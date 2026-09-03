'use client'
import { useState } from 'react'
import { Award, BookOpen, Download, Printer, Target, TrendingUp } from 'lucide-react'
import { mockData, getGrade, GOLD, BORDER, BLUE, GREEN, RED } from '../portalData'
import { Avatar, Card, CardLabel, GoldBadge, StatCard } from '../portalUi'

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
          <CardLabel>Form Teacher&apos;s Remark</CardLabel>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: '#0D0D0D', lineHeight: 1.7, fontStyle: 'italic' }}>&quot;{rc.formTeacherRemark}&quot;</p>
          <p style={{ margin: 0, fontSize: 12, color: GOLD, fontWeight: 600 }}>{d.formTeacher}</p>
        </Card>
        <Card>
          <CardLabel>Principal&apos;s Remark</CardLabel>
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

