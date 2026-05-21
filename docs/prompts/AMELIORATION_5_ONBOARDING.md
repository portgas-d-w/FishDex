# 🌅 FishDex — Axe 5 : Onboarding & Premier contact user

> Transformer les 60 premières secondes en moment **émouvant et clarifiant**.
>
> **Estimation** : 1 semaine de travail effectif.
>
> **⚠️ Règle d'or** : L'onboarding ne doit JAMAIS être un tutoriel chiant. C'est un moment narratif.

---

## 📐 Pourquoi l'onboarding est critique

**Statistiques générales d'apps** :
- 25% des users abandonnent après 1 ouverture
- 60% des users abandonnent dans les 7 premiers jours
- L'onboarding détermine 70% de la rétention long terme

**Pour FishDex**, c'est encore plus critique car :
- Tu vends une **expérience contemplative**, pas une feature
- L'user doit "ressentir" l'ADN dans les 30 premières secondes
- Sans premier capture, l'app reste vide et abstraite

---

# 🎯 PROMPT O5.1 — Onboarding 4 écrans contemplatif

**Format détaillé. Le cœur du premier contact.**

**⚠️ Note** : si tu as déjà fait S3.4, ce prompt enrichit et affine. Sinon, c'est ta première implémentation.

---PROMPT---

CONTEXTE — Onboarding 4 écrans (O5.1)

Refonte de l'onboarding pour qu'il soit court, beau, et émouvant.

═══════════════════════════════════════════
ÉTAPE 1 — STRUCTURE DES 4 ÉCRANS
═══════════════════════════════════════════

ÉCRAN 1 — BIENVENUE
- Background : vidéo loop courte ou photo cinématique d'un lac à l'aube
- Logo FishDex centré (animation fade-in lente)
- Titre grand : "Préserve tes moments de pêche"
- Sous-titre : "Une encyclopédie vivante de tes aventures"
- CTA : "Commencer →" (bouton cyan)
- Progress dots : 1/4

ÉCRAN 2 — CAPTURE
- Background : photo cinématique d'un pêcheur tenant un poisson au coucher (no-kill)
- Animation : icône camera apparaît au centre
- Titre : "Chaque prise devient un souvenir"
- Sous-titre : "Photographie, géolocalise, n'oublie rien"
- 3 mini-illustrations : photo / lieu / temps
- CTA : "Suivant →"
- Progress dots : 2/4

ÉCRAN 3 — SESSIONS
- Background : pêcheur de dos au crépuscule
- Animation : icône calendrier apparaît
- Titre : "Reviens à tes plus belles sorties"
- Sous-titre : "Le carnet vivant de tes sessions"
- 3 mini-illustrations : timer / météo / ressenti
- CTA : "Suivant →"
- Progress dots : 3/4

