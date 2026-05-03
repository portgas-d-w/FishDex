// scripts/seed-fishes.ts
import { createClient } from '@supabase/supabase-js';
import { SPECIES } from '../data/fishes';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log(`\n🐟 Synchronisation de ${SPECIES.length} espèces...\n`);

  let ok = 0;
  let ko = 0;

  for (const species of SPECIES) {
    const { error } = await supabase
      .from('species')
      .upsert(species, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ #${species.numero_dex} ${species.nom_fr}: ${error.message}`);
      ko++;
    } else {
      console.log(`✅ #${String(species.numero_dex).padStart(2, '0')} ${species.nom_fr} (${species.rarete})`);
      ok++;
    }
  }

  console.log(`\n🎉 Terminé : ${ok} OK / ${ko} erreurs`);
  if (ko > 0) process.exit(1);
}

seed().catch((err) => {
  console.error('💥 Erreur fatale :', err);
  process.exit(1);
});
