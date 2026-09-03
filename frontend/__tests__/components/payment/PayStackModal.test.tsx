import { render, screen, fireEvent, act } from '@testing-library/react'
import PayStackModal from '@/components/payment/PayStackModal'

// react-paystack's usePaystackPayment returns a function you call with
// { onSuccess, onClose } handlers. We capture that call so tests can
// trigger each path (success / cancel) exactly like PayStack's real
// widget would, without needing an actual PayStack session.
const mockInitializePayment = jest.fn()
jest.mock('react-paystack', () => ({
  usePaystackPayment: jest.fn(() => mockInitializePayment),
}))

const baseProps = {
  isOpen: true,
  onClose: jest.fn(),
  selectedFees: [{ id: 1, label: 'Tuition', amount: 50000 }],
  totalAmount: 50000,
  studentName: 'Ada Lovelace',
  studentEmail: 'ada@example.com',
  studentId: 'STU-001',
  onSuccess: jest.fn(),
  onError: jest.fn(),
}

const ORIGINAL_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()
  process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: 'pk_test_dummy' }
})

afterAll(() => {
  process.env = ORIGINAL_ENV
})

describe('PayStackModal', () => {
  it('shows a configuration error and never calls initializePayment when the public key is missing', () => {
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = ''
    render(<PayStackModal {...baseProps} />)

    fireEvent.click(screen.getByText(/Pay NGN/))

    expect(baseProps.onError).toHaveBeenCalledWith('PayStack public key is not configured')
    expect(mockInitializePayment).not.toHaveBeenCalled()
    expect(screen.getByText('PayStack public key is not configured')).toBeInTheDocument()
  })

  it('calls onSuccess with the payment reference when PayStack reports success', () => {
    render(<PayStackModal {...baseProps} />)

    fireEvent.click(screen.getByText(/Pay NGN/))

    expect(mockInitializePayment).toHaveBeenCalledTimes(1)
    const { onSuccess } = mockInitializePayment.mock.calls[0][0]

    act(() => {
      onSuccess({ reference: 'ref-12345' })
    })

    expect(baseProps.onSuccess).toHaveBeenCalledWith('ref-12345')
    expect(screen.getByText(/Payment successful/)).toBeInTheDocument()
  })

  it('surfaces a cancellation error when the PayStack widget is closed without completing payment', () => {
    render(<PayStackModal {...baseProps} />)

    fireEvent.click(screen.getByText(/Pay NGN/))

    expect(mockInitializePayment).toHaveBeenCalledTimes(1)
    const { onClose } = mockInitializePayment.mock.calls[0][0]

    act(() => {
      onClose()
    })

    expect(baseProps.onError).toHaveBeenCalledWith('Payment was cancelled')
    expect(screen.getByText('Payment was cancelled')).toBeInTheDocument()
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<PayStackModal {...baseProps} isOpen={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('disables the pay button when there are no selected fees', () => {
    render(<PayStackModal {...baseProps} selectedFees={[]} totalAmount={0} />)
    expect(screen.getByText(/Pay NGN/).closest('button')).toBeDisabled()
  })
})
