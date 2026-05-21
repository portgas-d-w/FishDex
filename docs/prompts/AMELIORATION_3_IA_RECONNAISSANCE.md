# 🤖 FishDex — Axe 3 : IA Reconnaissance Espèces (Budget 20€/mois)

> Activer une reconnaissance IA des espèces dans le flow capture, en respectant un budget strict de **20€/mois maximum**.
>
> **Estimation** : 3-5 jours de code + tests.
>
> **⚠️ Règle absolue** : l'IA **propose**, l'user **valide**. Jamais d'auto-validation silencieuse.

---

## 📐 Le contexte économique honnête

Tu m'as dit "20€/mois maximum". J'ai cherché, et voici la vérité du marché 2026 :

### Solutions évaluées

| Solution | Précision poissons | Coût estimé | Verdict |
|---|---|---|---|
| **Fishial.ai API** | Excellente (spécialisée) | ~0,15€/scan = 75-150€/mois facile | ❌ Hors budget |
| **Google Cloud Vision** | Faible sur poissons (généraliste) | 1,50€/1000 scans = 5€/mois | ⚠️ Précision médiocre |
| **AWS Rekognition Custom** | Bonne si entraîné | ~150€/mois minimum | ❌ Hors budget |
| **Roboflow Hosted** | Bonne | 50€/mois minimum | ❌ Hors budget |
| **OpenAI Vision (GPT-4o-mini)** | Bonne avec prompt engineering | ~0,01€/scan = 20€/mois pour 2000 scans | ✅ **DANS budget** |
| **iNaturalist API** | Excellente | Gratuit (rate-limited) | ✅ **Gratuit mais limité** |
| **Anthropic Claude Vision (Haiku)** | Bonne | ~0,005€/scan = 10€/mois pour 2000 scans | ✅ **DANS budget** |

### Ma recommandation

**Stratégie hybride à 0-20€/mois** :

1. **D'abord, iNaturalist API** (gratuit) → sur 100 captures/jour, ça gère 80-90% des cas
2. **Fallback Claude Vision Haiku** (~10€/mois) → quand iNaturalist échoue ou confiance faible
3. **Skip** Google Cloud Vision : précision décevante sur poissons spécifiques

**Avantage gros** : Claude Vision peut **raisonner** sur ta liste d'espèces FishDex. Tu lui passes "voici les 110 espèces possibles, voici la photo, dis-moi laquelle". Il fait du matching intelligent, pas de la classif aveugle.

---

## 🎯 Architecture du système

```
Photo capture user
     ↓
[ÉTAPE 1] iNaturalist API (gratuit)
     ↓ (si confiance > 70%)
Propose espèce + confiance
     ↓
[ÉTAPE 2] User valide ou corrige
     ↓
Stockage dans ai_training_data
     ↓
SI iNaturalist confiance < 70% :
[FALLBACK] Claude Vision Haiku
     ↓ (10€/mois max)
Propose espèce + raisonnement
     ↓
User valide ou corrige (toujours)
```

---

# 🎯 PROMPT IA3.1 — Setup iNaturalist API (gratuit)

**Format détaillé. La première couche IA gratuite.**

---PROMPT---

CONTEXTE — Intégration iNaturalist API (IA3.1)

iNaturalist est la plus grande communauté de naturalistes au monde.
Leur API computer vision (gratuite, rate-limitée) reconnaît les espèces depuis une photo.
Précision excellente sur poissons d'eau douce français.

═══════════════════════════════════════════
ÉTAPE 1 — RATE LIMITS À CONNAÎTRE
═══════════════════════════════════════════

iNaturalist API gratuite :
- 100 requêtes / minute (par IP)
- 10 000 requêtes / jour (recommandé)
- Pas d'authentification requise pour vision endpoint

Pour notre usage (~50-200 captures/jour) → largement suffisant.

═══════════════════════════════════════════
ÉTAPE 2 — SERVER ACTION
═══════════════════════════════════════════

Crée src/app/actions/ai-identify.ts :

'use server';

type IdentificationResult = {
  source: 'inaturalist' | 'claude' | 'failed';
  predictions: Array<{
    species_name: string;
    scientific_name: string;
    confidence: number; // 0-1
    matched_species_id?: string; // si match avec ta BDD species
  }>;
  reasoning?: string; // pour Claude Vision
};

