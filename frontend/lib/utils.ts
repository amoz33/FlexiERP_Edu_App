import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatDate(date: string | Date, fmt = 'MMM dd, yyyy') {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    approved: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-700',
    optimal: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-800',
    'pending review': 'bg-gray-100 text-gray-700',
    'under evaluation': 'bg-blue-100 text-blue-700',
    waitlisted: 'bg-red-100 text-red-700',
    overdue: 'bg-red-100 text-red-700',
    'low stock': 'bg-orange-100 text-orange-700',
    'on leave': 'bg-orange-100 text-orange-700',
  }
  return map[status.toLowerCase()] || 'bg-gray-100 text-gray-700'
}
