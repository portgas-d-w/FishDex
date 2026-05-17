export type MasteryTier = 'Initié' | 'Rare' | 'Épique' | 'Légendaire' | 'Mirage';
export type MasteryRank = 'I' | 'II' | 'III' | 'IV' | 'V';

const MASTERY_XP_THRESHOLD = 1000;

// XP cumulatif requis pour atteindre le niveau 50 : 100 × 49² = 240 100
export const XP_FOR_LEVEL_50 = 240_100;

type TierRange = { min: number; max: number };

const TIER_THRESHOLDS: Record<MasteryTier, TierRange> = {
  'Initié':     { min: 1,   max: 25 },
  'Rare':       { min: 26,  max: 75 },
  'Épique':     { min: 76,  max: 200 },
  'Légendaire': { min: 201, max: 500 },
  'Mirage':     { min: 501, max: Infinity },
};

const RANKS: MasteryRank[] = ['I', 'II', 'III', 'IV', 'V'];

export type MasteryInfo = {
  tier: MasteryTier;
  rank: MasteryRank;
  totalPoints: number;
  progress: number; // 0-100, progression dans le tier actuel
};

export function getMasteriesAfterLevel50(totalXp: number, xpForLevel50 = XP_FOR_LEVEL_50): MasteryInfo | null {
  if (totalXp < xpForLevel50) return null;

  const xpAfter50 = totalXp - xpForLevel50;
  const masteryPoints = Math.floor(xpAfter50 / MASTERY_XP_THRESHOLD);

  if (masteryPoints === 0) return null;

  const entry = (Object.entries(TIER_THRESHOLDS) as [MasteryTier, TierRange][]).find(
    ([, range]) => masteryPoints >= range.min && masteryPoints <= range.max
  );

  if (!entry) return null;

  const [tier, tierRange] = entry;
  const tierProgress = masteryPoints - tierRange.min;
  const tierSize = tierRange.max === Infinity ? 500 : tierRange.max - tierRange.min + 1;
  const rankIndex = Math.min(4, Math.floor((tierProgress / tierSize) * 5));
  const rank = RANKS[rankIndex];

  const progress = tierRange.max === Infinity
    ? Math.min(100, (tierProgress / 499) * 100)
    : Math.min(100, Math.round((tierProgress / (tierSize - 1)) * 100));

  return { tier, rank, totalPoints: masteryPoints, progress };
}
