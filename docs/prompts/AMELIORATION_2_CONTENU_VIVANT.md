# 🌿 FishDex — Axe 2 : Contenu vivant & Densification

> Faire passer l'app de "joli squelette" à "**univers vivant**" via contenu éditorial riche, citations naturalistes, et conseils contextuels.
>
> **Estimation** : 2-3 semaines de code + production éditoriale en parallèle.
>
> **⚠️ Règle d'or** : tout contenu doit servir l'ADN contemplatif. Pas de gamification déguisée, pas de marketing forcé.

---

## 📐 Philosophie du contenu FishDex

**Ce qu'on cherche** :
- Contenu qui **enseigne** (naturalisme, biologie, techniques)
- Contenu qui **émeut** (citations, anecdotes, beauté du vivant)
- Contenu qui **personnalise** (contextuel selon saison, météo, captures)
- Contenu qui **rythme** l'usage sans pousser

**Ce qu'on évite** :
- Notifications agressives ("Reviens vite !")
- Pop-ups marketing
- Badges flashy
- "Top X classement"
- "Tu es à 3 espèces de battre tes amis"

---

# 🎯 PROMPT C2.1 — Fiches espèces enrichies (les 110)

**Format détaillé. La fondation du contenu vivant.**

---PROMPT---

CONTEXTE — Enrichissement éditorial des fiches espèces (C2.1)

Chaque fiche FishDex doit être un **petit récit naturaliste** + **guide pratique**.

═══════════════════════════════════════════
ÉTAPE 1 — AUDIT BDD ACTUELLE
═══════════════════════════════════════════

Lance :
SELECT slug, nom_fr, nom_scientifique,
       (description IS NOT NULL) AS has_desc,
       (conseil_fishdex IS NOT NULL) AS has_conseil,
       (techniques IS NOT NULL) AS has_techniques
FROM species
ORDER BY nom_fr;

Présente le rapport : combien d'espèces ont contenu complet vs vides.

═══════════════════════════════════════════
ÉTAPE 2 — STRUCTURE CIBLE POUR CHAQUE FICHE
═══════════════════════════════════════════

Voici les champs qu'on veut remplir pour CHAQUE espèce (110 au total) :

ALTER TABLE species
  ADD COLUMN IF NOT EXISTS description_long TEXT,        -- 3-4 phrases naturalistes
  ADD COLUMN IF NOT EXISTS conseil_fishdex TEXT,         -- 2 phrases vieux pêcheur
  ADD COLUMN IF NOT EXISTS anecdote_naturaliste TEXT,    -- 1 fait fascinant
  ADD COLUMN IF NOT EXISTS citation TEXT,                -- citation littéraire/scientifique
  ADD COLUMN IF NOT EXISTS citation_auteur TEXT,         -- auteur de la citation
  ADD COLUMN IF NOT EXISTS techniques_recommandees JSONB, -- array de techniques
  ADD COLUMN IF NOT EXISTS conditions_ideales JSONB,     -- meteo, heure, profondeur
  ADD COLUMN IF NOT EXISTS saison_active TEXT,           -- ex: "Mars-Juin, Sept-Nov"
  ADD COLUMN IF NOT EXISTS profondeur TEXT,              -- ex: "1-3 m"
  ADD COLUMN IF NOT EXISTS temperature_eau TEXT,         -- ex: "8-16°C"
  ADD COLUMN IF NOT EXISTS difficulte INTEGER,           -- 1-5
  ADD COLUMN IF NOT EXISTS statut_reglementaire TEXT,    -- protégée/libre/maille
  ADD COLUMN IF NOT EXISTS taille_legale_cm INTEGER NULL;

═══════════════════════════════════════════
ÉTAPE 3 — TEMPLATE DE GÉNÉRATION
═══════════════════════════════════════════

Pour chaque espèce, j'utiliserai le template SPECIES_CONTENT_TEMPLATES.md
déjà fourni dans docs/ pour générer le contenu via ChatGPT/Claude.

Workflow :
1. Pour chaque espèce sans contenu complet
2. Lance le Template 1 dans une conversation Claude/ChatGPT
3. Vérifie sur FishBase + INPN
4. Insère dans species via migration SQL ou Supabase Dashboard

