# 🟤 FishDex — Prompts Claude Code · Phase H4 LONG TERME

> Prompts stratégiques pour la phase long terme.
>
> **⚠️ PRÉREQUIS H3** : V1 publique lancée, app stable, communauté en construction.
>
> **⚠️ NATURE DE CES PROMPTS** : H4 c'est dans 12-24 mois. Beaucoup de décisions vont évoluer. Ces prompts sont **stratégiques**, pas techniques. Quand tu y arriveras, reviens consulter Claude (web) pour générer des prompts techniques détaillés selon le contexte du moment.
>
> **Estimation** : H4 n'a pas de fin. C'est un horizon. Sous-projets parallèles selon priorités et énergie.

---

## 📋 Sous-projets H4 (par ordre de valeur stratégique)

1. **S4.1** Data flywheel IA (collecte photos validées users)
2. **S4.2** Reconnaissance espèces IA (entraînement DIY)
3. **S4.3** App native React Native (App Store + Play Store)
4. **S4.4** FishFeed minimaliste (communauté douce)
5. **S4.5** Monétisation Pro tier (si V1 décolle)
6. **S4.6** Sound design + Haptics (app native only)
7. **S4.7** IA souvenirs (résumés sessions GPT/Claude)

**Ne pas attaquer tout en parallèle.** Choisis 1-2 sous-projets selon ce qui a du sens à ce moment-là.

---

# 🟤 PROMPT S4.1 — Data flywheel IA

**Le plus important de H4. Préparation pour H4.2.**

**Doit commencer DÈS H3 V1 publique pour collecter dès le jour 1.**

---PROMPT---

CONTEXTE — Data flywheel IA (H4.1)

Stratégie long terme : chaque capture user validée = donnée d'entraînement gratuite.
Sans ça, pas de modèle IA possible plus tard.

═══════════════════════════════════════════
ÉTAPE 1 — MIGRATION BDD
═══════════════════════════════════════════

Crée une table dédiée à tracker les données d'entraînement :

