import { GoogleGenAI } from '@google/genai';

// Intentar obtener la clave API desde las variables de Vite.
// Se da soporte a VITE_GEMINI_API_KEY y GEMINI_API_KEY por flexibilidad.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

// Inicializar el cliente de IA de Google si la clave está disponible.
// De lo contrario, se inicializará con un placeholder inerte para evitar crasheos de importación.
export const ai = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey !== 'YOUR_GEMINI_API_KEY'
  ? new GoogleGenAI({ apiKey })
  : null;

/**
 * Genera una pista críptica y corta usando Gemini 2.5 Flash.
 * Si falla o no hay claves configuradas, retorna null para indicar que se debe usar el fallback local.
 */
export async function generateDynamicHint(word: string, category: string): Promise<string | null> {
  if (!ai) {
    console.warn('ℹ️ Gemini API Key no configurada o usa placeholder. Usando pista estática de la base de datos.');
    return null;
  }

  try {
    const prompt = `Eres un generador de pistas abstractas para el juego "Intruso" (un juego de deducción social).
Tu objetivo es dar una pista inteligente para la palabra secreta: "${word}" que pertenece a la categoría: "${category}".

REGLAS DE ORO:
1. La pista debe ser extremadamente corta: MÁXIMO de 1 a 4 palabras.
2. Debe ser abstracta, algo rebuscada y metafórica, pero que tenga sentido para quienes conocen la palabra. Evita descripciones obvias.
   Ejemplos de pistas geniales:
   - Para "Obelisco" (Categoría: Argentina): "aguja céntrica" o "faro porteño".
   - Para "Titanic" (Categoría: Películas): "hielo arrogante" o "metal sumergido".
   - Para "Asado" (Categoría: Comidas): "ritual de brasas" o "aplauso al fuego".
   - Para "Tenis" (Categoría: Deportes): "cero es amor" o "raqueta y red".
3. NUNCA uses la palabra misma, ni letras sueltas, ni rimas directas.
4. Responde ÚNICAMENTE con la pista críptica corta, sin introducciones, sin explicaciones y sin comillas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = response.text;
    if (!generatedText) return null;

    // Limpieza de formato (eliminar saltos de línea, comillas dobles o simples, puntos finales)
    let cleanedHint = generatedText
      .replace(/[\n\r]+/g, '')
      .replace(/["']/g, '')
      .trim();
    
    if (cleanedHint.endsWith('.')) {
      cleanedHint = cleanedHint.slice(0, -1);
    }

    console.log(`🤖 Gemini generó una pista dinámica para "${word}": "${cleanedHint}"`);
    return cleanedHint;
  } catch (error) {
    console.error('❌ Error al generar pista dinámica con Gemini:', error);
    return null;
  }
}
