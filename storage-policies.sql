-- Membuat bucket 'counselors' untuk menyimpan foto (jika belum ada)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'counselors',
    'counselors',
    true,
    5242880, -- 5 MB dalam bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];


-- Menghapus policy lama (opsional, jika Anda pernah membuatnya sebelumnya dan ingin mereset)
DROP POLICY IF EXISTS "Public Access for Counselors Photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users can upload Counselor Photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users can update Counselor Photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users can delete Counselor Photos" ON storage.objects;

-- 1. POLICY: Siapapun (publik) bisa melihat (membaca) foto konselor
CREATE POLICY "Public Access for Counselors Photos" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'counselors' );

-- 2. POLICY: Hanya admin (pengguna yang sudah login) yang bisa mengunggah (INSERT) foto baru
CREATE POLICY "Authenticated Users can upload Counselor Photos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'counselors' );

-- 3. POLICY: Hanya admin (pengguna yang sudah login) yang bisa mengedit (UPDATE) foto
CREATE POLICY "Authenticated Users can update Counselor Photos" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'counselors' );

-- 4. POLICY: Hanya admin (pengguna yang sudah login) yang bisa menghapus (DELETE) foto
CREATE POLICY "Authenticated Users can delete Counselor Photos" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'counselors' );
