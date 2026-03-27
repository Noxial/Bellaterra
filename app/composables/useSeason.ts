export type Season = 'winter' | 'spring' | 'summer' | 'fall'

export interface SeasonConfig {
  id: Season
  label: string
  months: string
  tagline: string
  description: string
  temperature: string
  activities: string[]
  image: string
  overlayColor: string
  accentColor: string
  textColor: string
  imageFilter: string  // CSS filter string for seasonal color grading
}

export const SEASONS: SeasonConfig[] = [
  {
    id: 'winter',
    label: 'Winter',
    months: 'Dec — Mar',
    tagline: 'Stillness and fire.',
    description: 'Snow-covered mornings, long evenings by the fireplace. A season for deep rest, creative work, and unhurried time.',
    temperature: '−5 to 5°C',
    activities: ['Skiing', 'Snowshoeing', 'Fireside reading', 'Nordic baths'],
    image: '/uploads/salon-rdc.jpg',
    overlayColor: 'bg-chocolate/65',
    accentColor: 'text-stone',
    textColor: 'text-cream',
    imageFilter: 'saturate(0.75) brightness(0.88) hue-rotate(15deg)',
  },
  {
    id: 'spring',
    label: 'Spring',
    months: 'Apr — Jun',
    tagline: 'The world wakes gently.',
    description: 'Wildflowers in the meadows, cool mornings giving way to warm afternoons. Perfect for creative escapes and slow exploration.',
    temperature: '8 to 18°C',
    activities: ['Hiking', 'Botanical walks', 'Outdoor dining', 'Photography'],
    image: '/uploads/entree.jpg',
    overlayColor: 'bg-cocoa/40',
    accentColor: 'text-amber',
    textColor: 'text-cream',
    imageFilter: 'saturate(1.05) brightness(1.0)',
  },
  {
    id: 'summer',
    label: 'Summer',
    months: 'Jul — Sep',
    tagline: 'Long light, open air.',
    description: 'Golden afternoons stretching into warm evenings. The terrace becomes your living room, the landscape your daily view.',
    temperature: '18 to 28°C',
    activities: ['Swimming', 'Mountain cycling', 'Alfresco dining', 'Sunrise walks'],
    image: '/uploads/salle-a-manger.jpg',
    overlayColor: 'bg-espresso/35',
    accentColor: 'text-amber',
    textColor: 'text-cream',
    imageFilter: 'saturate(1.2) brightness(1.06)',
  },
  {
    id: 'fall',
    label: 'Autumn',
    months: 'Oct — Nov',
    tagline: 'Amber light and harvest calm.',
    description: 'The forest turns to copper and gold. Cool days with crystalline light — a season of reflection, warmth, and beautiful solitude.',
    temperature: '5 to 15°C',
    activities: ['Forest walks', 'Foraging', 'Wine & cuisine', 'Long reading days'],
    image: '/uploads/salon-1er.jpg',
    overlayColor: 'bg-cocoa/55',
    accentColor: 'text-terracotta',
    textColor: 'text-cream',
    imageFilter: 'saturate(0.9) brightness(0.92) sepia(0.18)',
  },
]

export const useSeason = () => useState<Season | null>('selectedSeason', () => null)
