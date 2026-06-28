import { createClient } from '@/lib/supabase'
import type { Hotel, HotelSearchFilters, Room, RoomAvailability } from '@/types/hotel'

export async function searchHotels(filters: HotelSearchFilters): Promise<Hotel[]> {
  const supabase = createClient()
  let query = supabase
    .from('hotels')
    .select(`
      *,
      destination:destinations(*),
      rooms(*)
    `)
    .eq('status', 'active')

  if (filters.destination) {
    query = query.or(
      `city.ilike.%${filters.destination}%,country.ilike.%${filters.destination}%,name.ilike.%${filters.destination}%`
    )
  }
  if (filters.minPrice) {
    query = query.gte('rooms.base_price', filters.minPrice)
  }
  if (filters.maxPrice) {
    query = query.lte('rooms.base_price', filters.maxPrice)
  }
  if (filters.minRating) {
    query = query.gte('guest_rating', filters.minRating)
  }
  if (filters.starRating) {
    query = query.eq('star_rating', filters.starRating)
  }

  switch (filters.sortBy) {
    case 'rating':
      query = query.order('guest_rating', { ascending: false })
      break
    case 'popularity':
      query = query.order('review_count', { ascending: false })
      break
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Hotel[]
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('hotels')
    .select(`
      *,
      destination:destinations(*),
      rooms(*),
      images:hotel_images(*),
      hotel_amenities(amenity:amenities(*))
    `)
    .eq('id', id)
    .single()

  if (error) return null
  const hotel = data as Record<string, unknown>
  const amenities = ((hotel.hotel_amenities as Array<{ amenity: unknown }>) ?? []).map((ha) => ha.amenity)
  return { ...hotel, amenities } as Hotel
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('hotels')
    .select(`
      *,
      destination:destinations(*),
      rooms(*),
      images:hotel_images(*),
      hotel_amenities(amenity:amenities(*))
    `)
    .eq('slug', slug)
    .single()

  if (error) return null
  const hotel = data as Record<string, unknown>
  const amenities = ((hotel.hotel_amenities as Array<{ amenity: unknown }>) ?? []).map((ha) => ha.amenity)
  return { ...hotel, amenities } as Hotel
}

export async function getFeaturedHotels(): Promise<Hotel[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('hotels')
    .select(`*, destination:destinations(*), rooms(base_price, currency)`)
    .eq('is_featured', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) throw error
  return (data ?? []) as Hotel[]
}

export async function getRoomsByHotel(hotelId: string): Promise<Room[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('hotel_id', hotelId)
    .eq('is_active', true)

  if (error) throw error
  return (data ?? []) as Room[]
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<RoomAvailability[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('room_availability')
    .select('*')
    .eq('room_id', roomId)
    .gte('date', checkIn)
    .lte('date', checkOut)
    .gt('available_units', 0)

  if (error) throw error
  return (data ?? []) as RoomAvailability[]
}

export async function getFeaturedDestinations() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_featured', true)
    .order('name')
    .limit(8)

  if (error) throw error
  return data ?? []
}