Estimation : 15 min par espèce × 110 = 27h de travail éditorial.
Étalable sur 3-4 semaines à raison de 5-8 espèces par session.

═══════════════════════════════════════════
ÉTAPE 4 — UI FICHE DÉTAIL ENRICHIE
═══════════════════════════════════════════

Refonte src/app/(app)/fishdex/[slug]/page.tsx avec sections :

1. HERO (déjà fait)

2. PRÉSENTATION
- Description long (3-4 phrases naturalistes)
- Nom scientifique en italique + famille

3. CITATION NATURALISTE (nouveau, signature FishDex)
<blockquote>
  "{citation}"
  <cite>— {citation_auteur}</cite>
</blockquote>
- Style discret, italique, citation grise sur fond légèrement plus clair
- Pas pour toutes les espèces (50% suffisent, sinon ça devient répétitif)

4. STATS BIOLOGIQUES (déjà existant, à compléter)
- Taille, poids, longévité, régime
- Statut réglementaire en pill discret (vert = libre, orange = maille, rouge = protégée)

5. HABITAT & CONDITIONS
- Habitat naturel
- Profondeur préférée
- Température eau
- Saison d'activité avec petit graphique cyclique

6. TECHNIQUES DE PÊCHE (depuis techniques_recommandees JSONB)
Chaque technique en card :
- Nom (ex: "Jerkbait")
- Étoiles difficulté / efficacité
- Animation suggérée (1 phrase)
- Profondeur optimale

7. ANECDOTE NATURALISTE (nouveau)
Petit bloc "💡 Le saviez-vous ?" avec anecdote_naturaliste.
Style : background card discret, icône lampe, texte court (2-3 phrases).

8. CONSEIL FISHDEX (existant, à valoriser)
"Le mot du pêcheur" — ton chaleureux comme un vieux pêcheur qui partage.
À l'avenir, peut devenir audio (voix de pêcheur expert).

9. VARIANTES (si species_variants existent)
Grille horizontale des variantes connues.

10. TES CAPTURES DE CETTE ESPÈCE (existant)
Carrousel des captures perso + record perso.

═══════════════════════════════════════════
ÉTAPE 5 — DESIGN CITATIONS
═══════════════════════════════════════════

Composant Citation :

<div className="my-8 border-l-2 border-cyan-400/40 pl-6">
  <p className="italic text-white/70 text-lg leading-relaxed">
    "{citation}"
  </p>
  <p className="mt-2 text-sm text-white/40">
    — {citation_auteur}
  </p>
</div>

Sources de citations à privilégier :
- Sylvain Tesson (Sur les chemins noirs)
- Aldo Leopold (A Sand County Almanac)
- John Muir
- Henry David Thoreau (Walden)
- Jean-Henri Fabre
- Jean Giono
- Naturalistes français contemporains

═══════════════════════════════════════════
ÉTAPE 6 — COMMIT
═══════════════════════════════════════════

Plusieurs commits :
1. "feat(db): extend species table with editorial content fields"
2. "feat(fishdex): rich detail page with citations and anecdotes"
3. Plusieurs commits au fil du seeding éditorial : "content: seed N species with full editorial content"

⚠️ Ne pas hardcoder les citations dans le code, toujours en BDD
⚠️ Vérifier les droits d'auteur des citations (domaine public ou attribution)
⚠️ Maintenir un ton naturaliste, jamais sentimental ou guimauve

---PROMPT---

---

# 🎯 PROMPT C2.2 — Conseils contextuels du jour

**Format compact. Contenu qui change selon le contexte réel.**

---PROMPT---

CONTEXTE — Conseils contextuels du jour (C2.2)

Le widget "Conseil du jour" sur le Home doit afficher un conseil pertinent selon le contexte réel : saison, heure, météo, dernières captures.

ÉTAPE 1 — MIGRATION BDD

