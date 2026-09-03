'use client'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { feeApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Building2, AlertTriangle, Clock, MoreVertical } from 'lucide-react'

const MOCK_FEE = {
  total_collected: 1245000,
  total_change: '+12% from last term',
  pending_clearance: 84500,
  pending_invoices: 42,
  overdue_fees: 12350,
  fee_types: [
    { id: 1, name: 'Tuition - Spring Term', grade: 'Grade 10', amount: 4500, status: 'Active' },
    { id: 2, name: 'Lab & Materials Fee', grade: 'Grade 11 - Science', amount: 350, status: 'Pending' },
    { id: 3, name: 'Transportation (Bus Route A)', grade: 'All Grades', amount: 800, status: 'Active' },
    { id: 4, name: 'Library Late Fees', grade: 'Various', amount: 45, status: 'Overdue' },
    { id: 5, name: 'Extracurricular - Robotics', grade: 'Grade 9-12', amount: 150, status: 'Active' },
  ],
  recent_transactions: [
    { id: 1, student: 'Alice Johnson', amount: 4500, method: 'Card ends *4211', desc: 'Tuition - ID #8472', time: 'Today, 09:41 AM', color: '#C9A020' },
    { id: 2, student: 'Michael Smith', amount: 800, method: 'Bank Transfer', desc: 'Transport Fee - ID #9921', time: 'Yesterday, 14:22 PM', color: '#6B6660' },
    { id: 3, student: 'Emma Davis', amount: 350, method: 'Cash', desc: 'Lab Fee - ID #7364', time: 'Oct 24, 11:05 AM', color: '#6B6660' },
    { id: 4, student: 'System Auto-Billed', amount: 135, method: 'Automated', desc: 'Late Penalty Applied (3 Accounts)', time: 'Oct 23, 00:00 AM', color: '#EF4444' },
  ]
}

const statusStyle: Record<string, { label: string; cls: string }> = {
  Active: { label: 'Active', cls: 'badge-green' },
  Pending: { label: 'Pending', cls: 'badge-gold' },
  Overdue: { label: 'Overdue', cls: 'badge-red' },
}

export default function FeeManagementPage() {
  const { data = MOCK_FEE } = useQuery({
    queryKey: ['fee-dashboard'],
    queryFn: () => feeApi.getDashboard().then(r => r.data),
    placeholderData: MOCK_FEE,
  })

  return (
    <AppLayout>
      <Topbar action={{ label: 'Record Payment', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Fee Dashboard</h1>
        <p className="page-subtitle">Overview of institutional collections and outstandings.</p>
      </div>

      <div className="px-6 pb-8 space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in stagger-1">
          {/* Total Collected */}
          <div className="stat-card" style={{ borderBottom: '3px solid #C9A020' }}>
            <div className="flex items-center justify-between">
              <span className="stat-label">Total Collected</span>
              <Building2 size={18} style={{ color: '#C9A020' }} />
            </div>
            <div className="stat-value">{formatCurrency(data.total_collected)}</div>
            <p className="text-xs" style={{ color: '#10B981' }}>↗ {data.total_change}</p>
          </div>

          {/* Pending Clearance */}
          <div className="stat-card" style={{ borderBottom: '3px solid #C9A020' }}>
            <div className="flex items-center justify-between">
              <span className="stat-label">Pending Clearance</span>
              <Clock size={18} style={{ color: '#C9A020' }} />
            </div>
            <div className="stat-value">{formatCurrency(data.pending_clearance)}</div>
            <p className="text-xs" style={{ color: '#6B6660' }}>{data.pending_invoices} invoices processing</p>
          </div>

          {/* Overdue */}
          <div className="stat-card" style={{ borderBottom: '3px solid #EF4444' }}>
            <div className="flex items-center justify-between">
              <span className="stat-label">Overdue Fees</span>
              <AlertTriangle size={18} style={{ color: '#EF4444' }} />
            </div>
            <div className="stat-value" style={{ color: '#EF4444' }}>{formatCurrency(data.overdue_fees)}</div>
            <p className="text-xs" style={{ color: '#EF4444' }}>⚠ Requires immediate action</p>
          </div>
        </div>

        {/* Fee Breakdown + Recent Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Fee Breakdown Table */}
          <div className="card xl:col-span-2 p-0 overflow-hidden animate-in stagger-2">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E4E1D8' }}>
              <h2 className="font-bold text-base">Fee Breakdown</h2>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>Grade Level</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.fee_types.map((fee: typeof MOCK_FEE['fee_types'][0]) => {
                  const s = statusStyle[fee.status] || { label: fee.status, cls: 'badge-gray' }
                  return (
                    <tr key={fee.id}>
                      <td className="font-medium">{fee.name}</td>
                      <td style={{ color: '#6B6660' }}>{fee.grade}</td>
                      <td className="font-semibold" style={{ color: fee.status === 'Overdue' ? '#EF4444' : '#0D0D0D' }}>
                        {formatCurrency(fee.amount)}
                      </td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td>
                        <button className="p-1.5 rounded hover:bg-gray-100">
                          <MoreVertical size={14} style={{ color: '#6B6660' }} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Recent Transactions */}
          <div className="card animate-in stagger-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base">Recent Transactions</h2>
              <a href="#" className="text-xs font-medium" style={{ color: '#C9A020' }}>View All</a>
            </div>
            <div className="space-y-4">
              {data.recent_transactions.map((tx: typeof MOCK_FEE['recent_transactions'][0]) => (
                <div key={tx.id} className="flex gap-3">
                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                       style={{ background: tx.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-1">
                      <p className="font-semibold text-sm truncate">{tx.student}</p>
                      <p className="text-sm font-semibold flex-shrink-0" style={{ color: '#10B981' }}>
                        +{formatCurrency(tx.amount)}
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: '#6B6660' }}>{tx.desc}</p>
                    <div className="flex justify-between mt-0.5">
                      <p className="text-xs" style={{ color: '#A09080' }}>{tx.time}</p>
                      <span className="badge badge-gray text-xs">{tx.method}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
