import type { Season, LightPhase, Weather, Context } from './poetic-phrases';

export type { Season, LightPhase, Weather, Context };

export function getCurrentContext(weather: Weather = 'clear'): Context {
  const now = new Date()
  return {
    season:  getSeason(now),
    light:   getLightPhase(now),
    weather,
  }
}

function getSeason(date: Date): Season {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function getLightPhase(date: Date): LightPhase {
  const hour = date.getHours();
  if (hour >= 5  && hour < 8)  return 'dawn';
  if (hour >= 8  && hour < 12) return 'morning';
  if (hour >= 12 && hour < 15) return 'midday';
  if (hour >= 15 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'dusk';
  return 'night';
}

export function getReadableLightPhase(phase: LightPhase): string {
  const map: Record<LightPhase, string> = {
    dawn:      'AUBE',
    morning:   'MATIN',
    midday:    'MIDI',
    afternoon: 'APRÈS-MIDI',
    dusk:      'CRÉPUSCULE',
    night:     'NUIT',
  };
  return map[phase];
}

export function getReadableDate(date: Date): string {
  return date
    .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
