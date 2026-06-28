// Payment service placeholder — integrate Stripe later

export async function createPaymentIntent(bookingId: string, amount: number, currency = 'USD') {
  console.log('createPaymentIntent placeholder', { bookingId, amount, currency })
  return {
    clientSecret: 'placeholder_client_secret',
    paymentIntentId: `pi_placeholder_${Date.now()}`,
  }
}

export async function confirmPayment(paymentId: string) {
  console.log('confirmPayment placeholder', { paymentId })
  return { success: true, paymentId }
}

export async function markBookingPaid(bookingId: string) {
  const { createClient } = await import('@/lib/supabase')
  const supabase = createClient()
  const { error } = await supabase
    .from('bookings')
    .update({ payment_status: 'paid', status: 'confirmed' })
    .eq('id', bookingId)

  if (error) throw error
}

export async function refundPayment(bookingId: string) {
  console.log('refundPayment placeholder', { bookingId })
  const { createClient } = await import('@/lib/supabase')
  const supabase = createClient()
  await supabase
    .from('bookings')
    .update({ payment_status: 'refunded', status: 'cancelled' })
    .eq('id', bookingId)
}