CREATE TABLE public.ai_training_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  catch_id UUID NOT NULL REFERENCES public.catches(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  species_id_validated UUID NOT NULL REFERENCES public.species(id),
  variant_id UUID NULL REFERENCES public.species_variants(id),
  species_id_predicted UUID NULL REFERENCES public.species(id), -- pour le futur
  prediction_confidence FLOAT NULL,
  user_corrected BOOLEAN DEFAULT FALSE,
  quality_score FLOAT NULL, -- calculé : flou, IA-detect, etc.
  is_usable_for_training BOOLEAN DEFAULT TRUE,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_training_species ON public.ai_training_data(species_id_validated);
CREATE INDEX idx_ai_training_corrected ON public.ai_training_data(user_corrected);

ALTER TABLE public.ai_training_data ENABLE ROW LEVEL SECURITY;

-- Lecture admin only
CREATE POLICY "ai_training_admin_read" ON public.ai_training_data
  FOR SELECT USING (false); -- toi tu utilises service_role pour query

═══════════════════════════════════════════
ÉTAPE 2 — AUTO-CAPTURE À CHAQUE CATCH
═══════════════════════════════════════════

Modifie createCatch action pour, après création réussie d'un catch :
- INSERT dans ai_training_data avec les bonnes infos
- C'est silencieux côté user

═══════════════════════════════════════════
ÉTAPE 3 — CONSENTEMENT USER
═══════════════════════════════════════════

Dans les paramètres app, ajoute toggle :
"Contribuer à améliorer la reconnaissance d'espèces"
Description : "Tes photos validées peuvent aider à entraîner notre futur système d'identification automatique. Aucune photo n'est partagée publiquement."

Default : TRUE (mais respectable RGPD : l'user peut désactiver)

═══════════════════════════════════════════
ÉTAPE 4 — DASHBOARD ADMIN
═══════════════════════════════════════════

Crée /admin/ai-data (réservé à toi via check email) :
- Compteur total photos
- Répartition par espèce
- Identifie les espèces sous-représentées
- Export CSV pour entraînement futur

═══════════════════════════════════════════
ÉTAPE 5 — COMMIT
═══════════════════════════════════════════

"feat(ai): training data collection pipeline for future ML model"

⚠️ RGPD : prévoir export et suppression données utilisateur sur demande
⚠️ Documentation publique : être transparent sur l'usage des photos

---PROMPT---

---

# 🟤 PROMPT S4.2 — Reconnaissance IA (entraînement DIY)

**Format ultra-stratégique. À aborder seulement après 6-12 mois d'apprentissage ML.**

---PROMPT---

CONTEXTE — Entraînement IA reconnaissance espèces (H4.2)

⚠️ NE PAS LANCER ce prompt avant d'avoir :
- 6-12 mois d'apprentissage ML (Python, PyTorch, computer vision)
- 50 000+ photos validées via le data flywheel (H4.1)
- Compris les concepts : transfer learning, fine-tuning, quantization, ONNX

═══════════════════════════════════════════
ÉTAPE 1 — VÉRIFICATION PRÉREQUIS
═══════════════════════════════════════════

Avant tout code, vérifie :
- Combien de photos as-tu collectées ? (minimum 100 par espèce)
- Combien d'espèces reconnaissables ? (commence avec 20-30, pas 110)
- As-tu accès à un GPU (Colab Pro 10€/mois ou RunPod) ?

Si NON à un critère → STOP, attends.

═══════════════════════════════════════════
ÉTAPE 2 — ARCHITECTURE CIBLE (rappel master)
═══════════════════════════════════════════

Pipeline 2 étages :
1. Détection (YOLOv8n) → trouve le poisson dans l'image, crop
2. Classification (EfficientNetV2-S) → identifie l'espèce dans le crop

═══════════════════════════════════════════
ÉTAPE 3 — DATASET PRÉPARATION
═══════════════════════════════════════════

Workflow :
1. Export ai_training_data en CSV
2. Download photos depuis Supabase Storage
3. Filter qualité (auto blur detection, IA-image detection)
4. Auto-crop avec YOLOv8 pré-entraîné
5. Split train/val/test (70/15/15) par espèce
6. Versioning avec DVC

═══════════════════════════════════════════
ÉTAPE 4 — TRAINING
═══════════════════════════════════════════

Setup PyTorch + timm sur Colab Pro :
- Load EfficientNetV2-S pré-entraîné ImageNet
- Replace head : 110 classes (ou nombre actuel)
- Augmentations : RandAugment, Mixup, CutMix
- Optimizer : AdamW, OneCycleLR
- 50-100 epochs avec early stopping
- Track avec Weights & Biases

═══════════════════════════════════════════
ÉTAPE 5 — MOBILE EXPORT
═══════════════════════════════════════════

Pipeline export :
1. PyTorch → ONNX
2. ONNX → quantization INT8
3. ONNX → CoreML (iOS) + TFLite (Android)
4. Target : modèle < 20 MB, inférence < 200ms

═══════════════════════════════════════════
ÉTAPE 6 — INTÉGRATION APP
═══════════════════════════════════════════

Dans le flow capture :
1. User prend photo
2. App lance YOLO + Classification en local
3. Affiche top-3 prédictions avec confidence
4. User valide ou corrige
5. Capture la correction → renvoyée à ai_training_data

⚠️ L'IA PROPOSE, L'USER VALIDE. Jamais d'auto-validation.

═══════════════════════════════════════════
ÉTAPE 7 — MONITORING + RE-TRAINING
═══════════════════════════════════════════

Pipeline auto :
- Cron mensuel : compte les nouvelles corrections users
- Si > 1000 nouvelles données → re-training programmé
- Versioning modèle : v1.0, v1.1, etc.
- A/B test : 50% users nouveau modèle, 50% ancien
- Si nouveau > ancien sur métriques → déploiement complet

═══════════════════════════════════════════
ÉTAPE 8 — COMMIT
═══════════════════════════════════════════

Multiple commits car chantier de 3-6 mois.

⚠️ Documenter chaque expérimentation
⚠️ Conserver l'historique des modèles entraînés
⚠️ Toujours possibilité de fallback sélection manuelle

---PROMPT---

---

# 🟤 PROMPT S4.3 — App native React Native

**Format stratégique. Migration majeure.**

---PROMPT---

CONTEXTE — Migration vers React Native (H4.3)

À considérer seulement si :
- V1 publique a > 1000 users actifs
- Demande explicite "version mobile native"
- Tu as appris React Native / Expo (2-3 mois)

═══════════════════════════════════════════
ÉTAPE 1 — DÉCISION ARCHITECTURE
═══════════════════════════════════════════

Options :
(a) Migration complète Next.js → Expo React Native
(b) PWA améliorée (installable, offline, push)
(c) Coque WebView native (Capacitor) wrapping Next.js

Mon avis pour FishDex :
- (b) PWA = 95% du gain pour 5% de l'effort. À tenter d'abord.
- Si insuffisant → (a) migration React Native complète.
- (c) Capacitor est tentant mais médiocre pour features natives (caméra, IA on-device).

═══════════════════════════════════════════
ÉTAPE 2 — SI PWA D'ABORD (recommandé)
═══════════════════════════════════════════

1. Service Worker offline first
2. Manifest complet (icons, splash, theme)
3. Cache stratégies pour assets / pages
4. Push notifications via Web Push API
5. "Add to home screen" prompt optimisé
6. Background sync pour upload différé
7. Test installation iOS + Android

═══════════════════════════════════════════
ÉTAPE 3 — SI MIGRATION RN COMPLÈTE
═══════════════════════════════════════════

Setup :
- Expo SDK 51+
- TypeScript strict
- React Navigation 7
- Expo Camera, Expo Image Manipulator
- Supabase JS client compatible RN
- NativeWind (Tailwind pour RN)

Migration progressive :
1. Structure routing → React Navigation
2. Components Tailwind → NativeWind
3. Pages une par une (commence Home, FishDex, Aquarium)
4. Server Actions → Supabase direct calls (RN ne fait pas Server Actions)
5. Tests parallèle web/native pendant la phase de migration

═══════════════════════════════════════════
ÉTAPE 4 — PUBLICATION STORES
═══════════════════════════════════════════

App Store :
- Compte Apple Developer (99€/an)
- Screenshots cinématiques (assets du master)
- Description marketing (utiliser ton ADN contemplatif)
- Review Apple : 1-2 semaines

Play Store :
- Compte Google Play (25€ one-shot)
- Screenshots
- Review : 1-3 jours

═══════════════════════════════════════════
ÉTAPE 5 — COMMIT
═══════════════════════════════════════════

Multiple commits sur ~3-6 mois.

⚠️ Ne pas casser la version web pendant la migration
⚠️ Maintenir 2 codebases minimum (web + native) tant que la migration n'est pas finie
⚠️ Sound design (S4.6) ne peut commencer qu'après l'app native

---PROMPT---

---

# 🟤 PROMPT S4.4 — FishFeed minimaliste

**Format compact. Communauté douce.**

---PROMPT---

CONTEXTE — FishFeed minimaliste (H4.4)

Activation conditionnelle :
- Seulement si user a 5+ sessions enregistrées
- Anti-réseau-social-toxique strict

═══════════════════════════════════════════
ÉTAPE 1 — MIGRATION BDD
═══════════════════════════════════════════

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  catch_id UUID NULL REFERENCES public.catches(id),
  session_id UUID NULL REFERENCES public.sessions(id),
  type TEXT CHECK (type IN ('capture', 'session', 'memory')),
  caption TEXT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  emoji TEXT CHECK (emoji IN ('respect', 'beau', 'merci', 'inspire', 'sage', 'sourire', 'force')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id, user_id, emoji)
);

⚠️ PAS de table comments (volontaire)
⚠️ PAS de table followers (volontaire)

═══════════════════════════════════════════
ÉTAPE 2 — FEED UI
═══════════════════════════════════════════

Route /fishfeed accessible seulement si user.session_count >= 5.

UI :
- Feed chronologique inverse
- Pas de algorithme, pas de "Top posts"
- Cards posts avec photo + caption + 7 emoji réactions
- Pas de bouton "Like", juste les 7 réactions
- Pas de commentaires
- Pas de partage externe (volontaire)

═══════════════════════════════════════════
ÉTAPE 3 — MODÉRATION
═══════════════════════════════════════════

Système simple :
- Signalement post → flag dans BDD
- Toi tu reviews manuellement (dashboard admin)
- Posts douteux : auto-hide après 3 signalements

═══════════════════════════════════════════
ÉTAPE 4 — COMMIT
═══════════════════════════════════════════

"feat(fishfeed): minimal community feed with curated reactions"

⚠️ Restez vigilants : si toxicité émerge, réduire encore les features
⚠️ Pas de notification push agressive ("X a réagi à ton post !")

---PROMPT---

---

# 🟤 PROMPT S4.5 — Monétisation Pro tier

**Format stratégique. À explorer SEULEMENT si V1 décolle.**

---PROMPT---

CONTEXTE — Monétisation Pro (H4.5)

⚠️ NE PAS implémenter avant 1000+ users actifs et NPS > 40.

═══════════════════════════════════════════
ÉTAPE 1 — VALIDATION DEMANDE
═══════════════════════════════════════════

Avant tout code :
- Survey users : "Quelles features paieriez-vous ?"
- Identifies les top 3 features désirées
- Vérifies disposition à payer (price sensitivity)

═══════════════════════════════════════════
ÉTAPE 2 — PRICING
═══════════════════════════════════════════

Hypothèse master : 4.99€/mois.

À valider via tests :
- 3.99€ vs 4.99€ vs 6.99€
- Mensuel vs Annuel (50€/an avec ristourne)
- Lifetime offer (one-shot 99€)

═══════════════════════════════════════════
ÉTAPE 3 — FEATURES PRO
═══════════════════════════════════════════

Candidats Pro (à valider avec users) :
- Stats avancées (Wrapped permanent, analytics personnels)
- IA souvenirs (résumés sessions par GPT/Claude)
- Export pro (PDF/imprimable haute qualité)
- Illustrations HD espèces
- Backgrounds Home premium
- Synchronisation multi-appareils (peut-être déjà gratuit selon archi)
- Pas de limite captures (si tu mets une limite free)

⚠️ FREE doit rester excellent. Ne JAMAIS dégrader le free pour pousser au Pro.

═══════════════════════════════════════════
ÉTAPE 4 — STRIPE INTÉGRATION
═══════════════════════════════════════════

Setup :
- Compte Stripe
- Webhook Supabase
- Tables : subscriptions, subscription_events
- Server Actions : createCheckout, cancelSubscription, etc.
- Gestion fin de période / renouvellement

═══════════════════════════════════════════
ÉTAPE 5 — UX UPSELL
═══════════════════════════════════════════

Anti-pattern à éviter :
❌ Pop-up Pro à chaque action
❌ Features bloquées avec cadenas
❌ Limites artificielles ("Vous avez atteint 10 captures gratuites !")

Pattern recommandé :
✅ Page /pro accessible volontairement
✅ Discrete mention "Pro" dans paramètres
✅ Trial 7 jours gratuits

═══════════════════════════════════════════
ÉTAPE 6 — COMMIT
═══════════════════════════════════════════

Multiple commits sur 1-2 mois.

⚠️ Tester en détail le flow checkout
⚠️ Tester le flow annulation
⚠️ Gérer les cas d'échec paiement gracieusement

---PROMPT---

---

# 🟤 PROMPT S4.6 — Sound design + Haptics

**Format compact. App native only.**

---PROMPT---

CONTEXTE — Sound design + Haptics (H4.6)

⚠️ Requiert l'app native (H4.3).

═══════════════════════════════════════════
ÉTAPE 1 — CONCEPT
═══════════════════════════════════════════

Sons cibles (subtils, jamais agressifs) :
- Démarrage session : eau calme
- Fin de session : vent doux
- Nouvelle capture : "plop" délicat
- Nouvelle espèce : carillon discret
- Mirage capturée : chime mystique
- Splash transition pages : eau qui glisse

Haptics cibles (iOS) :
- Light : interactions normales
- Medium : confirmations
- Heavy : moments rares (nouvelle espèce)
- Success/Error feedback

═══════════════════════════════════════════
ÉTAPE 2 — PRODUCTION
═══════════════════════════════════════════

Sources :
- Freesound.org (gratuit, attribution)
- Epidemic Sound (payant ~15€/mois)
- Sound designer freelance (~500€ pour pack complet)

═══════════════════════════════════════════
ÉTAPE 3 — INTÉGRATION REACT NATIVE
═══════════════════════════════════════════

Libs :
- expo-av pour les sons
- expo-haptics pour vibrations

═══════════════════════════════════════════
ÉTAPE 4 — PARAMÉTRAGE USER
═══════════════════════════════════════════

Toggles :
- Sons (default ON)
- Vibrations (default ON)
- Volume effets

═══════════════════════════════════════════
ÉTAPE 5 — COMMIT
═══════════════════════════════════════════

"feat(native): premium sound design and haptic feedback"

---PROMPT---

---

# 🟤 PROMPT S4.7 — IA souvenirs (résumés sessions)

**Format compact. Feature Pro typique.**

---PROMPT---

CONTEXTE — IA souvenirs (H4.7)

Génère des résumés poétiques de sessions via Claude API ou GPT.
Feature potentiellement Pro (selon économie).

═══════════════════════════════════════════
ÉTAPE 1 — PROMPT ENGINEERING
═══════════════════════════════════════════

Template prompt à envoyer à l'API :

"Voici les données d'une session de pêche :
- Lieu : [spot]
- Date : [date]
- Durée : [duration]
- Captures : [list with species, sizes]
- Météo : [weather]
- Ressenti user : [ressenti]
- Notes user : [notes]

Génère un court résumé poétique (3-4 phrases) qui capture
l'essence de cette session. Ton : contemplatif, naturaliste,
inspiré de Sylvain Tesson. Pas d'exclamation, pas de superlatifs."

═══════════════════════════════════════════
ÉTAPE 2 — INTÉGRATION
═══════════════════════════════════════════

Sur détail session :
- Bouton "Générer mon résumé poétique" (Pro uniquement)
- Click → API call → stockage en BDD
- Affiché en haut de la page session

═══════════════════════════════════════════
ÉTAPE 3 — COÛTS
═══════════════════════════════════════════

Estimation :
- Claude Haiku ou GPT-4o-mini : ~0.001€ par résumé
- 1000 résumés / mois = 1€
- Marge confortable même à 4.99€/mois Pro

═══════════════════════════════════════════
ÉTAPE 4 — COMMIT
═══════════════════════════════════════════

"feat(pro): AI-generated poetic session summaries"

---PROMPT---

---

# ✅ H4 RÉFLEXIONS LONG TERME

H4 n'a pas de checklist finale. C'est un horizon, pas une phase.

**À te demander régulièrement** :
- L'app a-t-elle décollé ? (1000+ users actifs)
- Suis-je toujours aligné avec l'ADN contemplatif ?
- Le burnout est-il sous contrôle ?
- Y a-t-il un nouveau sous-projet H4 qui prend du sens ?

**Évolutions possibles non listées** :
- Internationalisation (anglais, espagnol)
- Partenariats fédérations pêche
- Mode famille / multi-comptes
- Intégration matériel connecté (sondes, balances)
- Documentary content (mini-vidéos)
- Tournois écoresponsables
- Cartes interactives spots France

⚠️ **Pas tout. Choisis selon ce qui résonne et ce qui sert l'ADN.**

H4 est un voyage. Pas une destination. 🌅