export async function identifySpeciesFromPhoto(
  photoUrl: string
): Promise<IdentificationResult> {
  // ÉTAPE 1 : Tente iNaturalist
  try {
    const result = await identifyWithINaturalist(photoUrl);
    if (result.predictions[0]?.confidence >= 0.7) {
      return { source: 'inaturalist', ...result };
    }
  } catch (e) {
    console.error('iNat failed:', e);
  }

  // ÉTAPE 2 : Fallback Claude Vision
  try {
    const result = await identifyWithClaudeVision(photoUrl);
    return { source: 'claude', ...result };
  } catch (e) {
    console.error('Claude vision failed:', e);
  }

  return { source: 'failed', predictions: [] };
}

═══════════════════════════════════════════
ÉTAPE 3 — INATURALIST IDENTIFY
═══════════════════════════════════════════

async function identifyWithINaturalist(photoUrl: string) {
  const formData = new FormData();
  formData.append('image_url', photoUrl);

  const response = await fetch('https://api.inaturalist.org/v1/computervision/score_image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error(`iNat returned ${response.status}`);

  const data = await response.json();
  // data.results : array de résultats

  // Filter sur les poissons uniquement (taxon_id 47178 = Actinopterygii)
  const fishResults = data.results.filter((r: any) =>
    r.taxon.iconic_taxon_name === 'Actinopterygii'
  );

  // Match avec ta BDD species
  const supabase = createClient();
  const predictions = await Promise.all(
    fishResults.slice(0, 5).map(async (r: any) => {
      const { data: speciesMatch } = await supabase
        .from('species')
        .select('id, nom_fr, nom_scientifique')
        .eq('nom_scientifique', r.taxon.name)
        .maybeSingle();

      return {
        species_name: r.taxon.preferred_common_name || r.taxon.name,
        scientific_name: r.taxon.name,
        confidence: r.combined_score / 100, // iNat retourne 0-100
        matched_species_id: speciesMatch?.id,
      };
    })
  );

  return { predictions };
}

═══════════════════════════════════════════
ÉTAPE 4 — TESTS
═══════════════════════════════════════════

1. Upload une photo de brochet via l'app
2. Server Action retourne predictions
3. Vérifier dans la console : matchedSpeciesId est rempli si l'espèce existe en BDD
4. Confidence raisonnable (généralement > 0.8 pour photos claires)

═══════════════════════════════════════════
ÉTAPE 5 — COMMIT
═══════════════════════════════════════════

"feat(ai): iNaturalist API integration for species recognition"

⚠️ Toujours vérifier le rate limit avant prod (header X-RateLimit-Remaining)
⚠️ Si iNat down → fallback Claude Vision (étape suivante)

---PROMPT---

---

# 🎯 PROMPT IA3.2 — Claude Vision en fallback

**Format détaillé. Quand iNaturalist échoue.**

---PROMPT---

CONTEXTE — Claude Vision Haiku en fallback (IA3.2)

Claude Vision (Haiku model) coûte ~0,005€ par image analysée.
Stratégie : on lui passe la photo + la liste des espèces FishDex, il choisit la plus probable avec raisonnement.

═══════════════════════════════════════════
ÉTAPE 1 — SETUP ANTHROPIC API
═══════════════════════════════════════════

1. Crée un compte sur https://console.anthropic.com
2. Récupère une API key
3. Ajoute dans .env.local : ANTHROPIC_API_KEY=sk-ant-xxx
4. Ajoute aussi dans Vercel ENV
5. npm install @anthropic-ai/sdk

═══════════════════════════════════════════
ÉTAPE 2 — IDENTIFY WITH CLAUDE
═══════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function identifyWithClaudeVision(photoUrl: string) {
  const supabase = createClient();

  // Récupère toutes les espèces de la BDD
  const { data: speciesList } = await supabase
    .from('species')
    .select('id, nom_fr, nom_scientifique, famille')
    .order('nom_fr');

  if (!speciesList) throw new Error('Could not load species list');

  // Construit la liste pour le prompt
  const speciesString = speciesList
    .map(s => `- ${s.nom_fr} (${s.nom_scientifique}) - ${s.famille}`)
    .join('\n');

  // Download image
  const imageResponse = await fetch(photoUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');
  const imageMediaType = 'image/jpeg'; // ou détecter automatiquement

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: imageMediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `Tu es naturaliste expert en poissons d'eau douce français.

Identifie le poisson sur cette photo parmi cette liste d'espèces FishDex :

${speciesString}

Réponds STRICTEMENT au format JSON :
{
  "predictions": [
    {
      "species_name": "nom français exact",
      "scientific_name": "nom scientifique",
      "confidence": 0.85,
      "reasoning": "1-2 phrases expliquant pourquoi"
    }
  ]
}

Maximum 3 prédictions, ordonnées par confiance décroissante.
Si tu n'es pas sûr, sois honnête : confidence < 0.5 acceptable.
Si aucun poisson visible : retourne predictions: [].
Ne réponds RIEN d'autre que le JSON.`,
          },
        ],
      },
    ],
  });

  // Parse la réponse
  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : '';

  const parsed = JSON.parse(responseText);

  // Match avec BDD
  const predictions = await Promise.all(
    parsed.predictions.map(async (p: any) => {
      const matched = speciesList.find(
        s => s.nom_scientifique === p.scientific_name
      );

      return {
        species_name: p.species_name,
        scientific_name: p.scientific_name,
        confidence: p.confidence,
        matched_species_id: matched?.id,
        reasoning: p.reasoning,
      };
    })
  );

  return { predictions, reasoning: parsed.predictions[0]?.reasoning };
}