CREATE TABLE public.conseils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  texte TEXT NOT NULL,
  saisons TEXT[] NOT NULL, -- ['printemps', 'été'] ou ['toutes']
  light_phases TEXT[] NOT NULL, -- ['aube', 'matin'] ou ['toutes']
  weather_conditions TEXT[] NOT NULL, -- ['clear', 'rainy'] ou ['toutes']
  themes TEXT[] NOT NULL, -- ['carpe', 'carnassiers', 'general']
  difficulty TEXT, -- 'debutant', 'intermediaire', 'avance'
  source TEXT, -- attribution si nécessaire
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conseils_saisons ON public.conseils USING GIN(saisons);
CREATE INDEX idx_conseils_light ON public.conseils USING GIN(light_phases);

ÉTAPE 2 — SEED 50 CONSEILS

Génère 50 conseils variés couvrant :
- Conseils saisonniers (printemps frai, été chaleur, automne carnassiers, hiver fond)
- Conseils horaires (aube prédateurs, midi ombragé, crépuscule actif)
- Conseils météo (orage = carnassiers actifs, pluie fine = bons sandres)
- Conseils techniques (animation, choix leurre, lecture eau)
- Conseils naturalistes (cycle vivant, respect)

Exemples :

INSERT INTO conseils (texte, saisons, light_phases, weather_conditions, themes) VALUES
('Au printemps, les carpes remontent en bordure dès que l''eau dépasse 14°C. Cherche-les sous les arbres au soleil.',
 ARRAY['printemps'], ARRAY['matin', 'aprem'], ARRAY['clear'], ARRAY['carpe']),
('Quand la pression atmosphérique chute brutalement, les sandres deviennent agressifs. Sors le swimbait.',
 ARRAY['toutes'], ARRAY['toutes'], ARRAY['rainy', 'cloudy'], ARRAY['carnassiers']),
('À l''aube, l''eau respire la nuit dernière. Approche en silence, le poisson sent les vibrations du sol.',
 ARRAY['toutes'], ARRAY['aube'], ARRAY['toutes'], ARRAY['general']);

ÉTAPE 3 — SERVER ACTION getConseilDuJour

Crée src/app/actions/conseils.ts :

'use server';

export async function getConseilDuJour(context: {
  season: string;
  light_phase: string;
  weather: string;
  userId: string;
}) {
  const supabase = createClient();

  // Sélectionne les conseils qui matchent le contexte
  const { data } = await supabase
    .from('conseils')
    .select('*')
    .or(`saisons.cs.{${context.season}},saisons.cs.{toutes}`)
    .or(`light_phases.cs.{${context.light_phase}},light_phases.cs.{toutes}`)
    .or(`weather_conditions.cs.{${context.weather}},weather_conditions.cs.{toutes}`);

  if (!data || data.length === 0) {
    return getFallbackConseil();
  }

  // Conseil stable pour la journée (pas de changement au refresh)
  const today = new Date().toISOString().split('T')[0];
  const seed = `${context.userId}-${today}`;
  const hash = hashString(seed);
  const index = hash % data.length;

  return data[index];
}

ÉTAPE 4 — UI HOME
Mise à jour du widget "Conseil du jour" :

<div className="rounded-2xl bg-white/5 backdrop-blur-md border-white/10 p-6">
  <div className="flex items-start gap-3">
    <Lightbulb className="h-5 w-5 text-cyan-400 mt-0.5" />
    <div className="flex-1">
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">
        Conseil du jour
      </p>
      <p className="text-base text-white/90 leading-relaxed">
        {conseil.texte}
      </p>
      {conseil.source && (
        <p className="text-xs text-white/40 mt-2 italic">
          — {conseil.source}
        </p>
      )}
    </div>
  </div>
</div>

ÉTAPE 5 — COMMIT
"feat(content): contextual daily advice system with 50 seed conseils"

⚠️ Le conseil change tous les jours, pas à chaque refresh
⚠️ Si aucun match contextuel → fallback générique élégant
⚠️ Ne pas afficher de conseil "Achète X leurre" (anti-marketing)

---PROMPT---

---

# 🎯 PROMPT C2.3 — Système de "souvenirs marquants"

**Format compact. Faire revivre les belles captures.**

---PROMPT---

CONTEXTE — Souvenirs marquants (C2.3)

À la place de juste "lister" les captures, on les "ravive" en proposant des souvenirs émergents.

ÉTAPE 1 — DÉTECTION AUTOMATIQUE
Crée src/lib/memories/detector.ts :

