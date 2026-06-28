'use client'

import { useState } from 'react'
import { Plane, ArrowLeftRight, Search, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FlightCard from '@/components/flight/FlightCard'
import { searchFlights } from '@/services/flights'
import type { FlightResult, FlightSearchParams, CabinClass } from '@/types/flight'

export default function FlightsPage() {
  const [tripType, setTripType] = useState<'round_trip' | 'one_way'>('round_trip')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [travelers, setTravelers] = useState(1)
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy')
  const [results, setResults] = useState<FlightResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const swapCities = () => {
    const tmp = origin
    setOrigin(destination)
    setDestination(tmp)
  }

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate) return
    setLoading(true)
    setSearched(true)
    try {
      const params: FlightSearchParams = {
        origin, destination, departureDate,
        returnDate: tripType === 'round_trip' ? returnDate : undefined,
        travelers, cabinClass, tripType,
      }
      const data = await searchFlights(params)
      setResults(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-teal-700 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Search Flights</h1>
          </div>

          <div className="flex gap-3 mb-6">
            {(['round_trip', 'one_way'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  tripType === type ? 'bg-white text-blue-700 shadow' : 'text-white/80 hover:text-white'
                }`}
              >
                {type === 'round_trip' ? 'Round Trip' : 'One Way'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 px-1">FROM</label>
                  <Input
                    placeholder="City or airport code"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <button
                  className="mt-5 p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex-shrink-0"
                  onClick={swapCities}
                >
                  <ArrowLeftRight className="h-4 w-4 text-gray-500" />
                </button>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 px-1">TO</label>
                  <Input
                    placeholder="City or airport code"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 px-1">DEPART</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {tripType === 'round_trip' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 px-1">RETURN</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={departureDate || new Date().toISOString().split('T')[0]}
                      className="h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <div className="w-24">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 px-1">TRAVELERS</label>
                  <Input
                    type="number"
                    min={1}
                    max={9}
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="w-40">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 px-1">CABIN</label>
                  <Select value={cabinClass} onValueChange={(v) => setCabinClass(v as CabinClass)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSearch} size="lg" className="gap-2 w-full lg:w-auto" disabled={loading}>
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Mock flight data</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Flight results are simulated. Real-time data will be powered by Amadeus, Duffel, or Sabre APIs once connected.
            </p>
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-28 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-500">Try different dates or destinations.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-700 font-medium">{results.length} flights found</p>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                <option>Sort: Cheapest</option>
                <option>Sort: Fastest</option>
                <option>Sort: Best</option>
              </select>
            </div>
            <div className="space-y-4">
              {results.map((flight) => (
                <FlightCard key={flight.id} flight={flight} travelers={travelers} />
              ))}
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center py-20">
            <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Ready to fly?</h3>
            <p className="text-gray-400">Enter your route above to search available flights.</p>
          </div>
        )}
      </div>
    </div>
  )
}
