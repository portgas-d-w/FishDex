import type { Weather } from '@/lib/home/poetic-phrases'
import type { WeatherData } from '@/app/actions/weather'

/**
 * Classifie une réponse OpenWeather en type Weather FishDex.
 * Utilise le condition_id OWM (plus fiable que la description texte).
 *
 * Codes OWM :
 *   2xx = Thunderstorm
 *   3xx = Drizzle
 *   5xx = Rain
 *   6xx = Snow
 *   7xx = Atmosphere (fog, mist, haze...)
 *   800 = Clear sky
 *   80x = Clouds
 */
export function classifyWeather(data: WeatherData): Weather {
  const id = data.condition_id

  if (id >= 200 && id < 300) return 'rainy'   // orage → rainy
  if (id >= 300 && id < 400) return 'rainy'   // bruine
  if (id >= 500 && id < 600) return 'rainy'   // pluie
  if (id >= 600 && id < 700) return 'snowy'   // neige
  if (id >= 700 && id < 800) return 'foggy'   // brouillard, brume, brume sèche
  if (id === 800)             return 'clear'   // ciel dégagé
  if (id > 800)               return 'cloudy'  // nuages partiels à couverts

  // Fallback via description texte
  const desc = data.conditions.toLowerCase()
  if (desc.includes('snow'))                          return 'snowy'
  if (desc.includes('rain') || desc.includes('drizzle')) return 'rainy'
  if (desc.includes('fog')  || desc.includes('mist'))   return 'foggy'
  if (desc.includes('cloud'))                         return 'cloudy'

  return 'clear'
}

/**
 * Icône Lucide suggérée selon le type de météo.
 */
export function weatherIcon(weather: Weather): string {
  const map: Record<Weather, string> = {
    clear:  'Sun',
    cloudy: 'Cloud',
    rainy:  'CloudRain',
    foggy:  'CloudFog',
    snowy:  'Snowflake',
  }
  return map[weather]
}

/**
 * Label français court pour affichage.
 */
export function weatherLabel(weather: Weather): string {
  const map: Record<Weather, string> = {
    clear:  'Ciel dégagé',
    cloudy: 'Nuageux',
    rainy:  'Pluvieux',
    foggy:  'Brumeux',
    snowy:  'Neigeux',
  }
  return map[weather]
}
