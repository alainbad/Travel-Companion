import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    confirmed: 'text-green-600 bg-green-50',
    pending_payment: 'text-yellow-600 bg-yellow-50',
    cancelled: 'text-red-600 bg-red-50',
    completed: 'text-blue-600 bg-blue-50',
    paid: 'text-green-600 bg-green-50',
    unpaid: 'text-yellow-600 bg-yellow-50',
    refunded: 'text-purple-600 bg-purple-50',
    active: 'text-green-600 bg-green-50',
    draft: 'text-gray-600 bg-gray-50',
    inactive: 'text-red-600 bg-red-50',
  }
  return colors[status] ?? 'text-gray-600 bg-gray-50'
}
