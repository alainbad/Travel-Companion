import { Clock, Users, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { FlightResult } from '@/types/flight'

interface FlightCardProps {
  flight: FlightResult
  travelers?: number
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function FlightCard({ flight, travelers = 1 }: FlightCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Airline */}
        <div className="flex items-center gap-3 sm:w-40">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm">
            {flight.airlineCode}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{flight.airline}</p>
            <p className="text-xs text-gray-400">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Route */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
            <p className="text-sm font-semibold text-gray-700">{flight.origin}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 min-w-[100px]">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />{flight.duration}
            </p>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-gray-300" />
              <Plane className="h-3.5 w-3.5 text-blue-500 rotate-90" />
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <p className="text-xs text-gray-400">
              {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
            <p className="text-sm font-semibold text-gray-700">{flight.destination}</p>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:min-w-[140px]">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(flight.price, flight.currency)}
            </p>
            <p className="text-xs text-gray-500">
              {travelers > 1 ? `${formatCurrency(flight.price / travelers)} per person` : 'per person'}
            </p>
            {flight.seatsLeft && flight.seatsLeft <= 5 && (
              <Badge variant="warning" className="mt-1">{flight.seatsLeft} seats left</Badge>
            )}
          </div>
          <Button>Select</Button>
        </div>
      </div>

      {/* Cabin class & stops info */}
      <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
        <Badge variant="secondary" className="capitalize">{flight.cabinClass.replace('_', ' ')}</Badge>
        {flight.stops === 0 && <Badge variant="success">Non-stop</Badge>}
        {flight.stopDetails?.map((s) => (
          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
        ))}
      </div>
    </div>
  )
}
