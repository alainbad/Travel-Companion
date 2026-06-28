'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Hotel, BookOpen, Calendar, TrendingUp, Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import type { Hotel as HotelType } from '@/types/hotel'
import type { Booking } from '@/types/booking'

export default function PartnerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [hotels, setHotels] = useState<HotelType[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'bookings'>('overview')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (!['partner', 'admin'].includes(profile?.role ?? '')) { setLoading(false); return }

      setAuthorized(true)

      try {
        const { data: partnerHotels } = await supabase
          .from('hotels')
          .select('*, rooms(*)')
          .eq('owner_id', user.id)

        setHotels((partnerHotels ?? []) as HotelType[])

        if (partnerHotels && partnerHotels.length > 0) {
          const hotelIds = partnerHotels.map((h) => h.id)
          const { data: b } = await supabase
            .from('bookings')
            .select(`*, hotel:hotels(name, city), room:rooms(name)`)
            .in('hotel_id', hotelIds)
            .order('created_at', { ascending: false })
          setBookings((b ?? []) as Booking[])
        }
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Partner Access Required</h2>
          <p className="text-gray-500 mb-4">This area is for hotel partners and administrators.</p>
          <Button onClick={() => router.push('/signup')}>Sign up as Partner</Button>
        </div>
      </div>
    )
  }

  const totalRevenue = bookings.filter((b) => b.payment_status === 'paid').reduce((s, b) => s + b.total_price, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your hotel listings and track bookings.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Hotel
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'My Hotels', value: hotels.length, icon: <Hotel className="h-5 w-5 text-blue-600" /> },
            { label: 'Total Bookings', value: bookings.length, icon: <BookOpen className="h-5 w-5 text-teal-600" /> },
            { label: 'Revenue', value: formatCurrency(totalRevenue), icon: <TrendingUp className="h-5 w-5 text-green-600" /> },
            { label: 'This Month', value: bookings.filter((b) => new Date(b.created_at).getMonth() === new Date().getMonth()).length, icon: <Calendar className="h-5 w-5 text-purple-600" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'hotels', label: `My Hotels (${hotels.length})` },
            { key: 'bookings', label: `Bookings (${bookings.length})` },
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

        {activeTab === 'hotels' && (
          <div>
            {hotels.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <Hotel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">No hotels yet</h3>
                <p className="text-gray-500 mb-4">Add your first hotel to start receiving bookings.</p>
                <Button className="gap-2"><Plus className="h-4 w-4" /> Add Hotel</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                      <p className="text-sm text-gray-500">{[hotel.city, hotel.country].filter(Boolean).join(', ')}</p>
                      <p className="text-xs text-gray-400 mt-1">{hotel.rooms?.length ?? 0} room types</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(hotel.status)}`}>
                        {hotel.status}
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Guest', 'Hotel', 'Dates', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">No bookings yet</td></tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{booking.guest_full_name ?? 'Guest'}</p>
                          <p className="text-xs text-gray-400">{booking.guest_email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{booking.hotel?.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(booking.check_in)} → {formatDate(booking.check_out)}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(booking.total_price)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
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
                <div key={b.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.guest_full_name ?? 'Guest'}</p>
                    <p className="text-xs text-gray-400">{b.hotel?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(b.total_price)}</p>
                    <span className={`text-xs ${getStatusColor(b.status)} px-1.5 py-0.5 rounded`}>{b.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No bookings yet</p>}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Hotel', emoji: '🏨' },
                  { label: 'Add Rooms', emoji: '🛏️' },
                  { label: 'Set Pricing', emoji: '💰' },
                  { label: 'View Calendar', emoji: '📅' },
                ].map((action) => (
                  <button key={action.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                    <span className="text-xl">{action.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
