export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first'

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  travelers: number
  cabinClass: CabinClass
  tripType: 'one_way' | 'round_trip'
}

export interface FlightResult {
  id: string
  airline: string
  airlineCode: string
  airlineLogo?: string
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  stopDetails?: string[]
  price: number
  currency: string
  cabinClass: CabinClass
  seatsLeft?: number
}

export interface FlightSearch {
  id: string
  user_id?: string
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  travelers: number
  cabin_class: CabinClass
  created_at: string
}