ÉCRAN 4 — VOIE & PERMISSIONS
- Background : neutre, calme (bord d'étang en gros plan)
- Titre : "Quelques permissions pour bien commencer"
- 3 toggles :
  * Caméra : "Pour photographier tes prises"
  * Géolocalisation : "Pour mémoriser tes spots"
  * Notifications : "Météo idéale, nouvelles espèces" (default OFF, opt-in)
- Section "Quelle pêche te passionne ?" (optionnelle, skippable) :
  * Paisibles 🐟
  * Prédateurs 🦈
  * Eaux vives 🌊
  * Toutes 🌐
- CTA principal : "Découvrir FishDex →"
- CTA secondaire : "Plus tard" (skip toutes les permissions)
- Progress dots : 4/4

═══════════════════════════════════════════
ÉTAPE 2 — TRANSITIONS ENTRE ÉCRANS
═══════════════════════════════════════════

Utilise framer-motion pour transitions horizontales swipeables :

import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

Support :
- Click sur CTA → écran suivant
- Swipe horizontal → écran suivant/précédent
- Tap sur progress dots → écran ciblé

═══════════════════════════════════════════
ÉTAPE 3 — GESTION ÉTAT
═══════════════════════════════════════════

Sauvegarder à chaque étape :

const [step, setStep] = useState(0);
const [voie, setVoie] = useState<string | null>(null);
const [permissions, setPermissions] = useState({
  camera: false,
  geolocation: false,
  notifications: false,
});

À la fin, Server Action :

await markOnboardingComplete({
  voie,
  permissions,
});

Qui :
1. UPDATE profiles SET onboarding_completed = TRUE
2. UPDATE profiles SET voie_principale = voie (si choisi)
3. Demande les permissions natives système via JS APIs

═══════════════════════════════════════════
ÉTAPE 4 — REDIRECTION POST-ONBOARDING
═══════════════════════════════════════════

Au signup → forcer redirection vers /onboarding
Au login si onboarding_completed === false → forcer /onboarding

Middleware Next.js :

export function middleware(request: NextRequest) {
  const isAuthenticated = ...;
  const isOnboardingComplete = ...;

  if (isAuthenticated && !isOnboardingComplete && request.nextUrl.pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
}

═══════════════════════════════════════════
ÉTAPE 5 — ANIMATION D'ENTRÉE FINALE
═══════════════════════════════════════════

Quand l'user finit l'onboarding et arrive sur le Home :

1. Hero background fade in lent (1s)
2. Greeting "Bienvenue [Prénom]" en grand
3. Sous-titre : "Bienvenue dans le silence de l'eau"
4. Après 3s, le greeting passe au format normal "Bonjour [Prénom]"
5. Tous les widgets fade in en cascade

C'est le "moment magique" qui fait passer l'user de "test" à "j'adhère".

═══════════════════════════════════════════
ÉTAPE 6 — COMMIT
═══════════════════════════════════════════

"feat(onboarding): 4-screen contemplative welcome experience"

⚠️ Skip toujours possible (pas de force)
⚠️ Permissions natives appelées au bon moment (caméra demandée seulement quand utile)
⚠️ Si l'user skip, il peut revenir aux paramètres pour activer

---PROMPT---

---

# 🎯 PROMPT O5.2 — Première capture guidée (parcours coaché)

**Format compact. Quand l'user vient juste d'arriver.**

---PROMPT---

CONTEXTE — Premier capture coaché (O5.2)

L'user vient de finir l'onboarding. Il atterrit sur le Home vide.
C'est le moment critique : ou il fait sa première capture (et accroche), ou il quitte.

ÉTAPE 1 — ÉTAT HOME "PREMIER VISITE"
Si user.has_no_captures === true, le Home affiche :

Widget AUJOURD'HUI :
- Pas "Aucune session en cours"
- Mais : "Bienvenue chez FishDex. Ta première capture t'attend."
- CTA proéminent : "Faire ma première capture" (cyan, animation pulse)

Widget DERNIÈRES CAPTURES :
- Empty state spécial : silhouette de poisson en transparence + "Ton premier souvenir s'écrit ici"

ÉTAPE 2 — FLOW CAPTURE GUIDÉ
Quand l'user clique sur capture pour la première fois, mode "guided" :

Step 1 : "Photographie ton poisson"
- Caméra ouverte automatiquement
- Overlay tutoriel discret : "Cadre bien, lumière naturelle si possible"
- Tap pour prendre

Step 2 : "Le FishDex analyse..."
- IA reconnaissance lancée
- Animation pendant 2-3s
- Si reconnue → "On dirait un brochet ! Confirmes-tu ?"
- Si pas reconnue → "Aide-nous à le reconnaître"

Step 3 : "Quelques détails"
- Formulaire allégé : juste taille (optionnel), poids (optionnel), notes (optionnel)
- Tooltip discret : "Toutes les infos sont optionnelles, tu peux compléter plus tard"

Step 4 : "Et voilà !"
- Animation de succès subtile (pas confettis, plutôt fade in cyan glow)
- Message : "Ta première capture est enregistrée."
- "Découvre ton Aquarium →"

ÉTAPE 3 — REWARD ÉMOTIONNEL
Au lieu de "+50 XP" gaming, message contemplatif :

"Une première trace. C'est par ici que ton histoire commence."

Vibration haptic success.

Suggérer immédiatement :
- "Tu pêchais avec qui ?" → onboard concept compagnons
- "Tu veux marquer ce souvenir ?" → onboard concept bookmark

ÉTAPE 4 — SUIVI PARCOURS
Dans une table user_journey :

CREATE TABLE public.user_journey (
  user_id UUID PRIMARY KEY,
  first_capture_at TIMESTAMPTZ,
  first_session_at TIMESTAMPTZ,
  first_5_captures_at TIMESTAMPTZ,
  first_species_diversity_at TIMESTAMPTZ, -- 5+ espèces différentes
  reached_level_5_at TIMESTAMPTZ
);

Permet de :
- Afficher des messages pertinents selon avancement
- Comprendre où les users décrochent
- Détecter le moment "aha" individuel

ÉTAPE 5 — COMMIT
"feat(onboarding): guided first capture experience"

---PROMPT---

---

# 🎯 PROMPT O5.3 — Tutoriels in-app discrets

**Format compact. Apprentissage progressif sans paraît tutoriel.**

---PROMPT---

CONTEXTE — Tutoriels in-app naturels (O5.3)

Au lieu d'un long onboarding qui essaie de tout expliquer, on saupoudre des micro-tutoriels au moment où l'user en a besoin.

ÉTAPE 1 — SYSTÈME DE COACH MARKS
Crée src/components/onboarding/CoachMark.tsx :

type Props = {
  id: string;          // unique, sauvegardé en BDD si vu
  target: string;      // selector du composant cible
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showOnce: boolean;
};

Si l'user n'a jamais vu ce coach mark (table user_seen_coach_marks),
on affiche un tooltip avec arrow pointant vers le composant.

ÉTAPE 2 — COACH MARKS À CRÉER

| ID | Trigger | Message |
|---|---|---|
| 'first_session_start' | 1ère fois sur /sessions | "Commence une session pour suivre une vraie sortie" |
| 'first_species_lock' | Voit une espèce verrouillée dans FishDex | "Capture pour débloquer cette espèce" |
| 'first_bookmark' | Sur une session | "Bookmark tes sessions marquantes ici" |
| 'first_voie' | Première fois sur FishDex | "Choisis ta voie pour personnaliser ton FishDex" |
| 'first_mirage' | Voit un Mirage non capturé | "Les Mirages sont des variantes rares à découvrir" |

Total : 5-7 coach marks max. Trop = lassant.

ÉTAPE 3 — TIMING
- Apparition : 1 seconde après que le composant cible soit visible
- Auto-dismiss après 8 secondes si pas interagis
- "Compris" button explicit pour dismiss
- Marqué comme vu en BDD pour pas le revoir

ÉTAPE 4 — COMMIT
"feat(onboarding): contextual coach marks system"

⚠️ Pas plus de 1 coach mark visible à la fois
⚠️ User peut désactiver tous les coach marks dans settings

---PROMPT---

---

# 🎯 PROMPT O5.4 — Premier login récurrent (welcome back)

**Format compact. Ramener les users qui reviennent.**

---PROMPT---

CONTEXTE — Welcome back pour users qui reviennent (O5.4)

Quand un user revient après une absence, FishDex doit "le saluer" sans être intrusif.

ÉTAPE 1 — DÉTECTION ABSENCE
Compare last_login_at avec NOW().

- < 24h : pas de message spécial
- 1-3 jours : "Bon retour"
- 4-7 jours : "On t'attendait"
- 7-30 jours : "Bon retour. La rivière t'a manqué ?"
- 30+ jours : "Heureux de te revoir. Ton dernier souvenir date de [date]."

ÉTAPE 2 — UI DOUCE
À l'ouverture après absence, modale OU banner discret en haut du Home :

<div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-cyan-700/5
                backdrop-blur p-5 mb-6 animate-fadeInUp">
  <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">
    Bon retour
  </p>
  <p className="text-base text-white/90 leading-relaxed">
    {message}
  </p>
  <p className="text-xs text-white/40 mt-3">
    Pendant ton absence, [X] espèces ont été ajoutées au FishDex.
  </p>
</div>

ÉTAPE 3 — CONTENU ENRICHI
Pour absences longues (> 7 jours), proposer :
- "Voir un souvenir de ton dernier passage" → lien vers dernière session
- "Découvrir les nouvelles espèces" → lien FishDex filtré sur nouveautés

ÉTAPE 4 — COMMIT
"feat(home): welcome-back banner for returning users"

---PROMPT---

---

# 🎯 PROMPT O5.5 — Privacy policy et confiance

**Format compact. Premier contact technique mais critique.**

---PROMPT---

CONTEXTE — Privacy policy contemplative (O5.5)

Légal obligatoire (RGPD), mais à présenter dans le ton FishDex.

ÉTAPE 1 — PAGE /privacy
Crée /src/app/privacy/page.tsx :

Structure :
1. Intro : "Ce que tu fais ici reste ici"
2. Ce qu'on collecte (clair, pas de jargon)
3. Ce qu'on NE collecte PAS (rassurant)
4. Comment on protège
5. Tes droits (export, suppression, modification)
6. Contact si question

Ton : factuel mais chaleureux. Pas de bullshit corporate.

Exemple intro :

"Chez FishDex, on respecte ta tranquillité comme on respecte celle d'un étang à l'aube.
Voici ce qu'on collecte, ce qu'on protège, et comment tu gardes le contrôle."

ÉTAPE 2 — CONSENT BANNER (RGPD)
Pas de gros banner agressif. Plutôt :
- À la première visite, en bas de page :
  "FishDex utilise des cookies essentiels et de l'analytics anonyme pour s'améliorer. [En savoir plus] [J'accepte]"

ÉTAPE 3 — EXPORT DONNÉES
Dans /settings, section "Mes données" :
- Bouton "Télécharger toutes mes données"
- Génère un JSON avec : profil, captures, sessions, photos URLs
- Email avec lien temporaire

ÉTAPE 4 — SUPPRESSION COMPTE
Dans /settings :
- Bouton "Supprimer mon compte" (rouge, en bas)
- Double confirmation : "Toutes tes captures, sessions et souvenirs seront effacés."
- Cooling period 7 jours : email reçu, possibilité d'annuler
- Après 7 jours : suppression effective + email confirmation

ÉTAPE 5 — COMMIT
"feat(legal): contemplative privacy policy and data control"

---PROMPT---

---

# ✅ CHECKLIST FINALE ONBOARDING

- [ ] **O5.1** — 4 écrans contemplatifs avec transitions fluides
- [ ] **O5.2** — Première capture guidée et émouvante
- [ ] **O5.3** — Coach marks contextuels in-app
- [ ] **O5.4** — Welcome back pour returning users
- [ ] **O5.5** — Privacy + export + suppression compte

**Tests qualitatifs** :
- [ ] Fais tester par 2-3 personnes non-pêcheurs : comprennent-ils en 60 sec ?
- [ ] Fais tester par 2-3 pêcheurs : se sentent-ils respectés ?
- [ ] Mesure le taux de complétion onboarding (PostHog funnel)
- [ ] Mesure le taux de première capture dans les 24h
- [ ] Vérifie RGPD avec un freelance juridique (50-100€ une fois)

**Objectifs chiffrés** :
- [ ] Onboarding completion rate > 70%
- [ ] First capture dans 24h > 40%
- [ ] D7 retention > 30%
- [ ] D30 retention > 15%

---

# 📊 PSYCHOLOGIE DE L'ONBOARDING FISHDEX

**Ce qu'on cherche émotionnellement** :
1. Émerveillement (premier hero, animations subtiles)
2. Reconnaissance (l'app comprend ce qu'on veut)
3. Permission (on ne force rien)
4. Première victoire (capture validée)
5. Curiosité (qu'est-ce qu'il y a après ?)

**Ce qu'on évite absolument** :
- Forcer la création de compte avant de montrer l'app
- Demander 10 permissions d'un coup
- Coller des CTA "Upgrade Pro" partout
- Forcer la voie au signup
- Promesses non tenues

**Quand l'onboarding est bien fait, l'user devient ambassadeur. Quand il est raté, il n'ouvre jamais une 2ème fois.**

Onboarding livré. 🌅
