# 🌅 FishDex — Phrases poétiques contextuelles du Home

> Phrases d'accueil affichées sur le Home selon le contexte (saison + lumière + météo).
> Ton : contemplatif, naturaliste, jamais grandiloquent. Inspiration Sylvain Tesson, haïkus.
> Contrainte : 5 à 10 mots maximum par phrase.

## 📍 Emplacement dans le projet

À placer dans : `src/lib/home/poetic-phrases.ts`

## 🔧 Comment Claude Code l'utilise

```typescript
// Exemple d'usage côté Home
import { getPoetricPhrase } from '@/lib/home/poetic-phrases';

const phrase = getPoetricPhrase({
  season: 'spring',
  light: 'dawn',
  weather: 'foggy'
});
// → "Le lac s'éveille. La brume hésite encore."
```

## 📊 Structure technique recommandée

```typescript
// src/lib/home/poetic-phrases.ts

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type LightPhase = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'night';
type Weather = 'clear' | 'cloudy' | 'rainy' | 'foggy' | 'snowy';

type Context = {
  season: Season;
  light: LightPhase;
  weather: Weather;
};

const PHRASES_LIBRARY: Record<string, string[]> = {
  // structure : "{season}-{light}-{weather}": [phrases possibles]
  // ... voir contenu ci-dessous
};

export function getPoetricPhrase(context: Context): string {
  const key = `${context.season}-${context.light}-${context.weather}`;
  const phrases = PHRASES_LIBRARY[key] || PHRASES_LIBRARY.default;
  return phrases[Math.floor(Math.random() * phrases.length)];
}
```

---

# 🌸 PRINTEMPS

## Printemps · Aube

### Brumeux
- Le lac s'éveille. La brume hésite encore.
- Premier souffle du jour. L'eau respire.
- La rivière sort doucement de la nuit.
- Tout est encore tu. Même les oiseaux.

### Dégagé
- L'air sent la terre humide et le frais.
- Les premières lueurs glissent sur l'eau.
- Le silence du matin n'a pas de prix.

### Nuageux
- Ciel bas, eau lisse. Journée de patience.
- La lumière prend son temps ce matin.

## Printemps · Matin

### Dégagé
- Le soleil chauffe les premiers nénuphars.
- Les hirondelles tracent l'aube en biais.
- Belle journée pour ouvrir une session.

### Nuageux
- Lumière douce. Les poissons aiment ça.
- Le printemps avance, à son rythme.

### Pluvieux
- La pluie de printemps réveille les eaux.
- Eau trouble, gros poissons. Patience.

## Printemps · Midi

### Dégagé
- Soleil haut. Les carpes cherchent l'ombre.
- L'air vibre, les libellules ouvrent le bal.

### Nuageux
- Conditions stables. Bonne fenêtre devant toi.

## Printemps · Après-midi

### Dégagé
- Lumière dorée à venir. La meilleure heure.
- Les insectes éclosent. Truites en alerte.

### Nuageux
- Le ciel ralentit. L'eau aussi.

## Printemps · Crépuscule

### Dégagé
- Le jour s'étire. Tout devient or.
- Magic hour. Les prédateurs sortent.

### Nuageux
- Crépuscule discret. Pêcheur attentif.

## Printemps · Nuit

### Dégagé
- Les étoiles veillent sur la rivière.
- Le silence est plus dense la nuit.

---

# ☀️ ÉTÉ

## Été · Aube

### Dégagé
- L'eau est tiède. Le jour sera long.
- Carpes en surface aux premières lueurs.
- Lever silencieux. Belle journée à venir.

### Brumeux
- La chaleur monte sous la brume.
- Air immobile. Le silence est total.

## Été · Matin

### Dégagé
- Soleil franc. Cherche l'ombre des berges.
- Belle eau ce matin. Active tôt.

### Nuageux
- Couvert agréable. Les poissons sortent.

## Été · Midi

### Dégagé
- Soleil cogne. Patience ou ombre.
- Pause à l'ombre. L'eau attendra.
- Heure chaude. Pose la canne, observe.

### Nuageux
- Lumière voilée. Belle fenêtre rare.

### Pluvieux
- Pluie d'orage. Les carnassiers s'agitent.
- Sous la pluie, l'eau reprend vie.

## Été · Après-midi

### Dégagé
- Lumière oblique. Les prédateurs s'éveillent.
- Heure dorée approche. Reste là.

### Nuageux
- Le ciel respire. L'eau aussi.

## Été · Crépuscule

### Dégagé
- Coucher de feu. Les brochets chassent.
- Crépuscule d'or. Moment sacré.
- Les libellules valsent une dernière fois.

