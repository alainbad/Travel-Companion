export type BookingStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'completed'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export interface Booking {
  id: string
  user_id?: string
  hotel_id: string
  room_id: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  currency: string
  status: BookingStatus
  payment_status: PaymentStatus
  guest_full_name?: string
  guest_email?: string
  guest_phone?: string
  created_at: string
  // joined
  hotel?: {
    id: string
    name: string
    main_image_url?: string
    city?: string
    country?: string
    star_rating?: number
  }
  room?: {
    id: string
    name: string
    bed_type?: string
  }
}

export interface CreateBookingInput {
  hotel_id: string
  room_id: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  currency?: string
  guest_full_name: string
  guest_email: string
  guest_phone?: string
}
