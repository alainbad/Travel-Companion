'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Hotel, Users, BookOpen, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getAllBookings } from '@/services/bookings'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import type { Booking } from '@/types/booking'

interface AdminStats {
  totalBookings: number
  totalRevenue: number
  totalHotels: number
  totalUsers: number
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [stats, setStats] = useState<AdminStats>({ totalBookings: 0, totalRevenue: 0, totalHotels: 0, totalUsers: 0 })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'hotels' | 'users'>('overview')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { setLoading(false); return }

      setAuthorized(true)

      try {
        const [bookingData, { count: hotelCount }, { count: userCount }] = await Promise.all([
          getAllBookings(),
          supabase.from('hotels').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ])
        setBookings(bookingData)
        setStats({
          totalBookings: bookingData.length,
          totalRevenue: bookingData.filter((b) => b.payment_status === 'paid').reduce((s, b) => s + b.total_price, 0),
          totalHotels: hotelCount ?? 0,
          totalUsers: userCount ?? 0,
        })
      } catch { /* continue */ }
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You need admin access to view this page.</p>
        </div>
      </div>
    )
  }

  const STAT_CARDS = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: <BookOpen className="h-6 w-6 text-blue-600" />, color: 'blue' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: <DollarSign className="h-6 w-6 text-green-600" />, color: 'green' },
    { label: 'Active Hotels', value: stats.totalHotels, icon: <Hotel className="h-6 w-6 text-teal-600" />, color: 'teal' },
    { label: 'Registered Users', value: stats.totalUsers, icon: <Users className="h-6 w-6 text-purple-600" />, color: 'purple' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage hotels, bookings, users, and revenue.</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200">
            Admin Access
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">{card.icon}</div>
                <TrendingUp className="h-4 w-4 text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'bookings', label: `Bookings (${bookings.length})` },
            { key: 'hotels', label: 'Hotels' },
            { key: 'users', label: 'Users' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings table */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">All Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Guest', 'Hotel', 'Dates', 'Amount', 'Status', 'Payment'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No bookings yet</td></tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{booking.guest_full_name ?? 'Guest'}</p>
                          <p className="text-xs text-gray-500">{booking.guest_email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-900">{booking.hotel?.name ?? '-'}</p>
                          <p className="text-xs text-gray-500">{booking.hotel?.city}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {formatCurrency(booking.total_price, booking.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.hotel?.name ?? 'Hotel'}</p>
                    <p className="text-xs text-gray-500">{b.guest_full_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(b.total_price)}</p>
                    <span className={`text-xs font-medium ${getStatusColor(b.status)} px-1.5 py-0.5 rounded`}>{b.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No bookings yet</p>}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Hotel', href: '/admin/hotels/new', emoji: '🏨' },
                  { label: 'Add Destination', href: '/admin/destinations/new', emoji: '🗺️' },
                  { label: 'Manage Rooms', href: '/admin/rooms', emoji: '🛏️' },
                  { label: 'View Reports', href: '/admin/reports', emoji: '📊' },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xl">{action.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'hotels' || activeTab === 'users') && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-400">
              {activeTab === 'hotels' ? '🏨 Hotel management' : '👥 User management'} — full UI coming in next sprint
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
