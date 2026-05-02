// src/app/fishdex/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { SpeciesRow, VarietyRow, MutationRow } from '@/types/fishdex';

// ============ HELPERS ============

const rareteColors: Record<string, string> = {
  commun: 'bg-slate-600/40 text-slate-200 border-slate-500/40',
  peu_commun: 'bg-emerald-600/40 text-emerald-200 border-emerald-500/40',
  rare: 'bg-blue-600/40 text-blue-200 border-blue-500/40',
  tres_rare: 'bg-purple-600/40 text-purple-200 border-purple-500/40',
  legendaire: 'bg-amber-500/40 text-amber-200 border-amber-400/50',
};

const rareteLabels: Record<string, string> = {
  commun: 'Commun',
  peu_commun: 'Peu commun',
  rare: 'Rare',
  tres_rare: 'Très rare',
  legendaire: 'Légendaire',
};

const eauLabels: Record<string, string> = {
  douce: 'Eau douce',
  salee: 'Eau salée',
  saumatre: 'Eau saumâtre',
};

const regimeLabels: Record<string, string> = {
  carnivore: 'Carnivore',
  omnivore: 'Omnivore',
  herbivore: 'Herbivore',
};

const profondeurLabels: Record<string, string> = {
  surface: 'Surface',
  moyenne: 'Eaux moyennes',
  fond: 'Fond',
};

const saisonLabels: Record<string, string> = {
  printemps: 'Printemps',
  ete: 'Été',
  automne: 'Automne',
  hiver: 'Hiver',
};

// Capitalise et remplace les underscores par des espaces
const formatTag = (tag: string) =>
  tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, ' ');

