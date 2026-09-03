'use client'
import { useState } from 'react'
import { BookMarked, CalendarDays, ClipboardList, UserRound } from 'lucide-react'
import { mockData, GOLD, BORDER, BLUE, GREEN, RED } from '../portalData'
import { Card, GoldBadge, StatCard } from '../portalUi'

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

