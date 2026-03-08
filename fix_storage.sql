
-- Copia y pega este script en el Editor SQL de tu proyecto Supabase para solucionar el error de subida de imágenes.

-- 1. Crear el bucket 'banners' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Eliminar políticas antiguas para evitar conflictos
DROP POLICY IF EXISTS "Public Access Banners" ON storage.objects;
DROP POLICY IF EXISTS "Upload Banners" ON storage.objects;
DROP POLICY IF EXISTS "Update Banners" ON storage.objects;
DROP POLICY IF EXISTS "Delete Banners" ON storage.objects;

-- 3. Crear política para permitir VER imágenes públicamente (lectura)
CREATE POLICY "Public Access Banners"
ON storage.objects FOR SELECT
USING ( bucket_id = 'banners' );

-- 4. Crear política para permitir SUBIR imágenes (insertar)
-- IMPORTANTE: Esta política permite uploads a usuarios anónimos si usas la key pública.
-- Si requieres autenticación, cambia 'true' por 'auth.role() = ''authenticated'''
CREATE POLICY "Upload Banners"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'banners' );

-- 5. Crear política para permitir ACTUALIZAR imágenes
CREATE POLICY "Update Banners"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'banners' );

-- 6. Crear política para permitir BORRAR imágenes
CREATE POLICY "Delete Banners"
ON storage.objects FOR DELETE
USING ( bucket_id = 'banners' );
