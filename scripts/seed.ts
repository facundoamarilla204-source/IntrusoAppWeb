import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { CATEGORIES } from '../src/constants/game';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
// Se prefiere la Service Role Key para operaciones administrativas como sembrado (seeding)
// para saltarse las restricciones de RLS, pero se da soporte a la Anon Key si se configuraron políticas.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno requeridas.');
  console.error('Por favor, asegúrate de configurar VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o VITE_SUPABASE_ANON_KEY) en tu archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🚀 Iniciando la migración de datos a Supabase...');
  console.log(`🔗 Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Clave detectada: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role Key (Recomendado)' : 'Anon Key'}\n`);

  try {
    console.log(`📋 Se procesarán ${CATEGORIES.length} categorías locales.`);

    for (const cat of CATEGORIES) {
      console.log(`⚙️ Procesando categoría: "${cat.name}" [ID: ${cat.id}]...`);

      // 1. Guardar la categoría en la DB (usando upsert por si ya existe)
      const { error: catError } = await supabase
        .from('categories')
        .upsert({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          color: cat.color
        });

      if (catError) {
        throw new Error(`Error al insertar categoría "${cat.name}": ${catError.message}`);
      }
      console.log(`   ✅ Categoría "${cat.name}" sincronizada.`);

      // 2. Limpiar palabras anteriores de esta categoría para evitar duplicados en re-ejecuciones
      const { error: deleteError } = await supabase
        .from('words')
        .delete()
        .eq('category_id', cat.id);

      if (deleteError) {
        console.warn(`   ⚠️ Advertencia limpiando palabras previas de "${cat.name}": ${deleteError.message}`);
      }

      // 3. Preparar e insertar en lote las palabras asociadas
      const wordsToInsert = cat.words.map(w => ({
        category_id: cat.id,
        word: w.word,
        hint: w.hint
      }));

      const { error: wordsError } = await supabase
        .from('words')
        .insert(wordsToInsert);

      if (wordsError) {
        throw new Error(`Error al insertar palabras para "${cat.name}": ${wordsError.message}`);
      }
      console.log(`   ✅ ${wordsToInsert.length} palabras insertadas con éxito.\n`);
    }

    console.log('🎉 ¡Sincronización completada! Todos los datos locales se han subido a Supabase.');
  } catch (error: any) {
    console.error('\n❌ Ocurrió un error durante el proceso de sembrado (seeding):');
    console.error(error.message || error);
    process.exit(1);
  }
}

seed();
