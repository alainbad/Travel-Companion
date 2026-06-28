'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Hotel } from '@/types/hotel'

interface HotelCardProps {
  hotel: Hotel
  checkIn?: string
  checkOut?: string
  guests?: number
}

export default function HotelCard({ hotel, checkIn, checkOut, guests }: HotelCardProps) {
  const minPrice = hotel.rooms?.length
    ? Math.min(...hotel.rooms.map((r) => r.base_price))
    : null

  const params = new URLSearchParams()
  if (checkIn) params.set('checkIn', checkIn)
  if (checkOut) params.set('checkOut', checkOut)
  if (guests) params.set('guests', String(guests))

  const href = `/hotels/${hotel.id}?${params.toString()}`

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {hotel.main_image_url ? (
          <Image
            src={hotel.main_image_url}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
            <span className="text-4xl">🏨</span>
          </div>
        )}
        {hotel.is_featured && (
          <Badge className="absolute top-3 left-3 bg-blue-600 text-white">Featured</Badge>
        )}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Star rating */}
        <div className="flex items-center gap-1 mb-1">
          {Array.from({ length: hotel.star_rating ?? 0 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
          {hotel.name}
        </h3>

        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{[hotel.city, hotel.country].filter(Boolean).join(', ')}</span>
        </div>

        {hotel.guest_rating && (
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              {hotel.guest_rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              {hotel.guest_rating >= 9 ? 'Exceptional' : hotel.guest_rating >= 8 ? 'Excellent' : hotel.guest_rating >= 7 ? 'Very Good' : 'Good'}
              {hotel.review_count > 0 && ` · ${hotel.review_count.toLocaleString()} reviews`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            {minPrice ? (
              <>
                <span className="text-xs text-gray-500">from</span>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(minPrice)}</p>
                <span className="text-xs text-gray-500">per night</span>
              </>
            ) : (
              <p className="text-sm text-gray-500">Price on request</p>
            )}
          </div>
          <Link href={href}>
            <Button size="sm">View deal</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
