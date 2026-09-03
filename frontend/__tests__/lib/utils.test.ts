import { cn, formatCurrency, formatDate, getInitials, getStatusColor } from '@/lib/utils'

describe('cn', () => {
  it('merges class names and resolves Tailwind conflicts (last one wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })
});

describe('formatCurrency', () => {
  it('formats a number as USD by default', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
  })

  it('formats using a specified currency code', () => {
    expect(formatCurrency(1234.5, 'NGN')).toBe('NGN\u00a01,234.50')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
});

describe('formatDate', () => {
  it('formats a date string as "MMM dd, yyyy" style output', () => {
    expect(formatDate('2026-03-15')).toBe('Mar 15, 2026')
  })

  it('accepts a Date object directly', () => {
    expect(formatDate(new Date(2026, 2, 15))).toBe('Mar 15, 2026')
  })
});

describe('getInitials', () => {
  it('returns uppercase initials from a full name', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL')
  })

  it('caps at two characters for names with more than two parts', () => {
    expect(getInitials('Ada Grace Lovelace')).toBe('AG')
  })

  it('handles a single-word name', () => {
    expect(getInitials('Ada')).toBe('A')
  })
});

describe('getStatusColor', () => {
  it('returns the matching color class for a known status, case-insensitively', () => {
    expect(getStatusColor('Approved')).toBe('bg-green-100 text-green-800')
    expect(getStatusColor('overdue')).toBe('bg-red-100 text-red-700')
  })

  it('falls back to a default gray class for an unknown status', () => {
    expect(getStatusColor('some-made-up-status')).toBe('bg-gray-100 text-gray-700')
  })
});
