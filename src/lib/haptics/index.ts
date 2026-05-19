// Web Vibration API — fonctionne sur Android Chrome/Firefox
// iOS Safari ne supporte pas navigator.vibrate (désactivé par Apple)
// La fonction tombe silencieusement sur les plateformes non supportées

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

const PATTERNS: Record<HapticType, number | number[]> = {
  light:   10,
  medium:  25,
  heavy:   50,
  success: [10, 50, 10],
  warning: [25, 100, 25],
  error:   [50, 100, 50, 100, 50],
}

const PREF_KEY = 'fishdex_haptics'

export function haptic(type: HapticType = 'light'): void {
  if (typeof window === 'undefined') return
  if (!('vibrate' in navigator)) return
  if (localStorage.getItem(PREF_KEY) === 'false') return
  navigator.vibrate(PATTERNS[type])
}

export function isHapticsEnabled(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(PREF_KEY) !== 'false'
}

export function setHapticsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PREF_KEY, String(enabled))
}
