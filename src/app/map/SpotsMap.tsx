'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Spot } from '@/lib/sessions/types'

// Fix Leaflet default icon (webpack issue)
function fixLeafletIcons() {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

type SpotWithStats = Spot & {
  catchCount: number
  lastVisit: string | null
}

function FitBounds({ spots }: { spots: SpotWithStats[] }) {
  const map = useMap()
  useEffect(() => {
    const valid = spots.filter(s => s.latitude && s.longitude)
    if (valid.length === 0) return
    if (valid.length === 1) {
      map.setView([valid[0].latitude!, valid[0].longitude!], 13)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require('leaflet')
      const bounds = L.latLngBounds(valid.map(s => [s.latitude!, s.longitude!] as LatLngTuple))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [map, spots])
  return null
}

export function SpotsMap({ spots }: { spots: SpotWithStats[] }) {
  useEffect(() => { fixLeafletIcons() }, [])

  const validSpots = spots.filter(s => s.latitude && s.longitude)
  const center: LatLngTuple = validSpots.length > 0
    ? [validSpots[0].latitude!, validSpots[0].longitude!]
    : [46.603354, 1.888334] // centre France

  return (
    <MapContainer
      center={center}
      zoom={validSpots.length === 1 ? 13 : 6}
      style={{ height: '100%', width: '100%', background: '#0a0f14' }}
      className="rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <FitBounds spots={spots} />
      {validSpots.map(spot => (
        <Marker key={spot.id} position={[spot.latitude!, spot.longitude!]}>
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
              <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>{spot.nom}</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 2px' }}>
                {spot.nb_visites} session{spot.nb_visites !== 1 ? 's' : ''}
              </p>
              {spot.catchCount > 0 && (
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                  {spot.catchCount} capture{spot.catchCount !== 1 ? 's' : ''}
                </p>
              )}
              {spot.lastVisit && (
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  Dernière visite : {new Date(spot.lastVisit).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
