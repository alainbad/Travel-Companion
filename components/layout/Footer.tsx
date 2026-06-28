import Link from 'next/link'
import { Globe, Share2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TravelHub</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your ultimate travel companion for the Middle East and beyond. Discover, book, and experience the world with confidence.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hotels" className="hover:text-white transition-colors">Hotels</Link></li>
              <li><Link href="/flights" className="hover:text-white transition-colors">Flights</Link></li>
              <li><Link href="/ai-trip-planner" className="hover:text-white transition-colors">AI Trip Planner</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Travel Deals</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Destinations</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/partner" className="hover:text-white transition-colors">Partner Portal</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TravelHub. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>🇦🇪 Dubai, UAE</span>
            <span>USD $</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
