export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type LightPhase = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'night';
export type Weather = 'clear' | 'cloudy' | 'rainy' | 'foggy' | 'snowy';

export type Context = {
  season: Season;
  light: LightPhase;
  weather: Weather;
};

const PHRASES_LIBRARY: Record<string, string[]> = {
  // ── PRINTEMPS ────────────────────────────────────────────────
  'spring-dawn-foggy': [
    "Le lac s'éveille. La brume hésite encore.",
    "Premier souffle du jour. L'eau respire.",
    "La rivière sort doucement de la nuit.",
    "Tout est encore tu. Même les oiseaux.",
  ],
  'spring-dawn-clear': [
    "L'air sent la terre humide et le frais.",
    "Les premières lueurs glissent sur l'eau.",
    "Le silence du matin n'a pas de prix.",
  ],
  'spring-dawn-cloudy': [
    "Ciel bas, eau lisse. Journée de patience.",
    "La lumière prend son temps ce matin.",
  ],
  'spring-morning-clear': [
    "Le soleil chauffe les premiers nénuphars.",
    "Les hirondelles tracent l'aube en biais.",
    "Belle journée pour ouvrir une session.",
  ],
  'spring-morning-cloudy': [
    "Lumière douce. Les poissons aiment ça.",
    "Le printemps avance, à son rythme.",
  ],
  'spring-morning-rainy': [
    "La pluie de printemps réveille les eaux.",
    "Eau trouble, gros poissons. Patience.",
  ],
  'spring-midday-clear': [
    "Soleil haut. Les carpes cherchent l'ombre.",
    "L'air vibre, les libellules ouvrent le bal.",
  ],
  'spring-midday-cloudy': [
    "Conditions stables. Bonne fenêtre devant toi.",
  ],
  'spring-afternoon-clear': [
    "Lumière dorée à venir. La meilleure heure.",
    "Les insectes éclosent. Truites en alerte.",
  ],
  'spring-afternoon-cloudy': [
    "Le ciel ralentit. L'eau aussi.",
  ],
  'spring-dusk-clear': [
    "Le jour s'étire. Tout devient or.",
    "Magic hour. Les prédateurs sortent.",
  ],
  'spring-dusk-cloudy': [
    "Crépuscule discret. Pêcheur attentif.",
  ],
  'spring-night-clear': [
    "Les étoiles veillent sur la rivière.",
    "Le silence est plus dense la nuit.",
  ],

  // ── ÉTÉ ─────────────────────────────────────────────────────
  'summer-dawn-clear': [
    "L'eau est tiède. Le jour sera long.",
    "Carpes en surface aux premières lueurs.",
    "Lever silencieux. Belle journée à venir.",
  ],
  'summer-dawn-foggy': [
    "La chaleur monte sous la brume.",
    "Air immobile. Le silence est total.",
  ],
  'summer-morning-clear': [
    "Soleil franc. Cherche l'ombre des berges.",
    "Belle eau ce matin. Active tôt.",
  ],
  'summer-morning-cloudy': [
    "Couvert agréable. Les poissons sortent.",
  ],
  'summer-midday-clear': [
    "Soleil cogne. Patience ou ombre.",
    "Pause à l'ombre. L'eau attendra.",
    "Heure chaude. Pose la canne, observe.",
  ],
  'summer-midday-cloudy': [
    "Lumière voilée. Belle fenêtre rare.",
  ],
  'summer-midday-rainy': [
    "Pluie d'orage. Les carnassiers s'agitent.",
    "Sous la pluie, l'eau reprend vie.",
  ],
  'summer-afternoon-clear': [
    "Lumière oblique. Les prédateurs s'éveillent.",
    "Heure dorée approche. Reste là.",
  ],
  'summer-afternoon-cloudy': [
    "Le ciel respire. L'eau aussi.",
  ],
  'summer-dusk-clear': [
    "Coucher de feu. Les brochets chassent.",
    "Crépuscule d'or. Moment sacré.",
    "Les libellules valsent une dernière fois.",
  ],
  'summer-dusk-cloudy': [
    "Le jour s'éteint doucement. Reste calme.",
  ],
  'summer-night-clear': [
    "La nuit d'été appartient aux silencieux.",
    "Eau noire, étoiles. Pêche d'initié.",
  ],
  'summer-night-cloudy': [
    "Nuit chaude et lourde. Carpes actives.",
  ],

  // ── AUTOMNE ──────────────────────────────────────────────────
  'autumn-dawn-foggy': [
    "L'automne avance. La brume tient bon.",
    "Eau froide. Premier frisson du matin.",
    "Lever gris. Beauté discrète.",
  ],
  'autumn-dawn-clear': [
    "Air vif. Les feuilles flottent doucement.",
    "L'aube d'automne sent l'écorce mouillée.",
  ],
  'autumn-dawn-cloudy': [
    "Ciel bas. L'automne s'installe.",
  ],
  'autumn-morning-cloudy': [
    "Lumière argentée. Belle journée pêche.",
    "Couvert calme. Les brochets aiment ça.",
  ],
  'autumn-morning-rainy': [
    "Pluie d'automne réveille les sandres.",
    "L'eau respire la pluie. Tout devient calme.",
  ],
  'autumn-morning-foggy': [
    "Brume tenace. Concentre-toi.",
  ],
  'autumn-midday-cloudy': [
    "Heure stable. Bonne fenêtre devant toi.",
  ],
  'autumn-midday-clear': [
    "Le soleil d'automne dore les berges.",
  ],
  'autumn-afternoon-clear': [
    "Lumière mordorée. Les feuilles tombent.",
    "Bel après-midi. Le bois sent bon.",
  ],
  'autumn-afternoon-cloudy': [
    "Couvert constant. Idéal pour insister.",
  ],
  'autumn-dusk-clear': [
    "Le ciel s'embrase. Octobre brûle.",
    "Crépuscule cuivré. Heure des géants.",
  ],
  'autumn-dusk-cloudy': [
    "Le jour s'éteint en silence.",
  ],
  'autumn-night-clear': [
    "Nuit fraîche, étoilée. Pêche méditative.",
  ],
  'autumn-night-cloudy': [
    "Obscurité douce. L'eau respire encore.",
  ],

  // ── HIVER ────────────────────────────────────────────────────
  'winter-dawn-clear': [
    "Aube glacée. Le givre couvre les roseaux.",
    "Lever bleuté. Tout est figé.",
    "L'eau fume légèrement. Silence absolu.",
  ],
  'winter-dawn-foggy': [
    "Brume givrante. Beauté austère.",
  ],
  'winter-dawn-snowy': [
    "Neige sur l'eau. Le monde s'efface.",
  ],
  'winter-morning-clear': [
    "Soleil pâle. Les truites bougent lentement.",
    "Matin sec et clair. Journée patiente.",
  ],
  'winter-morning-cloudy': [
    "Gris plombé. Les sandres aiment ça.",
  ],
  'winter-morning-snowy': [
    "La neige tombe. L'eau reçoit en silence.",
  ],
  'winter-midday-clear': [
    "Soleil bas. L'eau s'éclaire un instant.",
  ],
  'winter-midday-cloudy': [
    "Lumière voilée. Hiver continu.",
  ],
  'winter-afternoon-clear': [
    "Lumière oblique courte. Saisis l'instant.",
  ],
  'winter-afternoon-cloudy': [
    "Le jour s'efface vite en hiver.",
  ],
  'winter-dusk-clear': [
    "Crépuscule rosé. Brochets en chasse.",
    "L'horizon rougit. Beauté glacée.",
  ],
  'winter-dusk-cloudy': [
    "Nuit qui tombe tôt. Rentre au chaud.",
  ],
  'winter-night-clear': [
    "Nuit étoilée d'hiver. Silence cristal.",
  ],
  'winter-night-snowy': [
    "Neige nocturne. Tout est paisible.",
  ],

  // ── FALLBACK ─────────────────────────────────────────────────
  default: [
    "L'eau t'attend.",
    "Belle journée pour une session.",
    "Le monde vivant respire.",
    "Chaque sortie est un souvenir à venir.",
    "L'instant présent, c'est déjà beaucoup.",
  ],
};

export function getPoeticPhrase(context: Context, userId: string): string {
  const key = `${context.season}-${context.light}-${context.weather}`;
  const phrases = PHRASES_LIBRARY[key] ?? PHRASES_LIBRARY.default;

  // Phrase stable pour la journée (pas de changement à chaque refresh)
  const today = new Date().toISOString().split('T')[0];
  const seed = `${userId}-${today}-${key}`;
  const hash = hashString(seed);
  const index = hash % phrases.length;

  return phrases[index];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
