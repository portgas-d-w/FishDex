// src/app/fishdex/page.tsx
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import type { SpeciesRow } from '@/types/fishdex';

export const metadata = {
  title: 'FishDex - Encyclopédie des espèces',
  description: 'Découvre toutes les espèces de poissons et crustacés référencés dans le FishDex',
};

const rareteColors: Record<string, string> = {
  commun: 'bg-slate-600/40 text-slate-200',
  peu_commun: 'bg-emerald-600/40 text-emerald-200',
  rare: 'bg-blue-600/40 text-blue-200',
  tres_rare: 'bg-purple-600/40 text-purple-200',
};

const rareteLabels: Record<string, string> = {
  commun: 'Commun',
  peu_commun: 'Peu commun',
  rare: 'Rare',
  tres_rare: 'Très rare',
};

export default async function FishDexPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: species, error } = await supabase
    .from('species')
    .select('*')
    .order('categorie', { ascending: true })
    .order('nom_fr', { ascending: true });

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-red-400">Erreur de chargement</h1>
        <p className="text-slate-400 mt-2">{error.message}</p>
      </div>
    );
  }

  let discoveredSlugs = new Set<string>();
  if (user) {
    const { data: catches } = await supabase
      .from('catches')
      .select('species:species_id ( slug )')
      .eq('user_id', user.id);

    if (catches) {
      for (const c of catches) {
        const s = c.species as unknown as { slug: string } | null;
        if (s?.slug) discoveredSlugs.add(s.slug);
      }
    }
  }
  const discoveredCount = discoveredSlugs.size;
  const totalCount = species?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* En-tête */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-teal-400 mb-2">FishDex</h1>
          <p className="text-slate-400">
            <span className="text-teal-400 font-semibold">{discoveredCount}</span>
            {' '}/ {totalCount} espèces découvertes
          </p>
        </div>

        {/* Barre de progression */}
        <div className="w-full sm:w-64">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (discoveredCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right">
            {totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0}% complété
          </p>
        </div>
      </div>

      {/* Grille d'espèces */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {species?.map((fish: SpeciesRow) => {
          const isDiscovered = discoveredSlugs.has(fish.slug);

          return (
            <Link
              key={fish.id}
              href={`/fishdex/${fish.slug}`}
              className={`group bg-slate-800/50 hover:bg-slate-800 border rounded-lg overflow-hidden transition-all hover:scale-[1.02] ${
                isDiscovered 
                  ? 'border-slate-700 hover:border-teal-500/50' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Image — silhouette si non découvert, en couleur si découvert */}
              <div className="aspect-square relative bg-slate-900 flex items-center justify-center p-4">
                <div className="relative w-full h-full">
                  <Image
                    src={fish.image_url || '/fishes/placeholder.svg'}
                    alt={isDiscovered ? fish.nom_fr : 'Espèce non découverte'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className={`object-contain transition-all duration-500 ${
                      isDiscovered 
                        ? 'opacity-100' 
                        : '[filter:brightness(0)]'
                    }`}
                  />
                </div>
                
                {/* Badge catégorie (visible uniquement si découvert) */}
                {isDiscovered && fish.categorie === 'crustace' && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-xs bg-orange-600/80 text-white rounded-full">
                    Crustacé
                  </span>
                )}

                {/* Numéro du dex — toujours visible */}
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs bg-slate-900/80 text-slate-400 rounded font-mono">
                  #{species.indexOf(fish) + 1}
                </span>
              </div>

              {/* Infos */}
              <div className="p-3">
                <h3 className={`font-semibold text-sm leading-tight transition-colors ${
                  isDiscovered 
                    ? 'text-slate-100 group-hover:text-teal-400' 
                    : 'text-slate-500'
                }`}>
                  {isDiscovered ? fish.nom_fr : '???'}
                </h3>
                <p className="text-xs text-slate-500 italic mt-0.5 truncate">
                  {isDiscovered ? fish.nom_scientifique : '—'}
                </p>

                {/* Badge rareté (visible uniquement si découvert) */}
                {isDiscovered && fish.rarete && (
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${rareteColors[fish.rarete]}`}>
                    {rareteLabels[fish.rarete]}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {(!species || species.length === 0) && (
        <div className="text-center py-12">
          <p className="text-slate-400">Aucune espèce trouvée.</p>
        </div>
      )}
    </div>
  );
}