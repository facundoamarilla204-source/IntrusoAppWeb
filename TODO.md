# TODO - Proyecto INTRUSO

## Pendientes para Mañana 🚀 (¡Completado! 🎉)
- [x] **Migración a Supabase**:
    - [x] Crear el proyecto en Supabase (Pendiente agregar claves al `.env`).
    - [x] Crear tabla `categories` (id, name, icon, color) -> SQL provisto en [supabase_schema.sql](file:///c:/Users/Facundo-PC/Desktop/intruso/supabase_schema.sql).
    - [x] Crear tabla `words` (id, category_id, word, hint) -> SQL provisto en [supabase_schema.sql](file:///c:/Users/Facundo-PC/Desktop/intruso/supabase_schema.sql).
    - [x] Configurar el cliente de Supabase en [supabase.ts](file:///c:/Users/Facundo-PC/Desktop/intruso/src/lib/supabase.ts).
    - [x] Crear un script para cargar las palabras locales a la DB -> [seed.ts](file:///c:/Users/Facundo-PC/Desktop/intruso/scripts/seed.ts).
    - [x] Modificar la app para que cargue los datos desde Supabase en el inicio.

## Ideas Futuras 💡
- [ ] **Sistema de Puntos**: Guardar quién va ganando a lo largo de varias rondas.
- [x] **Pistas Dinámicas**: Usar IA para generar pistas aún más rebuscadas en tiempo real (¡Implementado usando Gemini! 🤖).
- [ ] **Modo Multijugador Online**: Permitir que cada uno juegue desde su propio celular.


---
*Última actualización: 16 de Mayo, 23:15 hs*

