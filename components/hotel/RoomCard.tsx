'use client'

import Image from 'next/image'
import { Users, Maximize2, Bed, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Room } from '@/types/hotel'

interface RoomCardProps {
  room: Room
  nights?: number
  onSelect?: (room: Room) => void
}

export default function RoomCard({ room, nights = 1, onSelect }: RoomCardProps) {
  const totalPrice = room.base_price * nights

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-56 h-40 sm:h-auto bg-gray-100 flex-shrink-0">
          {room.image_url ? (
            <Image
              src={room.image_url}
              alt={room.name}
              fill
              className="object-cover"
              sizes="224px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
              <span className="text-3xl">🛏️</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg">{room.name}</h4>

            {/* Room specs */}
            <div className="flex flex-wrap gap-4 mt-2">
              {room.max_guests && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>Up to {room.max_guests} guests</span>
                </div>
              )}
              {room.bed_type && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Bed className="h-4 w-4 text-gray-400" />
                  <span>{room.bed_type}</span>
                </div>
              )}
              {room.size_sqm && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Maximize2 className="h-4 w-4 text-gray-400" />
                  <span>{room.size_sqm} m²</span>
                </div>
              )}
            </div>

            {room.description && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{room.description}</p>
            )}

            {/* Inclusions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Free cancellation', 'Breakfast included', 'Free WiFi'].map((item) => (
                <div key={item} className="flex items-center gap-1 text-xs text-green-700">
                  <Check className="h-3 w-3" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:min-w-[140px]">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(room.base_price, room.currency)}</p>
              <p className="text-xs text-gray-500">per night</p>
              {nights > 1 && (
                <p className="text-sm font-semibold text-blue-600 mt-1">
                  {formatCurrency(totalPrice, room.currency)} total
                </p>
              )}
            </div>
            <Button
              onClick={() => onSelect?.(room)}
              className="whitespace-nowrap"
            >
              Reserve
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
