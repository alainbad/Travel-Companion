import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SlidersHorizontal } from 'lucide-react'
import SearchBar from '@/components/hotel/SearchBar'
import HotelCard from '@/components/hotel/HotelCard'
import { searchHotels } from '@/services/hotels'
import type { HotelSearchFilters } from '@/types/hotel'

export const metadata: Metadata = {
  title: 'Hotel Search',
  description: 'Search hotels worldwide. Filter by price, rating, amenities, and more.',
}

interface PageProps {
  searchParams: Promise<{
    destination?: string
    checkIn?: string
    checkOut?: string
    guests?: string
    minPrice?: string
    maxPrice?: string
    minRating?: string
    sortBy?: string
  }>
}

async function HotelResults({ filters, checkIn, checkOut, guests }: {
  filters: HotelSearchFilters
  checkIn?: string
  checkOut?: string
  guests?: number
}) {
  let hotels: import('@/types/hotel').Hotel[] = []
  try {
    hotels = await searchHotels(filters)
  } catch {
    hotels = []
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No hotels found</h3>
        <p className="text-gray-500">Try adjusting your search or browse all available hotels.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{hotels.length} properties found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} checkIn={checkIn} checkOut={checkOut} guests={guests} />
        ))}
      </div>
    </div>
  )
}

export default async function HotelsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: HotelSearchFilters = {
    destination: params.destination,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    guests: params.guests ? parseInt(params.guests) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    minRating: params.minRating ? parseFloat(params.minRating) : undefined,
    sortBy: params.sortBy as HotelSearchFilters['sortBy'],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SearchBar
            initialValues={{
              destination: filters.destination,
              checkIn: filters.checkIn,
              checkOut: filters.checkOut,
              guests: filters.guests,
            }}
            compact
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Price per night</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <input type="number" placeholder="Max" className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Star rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="text-sm text-gray-700">{'⭐'.repeat(stars)} {stars} stars</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Guest rating</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Exceptional (9+)', value: 9 },
                    { label: 'Excellent (8+)', value: 8 },
                    { label: 'Very Good (7+)', value: 7 },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Amenities</h4>
                <div className="space-y-2">
                  {['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Beach Access'].map((am) => (
                    <label key={am} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="text-sm text-gray-700">{am}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                {filters.destination ? `Hotels in ${filters.destination}` : 'All Hotels'}
              </h1>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                <option value="">Sort: Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>

            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 h-80 animate-pulse" />
                ))}
              </div>
            }>
              <HotelResults
                filters={filters}
                checkIn={filters.checkIn}
                checkOut={filters.checkOut}
                guests={filters.guests}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