// ============ PAGE ============

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Récupérer l'espèce
  const { data: species, error: speciesError } = await supabase
    .from('species')
    .select('*')
    .eq('slug', slug)
    .single();

  if (speciesError || !species) {
    notFound();
  }

  // 2. Récupérer les variétés liées
  const { data: varieties } = await supabase
    .from('varieties')
    .select('*')
    .eq('species_id', species.id)
    .order('nom_fr');

  // 3. Récupérer toutes les mutations des variétés
  const varietyIds = varieties?.map((v) => v.id) || [];
  const { data: mutations } = varietyIds.length > 0
    ? await supabase
        .from('mutations')
        .select('*')
        .in('variety_id', varietyIds)
        .order('nom_fr')
    : { data: [] };

  // 4. Récupérer le numéro de l'espèce dans le dex
  const { data: allSpecies } = await supabase
    .from('species')
    .select('slug')
    .order('categorie', { ascending: true })
    .order('nom_fr', { ascending: true });

  const dexNumber = (allSpecies?.findIndex((s) => s.slug === slug) ?? -1) + 1;
  const totalCount = allSpecies?.length || 0;

  // 🔒 Pour l'instant, aucune découverte (sera dynamique avec l'Aquarium)
  // 💡 Pour tester : ajoute le slug ici, ex: ['carpe-commune']
  const discoveredSlugs = new Set<string>(['carpe-koi', 'silure-glane', 'truite-arc-en-ciel']);
  const isDiscovered = discoveredSlugs.has(slug);

  // Helpers visuels
  const imgClass = isDiscovered
    ? 'opacity-100'
    : '[filter:brightness(0)]';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Bouton retour */}
      <Link
        href="/fishdex"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour au FishDex
      </Link>

      {/* En-tête : image + identité */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Image */}
        <div className="relative aspect-square bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-8">
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs bg-slate-800/80 text-slate-400 rounded-md font-mono z-10">
            #{dexNumber.toString().padStart(2, '0')} / {totalCount}
          </span>
          <div className="relative w-full h-full">
            <Image
              src={species.image_url || '/fishes/placeholder.svg'}
              alt={isDiscovered ? species.nom_fr : 'Espèce non découverte'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className={`object-contain transition-all duration-500 ${imgClass}`}
            />
          </div>
        </div>

        {/* Identité */}
        <div className="flex flex-col justify-center">
          {isDiscovered ? (
            <>
              <h1 className="text-4xl font-bold text-teal-400 mb-2">{species.nom_fr}</h1>
              <p className="text-lg italic text-slate-400 mb-1">{species.nom_scientifique}</p>
              {species.famille && (
                <p className="text-sm text-slate-500 mb-4">Famille : {species.famille}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {species.rarete && (
                  <span className={`px-3 py-1 text-sm rounded-full border ${rareteColors[species.rarete]}`}>
                    {rareteLabels[species.rarete]}
                  </span>
                )}
                {species.categorie === 'crustace' && (
                  <span className="px-3 py-1 text-sm bg-orange-600/40 text-orange-200 border border-orange-500/40 rounded-full">
                    Crustacé
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-slate-500 mb-2">???</h1>
              <p className="text-slate-500 italic">
                Cette espèce n'a pas encore été découverte.
              </p>
              <p className="text-sm text-slate-600 mt-4">
                Capture-la pour révéler ses informations.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Le reste s'affiche uniquement si découvert */}
      {isDiscovered && (
        <>
          {/* Description */}
          {species.description && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span>📝</span> Description
              </h2>
              <p className="text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800 rounded-lg p-4">
                {species.description}
              </p>
            </section>
          )}

          {/* Caractéristiques + Pêche en grille */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Caractéristiques */}
            <section>
              <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span>📊</span> Caractéristiques
              </h2>
              <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-2">
                {(species.taille_min_cm || species.taille_max_cm) && (
                  <InfoRow
                    label="Taille"
                    value={`${species.taille_min_cm || '?'} - ${species.taille_max_cm || '?'} cm`}
                  />
                )}
                {species.poids_max_kg && (
                  <InfoRow label="Poids max" value={`${species.poids_max_kg} kg`} />
                )}
                {species.eau && <InfoRow label="Eau" value={eauLabels[species.eau] || species.eau} />}
                {species.habitat && species.habitat.length > 0 && (
                  <InfoRow
                    label="Habitat"
                    value={species.habitat.map(formatTag).join(', ')}
                  />
                )}
                {species.regime && (
                  <InfoRow label="Régime" value={regimeLabels[species.regime] || species.regime} />
                )}
                {species.profondeur && (
                  <InfoRow
                    label="Profondeur"
                    value={profondeurLabels[species.profondeur] || species.profondeur}
                  />
                )}
              </div>
            </section>

            {/* Pêche */}
            <section>
              <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span>🎣</span> Pêche
              </h2>
              <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-2">
                {species.difficulte && (
                  <InfoRow
                    label="Difficulté"
                    value={
                      <span>
                        {'★'.repeat(species.difficulte)}
                        <span className="text-slate-600">{'★'.repeat(5 - species.difficulte)}</span>
                      </span>
                    }
                  />
                )}
                {species.taille_legale_cm && (
                  <InfoRow
                    label="Taille légale"
                    value={`${species.taille_legale_cm} cm minimum`}
                  />
                )}
                {species.saison && species.saison.length > 0 && (
                  <InfoRow
                    label="Saison"
                    value={species.saison.map((s: string) => saisonLabels[s] || s).join(', ')}
                  />
                )}
                {species.techniques && species.techniques.length > 0 && (
                  <div className="pt-2">
                    <p className="text-sm text-slate-500 mb-2">Techniques recommandées</p>
                    <div className="flex flex-wrap gap-1.5">
                      {species.techniques.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs bg-teal-900/30 text-teal-300 border border-teal-700/30 rounded-md"
                        >
                          {formatTag(tech)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

{/* Variétés */}
          {varieties && varieties.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span>🌟</span> Variétés
                <span className="text-sm text-slate-500 font-normal">({varieties.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {varieties.map((variety: VarietyRow) => {
                  const varietyDiscovered = isDiscovered;
                  
                  return (
                    <div
                      key={variety.id}
                      className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden hover:border-teal-500/30 transition-colors flex "
                    >
                      {/* Image vignette à gauche */}
                      {variety.image_url && (
                       <div className="relative flex-shrink-0 w-24 bg-slate-950/80 flex items-center justify-center p-2">
                          <div className="relative w-full h-full">
                            <Image
                              src={variety.image_url}
                              alt={varietyDiscovered ? variety.nom_fr : 'Variété non découverte'}
                              fill
                              sizes="96px"
                              className={`object-contain transition-all duration-500 ${
                                varietyDiscovered ? 'opacity-100' : '[filter:brightness(0)]'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Infos à droite */}
                      <div className="p-3 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-slate-100 text-sm">
                            {variety.nom_fr}
                          </h3>
                          {variety.rarete && (
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full border whitespace-nowrap ${rareteColors[variety.rarete]}`}
                            >
                              {rareteLabels[variety.rarete]}
                            </span>
                          )}
                        </div>
                        {variety.description && (
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {variety.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

  {/* Mutations */}
          {mutations && mutations.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span>✨</span> Mutations rares
                <span className="text-sm text-slate-500 font-normal">({mutations.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mutations.map((mutation: MutationRow) => {
                  const mutationDiscovered = isDiscovered;
                  
                  return (
                    <div
                      key={mutation.id}
                      className="bg-gradient-to-br from-slate-900/60 to-purple-950/30 border border-purple-700/20 rounded-lg overflow-hidden flex "
                    >
                      {/* Image vignette à gauche */}
                      {mutation.image_url && (
                        <div className="relative flex-shrink-0 w-24 bg-slate-950/80 flex items-center justify-center p-2">
                          <div className="relative w-full h-full">
                            <Image
                              src={mutation.image_url}
                              alt={mutationDiscovered ? mutation.nom_fr : 'Mutation non découverte'}
                              fill
                              sizes="96px"
                              className={`object-contain  transition-all duration-500 ${
                                mutationDiscovered ? 'opacity-100' : '[filter:brightness(0)]'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Infos à droite */}
                      <div className="p-3 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-purple-200 text-sm">
                            {mutation.nom_fr}
                          </h3>
                          {mutation.rarete && (
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full border whitespace-nowrap ${rareteColors[mutation.rarete]}`}
                            >
                              {rareteLabels[mutation.rarete]}
                            </span>
                          )}
                        </div>
                        {mutation.description && (
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {mutation.description}
                          </p>
                        )}
                        {mutation.couleurs && mutation.couleurs.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {mutation.couleurs.map((c: string) => (
                              <span key={c} className="text-xs text-slate-500">
                                {formatTag(c)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
 }

// Petit composant utilitaire
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-800 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm text-slate-200 text-right font-medium">{value}</span>
    </div>
  );
}