### Nuageux
- Le jour s'éteint doucement. Reste calme.

## Été · Nuit

### Dégagé
- La nuit d'été appartient aux silencieux.
- Eau noire, étoiles. Pêche d'initié.

### Nuageux
- Nuit chaude et lourde. Carpes actives.

---

# 🍂 AUTOMNE

## Automne · Aube

### Brumeux
- L'automne avance. La brume tient bon.
- Eau froide. Premier frisson du matin.
- Lever gris. Beauté discrète.

### Dégagé
- Air vif. Les feuilles flottent doucement.
- L'aube d'automne sent l'écorce mouillée.

### Nuageux
- Ciel bas. L'automne s'installe.

## Automne · Matin

### Nuageux
- Lumière argentée. Belle journée pêche.
- Couvert calme. Les brochets aiment ça.

### Pluvieux
- Pluie d'automne réveille les sandres.
- L'eau respire la pluie. Tout devient calme.

### Brumeux
- Brume tenace. Concentre-toi.

## Automne · Midi

### Nuageux
- Heure stable. Bonne fenêtre devant toi.

### Dégagé
- Le soleil d'automne dore les berges.

## Automne · Après-midi

### Dégagé
- Lumière mordorée. Les feuilles tombent.
- Bel après-midi. Le bois sent bon.

### Nuageux
- Couvert constant. Idéal pour insister.

## Automne · Crépuscule

### Dégagé
- Le ciel s'embrase. Octobre brûle.
- Crépuscule cuivré. Heure des géants.

### Nuageux
- Le jour s'éteint en silence.

## Automne · Nuit

### Dégagé
- Nuit fraîche, étoilée. Pêche méditative.

### Nuageux
- Obscurité douce. L'eau respire encore.

---

# ❄️ HIVER

## Hiver · Aube

### Dégagé
- Aube glacée. Le givre couvre les roseaux.
- Lever bleuté. Tout est figé.
- L'eau fume légèrement. Silence absolu.

### Brumeux
- Brume givrante. Beauté austère.

### Neigeux
- Neige sur l'eau. Le monde s'efface.

## Hiver · Matin

### Dégagé
- Soleil pâle. Les truites bougent lentement.
- Matin sec et clair. Journée patiente.

### Nuageux
- Gris plombé. Les sandres aiment ça.

### Neigeux
- La neige tombe. L'eau reçoit en silence.

## Hiver · Midi

### Dégagé
- Soleil bas. L'eau s'éclaire un instant.

### Nuageux
- Lumière voilée. Hiver continu.

## Hiver · Après-midi

### Dégagé
- Lumière oblique courte. Saisis l'instant.

### Nuageux
- Le jour s'efface vite en hiver.

## Hiver · Crépuscule

### Dégagé
- Crépuscule rosé. Brochets en chasse.
- L'horizon rougit. Beauté glacée.

### Nuageux
- Nuit qui tombe tôt. Rentre au chaud.

## Hiver · Nuit

### Dégagé
- Nuit étoilée d'hiver. Silence cristal.

### Neigeux
- Neige nocturne. Tout est paisible.

---

# 🌐 FALLBACK / DEFAULT

Si la combinaison contexte n'existe pas en base, utiliser ces phrases neutres :

- L'eau t'attend.
- Belle journée pour une session.
- Le monde vivant respire.
- Chaque sortie est un souvenir à venir.
- L'instant présent, c'est déjà beaucoup.

---

# 📝 Notes d'usage

## Pourquoi cette structure ?

- **5 combinaisons par défaut minimum** par contexte → variation naturelle, pas de répétition.
- **Aucune phrase exclamative**, aucun emoji intégré → laisse la photo et l'UI porter l'émotion.
- **Pas de "tu/vous" forcé**, l'app parle parfois directement à l'user, parfois décrit le monde. Variation naturelle.
- **Court** : la moyenne est 6-8 mots. Au-delà de 10 mots, ça devient verbeux.

## Quand enrichir la liste ?

- Si tu vois des combinaisons trop répétitives en testant → ajoute des phrases.
- Si tu veux ajouter des occasions spéciales (anniversaire de l'user, "il y a 1 an...") → crée une catégorie dédiée plus tard, en H3.

## Évolutions possibles plus tard

- **Phrases liées à la dernière capture** : "Hier, la perche t'a surpris."
- **Phrases liées à la série** : "Trois sessions de suite. Belle régularité."
- **Phrases liées aux Mirages** : "Le monde garde encore des surprises."

Ces évolutions sont **H3+**, pas urgentes.
