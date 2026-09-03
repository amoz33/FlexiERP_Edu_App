'use client'

import Card from '@/components/ui/Card'
import GoldBadge from '@/components/ui/GoldBadge'

const feeItems = [
  { label: 'School Fees (2nd Term)', amount: 85000 },
  { label: 'PTA Levy', amount: 5000 },
]

const paymentHistory = [
  { date: 'Sep 12, 2025', desc: '1st Term School Fees', amount: 85000, method: 'Bank Transfer' },
]

export default function FeesView() {
  const total = feeItems.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div>
        <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#9B9590' }}>School Fees</p>
        <h2 style={{ margin: '10px 0 0', fontSize: 28, color: '#0D0D0D', fontFamily: "'Georgia',serif" }}>Payment Summary</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        <Card>
          <p style={{ margin: 0, fontSize: 11, color: '#9B9590', textTransform: 'uppercase', letterSpacing: 1.2 }}>Total Due</p>
          <p style={{ margin: '10px 0 0', fontSize: 28, fontWeight: 700 }}>₦{total.toLocaleString()}</p>
        </Card>
        <Card>
          <p style={{ margin: 0, fontSize: 11, color: '#9B9590', textTransform: 'uppercase', letterSpacing: 1.2 }}>Outstanding</p>
          <p style={{ margin: '10px 0 0', fontSize: 28, fontWeight: 700 }}>₦{(total * 0.55).toLocaleString()}</p>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: '#9B9590', textTransform: 'uppercase', letterSpacing: 1.2 }}>Fee Breakdown</p>
            <h3 style={{ margin: '8px 0 0', fontSize: 18, fontWeight: 700 }}>Current Term</h3>
          </div>
          <GoldBadge color='#1D9E75'>Paid on time</GoldBadge>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {feeItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', color: '#5C5750' }}>
              <span>{item.label}</span>
              <strong>₦{item.amount.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p style={{ margin: 0, fontSize: 12, color: '#9B9590', textTransform: 'uppercase', letterSpacing: 1.2 }}>Payment History</p>
        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {paymentHistory.map((item, index) => (
            <div key={index} style={{ display: 'grid', gap: 4, padding: 14, borderRadius: 14, background: '#FAFAFA' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontWeight: 700 }}>{item.date}</span>
                <GoldBadge>{item.method}</GoldBadge>
              </div>
              <p style={{ margin: 0, color: '#5C5750' }}>{item.desc}</p>
              <strong style={{ marginTop: 6 }}>₦{item.amount.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
