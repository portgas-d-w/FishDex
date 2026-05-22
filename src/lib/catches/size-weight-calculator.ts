type SpeciesFormula = { a: number; b: number }

// Formule Le Cren : W(g) = a × L(cm)^b
export function estimateWeight(lengthCm: number, formula: SpeciesFormula): number {
  const weightGrams = formula.a * Math.pow(lengthCm, formula.b)
  return Math.round(weightGrams) / 1000 // kg, arrondi au gramme
}

export function estimateLength(weightKg: number, formula: SpeciesFormula): number {
  const weightGrams = weightKg * 1000
  const lengthCm = Math.pow(weightGrams / formula.a, 1 / formula.b)
  return Math.round(lengthCm * 10) / 10 // arrondi au mm
}

export function getGenericFormula(): SpeciesFormula {
  return { a: 0.015, b: 3.0 }
}

// Intervalle de confiance ±15%
export function getConfidenceInterval(value: number): { min: number; max: number } {
  return {
    min: Math.round(value * 0.85 * 100) / 100,
    max: Math.round(value * 1.15 * 100) / 100,
  }
}
