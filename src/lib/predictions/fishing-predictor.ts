import { calculateFishingScore, getIdealSpeciesForConditions } from '@/lib/weather/fishing-score'

export type DayPrediction = {
  date: string          // ISO date string
  label: string         // 'Samedi 24 mai'
  score: number         // 0-100
  scoreLabel: string    // 'Excellent' | 'Bon' | 'Moyen' | 'Mauvais'
  temp: number
  conditions: string
  windSpeed: number
  bestWindow: string    // ex: 'Matin, 6h-9h'
  bestSpecies: string[]
  reasoning: string
}

const OPENWEATHER_KEYS = [
  process.env.OPENWEATHER_API_KEY_1,
  process.env.OPENWEATHER_API_KEY_2,
].filter(Boolean) as string[]

async function fetchForecast(lat: number, lon: number) {
  for (const key of OPENWEATHER_KEYS) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${key}&cnt=40`,
        { next: { revalidate: 3600 } }
      )
      if (res.ok) return await res.json()
    } catch { continue }
  }
  return null
}

function getBestWindow(temp: number, conditions: string): string {
  if (conditions === 'clouds' || conditions === 'drizzle') return 'Toute la journée'
  if (temp < 12) return 'Matin, 10h-13h (eau réchauffée)'
  if (temp > 25) return 'Aube, 5h-8h ou Crépuscule, 19h-21h'
  return 'Matin, 6h-10h'
}

function getReasoning(score: number, conditions: string, temp: number, windSpeed: number): string {
  const parts: string[] = []
  if (conditions === 'clouds') parts.push('ciel couvert favorable aux carnassiers')
  if (conditions === 'drizzle') parts.push('bruine — activité accrue des prédateurs')
  if (temp >= 10 && temp <= 20) parts.push('température optimale')
  if (windSpeed < 15) parts.push('vent faible')
  if (windSpeed > 25) parts.push('vent fort défavorable')
  if (conditions === 'thunderstorm') return 'Orage prévu — pêche déconseillée.'
  if (parts.length === 0) return 'Conditions standard.'
  return parts.join(', ').replace(/^./, c => c.toUpperCase()) + '.'
}

const COND_LABEL: Record<string, string> = {
  clear: 'Ciel dégagé', clouds: 'Nuageux', rain: 'Pluie',
  drizzle: 'Bruine', thunderstorm: 'Orage', snow: 'Neige', mist: 'Brume', fog: 'Brouillard',
}

export async function predictFishingWindows(
  lat: number,
  lon: number
): Promise<DayPrediction[]> {
  const forecast = await fetchForecast(lat, lon)
  if (!forecast?.list) return []

  // Grouper par jour
  const dayMap = new Map<string, { dt: number; main: { temp: number; pressure: number; humidity: number }; wind: { speed: number }; weather: { main: string }[] }[]>()
  for (const item of forecast.list) {
    const date = new Date(item.dt * 1000).toISOString().slice(0, 10)
    if (!dayMap.has(date)) dayMap.set(date, [])
    dayMap.get(date)!.push(item)
  }

  const predictions: DayPrediction[] = []
  const today = new Date().toISOString().slice(0, 10)

  for (const [date, items] of dayMap.entries()) {
    if (date <= today) continue

    // Prendre le créneau matin (6h-10h) ou le premier disponible
    const morningItem = items.find(i => {
      const h = new Date(i.dt * 1000).getHours()
      return h >= 6 && h <= 10
    }) ?? items[0]

    const weather = {
      temp: Math.round(morningItem.main.temp),
      wind_speed: Math.round(morningItem.wind.speed * 3.6),
      conditions: morningItem.weather[0].main.toLowerCase(),
      pressure: morningItem.main.pressure,
      humidity: morningItem.main.humidity,
    }

    const { score, label } = calculateFishingScore(weather)
    const bestSpecies = getIdealSpeciesForConditions(weather)
    const d = new Date(date)
    const label_date = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    const label_cond = COND_LABEL[weather.conditions] ?? weather.conditions

    predictions.push({
      date,
      label: label_date.charAt(0).toUpperCase() + label_date.slice(1),
      score,
      scoreLabel: label,
      temp: weather.temp,
      conditions: label_cond,
      windSpeed: weather.wind_speed,
      bestWindow: getBestWindow(weather.temp, weather.conditions),
      bestSpecies,
      reasoning: getReasoning(score, weather.conditions, weather.temp, weather.wind_speed),
    })

    if (predictions.length >= 5) break
  }

  return predictions
}
