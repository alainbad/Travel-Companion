export interface Destination {
  id: string
  name: string
  country: string
  city?: string
  description?: string
  image_url?: string
  is_featured: boolean
  created_at: string
}

export interface Hotel {
  id: string
  owner_id?: string
  destination_id?: string
  name: string
  slug?: string
  description?: string
  address?: string
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  star_rating?: number
  guest_rating?: number
  review_count: number
  main_image_url?: string
  is_featured: boolean
  status: 'draft' | 'active' | 'inactive'
  created_at: string
  updated_at: string
  // joined fields
  destination?: Destination
  rooms?: Room[]
  amenities?: Amenity[]
  images?: HotelImage[]
}

export interface HotelImage {
  id: string
  hotel_id: string
  image_url: string
  alt_text?: string
  sort_order: number
  created_at: string
}

export interface Amenity {
  id: string
  name: string
  icon?: string
  category?: string
}

export interface Room {
  id: string
  hotel_id: string
  name: string
  description?: string
  max_guests?: number
  bed_type?: string
  size_sqm?: number
  base_price: number
  currency: string
  image_url?: string
  is_active: boolean
  created_at: string
  // joined
  availability?: RoomAvailability[]
}

export interface RoomAvailability {
  id: string
  room_id: string
  date: string
  available_units: number
  price?: number
  currency: string
}

export interface HotelSearchFilters {
  destination?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  starRating?: number
  amenities?: string[]
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity'
}
