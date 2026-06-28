import Image from 'next/image'
import { MapPin, Calendar, Users, Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate, calculateNights } from '@/lib/utils'
import type { Hotel } from '@/types/hotel'
import type { Room } from '@/types/hotel'

interface BookingSummaryProps {
  hotel: Hotel
  room: Room
  checkIn: string
  checkOut: string
  guests: number
}

export default function BookingSummary({ hotel, room, checkIn, checkOut, guests }: BookingSummaryProps) {
  const nights = calculateNights(checkIn, checkOut)
  const roomTotal = room.base_price * nights
  const taxes = Math.round(roomTotal * 0.1)
  const total = roomTotal + taxes

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
      {/* Hotel image */}
      <div className="relative h-44">
        {hotel.main_image_url ? (
          <Image src={hotel.main_image_url} alt={hotel.name} fill className="object-cover" sizes="400px" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-4xl">🏨</div>
        )}
      </div>

      <div className="p-5">
        {/* Hotel info */}
        <div className="flex gap-1 mb-1">
          {Array.from({ length: hotel.star_rating ?? 0 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{hotel.name}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          {[hotel.city, hotel.country].filter(Boolean).join(', ')}
        </div>

        <Separator className="my-4" />

        {/* Stay details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">CHECK-IN / CHECK-OUT</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(checkIn)} → {formatDate(checkOut)}</p>
              <p className="text-xs text-gray-500">{nights} night{nights !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">GUESTS</p>
              <p className="text-sm font-medium text-gray-900">{guests} guest{guests !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Room */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 font-medium mb-1">ROOM TYPE</p>
          <p className="text-sm font-semibold text-gray-900">{room.name}</p>
          {room.bed_type && <p className="text-xs text-gray-500 mt-0.5">{room.bed_type}</p>}
        </div>

        <Separator className="my-4" />

        {/* Price breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{formatCurrency(room.base_price)} × {nights} night{nights !== 1 ? 's' : ''}</span>
            <span className="font-medium">{formatCurrency(roomTotal, room.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxes & fees (10%)</span>
            <span className="font-medium">{formatCurrency(taxes, room.currency)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-xl text-blue-600">{formatCurrency(total, room.currency)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3 text-center">You won&apos;t be charged yet</p>
      </div>
    </div>
  )
}
