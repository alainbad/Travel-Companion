'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Heart, Settings, LogOut, MapPin, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase'
import { getUserBookings } from '@/services/bookings'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import type { Profile } from '@/types/user'
import type { Booking } from '@/types/booking'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'bookings' | 'wishlist' | 'profile'>('bookings')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData as Profile)

      try {
        const b = await getUserBookings(user.id)
        setBookings(b)
      } catch { setBookings([]) }

      setLoading(false)
    }
    load()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const upcomingBookings = bookings.filter((b) => new Date(b.check_in) >= new Date() && b.status !== 'cancelled')
  const pastBookings = bookings.filter((b) => new Date(b.check_in) < new Date() || b.status === 'cancelled')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
              {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{profile?.full_name ?? 'Traveler'}</h1>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <Badge variant="secondary" className="mt-1 capitalize">{profile?.role ?? 'user'}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {profile?.role === 'admin' && (
              <Link href="/admin"><Button variant="outline" size="sm">Admin Panel</Button></Link>
            )}
            {profile?.role === 'partner' && (
              <Link href="/partner"><Button variant="outline" size="sm">Partner Panel</Button></Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1 text-gray-500">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: <Calendar className="h-5 w-5 text-blue-600" /> },
            { label: 'Upcoming', value: upcomingBookings.length, icon: <Clock className="h-5 w-5 text-teal-600" /> },
            { label: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'bookings', label: 'My Bookings', icon: <Calendar className="h-4 w-4" /> },
            { key: 'wishlist', label: 'Saved Hotels', icon: <Heart className="h-4 w-4" /> },
            { key: 'profile', label: 'Profile Settings', icon: <Settings className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-4">Start exploring and book your first trip!</p>
                <Link href="/hotels"><Button>Browse Hotels</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Upcoming</h3>
                    {upcomingBookings.map((booking) => (
                      <BookingItem key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
                {pastBookings.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-700 mb-3 mt-4 text-sm uppercase tracking-wide">Past</h3>
                    {pastBookings.map((booking) => (
                      <BookingItem key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wishlist tab */}
        {activeTab === 'wishlist' && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">No saved hotels yet</h3>
            <p className="text-gray-500 mb-4">Click the heart icon on any hotel to save it here.</p>
            <Link href="/hotels"><Button>Browse Hotels</Button></Link>
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md">
            <h3 className="font-bold text-gray-900 mb-5">Profile Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  defaultValue={profile?.full_name ?? ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  defaultValue={profile?.email ?? ''}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input
                  defaultValue={profile?.phone ?? ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button className="w-full">Save Changes</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BookingItem({ booking }: { booking: Booking }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 mb-3">
      <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {booking.hotel?.main_image_url ? (
          <Image src={booking.hotel.main_image_url} alt={booking.hotel.name ?? ''} fill className="object-cover" sizes="96px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🏨</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 line-clamp-1">{booking.hotel?.name ?? 'Hotel'}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              {[booking.hotel?.city, booking.hotel?.country].filter(Boolean).join(', ')}
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
            {booking.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>{formatDate(booking.check_in)} → {formatDate(booking.check_out)}</span>
          <span className="font-semibold text-gray-900">{formatCurrency(booking.total_price, booking.currency)}</span>
        </div>
      </div>
    </div>
  )
}
