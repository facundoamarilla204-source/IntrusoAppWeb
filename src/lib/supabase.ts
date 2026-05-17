import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Se inicializa el cliente con placeholders si no están definidos, 
// para evitar crasheos durante el renderizado inicial sin configuración.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export interface SupabaseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface SupabaseWord {
  id: string;
  category_id: string;
  word: string;
  hint: string;
}

export const gameService = {
  /**
   * Obtiene todas las categorías desde la base de datos de Supabase.
   */
  async getCategories(): Promise<SupabaseCategory[] | null> {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase URL o Anon Key no configurados. Usando datos locales.');
        return null;
      }
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, icon, color');
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error al obtener categorías de Supabase. Revirtiendo a locales:', err);
      return null;
    }
  },

  /**
   * Obtiene todas las palabras desde la base de datos de Supabase.
   */
  async getWords(): Promise<SupabaseWord[] | null> {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase URL o Anon Key no configurados. Usando datos locales.');
        return null;
      }
      const { data, error } = await supabase
        .from('words')
        .select('id, category_id, word, hint');
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error al obtener palabras de Supabase. Revirtiendo a locales:', err);
      return null;
    }
  }
};
