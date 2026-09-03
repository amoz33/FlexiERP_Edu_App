'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Download } from 'lucide-react'
import type { FeeItem } from '@/components/payment/PayStackModal'
import { mockData, GOLD, BORDER, GREEN, RED } from '../portalData'
import { Card, CardLabel, StatCard } from '../portalUi'

const PayStackModal = dynamic(() => import('@/components/payment/PayStackModal'), { ssr: false })

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
