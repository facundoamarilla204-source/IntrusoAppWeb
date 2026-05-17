-- ============================================================================
-- SCRIPT DE CREACIÓN DE TABLAS PARA EL JUEGO "INTRUSO"
-- Ejecuta este script en el editor SQL de tu panel de Supabase.
-- ============================================================================

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,                       -- Ej: 'foods', 'sports' (usamos TEXT para mapear directamente con el código local)
    name TEXT NOT NULL,                        -- Ej: 'Comidas', 'Deportes'
    icon TEXT NOT NULL,                        -- Ej: '🍔', '🏆'
    color TEXT NOT NULL,                       -- Ej: 'from-orange-500 to-red-600'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Crear tabla de palabras
CREATE TABLE IF NOT EXISTS public.words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    word TEXT NOT NULL,                        -- Ej: 'Pizza'
    hint TEXT NOT NULL,                        -- Ej: 'Disco fraccionado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Habilitar la Seguridad a Nivel de Fila (Row Level Security - RLS)
-- Supabase habilita RLS por defecto. Para permitir que la app cliente lea los datos
-- sin autenticación (ya que es un juego local público), creamos políticas de lectura.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas para permitir lectura pública (SELECT) a cualquier usuario anon
CREATE POLICY "Allow public read access to categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to words" 
ON public.words 
FOR SELECT 
USING (true);

-- 5. Crear índice para mejorar el rendimiento de las consultas por categoría
CREATE INDEX IF NOT EXISTS words_category_id_idx ON public.words(category_id);
