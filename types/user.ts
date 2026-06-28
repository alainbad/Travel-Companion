export type UserRole = 'user' | 'partner' | 'admin'

export interface Profile {
  id: string
  full_name?: string
  email?: string
  phone?: string
  role: UserRole
  avatar_url?: string
  created_at: string
}

export interface Wishlist {
  id: string
  user_id: string
  hotel_id: string
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  hotel_id: string
  booking_id?: string
  rating: number
  comment?: string
  created_at: string
  profile?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface AiTripPlan {
  id: string
  user_id?: string
  destination?: string
  prompt?: string
  itinerary?: Record<string, unknown>
  created_at: string
}
