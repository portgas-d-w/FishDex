---
name: server-actions
description: >
  Charge ce skill avant toute création ou modification d'une Server Action
  dans FishDex. Couvre la structure obligatoire, l'auth, la validation Zod,
  le typage du retour, revalidatePath et les conventions de nommage.
  Ne jamais écrire une Server Action sans suivre ce guide.
---

# FishDex — Server Actions

## 1. Template de base — copier-coller obligatoire

```ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types/fishdex'

// Schema Zod en dehors de la fonction (réutilisable)
const CreateCatchSchema = z.object({
  fishId:    z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  weightKg:  z.number().positive().max(500).optional(),
  lengthCm:  z.number().positive().max(300).optional(),
  spotId:    z.string().uuid().optional(),
  notes:     z.string().max(1000).optional(),
  caughtAt:  z.string().datetime().optional(),
})

export async function createCatch(
  rawInput: unknown
): Promise<ActionResult<{ id: string }>> {

  // 1. Auth — toujours en premier, jamais skipper
  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Non authentifié' }
  }

  // 2. Validation Zod
  const parsed = CreateCatchSchema.safeParse(rawInput)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const input = parsed.data

  // 3. Logique métier
  const { data, error } = await supabase
    .from('catches')
    .insert({
      user_id:    user.id,
      fish_id:    input.fishId,
      session_id: input.sessionId,
      weight_kg:  input.weightKg,
      length_cm:  input.lengthCm,
      spot_id:    input.spotId,
      notes:      input.notes,
      caught_at:  input.caughtAt ?? new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    // Logging côté serveur uniquement — jamais exposer le message DB au client
    console.error('[createCatch] Supabase error:', error.message)
    return { error: 'Impossible d\'enregistrer la capture' }
  }

  // 4. Revalidation des pages impactées
  revalidatePath('/fishdex')
  revalidatePath(`/species/${input.fishId}`)

  // 5. Retour typé
  return { data: { id: data.id } }
}
```

---

## 2. Type ActionResult — source de vérité

```ts
// @/types/fishdex.ts — toujours utiliser ce type pour les retours

export type ActionResult<T = void> =
  | { data: T; error?: never }
  | { error: string; data?: never }

// Exemples d'utilisation
type CreateCatchResult  = ActionResult<{ id: string }>
type UpdateSessionResult = ActionResult<{ updatedAt: string }>
type DeleteResult       = ActionResult<void>
```

---

## 3. Règles obligatoires

### 3.1 `'use server'` — toujours en première ligne
```ts
'use server' // ligne 1, avant tous les imports
import { ... }
```

### 3.2 Auth — toujours vérifier en premier
```ts
// ✅ Pattern correct
const supabase = await createServerClient()
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError || !user) return { error: 'Non authentifié' }

// ❌ Interdit — jamais faire confiance au client
const userId = formData.get('userId') as string // attaquable
```

### 3.3 Validation Zod — toujours avant toute logique
```ts
// ✅ Correct — Zod avant tout
const parsed = MySchema.safeParse(rawInput)
if (!parsed.success) return { error: parsed.error.errors[0].message }

// ❌ Interdit — pas de cast aveugle
const input = rawInput as MyType // dangereux
const name = formData.get('name') as string // non validé
```

### 3.4 Retour — jamais `throw`, toujours `{ data?, error? }`
```ts
// ✅ Correct
return { error: 'Espèce introuvable' }
return { data: { id: newCatch.id } }

// ❌ Interdit
throw new Error('Espèce introuvable')  // casse le typage côté client
return null                             // non typé
return false                            // non typé
```

### 3.5 Logging — côté serveur uniquement
```ts
// ✅ Log serveur (ne jamais exposer l'erreur DB au client)
console.error('[actionName] DB error:', error.message)
return { error: 'Message générique pour l\'utilisateur' }

// ❌ Interdit
return { error: error.message }         // expose l'erreur DB
return { error: JSON.stringify(error) } // expose la structure interne
```

### 3.6 `revalidatePath` — toujours après mutation
```ts
// Après INSERT / UPDATE / DELETE, invalider les pages concernées
revalidatePath('/fishdex')                    // liste globale
revalidatePath(`/species/${fishId}`)          // fiche espèce
revalidatePath('/sessions')                   // liste sessions
revalidatePath(`/sessions/${sessionId}`)      // session spécifique
```

---

## 4. Conventions de nommage

