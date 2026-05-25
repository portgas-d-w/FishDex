import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { calculateFishingScore, getIdealSpeciesForConditions } from '@/lib/weather/fishing-score'

// Ce endpoint est appelé par un cron Vercel chaque vendredi soir (18h)
// Vercel cron config : { "crons": [{ "path": "/api/notifications/fishing", "schedule": "0 18 * * 5" }] }

const OPENWEATHER_KEYS = [
  process.env.OPENWEATHER_API_KEY_1,
  process.env.OPENWEATHER_API_KEY_2,
].filter(Boolean) as string[]

async function fetchWeekendForecast(lat: number, lon: number) {
  for (const key of OPENWEATHER_KEYS) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${key}&cnt=16`
      )
      if (res.ok) return await res.json()
    } catch { continue }
  }
  return null
}

export async function GET(req: Request) {
  // Vérifier le secret cron Vercel
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Récupérer les users Pro avec notifications activées
  const { data: prefs } = await admin
    .from('notification_preferences')
    .select('user_id, preferred_lat, preferred_lon, push_endpoint, push_keys')
    .eq('weather_notifications', true)

  if (!prefs?.length) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const pref of prefs) {
    if (!pref.preferred_lat || !pref.preferred_lon) continue

    const forecast = await fetchWeekendForecast(pref.preferred_lat, pref.preferred_lon)
    if (!forecast) continue

    // Prendre la météo du samedi matin (créneaux 6h-12h)
    type ForecastItem = { dt: number; dt_txt: string; main: { temp: number; pressure: number; humidity: number }; wind: { speed: number }; weather: { main: string }[] }
    const saturdayMorning = (forecast.list as ForecastItem[])?.find((f) =>
      new Date(f.dt * 1000).getDay() === 6
    )
    if (!saturdayMorning) continue

    const weather = {
      temp: Math.round(saturdayMorning.main.temp),
      wind_speed: Math.round(saturdayMorning.wind.speed * 3.6),
      conditions: saturdayMorning.weather[0].main.toLowerCase(),
      pressure: saturdayMorning.main.pressure,
      humidity: saturdayMorning.main.humidity,
    }

    const { score, label } = calculateFishingScore(weather)
    if (score < 55) continue  // Pas de notif si conditions médiocres

    const species = getIdealSpeciesForConditions(weather)
    const speciesText = species.length > 0 ? ` · ${species.slice(0, 2).join(', ')}` : ''

    await admin
      .from('notification_preferences')
      .update({ last_notified_at: new Date().toISOString() })
      .eq('user_id', pref.user_id)

    sent++
  }

  return NextResponse.json({ sent })
}
