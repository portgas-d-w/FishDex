# 📋 FishDex — Index des Améliorations Post-H3

> Vue d'ensemble des 5 axes d'amélioration pour passer de "V1 prête" à "V1 premium".

---

## 🎯 Les 5 axes d'amélioration

| # | Axe | Durée estimée | Coût | Priorité reco |
|---|---|---|---|---|
| **1** | Polish UX & Micro-interactions | 1-2 semaines | 0€ | ⭐⭐⭐⭐ |
| **2** | Contenu vivant & Densification | 2-3 semaines | 0€ | ⭐⭐⭐ |
| **3** | IA Reconnaissance Espèces | 3-5 jours | ~5-20€/mois | ⭐⭐⭐⭐⭐ |
| **4** | Performance & Robustesse | 1-2 semaines | 0€ | ⭐⭐⭐⭐ |
| **5** | Onboarding & Premier contact | 1 semaine | 0€ | ⭐⭐⭐⭐ |

**Total** : 6-9 semaines de travail effectif si tout fait en série.
**Budget** : 5-20€/mois (uniquement pour l'IA).

---

## 📂 Documents fournis

1. **`AMELIORATION_1_POLISH_UX.md`** (~12 KB)
   - 5 prompts : système d'animations, skeletons, haptics, parallax, polish ciblé
   - Lib principale : framer-motion

2. **`AMELIORATION_2_CONTENU_VIVANT.md`** (~15 KB)
   - 5 prompts : fiches espèces enrichies, conseils contextuels, souvenirs, phrases poétiques, empty states
   - Production éditoriale : 40-50h de contenu à produire

3. **`AMELIORATION_3_IA_RECONNAISSANCE.md`** (~16 KB)
   - 4 prompts : iNaturalist API, Claude Vision fallback, UI suggestions, dashboard admin
   - Stratégie hybride iNat (gratuit) + Claude Haiku (~5-20€/mois)

4. **`AMELIORATION_4_PERFORMANCE.md`** (~15 KB)
   - 6 prompts : audit baseline, images, code splitting, error handling, monitoring, PWA
   - Outils : Lighthouse, Sentry, PostHog, UptimeRobot, next-pwa

5. **`AMELIORATION_5_ONBOARDING.md`** (~13 KB)
   - 5 prompts : 4 écrans contemplatifs, première capture guidée, coach marks, welcome back, privacy
   - Objectif : passage de "test" à "j'adhère" en 60 secondes

---

## 🎯 Ordre d'exécution recommandé

### Option A — "Je veux livrer V1 publique vite" (4-6 semaines)

1. **Semaine 1** : Axe 3 (IA) — le facteur "wow"
2. **Semaines 2-3** : Axe 4 (Performance) — stabilité avant prod
3. **Semaine 4** : Axe 5 (Onboarding) — première impression
4. **Semaines 5-6** : Axe 1 (Polish UX) — détails qui font la différence
5. **En continu** : Axe 2 (Contenu) — production éditoriale en parallèle

### Option B — "Je veux d'abord polish, puis pousser" (6-9 semaines)

1. **Semaines 1-2** : Axe 1 (Polish UX)
2. **Semaines 3-4** : Axe 4 (Performance)
3. **Semaine 5** : Axe 5 (Onboarding)
4. **Semaine 6** : Axe 3 (IA)
5. **Semaines 7-9** : Axe 2 (Contenu)

### Option C — "Tester l'IA d'abord avant de tout polish" (1-2 semaines pilote)

1. **3-5 jours** : Axe 3 uniquement (IA en bêta)
2. **Phase test** : montrer à 5-10 testeurs proches
3. **Selon retours** : prioriser axe 1, 4, ou 5

---

## ⚠️ Pièges à éviter

1. **Tout faire en parallèle** : tu vas avoir un bordel ingérable. Une feature à la fois.
2. **Commencer par le plus dur (IA) sans bases stables** : sécurise d'abord les perfs.
3. **Sous-estimer le contenu éditorial** : 110 fiches = travail vraiment long, étale-le.
4. **Sauter le monitoring (Axe 4)** : tu navigueras à l'aveugle en prod.
5. **Bâcler l'onboarding** : la 1ère impression détermine 70% de la rétention.

---

## 💡 Mon conseil franc

**Ordre que JE choisirais pour toi** :

**1. Commence par Axe 4.1 (audit perf)** — 1 jour
   → Tu sauras où tu en es vraiment, c'est la base

**2. Puis Axe 3 (IA reconnaissance)** — 3-5 jours
   → Le facteur "wow" qui te distingue
   → Test rapide avec 5-10 testeurs proches

**3. Puis Axe 5 (Onboarding)** — 1 semaine
   → Maintenant que l'IA marche, donne une bonne première impression

**4. Puis Axe 4 reste (perfs)** — 1-2 semaines
   → Solidifie avant V1 publique

**5. Puis Axe 1 (Polish UX)** — 1-2 semaines
   → Passage de pro à premium

**6. En continu : Axe 2 (Contenu)** — étalé sur 4-6 semaines
   → Tu produis 5-10 fiches par semaine en parallèle du dev

**Total : 8-10 semaines de travail intense mais cohérent.**

---

## 📈 Métriques de succès post-améliorations

Tu sauras que c'est réussi quand :

- **Lighthouse mobile** : 85+ (était probablement 60-70)
- **First Capture in 24h** : > 40%
- **D7 Retention** : > 30%
- **NPS** : > 30
- **Coût IA mensuel** : < 20€
- **Tu ressens** que l'app est "premium", pas "amateur"
- **Tes testeurs disent** "ça me rappelle [app premium connue]"

---

## 🐟 Note finale

Tu as devant toi **8-10 semaines de travail propre** pour transformer FishDex de "très belle V1" à "**produit fini de référence**" pour la pêche contemplative française.

C'est rapide pour ce que c'est. C'est lent si tu veux tout finir hier.

**Reste fidèle à l'ADN**. Chaque feature que tu ajoutes, demande-toi : "Sylvain Tesson approuverait-il ?". Si oui, fonce. Si non, redesign.

Bonne suite. ✨
