// AI travel assistant service — integrate OpenAI later

export interface TripPlanResult {
  destination: string
  summary: string
  days: DayPlan[]
  estimatedBudget: string
  bestTimeToVisit: string
  tips: string[]
}

export interface DayPlan {
  day: number
  title: string
  activities: string[]
  accommodation?: string
  meals?: string[]
}

const MOCK_PLANS: Record<string, TripPlanResult> = {
  default: {
    destination: 'Dubai, UAE',
    summary: 'A luxurious city escape blending modern architecture, desert adventures, and world-class dining.',
    bestTimeToVisit: 'November to March (cooler weather, outdoor activities)',
    estimatedBudget: '$150–$400/night for hotels, $50–$150/day for activities',
    days: [
      {
        day: 1,
        title: 'Arrival & Downtown Discovery',
        activities: [
          'Check into hotel and freshen up',
          'Visit the Burj Khalifa observation deck (At the Top)',
          'Stroll Dubai Mall and visit the Dubai Aquarium',
          'Watch the Dubai Fountain show at sunset',
          'Dinner at a downtown restaurant',
        ],
        meals: ['Lunch at The Dubai Mall food court', 'Dinner at Zuma Dubai'],
      },
      {
        day: 2,
        title: 'Old Dubai & Culture',
        activities: [
          'Morning at the Gold Souk and Spice Souk in Deira',
          'Abra (water taxi) ride across Dubai Creek',
          'Explore Al Fahidi Historical Neighbourhood',
          'Visit the Dubai Museum',
          'Afternoon at Jumeirah Beach',
          'Evening at La Mer beachfront',
        ],
        meals: ['Breakfast at hotel', 'Lunch at Al Ustad Special Kabab', 'Dinner at a beachside restaurant'],
      },
      {
        day: 3,
        title: 'Desert Adventure',
        activities: [
          'Morning leisure at hotel',
          'Afternoon desert safari: dune bashing, camel riding',
          'Sandboarding on the dunes',
          'Bedouin camp dinner with live entertainment',
          'Stargazing in the desert',
        ],
        meals: ['Breakfast at hotel', 'Light lunch before safari', 'Dinner at desert camp'],
      },
    ],
    tips: [
      'Book Burj Khalifa tickets in advance to skip queues',
      'Use the Dubai Metro for affordable and quick city travel',
      'Dress modestly when visiting mosques and traditional areas',
      'Tap water is safe but locals prefer bottled water',
      'Friday is the main day off — expect crowds at popular spots',
    ],
  },
}

export async function generateTripPlan(prompt: string): Promise<TripPlanResult> {
  await new Promise((r) => setTimeout(r, 1500))

  const lower = prompt.toLowerCase()
  if (lower.includes('paris')) {
    return {
      ...MOCK_PLANS.default,
      destination: 'Paris, France',
      summary: 'The City of Light — art, cuisine, fashion, and iconic landmarks await.',
      bestTimeToVisit: 'April–June and September–October',
      estimatedBudget: '$200–$600/night for hotels, $80–$200/day for activities',
    }
  }
  if (lower.includes('bali')) {
    return {
      ...MOCK_PLANS.default,
      destination: 'Bali, Indonesia',
      summary: 'Tropical paradise with stunning temples, rice terraces, and surf beaches.',
      bestTimeToVisit: 'April–October (dry season)',
      estimatedBudget: '$50–$300/night for hotels, $30–$80/day for activities',
    }
  }
  return MOCK_PLANS.default
}

export async function recommendHotels(
  destination: string,
  budget: number,
  preferences: string[]
) {
  await new Promise((r) => setTimeout(r, 500))
  return {
    recommendations: [],
    reasoning: `Based on your budget of $${budget}/night and preferences for ${preferences.join(', ')}, here are the top picks in ${destination}.`,
  }
}

export async function generateDayByDayItinerary(
  destination: string,
  days: number,
  travelStyle: string
) {
  const result = await generateTripPlan(`${days} days in ${destination}, ${travelStyle} style`)
  return result.days.slice(0, days)
}