export async function getMarkanteMemory(userId: string) {
  // Logique de détection prioritisée :
  // 1. "Il y a exactement 1 an aujourd'hui"
  // 2. "Il y a exactement 1 mois aujourd'hui"
  // 3. "Ta plus grosse capture de la saison précédente"
  // 4. "Première capture d'une espèce rare"
  // 5. "Dernier souvenir bookmarké"

  // Retourne le premier qui matche, sinon null

  return memory; // { type, data, label }
}

ÉTAPE 2 — WIDGET HOME "SOUVENIR DU MOMENT"
Conditionnel : si une mémoire est détectée, afficher au-dessus de "Dernières captures" :

<div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-700/5
                backdrop-blur-md border border-amber-500/20 p-5">
  <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
    📅 Souvenir du moment
  </p>
  <p className="text-sm text-white/80 mb-4">
    Il y a 1 an aujourd'hui, tu pêchais à {memory.spot}.
  </p>
  <CatchCard catch={memory.data} variant="compact" />
</div>

Couleur ambrée pour distinguer de l'UI cyan habituelle (souvenir = chaleur).

ÉTAPE 3 — PAGE /MEMORIES (optionnelle, H3+)
Page dédiée avec toutes les mémoires cycliques :
- "Tes plus belles captures de l'année"
- "Tes premières fois"
- "Tes records perso"
- "Tes spots préférés"

ÉTAPE 4 — COMMIT
"feat(memories): system of cyclical and milestone memories"

---PROMPT---

---

# 🎯 PROMPT C2.4 — Phrases poétiques étendues

**Format compact. Plus de variété dans les phrases Home.**

---PROMPT---

CONTEXTE — Étendre les phrases poétiques Home (C2.4)

Le fichier HOME_POETIC_PHRASES.md actuel a ~60 phrases. À user qui ouvre l'app plusieurs fois par jour pendant des mois, ça va devenir répétitif.

Objectif : passer à 200+ phrases pour qu'aucune ne soit revue avant ~3 mois d'usage intensif.

ÉTAPE 1 — GÉNÉRATION
Pour chaque combinaison season × light × weather, génère 5-8 phrases au lieu de 4.

Total combinaisons utiles : ~30 (toutes ne sont pas utilisées)
30 × 7 phrases moyennes = 210 phrases.

Sources d'inspiration :
- Sylvain Tesson, Robert Hainard
- Haïkus japonais (5-7-5 mais adaptés)
- Tankas
- Naturalistes français (Aubrac, Jura, Sologne)

Règles strictes :
- Maximum 10 mots
- Pas d'exclamation
- Pas de "tu" agressif
- Évoquer l'eau, le silence, le temps, le vivant
- Ton sobre, pas sentimental

ÉTAPE 2 — INTÉGRATION
Mets à jour src/lib/home/poetic-phrases.ts avec la nouvelle liste étendue.
Garde la même structure de clés "season-light-weather".

ÉTAPE 3 — PHRASES SPÉCIALES (bonus)
Ajoute des catégories spéciales :
- 'first_capture_of_day' : "Premier rendez-vous du jour."
- 'after_3_days_offline' : "L'eau ne change pas pendant ton absence."
- 'birthday' : "Une année de plus à compter les poissons."
- 'after_long_session' : "Belle endurance. L'eau récompense la patience."

Logique de priorité :
- Si une condition spéciale matche → priorité sur phrase contextuelle
- Sinon → phrase saison/light/weather normale

ÉTAPE 4 — COMMIT
"content: expand poetic phrases library to 200+ entries"

⚠️ Demander à un humain (toi) de relire/valider chaque phrase avant intégration
⚠️ Les phrases générées par IA doivent être TRIÉES, certaines seront mauvaises

---PROMPT---

---

# 🎯 PROMPT C2.5 — Empty states qui racontent

**Format compact. Les états vides comme moments narratifs.**

---PROMPT---

CONTEXTE — Empty states travaillés (C2.5)

Les états vides (Aquarium vide, FishDex vide, Sessions vides) sont des MOMENTS NARRATIFS, pas des erreurs.

