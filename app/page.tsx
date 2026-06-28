import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Clock, Star, Sparkles, Plane, Hotel } from 'lucide-react'
import SearchBar from '@/components/hotel/SearchBar'
import HotelCard from '@/components/hotel/HotelCard'
import { Button } from '@/components/ui/button'
import { getFeaturedHotels, getFeaturedDestinations } from '@/services/hotels'

export const revalidate = 3600

async function getHomeData() {
  try {
    const [hotels, destinations] = await Promise.all([
      getFeaturedHotels(),
      getFeaturedDestinations(),
    ])
    return { hotels, destinations }
  } catch {
    return { hotels: [], destinations: [] }
  }
}

export default async function HomePage() {
  const { hotels, destinations } = await getHomeData()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-800/40 to-blue-900/70" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20 mb-6">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            AI-powered travel planning
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Your next adventure
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              starts here
            </span>
          </h1>

          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Discover world-class hotels, find the best flights, and plan your perfect trip with AI — all in one place.
          </p>

          {/* Search tabs */}
          <div className="bg-white/10 backdrop-blur-sm rounded-t-xl border border-white/20 inline-flex mb-0">
            <button className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-white/20 rounded-tl-xl rounded-tr-none border-b-2 border-white">
              <Hotel className="h-4 w-4" />Hotels
            </button>
            <Link href="/flights" className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/70 hover:text-white transition-colors">
              <Plane className="h-4 w-4" />Flights
            </Link>
          </div>

          {/* Search bar */}
          <div className="rounded-tl-none rounded-tr-xl rounded-b-xl overflow-hidden">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      {destinations.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Destinations</h2>
              <p className="text-gray-500 mt-1">Hand-picked destinations for every type of traveler</p>
            </div>
            <Link href="/hotels">
              <Button variant="outline" className="gap-2 hidden sm:flex">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/hotels?destination=${encodeURIComponent(dest.name)}`}
                className="group relative rounded-xl overflow-hidden h-40 sm:h-52 bg-gray-200"
              >
                {dest.image_url && (
                  <Image
                    src={dest.image_url}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <p className="text-white font-bold text-base sm:text-lg leading-tight">{dest.name}</p>
                  <p className="text-white/70 text-xs sm:text-sm">{dest.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Hotels */}
      {hotels.length > 0 ? (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Hotels</h2>
              <p className="text-gray-500 mt-1">Top-rated properties our guests love</p>
            </div>
            <Link href="/hotels">
              <Button variant="outline" className="gap-2 hidden sm:flex">
                View all hotels <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {hotels.slice(0, 8).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/hotels">
              <Button size="lg" variant="outline" className="gap-2">
                Browse all hotels <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <div className="text-5xl mb-4">🏨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No hotels yet</h2>
            <p className="text-gray-500 mb-6">Run the Supabase seed to populate hotels, or add them via the Admin dashboard.</p>
            <Link href="/admin">
              <Button>Go to Admin Dashboard</Button>
            </Link>
          </div>
        </section>
      )}

      {/* AI Trip Planner CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Plan your trip with AI
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Tell our AI where you want to go and get a personalized day-by-day itinerary, hotel suggestions, and local tips — instantly.
          </p>
          <Link href="/ai-trip-planner">
            <Button size="xl" variant="premium" className="gap-3">
              <Sparkles className="h-5 w-5" />
              Try AI Trip Planner
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why book with us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
          Why book with TravelHub?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="h-7 w-7 text-blue-600" />,
              title: 'Secure Booking',
              desc: 'Your payment and personal data are always protected with bank-level encryption.',
            },
            {
              icon: <Clock className="h-7 w-7 text-teal-600" />,
              title: '24/7 Support',
              desc: 'Our travel experts are available around the clock to help with any issue.',
            },
            {
              icon: <Star className="h-7 w-7 text-yellow-500" />,
              title: 'Best Price Guarantee',
              desc: 'Find a lower price? We\'ll match it and give you an extra 10% off.',
            },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
