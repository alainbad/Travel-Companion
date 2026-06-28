'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Globe, User, Heart, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TravelHub</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/hotels" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Hotels
            </Link>
            <Link href="/flights" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Flights
            </Link>
            <Link href="/ai-trip-planner" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              AI Planner
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/hotels" className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setMenuOpen(false)}>Hotels</Link>
          <Link href="/flights" className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setMenuOpen(false)}>Flights</Link>
          <Link href="/ai-trip-planner" className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setMenuOpen(false)}>AI Planner</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="block text-sm font-medium text-red-600 py-2 w-full text-left" onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/login" onClick={() => setMenuOpen(false)}><Button variant="outline" size="sm" className="w-full">Sign in</Button></Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}><Button size="sm" className="w-full">Sign up</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
