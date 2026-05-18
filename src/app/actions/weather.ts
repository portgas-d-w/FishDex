'use server'

import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// ── Types ─────────────────────────────────────────────────────────────────────

export type WeatherData = {
  temp:        number    // °C
  feels_like:  number    // °C
  humidity:    number    // %
  wind_speed:  number    // km/h
  wind_dir:    string    // N, NE, E, SE, S, SO, O, NO
  conditions:  string    // description libre OpenWeather
  condition_id: number   // code OWM (800 = clear, 801-804 = clouds, etc.)
  pressure:    number    // hPa
  sunrise:     string    // HH:MM format local
  sunset:      string    // HH:MM format local
  city:        string
  icon:        string    // ex: "01d"
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function degToCardinal(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(deg / 45) % 8]
}

function tsToTime(ts: number, offset: number): string {
  const d = new Date((ts + offset) * 1000)
  const h = String(d.getUTCHours()).padStart(2, '0')
  const m = String(d.getUTCMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function mapToWeatherData(raw: Record<string, unknown>): WeatherData {
  const main    = raw.main    as Record<string, number>
  const wind    = raw.wind    as Record<string, number>
  const sys     = raw.sys     as Record<string, number>
  const weather = (raw.weather as Record<string, unknown>[])?.[0] ?? {}
  const offset  = (raw.timezone as number) ?? 0

  return {
    temp:         Math.round(main.temp),
    feels_like:   Math.round(main.feels_like),
    humidity:     main.humidity,
    wind_speed:   Math.round((wind.speed ?? 0) * 3.6),   // m/s → km/h
    wind_dir:     degToCardinal(wind.deg ?? 0),
    conditions:   (weather.description as string | undefined) ?? '',
    condition_id: weather.id as number ?? 800,
    pressure:     main.pressure,
    sunrise:      tsToTime(sys.sunrise, offset),
    sunset:       tsToTime(sys.sunset, offset),
    city:         (raw.name as string | undefined) ?? '',
    icon:         (weather.icon as string | undefined) ?? '01d',
  }
}

// ── Fetch avec cache 15 min ───────────────────────────────────────────────────

const _fetchWeather = unstable_cache(
  async (lat: number, lng: number): Promise<WeatherData | null> => {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.warn('[Weather] OPENWEATHER_API_KEY manquante — météo désactivée')
      return null
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=fr&appid=${apiKey}`

    try {
      const res = await fetch(url, { next: { revalidate: 900 } })
      if (!res.ok) {
        console.error('[Weather] API error:', res.status, await res.text())
        return null
      }
      const data = await res.json() as Record<string, unknown>
      return mapToWeatherData(data)
    } catch (e) {
      console.error('[Weather] Fetch failed:', e)
      return null
    }
  },
  ['openweather'],
  { revalidate: 900 }  // 15 min
)

export async function getWeather(lat: number, lng: number): Promise<WeatherData | null> {
  // Arrondir les coords pour maximiser les hits de cache
  const latR = Math.round(lat * 100) / 100
  const lngR = Math.round(lng * 100) / 100
  return _fetchWeather(latR, lngR)
}

// ── Coords par défaut : Paris ──────────────────────────────────────────────────

const DEFAULT_COORDS = { lat: 48.8566, lng: 2.3522, city: 'Paris' }

// ── Obtenir la météo pour l'user (spot favori ou Paris) ───────────────────────

export async function getWeatherForUser(): Promise<{
  weather: WeatherData | null
  coords: { lat: number; lng: number }
  source: 'spot' | 'default'
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Spot le plus visité avec des coordonnées
    const { data: spot } = await supabase
      .from('spots')
      .select('nom, latitude, longitude, nb_visites')
      .eq('user_id', user.id)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('nb_visites', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (spot?.latitude && spot.longitude) {
      const weather = await getWeather(spot.latitude, spot.longitude)
      return { weather, coords: { lat: spot.latitude, lng: spot.longitude }, source: 'spot' }
    }
  }

  // Fallback Paris
  const weather = await getWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng)
  return { weather, coords: DEFAULT_COORDS, source: 'default' }
}
