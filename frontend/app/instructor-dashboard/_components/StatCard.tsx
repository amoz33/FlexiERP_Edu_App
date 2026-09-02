'use client'

interface StatCardProps {
  icon: React.ReactNode
  iconBg: string
  value: string | number
  label: string
}

export default function StatCard({ icon, iconBg, value, label }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
        {icon}
      </div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  )
}
