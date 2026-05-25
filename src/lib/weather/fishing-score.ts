export type WeatherSnapshot = {
  temp: number
  wind_speed: number
  conditions: string  // 'clear', 'clouds', 'rain', 'drizzle', 'thunderstorm', 'snow', 'mist'
  pressure: number
  humidity: number
}

export type FishingScore = {
  score: number       // 0-100
  label: string       // 'Excellent' | 'Bon' | 'Moyen' | 'Mauvais'
  reasons: string[]
}

export function calculateFishingScore(weather: WeatherSnapshot): FishingScore {
  let score = 50
  const reasons: string[] = []

  // Température
  if (weather.temp >= 10 && weather.temp <= 22) {
    score += 15
    reasons.push('Température idéale')
  } else if (weather.temp < 5 || weather.temp > 30) {
    score -= 20
    reasons.push(weather.temp < 5 ? 'Trop froid' : 'Trop chaud')
  }

  // Vent (en km/h)
  if (weather.wind_speed < 15) {
    score += 10
    reasons.push('Vent faible')
  } else if (weather.wind_speed > 30) {
    score -= 15
    reasons.push(`Vent fort (${weather.wind_speed} km/h)`)
  }

  // Conditions nuageuses (favorables pour les carnassiers)
  if (weather.conditions === 'clouds' || weather.conditions === 'drizzle') {
    score += 12
    reasons.push('Ciel couvert favorable')
  } else if (weather.conditions === 'thunderstorm') {
    score -= 30
    reasons.push('Orage — dangereux')
  } else if (weather.conditions === 'rain') {
    score -= 10
    reasons.push('Pluie modérée')
  } else if (weather.conditions === 'clear') {
    // Clear peut être bien le matin mais mauvais le midi
    score += 5
  }

  // Pression atmosphérique (idéale 1013-1025 hPa, stable)
  if (weather.pressure >= 1010 && weather.pressure <= 1025) {
    score += 8
    reasons.push('Pression stable')
  } else if (weather.pressure < 995) {
    score -= 12
    reasons.push('Dépression (pression basse)')
  }

  score = Math.max(0, Math.min(100, score))

  const label =
    score >= 75 ? 'Excellent' :
    score >= 55 ? 'Bon' :
    score >= 35 ? 'Moyen' : 'Mauvais'

  return { score, label, reasons }
}

export function getIdealSpeciesForConditions(weather: WeatherSnapshot): string[] {
  const species: string[] = []

  if (weather.conditions === 'clouds' || weather.conditions === 'drizzle') {
    species.push('Brochet', 'Sandre', 'Perche')
  }
  if (weather.temp >= 8 && weather.temp <= 16) {
    species.push('Truite fario', 'Ombre commun')
  }
  if (weather.temp >= 18 && weather.temp <= 26) {
    species.push('Carpe commune', 'Brochet', 'Black-bass')
  }
  if (weather.conditions === 'clear' && weather.temp >= 12) {
    species.push('Gardon', 'Brème', 'Tanche')
  }

  return [...new Set(species)].slice(0, 3)
}
