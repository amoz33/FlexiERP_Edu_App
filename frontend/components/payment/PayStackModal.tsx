'use client'

import { ReactNode, useMemo, useState } from 'react'
import { usePaystackPayment } from 'react-paystack'
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react'
import { BORDER, GOLD, GREEN, RED, TEXT, TEXT2 } from '@/constants'

export interface FeeItem {
  id: number
  label: string
  amount: number
}

interface PayStackModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFees: FeeItem[]
  totalAmount: number
  studentName: string
  studentEmail: string
  studentId: string
  onSuccess: (reference: string) => void
  onError: (error: string) => void
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error'

export default function PayStackModal({
  isOpen,
  onClose,
  selectedFees,
  totalAmount,
  studentName,
  studentEmail,
  studentId,
  onSuccess,
  onError,
}: PayStackModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
  const hasPaystackKey = Boolean(publicKey)

  const reference = useMemo(() => `fees-${studentId}-${Date.now()}`, [studentId])
  const initializePayment = usePaystackPayment({
    reference,
    email: studentEmail,
    amount: totalAmount * 100,
    publicKey,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        { display_name: 'Student Name', variable_name: 'student_name', value: studentName },
        { display_name: 'Student ID', variable_name: 'student_id', value: studentId },
        { display_name: 'Fees', variable_name: 'fees', value: JSON.stringify(selectedFees) },
      ],
    },
  })

  const resetAndClose = () => {
    if (paymentStatus === 'processing') return
    setPaymentStatus('idle')
    setErrorMessage('')
    onClose()
  }

  const handlePayment = () => {
    if (!hasPaystackKey) {
      const message = 'PayStack public key is not configured'
      setPaymentStatus('error')
      setErrorMessage(message)
      onError(message)
      return
    }

    setPaymentStatus('processing')
    setErrorMessage('')
    initializePayment({
      onSuccess: (response) => {
        const paymentReference = response?.reference || reference
        setPaymentStatus('success')
        onSuccess(paymentReference)
        setTimeout(() => {
          setPaymentStatus('idle')
          onClose()
        }, 2000)
      },
      onClose: () => {
        const message = 'Payment was cancelled'
        setPaymentStatus('idle')
        setErrorMessage(message)
        onError(message)
      },
    })
  }

  if (!isOpen) return null

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      onClick={resetAndClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="paystack-modal-title"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          maxWidth: 500,
          width: '100%',
          padding: 24,
          position: 'relative',
          boxShadow: '0 20px 60px rgba(13, 13, 13, 0.18)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close payment modal"
          onClick={resetAndClose}
          disabled={paymentStatus === 'processing'}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            cursor: paymentStatus === 'processing' ? 'not-allowed' : 'pointer',
            opacity: paymentStatus === 'processing' ? 0.5 : 1,
          }}
        >
          <X size={20} color={TEXT2} />
        </button>

        <h3 id="paystack-modal-title" style={{ fontSize: 20, fontWeight: 600, color: TEXT, margin: '0 0 8px' }}>
          Complete Payment
        </h3>
        <p style={{ fontSize: 13, color: TEXT2, margin: '0 0 20px' }}>
          Review your selected fees and proceed to payment.
        </p>

        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>Selected Fees</h4>
          {selectedFees.map((fee, index) => (
            <div
              key={fee.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '8px 0',
                borderBottom: index < selectedFees.length - 1 ? `1px solid ${BORDER}` : 'none',
              }}
            >
              <span style={{ fontSize: 13, color: TEXT }}>{fee.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>NGN {fee.amount.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12, paddingTop: 12, borderTop: `2px solid ${GOLD}` }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>NGN {totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#F9F8F6', borderRadius: 8, padding: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, flexWrap: 'wrap' }}>
            <span style={{ color: TEXT2 }}>Student:</span>
            <span style={{ fontWeight: 500 }}>{studentName}</span>
            <span style={{ color: TEXT2 }}>ID:</span>
            <span style={{ fontWeight: 500 }}>{studentId}</span>
          </div>
        </div>

        {paymentStatus === 'processing' && (
          <StatusMessage color={GOLD} icon={<Loader2 className="animate-spin" size={20} color={GOLD} />}>
            Redirecting to PayStack...
          </StatusMessage>
        )}

        {paymentStatus === 'success' && (
          <StatusMessage color={GREEN} icon={<CheckCircle size={20} color={GREEN} />}>
            Payment successful. Updating your fees record...
          </StatusMessage>
        )}

        {paymentStatus === 'error' && (
          <StatusMessage color={RED} icon={<AlertCircle size={20} color={RED} />}>
            {errorMessage}
          </StatusMessage>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={resetAndClose}
            disabled={paymentStatus === 'processing'}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: paymentStatus === 'processing' ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={paymentStatus === 'processing' || selectedFees.length === 0}
            style={{
              flex: 2,
              padding: '12px',
              backgroundColor: GOLD,
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#0D0D0D',
              cursor: paymentStatus === 'processing' || selectedFees.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {paymentStatus === 'processing' ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Processing...
              </>
            ) : (
              `Pay NGN ${totalAmount.toLocaleString()}`
            )}
          </button>
        </div>

        <p style={{ fontSize: 10, color: TEXT2, textAlign: 'center', margin: '16px 0 0' }}>
          Secure payment powered by PayStack
        </p>
      </div>
    </div>
  )
}

function StatusMessage({ children, color, icon }: { children: string; color: string; icon: ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: `${color}10`,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: TEXT,
        fontSize: 13,
      }}
    >
      {icon}
      <span>{children}</span>
    </div>
  )
}