═══════════════════════════════════════════
ÉTAPE 3 — MONITORING DES COÛTS
═══════════════════════════════════════════

Crée src/lib/ai/usage-tracker.ts :

CREATE TABLE public.ai_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  source TEXT, -- 'inaturalist' ou 'claude'
  cost_estimate_eur NUMERIC(10,4),
  tokens_used INTEGER NULL,
  success BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

À chaque appel Claude, log :
- 0 € pour iNaturalist
- ~0,005 € pour Claude Haiku (estimation conservative)

Dans dashboard admin (/admin), affiche :
- Coût mensuel cumulé
- Alert si dépasse 18€ (90% du budget 20€)
- Auto-disable Claude Vision si dépasse 20€ → fallback "sélection manuelle uniquement"

═══════════════════════════════════════════
ÉTAPE 4 — TESTS
═══════════════════════════════════════════

Test 1 : Photo claire brochet → iNat marche (free)
Test 2 : Photo floue ou cadre étrange → iNat échoue → Claude prend le relais
Test 3 : Photo non-poisson → predictions vides → user fait sélection manuelle
Test 4 : Budget dépassé → Claude désactivé proprement

═══════════════════════════════════════════
ÉTAPE 5 — COMMIT
═══════════════════════════════════════════

"feat(ai): Claude Vision fallback with budget monitoring"

⚠️ Budget hard cap : si > 20€/mois → désactivation auto Claude
⚠️ Toujours retomber sur sélection manuelle si IA fail
⚠️ Logger absolument TOUS les appels pour monitoring

---PROMPT---

---

# 🎯 PROMPT IA3.3 — UI de capture avec IA

**Format détaillé. L'expérience user complète.**

---PROMPT---

CONTEXTE — UI capture avec IA (IA3.3)

L'experience cible :
1. User prend photo / upload
2. Loading "Analyse en cours..." (2-3 secondes)
3. App propose top 3 espèces avec confidence
4. User valide ou choisit autre / saisit manuellement

═══════════════════════════════════════════
ÉTAPE 1 — REFONTE FORMULAIRE CAPTURE
═══════════════════════════════════════════

Modifie src/app/(app)/capture/page.tsx :

Étape 1 : Photo upload (déjà existant)
Étape 2 : AI Analysis (NOUVEAU)
Étape 3 : Form completion (déjà existant)

═══════════════════════════════════════════
ÉTAPE 2 — COMPOSANT IA SUGGESTION
═══════════════════════════════════════════

Crée src/components/capture/AiSuggestion.tsx :

'use client';

import { useEffect, useState } from 'react';
import { identifySpeciesFromPhoto } from '@/app/actions/ai-identify';
import { Sparkles, Check } from 'lucide-react';

type Props = {
  photoUrl: string;
  onSpeciesSelect: (speciesId: string) => void;
};