```ts
// Verbe + Entité en camelCase — toujours des verbes d'action
createCatch(input)        // ✅
updateCatch(id, input)    // ✅
deleteCatch(id)           // ✅
endSession(sessionId)     // ✅
unlockSpecies(fishId)     // ✅
addToFishdex(fishId)      // ✅
updateUserRecord(input)   // ✅

// ❌ Interdit
catch(input)              // pas de verbe
newCatch(input)           // adjectif, pas verbe
CatchCreate(input)        // PascalCase
catch_create(input)       // snake_case
handleCatch(input)        // trop générique
```

---

## 5. Schemas Zod — catalogue FishDex

```ts
// Réutiliser ces schemas définis dans @/lib/validations/fishdex.ts

export const CreateCatchSchema = z.object({
  fishId:    z.string().uuid('ID poisson invalide'),
  sessionId: z.string().uuid().optional(),
  weightKg:  z.number().positive('Poids doit être positif').max(500).optional(),
  lengthCm:  z.number().positive('Taille doit être positive').max(300).optional(),
  spotId:    z.string().uuid().optional(),
  notes:     z.string().max(1000, 'Notes trop longues').optional(),
  caughtAt:  z.string().datetime().optional(),
})

export const CreateSessionSchema = z.object({
  spotId:      z.string().uuid().optional(),
  waterType:   z.enum(['freshwater', 'saltwater', 'brackish']),
  technique:   z.string().max(100).optional(),
  weatherNote: z.string().max(500).optional(),
  startedAt:   z.string().datetime().optional(),
})

export const EndSessionSchema = z.object({
  sessionId: z.string().uuid('ID session invalide'),
  endedAt:   z.string().datetime().optional(),
  notes:     z.string().max(1000).optional(),
})

export const UpdateUserProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  region:      z.string().max(100).optional(),
  licenseType: z.enum(['amateur', 'pro', 'none']).optional(),
})
```

---

## 6. Gestion des erreurs — patterns courants

```ts
// Erreur Supabase unique violation (doublon)
if (error?.code === '23505') {
  return { error: 'Cette entrée existe déjà' }
}

// Erreur foreign key violation
if (error?.code === '23503') {
  return { error: 'Référence invalide' }
}

// Erreur RLS (ligne protégée)
if (error?.code === '42501') {
  return { error: 'Accès non autorisé' }
}

// Erreur générique — toujours logger + message générique
console.error('[actionName] error:', error)
return { error: 'Une erreur est survenue, réessaie' }
```

---

## 7. Utilisation côté client

```tsx
// ✅ Pattern correct dans un composant
'use client'

import { createCatch } from '@/app/actions/catches'
import { useState } from 'react'

export function CatchForm({ fishId }: { fishId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await createCatch({
      fishId,
      weightKg: Number(formData.get('weight')),
      lengthCm: Number(formData.get('length')),
    })

    if (result.error) {
      setError(result.error)
    } else {
      // result.data.id est typé et disponible
      console.log('Capture créée :', result.data.id)
    }

    setLoading(false)
  }

  return (
    <form action={handleSubmit}>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {/* champs du formulaire */}
    </form>
  )
}
```

---

## 8. Catalogue des Server Actions FishDex

Toutes les actions existent dans `@/app/actions/` :

```
actions/
├── catches.ts     → createCatch, updateCatch, deleteCatch
├── sessions.ts    → createSession, endSession, updateSession
├── fishdex.ts     → unlockSpecies, addToFishdex, updateObservation
├── spots.ts       → createSpot, updateSpot, deleteSpot
├── records.ts     → updateRecord (déclenché auto depuis catches)
└── user.ts        → updateUserProfile, updateUserPreferences
```

---

## 9. Checklist avant commit

- [ ] `'use server'` en ligne 1
- [ ] Auth vérifiée avant toute logique (`auth.getUser()`)
- [ ] Schema Zod défini et utilisé avec `.safeParse()`
- [ ] Retour typé `ActionResult<T>` — jamais `throw`
- [ ] Logs d'erreur côté serveur uniquement (`console.error`)
- [ ] Message d'erreur client générique (pas l'erreur DB brute)
- [ ] `revalidatePath` appelé après chaque mutation
- [ ] Nommage : verbe + entité en camelCase
- [ ] Aucun `try/catch` silencieux (sans log ni retour d'erreur)
- [ ] Import depuis `@/lib/supabase/server` (pas client)
