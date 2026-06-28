'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BookingSummary from '@/components/booking/BookingSummary'
import { getHotelById, getRoomsByHotel } from '@/services/hotels'
import { createBooking } from '@/services/bookings'
import { calculateNights } from '@/lib/utils'
import type { Hotel, Room } from '@/types/hotel'

interface PageProps {
  params: Promise<{ hotelId: string }>
  searchParams: Promise<{ roomId?: string; checkIn?: string; checkOut?: string; guests?: string }>
}

export default function CheckoutPage({ params, searchParams }: PageProps) {
  const { hotelId } = use(params)
  const sp = use(searchParams)

  const router = useRouter()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const checkIn = sp.checkIn ?? ''
  const checkOut = sp.checkOut ?? ''
  const guests = parseInt(sp.guests ?? '2')
  const nights = checkIn && checkOut ? Math.max(1, calculateNights(checkIn, checkOut)) : 1

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
  })

  useEffect(() => {
    async function load() {
      try {
        const [h, rooms] = await Promise.all([
          getHotelById(hotelId),
          getRoomsByHotel(hotelId),
        ])
        setHotel(h)
        const selectedRoom = rooms.find((r) => r.id === sp.roomId) ?? rooms[0]
        setRoom(selectedRoom ?? null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [hotelId, sp.roomId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hotel || !room) return
    if (!form.fullName || !form.email) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const nights = calculateNights(checkIn, checkOut)
      const total = room.base_price * nights * 1.1
      await createBooking({
        hotel_id: hotel.id,
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: Math.round(total),
        currency: room.currency,
        guest_full_name: form.fullName,
        guest_email: form.email,
        guest_phone: form.phone,
      })
      setSuccess(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 mb-2">Hotel or room not found</p>
          <Button onClick={() => router.push('/hotels')}>Browse Hotels</Button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-1">A confirmation email has been sent to</p>
          <p className="font-semibold text-gray-900 mb-6">{form.email}</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-2">{hotel.name}</p>
            <p className="text-sm text-gray-500">{room.name}</p>
            <p className="text-sm text-gray-500">{checkIn} → {checkOut} · {guests} guest{guests !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="flex-1">
              View Bookings
            </Button>
            <Button onClick={() => router.push('/')} className="flex-1">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete your booking</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Guest Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests (optional)</label>
                    <textarea
                      placeholder="Any special requests or preferences..."
                      value={form.specialRequests}
                      onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                      className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-bold text-gray-900">Payment</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Stripe payment coming soon</p>
                    <p className="text-sm text-blue-700 mt-0.5">
                      For now, clicking &quot;Confirm Booking&quot; will create a reservation in &quot;Pending Payment&quot; status. Stripe Checkout will be integrated in the next sprint.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-50 pointer-events-none">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                    <Input placeholder="•••• •••• •••• ••••" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                    <Input placeholder="MM / YY" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                    <Input placeholder="•••" disabled />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" size="xl" className="w-full" disabled={submitting}>
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                By confirming, you agree to our Terms of Service and Cancellation Policy.
              </p>
            </form>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <BookingSummary
              hotel={hotel}
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
