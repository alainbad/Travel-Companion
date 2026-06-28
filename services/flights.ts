import type { FlightResult, FlightSearchParams } from '@/types/flight'

// Mock flight data — replace with Amadeus / Sabre / Duffel integration later
const MOCK_AIRLINES = [
  { name: 'Emirates', code: 'EK' },
  { name: 'Etihad Airways', code: 'EY' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'FlyDubai', code: 'FZ' },
  { name: 'Air Arabia', code: 'G9' },
  { name: 'British Airways', code: 'BA' },
]

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function addMinutes(base: Date, minutes: number): string {
  const d = new Date(base.getTime() + minutes * 60 * 1000)
  return d.toISOString()
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightResult[]> {
  await new Promise((r) => setTimeout(r, 800))

  const baseDate = new Date(`${params.departureDate}T06:00:00`)
  const cabinMultiplier =
    params.cabinClass === 'first' ? 5
    : params.cabinClass === 'business' ? 3
    : params.cabinClass === 'premium_economy' ? 1.8
    : 1

  return MOCK_AIRLINES.map((airline, i) => {
    const departureOffset = randomBetween(0, 16) * 60
    const durationMinutes = randomBetween(150, 480)
    const departureTime = addMinutes(baseDate, departureOffset)
    const arrivalTime = addMinutes(new Date(departureTime), durationMinutes)
    const stops = i < 3 ? 0 : 1
    const basePrice = randomBetween(180, 800) * params.travelers * cabinMultiplier

    return {
      id: `${airline.code}-${i}-${Date.now()}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${randomBetween(100, 999)}`,
      origin: params.origin.toUpperCase(),
      destination: params.destination.toUpperCase(),
      departureTime,
      arrivalTime,
      duration: formatDuration(durationMinutes),
      stops,
      stopDetails: stops > 0 ? ['Dubai International Airport'] : undefined,
      price: Math.round(basePrice),
      currency: 'USD',
      cabinClass: params.cabinClass,
      seatsLeft: randomBetween(1, 9),
    }
  }).sort((a, b) => a.price - b.price)
}

export async function getFlightDetails(id: string): Promise<FlightResult | null> {
  return null
}

export async function createFlightBooking(data: {
  flightId: string
  passengers: number
  cabinClass: string
}) {
  return { bookingRef: `TH-${Date.now()}`, status: 'pending' }
}
