'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  initialValues?: {
    destination?: string
    checkIn?: string
    checkOut?: string
    guests?: number
  }
  compact?: boolean
}

export default function SearchBar({ initialValues, compact = false }: SearchBarProps) {
  const router = useRouter()
  const [destination, setDestination] = useState(initialValues?.destination ?? '')
  const [checkIn, setCheckIn] = useState(initialValues?.checkIn ?? '')
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut ?? '')
  const [guests, setGuests] = useState(initialValues?.guests ?? 2)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('guests', String(guests))
    router.push(`/hotels?${params.toString()}`)
  }

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
        <div className="flex-1 flex items-center gap-2 px-3">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Input
            placeholder="Where to?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border-0 shadow-none h-8 p-0 focus-visible:ring-0"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        {/* Destination */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Where</label>
            <Input
              placeholder="Destination, hotel, or city"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border-0 shadow-none h-auto p-0 text-sm focus-visible:ring-0 placeholder:text-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full text-sm text-gray-900 bg-transparent border-0 outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="w-full text-sm text-gray-900 bg-transparent border-0 outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <Users className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Guests</label>
            <div className="flex items-center gap-2">
              <button
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
                onClick={() => setGuests(Math.max(1, guests - 1))}
              >-</button>
              <span className="text-sm font-medium w-6 text-center">{guests}</span>
              <button
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
                onClick={() => setGuests(guests + 1)}
              >+</button>
              <span className="text-sm text-gray-500">{guests === 1 ? 'guest' : 'guests'}</span>
            </div>
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-center px-4 py-3">
          <Button onClick={handleSearch} size="lg" variant="premium" className="gap-2 min-w-[120px]">
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
