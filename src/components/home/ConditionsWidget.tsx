'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Snowflake, Sunrise, Sunset } from 'lucide-react'
import type { WeatherData } from '@/app/actions/weather'
import { getWeather } from '@/app/actions/weather'
import { getClientCoordinates } from '@/lib/weather/client'
import type { Weather } from '@/lib/home/poetic-phrases'

type Props = {
  weather: WeatherData | null
  classified: Weather
  source?: 'spot' | 'default' | 'gps'
}

const ICON_MAP: Record<Weather, React.ElementType> = {
  clear:  Sun,
  cloudy: Cloud,
  rainy:  CloudRain,
  foggy:  Cloud,
  snowy:  Snowflake,
}

const COLOR_MAP: Record<Weather, string> = {
  clear:  'text-amber-400',
  cloudy: 'text-white/50',
  rainy:  'text-blue-400',
  foggy:  'text-white/40',
  snowy:  'text-blue-200',
}

function classifyFromData(w: WeatherData): Weather {
  const id = w.condition_id ?? 800
  if (id === 800) return 'clear'
  if (id >= 801 && id <= 804) return 'cloudy'
  if (id >= 300 && id < 600) return 'rainy'
  if (id >= 600 && id < 700) return 'snowy'
  if (id >= 700 && id < 800) return 'foggy'
  return 'clear'
}

export function ConditionsWidget({ weather: initialWeather, classified: initialClassified, source: initialSource }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather)
  const [classified, setClassified] = useState<Weather>(initialClassified)
  const [source, setSource] = useState(initialSource)

  useEffect(() => {
    getClientCoordinates().then(async (coords) => {
      if (!coords) return
      const gpsWeather = await getWeather(coords.lat, coords.lon)
      if (gpsWeather) {
        setWeather(gpsWeather)
        setClassified(classifyFromData(gpsWeather))
        setSource('gps')
      }
    })
  }, [])

  const WeatherIcon = ICON_MAP[classified]
  const iconColor   = COLOR_MAP[classified]

  if (!weather) {
    return (
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex flex-col">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Conditions actuelles
        </p>
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="h-5 w-5 text-white/20" />
          <span className="text-sm text-white/25 italic">Météo indisponible</span>
        </div>
        <p className="text-[10px] text-white/15 mt-auto pt-2 border-t border-white/8">
          <span className="text-white/40 text-xs">Active la géoloc pour la météo locale</span>
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex flex-col">
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
        Conditions actuelles
        {weather.city && (
          <span className="text-white/25 font-normal normal-case tracking-normal ml-1.5">
            — {weather.city}
          </span>
        )}
      </p>

      {/* Température + icône */}
      <div className="flex items-center gap-2 mb-4">
        <WeatherIcon className={`h-5 w-5 ${iconColor} shrink-0`} />
        <span className="text-2xl font-semibold text-white">{weather.temp}°C</span>
        <span className="text-sm text-white/50 capitalize">{weather.conditions}</span>
      </div>

      {/* Stats 2×2 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 flex-1">
        <div>
          <p className="text-[10px] text-white/30">Vent</p>
          <p className="text-xs text-white/70 font-medium">
            {weather.wind_speed} km/h {weather.wind_dir}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-white/30">Pression</p>
          <p className="text-xs text-white/70 font-medium">{weather.pressure} hPa</p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <Sunrise size={9} className="text-amber-400/60" />
            <p className="text-[10px] text-white/30">Lever</p>
          </div>
          <p className="text-xs text-white/70 font-medium">{weather.sunrise}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <Sunset size={9} className="text-orange-400/60" />
            <p className="text-[10px] text-white/30">Coucher</p>
          </div>
          <p className="text-xs text-white/70 font-medium">{weather.sunset}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30">Ressenti</p>
          <p className="text-xs text-white/70 font-medium">{weather.feels_like}°C</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30">Humidité</p>
          <p className="text-xs text-white/70 font-medium">{weather.humidity}%</p>
        </div>
      </div>

      {source === 'default' && (
        <p className="text-[9px] text-white/15 mt-3 pt-2 border-t border-white/8">
          <span className="text-white/40 text-xs">Active la géoloc pour la météo locale</span>
        </p>
      )}
    </div>
  )
}
