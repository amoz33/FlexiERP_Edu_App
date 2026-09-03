'use client'
import { Plus, Search } from 'lucide-react'

interface TopbarProps {
  title?: string
  action?: { label: string; onClick: () => void }
}

export default function Topbar({ title, action }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {title && (
          <h2 className="text-lg font-bold truncate" style={{ color: '#0D0D0D' }}>
            {title}
          </h2>
        )}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm rounded-lg border outline-none w-56 transition-all"
            style={{ borderColor: '#E4E1D8', fontFamily: 'inherit', background: '#F7F6F3' }}
            onFocus={e => { e.target.style.borderColor = '#C9A020'; e.target.style.width = '300px' }}
            onBlur={e => { e.target.style.borderColor = '#E4E1D8'; e.target.style.width = '224px' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {action && (
          <button onClick={action.onClick} className="btn-gold text-sm flex items-center gap-1.5">
            <Plus size={14} />
            {action.label}
          </button>
        )}
      </div>
    </header>
  )
}
