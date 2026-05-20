export type CatchValidationRule = {
  taille_min_cm: number
  taille_max_cm: number
  poids_min_kg: number
  poids_max_kg: number
  ratio_poids_taille_max: number
}

export const CATCH_VALIDATION_RULES: Record<string, CatchValidationRule> = {
  'carpe-commune':  { taille_min_cm: 10, taille_max_cm: 120, poids_min_kg: 0.1,   poids_max_kg: 40,  ratio_poids_taille_max: 0.08 },
  'brochet':        { taille_min_cm: 20, taille_max_cm: 150, poids_min_kg: 0.2,   poids_max_kg: 25,  ratio_poids_taille_max: 0.06 },
  'sandre':         { taille_min_cm: 15, taille_max_cm: 130, poids_min_kg: 0.2,   poids_max_kg: 15,  ratio_poids_taille_max: 0.04 },
  'silure-glane':   { taille_min_cm: 30, taille_max_cm: 280, poids_min_kg: 1,     poids_max_kg: 130, ratio_poids_taille_max: 0.25 },
  'perche-commune': { taille_min_cm: 5,  taille_max_cm: 60,  poids_min_kg: 0.01,  poids_max_kg: 4.8, ratio_poids_taille_max: 0.03 },
  'truite-fario':   { taille_min_cm: 10, taille_max_cm: 80,  poids_min_kg: 0.05,  poids_max_kg: 5,   ratio_poids_taille_max: 0.025 },
  'gardon':         { taille_min_cm: 5,  taille_max_cm: 50,  poids_min_kg: 0.01,  poids_max_kg: 2,   ratio_poids_taille_max: 0.015 },
  'default':        { taille_min_cm: 1,  taille_max_cm: 300, poids_min_kg: 0.001, poids_max_kg: 200, ratio_poids_taille_max: 0.5 },
}

export type ValidationWarning = {
  field: 'taille' | 'poids' | 'ratio'
  message: string
  severity: 'warning' | 'error'
}

export function validateCatchValues(
  speciesSlug: string,
  tailleCm?: number,
  poidsKg?: number
): ValidationWarning[] {
  const warnings: ValidationWarning[] = []
  const rules = CATCH_VALIDATION_RULES[speciesSlug] ?? CATCH_VALIDATION_RULES['default']

  if (tailleCm !== undefined) {
    if (tailleCm < rules.taille_min_cm) {
      warnings.push({ field: 'taille', message: `Taille inhabituelle pour cette espèce (min: ${rules.taille_min_cm} cm)`, severity: 'warning' })
    }
    if (tailleCm > rules.taille_max_cm) {
      warnings.push({ field: 'taille', message: `Taille dépasse le record connu pour cette espèce (max: ${rules.taille_max_cm} cm)`, severity: 'warning' })
    }
  }

  if (poidsKg !== undefined) {
    if (poidsKg < rules.poids_min_kg) {
      warnings.push({ field: 'poids', message: `Poids inhabituel pour cette espèce`, severity: 'warning' })
    }
    if (poidsKg > rules.poids_max_kg) {
      warnings.push({ field: 'poids', message: `Poids dépasse le record connu pour cette espèce (max: ${rules.poids_max_kg} kg)`, severity: 'warning' })
    }
  }

  if (tailleCm && poidsKg) {
    const ratio = poidsKg / tailleCm
    if (ratio > rules.ratio_poids_taille_max) {
      warnings.push({
        field: 'ratio',
        message: `Combinaison taille/poids peu probable pour cette espèce. Vérifie les valeurs.`,
        severity: 'warning',
      })
    }
  }

  return warnings
}

export function isAbsurdCatchValue(
  speciesSlug: string,
  tailleCm?: number | null,
  poidsKg?: number | null
): boolean {
  const rules = CATCH_VALIDATION_RULES[speciesSlug] ?? CATCH_VALIDATION_RULES['default']

  if (tailleCm !== undefined && tailleCm !== null) {
    if (tailleCm <= 0 || tailleCm > rules.taille_max_cm * 2) return true
  }
  if (poidsKg !== undefined && poidsKg !== null) {
    if (poidsKg <= 0 || poidsKg > rules.poids_max_kg * 3) return true
  }

  return false
}