ÉTAPE 1 — AUDIT
Liste les états vides actuels dans l'app :
- Aquarium sans capture
- Sessions sans session
- FishDex avec 0 espèces capturées
- Spots favoris vide
- FishFeed vide (si feature activée)

ÉTAPE 2 — REDESIGN

Pour chaque empty state, structure :

1. Illustration SVG simple et poétique (silhouette d'eau, hameçon, vague)
2. Titre principal contemplatif (pas "Vide" ou "Rien à afficher")
3. Sous-titre invitant
4. CTA principal cohérent

Exemples :

AQUARIUM VIDE :
- Illustration : silhouette de bocal vide avec une seule bulle qui monte
- Titre : "L'aquarium attend"
- Sous-titre : "Tes premières captures dessineront ton histoire."
- CTA : "Capturer ma première prise"

SESSIONS VIDE :
- Illustration : silhouette d'une canne posée près d'un étang à l'aube
- Titre : "Ta première sortie t'attend"
- Sous-titre : "Chaque session, chaque spot, chaque prise — immortalisés."
- CTA : "Démarrer une session"

FISHDEX 0 ESPÈCES :
- Illustration : silhouette de poisson en transparence
- Titre : "L'encyclopédie s'éveille"
- Sous-titre : "Chaque espèce capturée s'inscrit ici."
- CTA : "Voir toutes les espèces" (vers liste complète)

SPOTS FAVORIS VIDE :
- Illustration : silhouette de carte
- Titre : "Tes lieux n'attendent qu'une trace"
- Sous-titre : "Chaque capture peut devenir un spot."
- (Pas de CTA, c'est une conséquence des sessions/captures)

ÉTAPE 3 — COMPOSANT RÉUTILISABLE
Crée src/components/ui/EmptyState.tsx :

type Props = {
  illustration: ReactNode;
  title: string;
  subtitle: string;
  cta?: { label: string; href?: string; onClick?: () => void };
};

export function EmptyState({ illustration, title, subtitle, cta }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="mb-6 opacity-30">{illustration}</div>
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">
        {title.split(' ').slice(0, 2).join(' ')}
      </p>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-sm text-white/60 mb-6 max-w-xs">{subtitle}</p>
      {cta && (
        <Button asChild={!!cta.href} variant="primary">
          {cta.href ? <Link href={cta.href}>{cta.label}</Link> : <button onClick={cta.onClick}>{cta.label}</button>}
        </Button>
      )}
    </div>
  );
}

ÉTAPE 4 — COMMIT
"feat(ui): narrative empty states across the app"

---PROMPT---

---

# 📚 ANNEXE — Production éditoriale en parallèle

**Ce qui ne dépend pas du code, mais doit être produit** :

## 110 fiches espèces complètes
- 27h de travail réparti sur 3-4 semaines
- Template SPECIES_CONTENT_TEMPLATES.md
- Vérification systématique FishBase

## 50 conseils du jour
- 4-5h de travail
- À répartir équitablement : saisonniers, horaires, météo, techniques
- Style cohérent

## 200+ phrases poétiques
- 4-6h de travail
- Sources : haïkus, naturalistes, créations personnelles
- Validation manuelle obligatoire

## 50 citations naturalistes
- Recherche dans sources libres de droits
- Attribution rigoureuse
- Cohérence avec ADN contemplatif

**Total temps éditorial : 40-50h sur 4-6 semaines.**

À étaler. Faire 2-3 sessions de 2h par semaine, pas 50h en 1 weekend.

---

# ✅ CHECKLIST FINALE CONTENU VIVANT

- [ ] **C2.1** — Fiches enrichies, BDD étendue, UI détail refondue
- [ ] **C2.2** — Conseils contextuels du jour fonctionnels
- [ ] **C2.3** — Souvenirs marquants détectés et affichés
- [ ] **C2.4** — 200+ phrases poétiques en BDD
- [ ] **C2.5** — Empty states narratifs partout

**Production éditoriale** :
- [ ] 110 fiches espèces complètes
- [ ] 50 conseils du jour seed
- [ ] 200+ phrases poétiques
- [ ] 50 citations naturalistes

**Quand c'est fini, ton app est habitée. Elle parle au pêcheur, elle l'enseigne, elle le ramène.**

Contenu vivant livré. 🌿
