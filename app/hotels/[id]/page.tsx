import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MapPin, Star, Wifi, Car, Waves, Dumbbell, UtensilsCrossed, Phone } from 'lucide-react'
import RoomCard from '@/components/hotel/RoomCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getHotelById } from '@/services/hotels'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const hotel = await getHotelById(id)
  if (!hotel) return { title: 'Hotel Not Found' }
  return {
    title: hotel.name,
    description: hotel.description ?? `Book ${hotel.name} in ${hotel.city}, ${hotel.country}`,
  }
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="h-4 w-4" />,
  'Parking': <Car className="h-4 w-4" />,
  'Swimming Pool': <Waves className="h-4 w-4" />,
  'Fitness Center': <Dumbbell className="h-4 w-4" />,
  'Restaurant': <UtensilsCrossed className="h-4 w-4" />,
}

export default async function HotelDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const sp = await searchParams
  const hotel = await getHotelById(id)

  if (!hotel) notFound()

  const checkIn = sp.checkIn ?? ''
  const checkOut = sp.checkOut ?? ''
  const guests = parseInt(sp.guests ?? '2')

  const images = [hotel.main_image_url, ...(hotel.images?.map((i) => i.image_url) ?? [])].filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-72 sm:h-96 lg:h-[480px] bg-gray-200 overflow-hidden">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={hotel.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-6xl">🏨</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2 hidden sm:grid">
            {images.slice(1, 4).map((img, i) => (
              <div key={i} className="relative w-24 h-16 rounded-lg overflow-hidden border-2 border-white">
                <Image src={img} alt={`${hotel.name} ${i + 2}`} fill className="object-cover" sizes="96px" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                {hotel.star_rating && (
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: hotel.star_rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{[hotel.address, hotel.city, hotel.country].filter(Boolean).join(', ')}</span>
                </div>
              </div>
              {hotel.guest_rating && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">
                      {hotel.guest_rating >= 9 ? 'Exceptional' : hotel.guest_rating >= 8 ? 'Excellent' : 'Very Good'}
                    </p>
                    {hotel.review_count > 0 && (
                      <p className="text-xs text-gray-500">{hotel.review_count.toLocaleString()} reviews</p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {hotel.guest_rating.toFixed(1)}
                  </div>
                </div>
              )}
            </div>

            {hotel.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About this property</h2>
                <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              </div>
            )}

            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2.5 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2.5">
                      {AMENITY_ICONS[amenity.name] ?? <Phone className="h-4 w-4 text-gray-400" />}
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Rooms</h2>
              {hotel.rooms && hotel.rooms.length > 0 ? (
                <div className="space-y-4">
                  {hotel.rooms.filter((r) => r.is_active).map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      nights={checkIn && checkOut ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1}
                      onSelect={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">No rooms available for the selected dates.</p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Map integration coming soon</p>
                  <p className="text-xs mt-1">{[hotel.address, hotel.city, hotel.country].filter(Boolean).join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="mb-4">
                {hotel.rooms && hotel.rooms.length > 0 && (
                  <>
                    <p className="text-sm text-gray-500">from</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${Math.min(...hotel.rooms.map((r) => r.base_price)).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">per night</p>
                  </>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Check-in</label>
                  <input
                    type="date"
                    defaultValue={checkIn}
                    className="w-full text-sm text-gray-900 bg-transparent border-0 outline-none mt-1"
                  />
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Check-out</label>
                  <input
                    type="date"
                    defaultValue={checkOut}
                    className="w-full text-sm text-gray-900 bg-transparent border-0 outline-none mt-1"
                  />
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Guests</label>
                  <p className="text-sm text-gray-900 mt-1">{guests} guest{guests !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {hotel.rooms && hotel.rooms.length > 0 ? (
                <Link href={`/checkout/${hotel.id}?roomId=${hotel.rooms[0].id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}>
                  <Button className="w-full" size="lg">Reserve a Room</Button>
                </Link>
              ) : (
                <Button className="w-full" size="lg" disabled>No Rooms Available</Button>
              )}

              <p className="text-xs text-gray-400 text-center mt-3">You won&apos;t be charged yet</p>

              <div className="mt-4 space-y-2">
                {['Free cancellation', 'No booking fees', 'Secure payment'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-green-500">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
