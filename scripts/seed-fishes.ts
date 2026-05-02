// scripts/seed-fishes.ts
import { createClient } from '@supabase/supabase-js';
import { SPECIES } from '../data/fishes';
import * as dotenv from 'dotenv';

// Charge les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('Vérifie que .env.local contient bien :');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log(`\n🐟 Synchronisation de ${SPECIES.length} espèces...\n`);

  let speciesCount = 0;
  let varietiesCount = 0;
  let mutationsCount = 0;

  for (const species of SPECIES) {
    const { varieties, ...speciesData } = species;

    // 1. Upsert espèce
    const { data: speciesRow, error: speciesError } = await supabase
      .from('species')
      .upsert(speciesData, { onConflict: 'slug' })
      .select()
      .single();

    if (speciesError) {
      console.error(`❌ ${species.nom_fr}:`, speciesError.message);
      continue;
    }
    console.log(`✅ ${species.nom_fr}`);
    speciesCount++;

    if (!varieties || varieties.length === 0) continue;

    // 2. Upsert variétés
    for (const variety of varieties) {
      const { mutations, ...varietyData } = variety;

      const { data: varietyRow, error: varietyError } = await supabase
        .from('varieties')
        .upsert(
          { ...varietyData, species_id: speciesRow.id },
          { onConflict: 'species_id,slug' }
        )
        .select()
        .single();

      if (varietyError) {
        console.error(`  ❌ ${variety.nom_fr}:`, varietyError.message);
        continue;
      }
      console.log(`  ↳ ${variety.nom_fr}`);
      varietiesCount++;

      if (!mutations || mutations.length === 0) continue;

      // 3. Upsert mutations
      for (const mutation of mutations) {
        const { error: mutationError } = await supabase
          .from('mutations')
          .upsert(
            { ...mutation, variety_id: varietyRow.id },
            { onConflict: 'variety_id,slug' }
          );

        if (mutationError) {
          console.error(`    ❌ ${mutation.nom_fr}:`, mutationError.message);
        } else {
          console.log(`    ✦ ${mutation.nom_fr}`);
          mutationsCount++;
        }
      }
    }
  }

  console.log('\n🎉 Terminé !');
  console.log(`   ${speciesCount} espèces`);
  console.log(`   ${varietiesCount} variétés`);
  console.log(`   ${mutationsCount} mutations`);
}

seed().catch((err) => {
  console.error('💥 Erreur fatale :', err);
  process.exit(1);
});