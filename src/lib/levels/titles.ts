export type LevelTier = {
  range: [number, number];
  title: string;
};

export const LEVEL_TITLES: LevelTier[] = [
  { range: [1, 5],   title: 'Débutant' },
  { range: [6, 10],  title: 'Pêcheur' },
  { range: [11, 15], title: 'Amateur' },
  { range: [16, 20], title: 'Explorateur' },
  { range: [21, 30], title: 'Traqueur' },
  { range: [31, 40], title: 'Spécialiste' },
  { range: [41, 49], title: 'Expert' },
  { range: [50, 50], title: 'Légende' },
];

export function getTitleForLevel(level: number): string {
  if (level > 50) return 'Légende';
  const tier = LEVEL_TITLES.find(t => level >= t.range[0] && level <= t.range[1]);
  return tier?.title ?? 'Débutant';
}
