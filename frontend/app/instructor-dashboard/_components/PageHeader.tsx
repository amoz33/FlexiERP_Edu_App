'use client'

interface PageHeaderProps {
  title: string
  subtitle: string
  action?: { label: string; icon?: React.ReactNode; onClick: () => void }
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="page-header animate-in">
      <div className="gold-accent" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        {action && (
          <button onClick={action.onClick} className="btn-gold">
            {action.icon} {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
