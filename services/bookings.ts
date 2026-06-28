import { createClient } from '@/lib/supabase'
import type { Booking, BookingStatus, CreateBookingInput } from '@/types/booking'

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...input,
      user_id: user?.id ?? null,
      status: 'pending_payment',
      payment_status: 'unpaid',
      currency: input.currency ?? 'USD',
    })
    .select()
    .single()

  if (error) throw error
  return data as Booking
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      hotel:hotels(id, name, main_image_url, city, country, star_rating),
      room:rooms(id, name, bed_type)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Booking[]
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      hotel:hotels(id, name, main_image_url, city, country, star_rating, address),
      room:rooms(id, name, bed_type, size_sqm, max_guests)
    `)
    .eq('id', bookingId)
    .single()

  if (error) return null
  return data as Booking
}

export async function cancelBooking(bookingId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) throw error
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (error) throw error
}

export async function getAllBookings(): Promise<Booking[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      hotel:hotels(id, name, city, country),
      room:rooms(id, name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Booking[]
}