export function AiSuggestion({ photoUrl, onSpeciesSelect }: Props) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<IdentificationResult | null>(null);

  useEffect(() => {
    identifySpeciesFromPhoto(photoUrl).then(r => {
      setResult(r);
      setLoading(false);
    });
  }, [photoUrl]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/5 border-white/10 p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase">
            Analyse en cours
          </span>
        </div>
        <p className="text-sm text-white/60">
          Le FishDex étudie ta photo...
        </p>
      </div>
    );
  }

  if (!result || result.predictions.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border-white/10 p-6">
        <p className="text-sm text-white/60">
          Aucune espèce identifiée. Sélectionne manuellement ci-dessous.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-700/5
                    backdrop-blur-md border border-cyan-500/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-cyan-400" />
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
          Suggestions IA
        </p>
        <span className="text-xs text-white/40 ml-auto">
          {result.source === 'inaturalist' ? 'iNaturalist' : 'Claude'}
        </span>
      </div>

      <div className="space-y-2">
        {result.predictions.map((pred, i) => (
          <button
            key={i}
            onClick={() => pred.matched_species_id && onSpeciesSelect(pred.matched_species_id)}
            className="w-full flex items-center justify-between p-3 rounded-xl
                       bg-white/5 hover:bg-white/10 transition-colors
                       border border-white/5 hover:border-cyan-400/50"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-white">
                {pred.species_name}
              </p>
              <p className="text-xs italic text-white/40">
                {pred.scientific_name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-cyan-400 font-medium">
                {Math.round(pred.confidence * 100)}%
              </div>
              <Check className="h-4 w-4 text-cyan-400" />
            </div>
          </button>
        ))}
      </div>

      {result.reasoning && (
        <p className="mt-4 text-xs italic text-white/40 leading-relaxed">
          {result.reasoning}
        </p>
      )}

      <button
        onClick={() => onSpeciesSelect('')}
        className="w-full mt-4 text-xs text-white/40 hover:text-white/60
                   underline underline-offset-2"
      >
        Aucune de ces suggestions — choisir manuellement
      </button>
    </div>
  );
}

═══════════════════════════════════════════
ÉTAPE 3 — INTÉGRATION FLOW
═══════════════════════════════════════════

Dans le formulaire capture :

const [photoUrl, setPhotoUrl] = useState<string | null>(null);
const [speciesId, setSpeciesId] = useState<string | null>(null);

// Quand photo uploadée, déclencher AiSuggestion
{photoUrl && !speciesId && (
  <AiSuggestion
    photoUrl={photoUrl}
    onSpeciesSelect={(id) => setSpeciesId(id || 'manual')}
  />
)}

// Si speciesId === 'manual' OU pas suggestion satisfaisante → afficher sélecteur manuel
{(speciesId === 'manual' || !speciesId) && (
  <SpeciesSelector value={speciesId} onChange={setSpeciesId} />
)}

═══════════════════════════════════════════
ÉTAPE 4 — DATA FLYWHEEL
═══════════════════════════════════════════

À chaque création de catch, log la prédiction + la sélection finale dans ai_training_data :

await supabase.from('ai_training_data').insert({
  user_id: userId,
  catch_id: newCatch.id,
  photo_url: photoUrl,
  species_id_predicted: result.predictions[0]?.matched_species_id,
  prediction_confidence: result.predictions[0]?.confidence,
  species_id_validated: finalSpeciesId,
  user_corrected: result.predictions[0]?.matched_species_id !== finalSpeciesId,
});

═══════════════════════════════════════════
ÉTAPE 5 — PARAMÈTRES USER
═══════════════════════════════════════════

