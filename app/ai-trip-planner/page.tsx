'use client'

import { useState } from 'react'
import { Sparkles, Send, Calendar, MapPin, Lightbulb, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateTripPlan } from '@/services/ai'
import type { TripPlanResult } from '@/services/ai'

const SAMPLE_PROMPTS = [
  '5 days in Dubai with family, budget $200/night',
  '1 week in Bali for a romantic honeymoon',
  'Weekend trip to Paris, luxury experience',
  '10 days exploring Japan, culture and food',
]

export default function AiTripPlannerPage() {
  const [prompt, setPrompt] = useState('')
  const [plan, setPlan] = useState<TripPlanResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const result = await generateTripPlan(prompt)
      setPlan(result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="bg-gradient-to-br from-blue-900 to-teal-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">AI Trip Planner</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Tell us where you want to go and we&apos;ll build a personalized itinerary in seconds.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Describe your dream trip
          </label>
          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 7 days in Dubai for a family of 4, budget $300/night, we love beaches and local culture..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none h-24 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && e.metaKey && handleGenerate()}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="gap-2 ml-3 flex-shrink-0">
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {loading ? 'Planning...' : 'Generate Plan'}
            </Button>
          </div>
        </div>

        {plan && !loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{plan.destination}</h2>
                  <p className="text-gray-600 mt-2 leading-relaxed">{plan.summary}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Best Time to Visit</p>
                      <p className="text-sm text-gray-900">{plan.bestTimeToVisit}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Estimated Budget</p>
                      <p className="text-sm text-gray-900">{plan.estimatedBudget}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Day-by-Day Itinerary</h3>
              </div>
              <div className="space-y-4">
                {plan.days.map((day) => (
                  <div key={day.day} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-5 py-3 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                        {day.day}
                      </span>
                      <h4 className="font-semibold text-white">{day.title}</h4>
                    </div>
                    <div className="p-5">
                      <div className="space-y-2 mb-4">
                        {day.activities.map((activity, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-sm text-gray-700">{activity}</p>
                          </div>
                        ))}
                      </div>
                      {day.meals && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                          {day.meals.map((meal, i) => (
                            <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-100">
                              🍽️ {meal}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {plan.tips.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  <h3 className="font-bold text-amber-900">Travel Tips</h3>
                </div>
                <ul className="space-y-2">
                  {plan.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                      <span className="text-amber-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Save Trip Plan
              </Button>
              <Button className="gap-2" onClick={() => window.location.href = '/hotels?destination=' + encodeURIComponent(plan.destination)}>
                <MapPin className="h-4 w-4" />
                Find Hotels in {plan.destination.split(',')[0]}
              </Button>
            </div>
          </div>
        )}

        {!plan && !loading && (
          <div className="text-center py-16 text-gray-400">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Your personalized itinerary will appear here</p>
            <p className="text-sm mt-1">Powered by AI — real OpenAI integration coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
