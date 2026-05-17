import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { CATEGORIES } from '../src/constants/game';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('❌ Error: Faltan credenciales de Supabase en el archivo .env');
  process.exit(1);
}

if (!geminiApiKey || geminiApiKey === 'MY_GEMINI_API_KEY' || geminiApiKey === 'YOUR_GEMINI_API_KEY') {
  console.error('❌ Error: Necesitas configurar tu clave API de Gemini en el archivo .env para realizar la generación masiva.');
  console.log('👉 Agrega la variable VITE_GEMINI_API_KEY="tu-clave-aqui" en tu archivo .env antes de correr este script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

interface WordObj {
  word: string;
  hint: string;
}

async function generateChunk(categoryName: string, categoryId: string, count: number, existingWords: string[]): Promise<WordObj[]> {
  const prompt = `Genera un array JSON de exactamente ${count} objetos que contengan palabras únicas de la categoría "${categoryName}" para el juego de deducción social "Intruso". Cada objeto debe tener la estructura {"word": "...", "hint": "..."}.

Las palabras que YA existen en esta categoría son: ${existingWords.join(', ')}. NUNCA repitas ninguna de estas palabras en tu respuesta.

REGLAS PARA LAS PALABRAS:
1. Deben ser sustantivos, conceptos o personajes muy populares y conocidos en español (comunes en Argentina y Latinoamérica).
2. Deben ser palabras fáciles de entender pero que den juego para debatir y dar pistas ingeniosas.

REGLAS PARA LAS PISTAS (hint):
1. Deben ser abstractas, algo rebuscadas y metafóricas. MÁXIMO de 1 a 4 palabras.
2. Evita descripciones obvias.
   Ejemplos de pistas ideales:
   - Para "Obelisco" (Categoría: Argentina): "faro porteño" o "aguja céntrica"
   - Para "Titanic" (Categoría: Películas): "hielo arrogante" o "metal sumergido"
   - Para "Pizza" (Categoría: Comidas): "disco de masa" o "geometría de queso"
   - Para "Maradona" (Categoría: Futbolistas): "mano divina" o "diez celestial"
3. NUNCA uses la palabra misma, ni letras sueltas, ni rimas directas.

Retorna ÚNICAMENTE el array JSON válido, sin bloques de código markdown, sin introducciones y sin explicaciones.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error('Respuesta de Gemini vacía.');

    const words = JSON.parse(text) as WordObj[];
    
    // Limpieza básica de comillas y puntos finales en las pistas
    return words.map(w => ({
      word: w.word.trim(),
      hint: w.hint.replace(/["']/g, '').replace(/\.$/, '').trim()
    }));
  } catch (error) {
    console.error(`❌ Error al generar lote para la categoría ${categoryName}:`, error);
    return [];
  }
}

async function run() {
  console.log('🚀 Iniciando la GENERACIÓN MASIVA de palabras con IA...');
  console.log(`🔗 Conectado a Supabase: ${supabaseUrl}`);

  // Haremos una copia de las categorías actuales del archivo local para ir añadiendo las nuevas
  const updatedCategories = JSON.parse(JSON.stringify(CATEGORIES));

  for (let i = 0; i < updatedCategories.length; i++) {
    const cat = updatedCategories[i];
    console.log(`\n⚙️ Procesando categoría: "${cat.name}" [ID: ${cat.id}]...`);

    const existingWordList = cat.words.map((w: any) => w.word);
    console.log(`   Actualmente cuenta con ${existingWordList.length} palabras locales.`);
    console.log('   Generando 100 palabras nuevas en 2 lotes de 50...');

    // Lote 1 (50 palabras)
    console.log('   🤖 Generando lote 1 (50 palabras)...');
    const batch1 = await generateChunk(cat.name, cat.id, 50, existingWordList);
    console.log(`   ✅ Lote 1 generado. (${batch1.length} palabras)`);
    
    // Añadimos el lote 1 a la lista de existentes para que el lote 2 no duplique nada
    const updatedExistingList = [...existingWordList, ...batch1.map(w => w.word)];

    // Lote 2 (50 palabras)
    console.log('   🤖 Generando lote 2 (50 palabras)...');
    const batch2 = await generateChunk(cat.name, cat.id, 50, updatedExistingList);
    console.log(`   ✅ Lote 2 generado. (${batch2.length} palabras)`);

    const allNewWords = [...batch1, ...batch2];
    
    if (allNewWords.length === 0) {
      console.warn(`   ⚠️ No se pudieron generar nuevas palabras para "${cat.name}". Saltando.`);
      continue;
    }

    // Guardar en el array local actualizado
    cat.words.push(...allNewWords);
    console.log(`   📈 Total local de la categoría actualizado a ${cat.words.length} palabras.`);

    // Subir a Supabase en lotes
    console.log('   ☁️ Subiendo nuevas palabras a tu Supabase en la nube...');
    
    // 1. Asegurar que la categoría exista en la DB (por las dudas)
    await supabase.from('categories').upsert({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color
    });

    // 2. Insertar las palabras nuevas
    const wordsToInsert = allNewWords.map(w => ({
      category_id: cat.id,
      word: w.word,
      hint: w.hint
    }));

    const { error: insertError } = await supabase
      .from('words')
      .insert(wordsToInsert);

    if (insertError) {
      console.error(`   ❌ Error al subir palabras a la DB:`, insertError);
    } else {
      console.log(`   ✅ ¡${wordsToInsert.length} palabras nuevas cargadas en Supabase exitosamente!`);
    }
  }

  // Escribir el archivo src/constants/game.ts de vuelta para mantener el fallback actualizado
  console.log('\n📝 Actualizando archivo local src/constants/game.ts...');
  const gameTsPath = path.join(__dirname, '../src/constants/game.ts');
  
  const fileContent = `export interface GameWord {
  word: string;
  hint: string;
}

export const CATEGORIES = ${JSON.stringify(updatedCategories, null, 2)} as const;

export const INITIAL_CONFIG = {
  minPlayers: 3,
  maxPlayers: 12,
  defaultPlayers: 3,
  defaultImpostors: 1,
  durations: [30, 60, 90, 120]
};
`;

  // Remover la marca 'as const' al castear array para evitar problemas menores de lectura
  const cleanedFileContent = fileContent.replace('as const', 'as any');

  fs.writeFileSync(gameTsPath, cleanedFileContent, 'utf-8');
  console.log('✅ Archivo game.ts actualizado con éxito.');
  console.log('\n🎉 ¡PROCESO DE GENERACIÓN MASIVA COMPLETADO CON ÉXITO!');
  console.log(`👉 Ahora el juego cuenta con más de ${updatedCategories[0].words.length} palabras por categoría.`);
}

run();