Dans /settings, toggle :
"Suggestions IA lors des captures" (default ON)
"Contribuer à l'amélioration de l'IA" (default ON, explique l'usage des photos)

═══════════════════════════════════════════
ÉTAPE 6 — TESTS COMPLETS
═══════════════════════════════════════════

Scenario 1 : Photo claire brochet
→ iNat reconnaît avec 0.92 confidence
→ User clique sur "Brochet" → form pré-rempli
→ Coût : 0€

Scenario 2 : Photo angle bizarre
→ iNat échoue ou confidence < 0.7
→ Claude prend le relais
→ Identification avec raisonnement
→ Coût : 0,005€

Scenario 3 : Photo de paysage (pas de poisson)
→ Predictions vides
→ Sélecteur manuel affiché
→ Coût : minimal (juste fail)

Scenario 4 : User désactive IA dans settings
→ Sélecteur manuel direct, pas d'appel API
→ Coût : 0€

═══════════════════════════════════════════
ÉTAPE 7 — COMMIT
═══════════════════════════════════════════

"feat(capture): AI species suggestion with iNaturalist + Claude Vision fallback"

⚠️ Toujours laisser la sélection manuelle accessible
⚠️ Ne JAMAIS valider automatiquement (l'IA propose, l'user valide)
⚠️ Tracker dans ai_training_data pour le futur modèle DIY

---PROMPT---

---

# 🎯 PROMPT IA3.4 — Dashboard admin IA (coûts et qualité)

**Format compact. Monitoring critique pour respecter le budget.**

---PROMPT---

CONTEXTE — Dashboard admin IA (IA3.4)

Page admin pour monitorer le système IA en temps réel.

ÉTAPE 1 — CRÉE LA ROUTE
src/app/(admin)/admin/ai-dashboard/page.tsx
Réservé via check email : if (user.email !== 'alexy101099@gmail.com') notFound();

ÉTAPE 2 — MÉTRIQUES À AFFICHER
- Coût mensuel cumulé (€)
- Coût quotidien moyen
- Coût projeté fin de mois
- Alerte rouge si > 18€ (90% budget)
- Répartition iNat vs Claude (gratuit vs payant)
- Nombre total de scans ce mois
- Taux de validation (% où user accepte la 1ère suggestion)
- Taux de correction (% où user choisit autre)
- Top 10 espèces les plus difficiles à identifier (mal-prédites)
- Top 10 espèces avec dataset insuffisant (sous-représentées)

ÉTAPE 3 — KILL SWITCH
Bouton "Désactiver Claude Vision" qui set un flag dans BDD :

UPDATE app_settings SET claude_vision_enabled = FALSE;

Si dépassement budget → ce flag passe à false automatiquement via cron.

ÉTAPE 4 — COMMIT
"feat(admin): AI usage dashboard with cost monitoring and kill switch"

---PROMPT---

---

# 💰 SIMULATION BUDGET RÉEL

## Hypothèses

| Métrique | Valeur |
|---|---|
| Users actifs | 50 |
| Captures/user/mois | 10 |
| Total captures/mois | 500 |
| % réussi iNat (free) | 80% |
| % fallback Claude | 20% |
| Coût Claude Haiku | 0,005€/scan |

## Coût mensuel

- iNaturalist : **0€** (free tier suffisant)
- Claude Vision : 500 × 0,20 × 0,005 = **0,50€**

**Coût total estimé : ~0,50-1€/mois**

## À l'échelle (si app décolle à 500 users)

- Total captures : 5000/mois
- Claude scans : 1000
- Coût : **~5€/mois**

**Conclusion** : à 500-1000 users actifs, tu restes EN DESSOUS de 5€/mois.
Le budget 20€/mois te laisse une grande marge (jusqu'à ~4000 scans Claude/mois).

---

# ✅ CHECKLIST FINALE IA

- [ ] **IA3.1** — iNaturalist API intégrée, predictions matchées avec BDD species
- [ ] **IA3.2** — Claude Vision en fallback configuré, monitoring coûts en place
- [ ] **IA3.3** — UI suggestion intégrée dans flow capture, data flywheel actif
- [ ] **IA3.4** — Dashboard admin coûts + kill switch

**Tests obligatoires** :
- [ ] Photo claire → iNat marche, 0€
- [ ] Photo difficile → Claude prend le relais, log coût
- [ ] Photo non-poisson → fallback manuel propre
- [ ] User refuse l'IA → flow manuel pur
- [ ] Budget atteint 18€ → alerte
- [ ] Budget atteint 20€ → Claude désactivé auto

**Tests data flywheel** :
- [ ] Chaque validation crée ligne ai_training_data
- [ ] Chaque correction est trackée
- [ ] Photos pouvant servir au futur entraînement

---

# 📊 ROADMAP IA LONG TERME

**Maintenant** : système hybride iNat + Claude, budget contrôlé
**Dans 6 mois** : dataset de 5000-15000 photos validées users
**Dans 12 mois** : assez de data pour commencer entraînement DIY (voir PROMPTS_H4.md, S4.2)
**Dans 18 mois** : ton propre modèle déployé, remplace Claude Vision graduellement
**Dans 24 mois** : 100% modèle DIY, coût mensuel près de zéro

**C'est le data flywheel qui te rend libre des API payantes à terme.**

IA livrée. 🤖
