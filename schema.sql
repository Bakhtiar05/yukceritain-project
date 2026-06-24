-- ============================================
-- Akutemanmu Blog — PostgreSQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'uncategorized',
  tag_color TEXT DEFAULT '#2E86DE',
  tag_bg TEXT DEFAULT '#EBF4FF',
  cover_image TEXT,
  author_name TEXT NOT NULL DEFAULT 'Admin',
  author_title TEXT,
  read_time TEXT DEFAULT '5 menit baca',
  is_featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slug lookups (used on every article page)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Index for published posts listing (most common query)
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, created_at DESC);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. ROW LEVEL SECURITY (RLS) — POSTS
-- ============================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts (public blog)
CREATE POLICY "Public can read published posts"
  ON posts
  FOR SELECT
  USING (published = true);

-- Authenticated users can read ALL posts (admin dashboard)
CREATE POLICY "Authenticated users can read all posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert new posts
CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update any post
CREATE POLICY "Authenticated users can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete any post
CREATE POLICY "Authenticated users can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 3. NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert their email)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view subscribers
CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 4. SEED DATA (Optional — sample blog posts)
-- ============================================
INSERT INTO posts (title, slug, excerpt, content, category, tag_color, tag_bg, cover_image, author_name, author_title, read_time, is_featured, published) VALUES
(
  'Mengenal Kecemasan: Tanda-Tanda, Penyebab, dan Cara Mengatasinya Sehari-hari',
  'mengenal-kecemasan',
  'Kecemasan adalah emosi alami, tapi bagaimana jika ia mulai mengganggu kehidupan sehari-hari? Pelajari tanda-tanda, penyebab, dan cara efektif mengatasinya.',
  '<section id="apa-itu-kecemasan" class="article-section"><h2>Apa itu Kecemasan?</h2><p>Kecemasan atau <em>anxiety</em> adalah respons alami tubuh terhadap stres. Ini adalah perasaan takut atau khawatir tentang apa yang akan datang. Hampir semua orang pernah mengalaminya — saat wawancara kerja, hari pertama sekolah, atau sebelum membuat keputusan besar.</p><p>Namun, ketika perasaan cemas menjadi berlebihan, berlangsung selama berbulan-bulan, dan mulai mengganggu aktivitas sehari-hari, ini bisa menjadi tanda gangguan kecemasan (<em>anxiety disorder</em>) yang memerlukan perhatian lebih.</p><blockquote class="article-quote"><p>"Kecemasan bukan berarti kamu lemah. Itu berarti kamu sudah terlalu lama mencoba untuk tetap kuat."</p><cite>— Anonim</cite></blockquote></section><section id="tanda-tanda" class="article-section"><h2>Tanda-tanda Kecemasan yang Perlu Dikenali</h2><p>Kecemasan dapat muncul dalam berbagai bentuk. Berikut adalah tanda-tanda yang perlu kamu waspadai:</p><div class="symptom-grid"><div class="symptom-card symptom-card--physical"><div class="symptom-icon">💓</div><h3>Gejala Fisik</h3><ul><li>Jantung berdebar cepat</li><li>Napas pendek atau sesak</li><li>Otot tegang dan nyeri</li><li>Gangguan tidur</li><li>Kelelahan berlebihan</li></ul></div><div class="symptom-card symptom-card--emotional"><div class="symptom-icon">🧠</div><h3>Gejala Emosional</h3><ul><li>Rasa khawatir berlebihan</li><li>Sulit berkonsentrasi</li><li>Perasaan gelisah</li><li>Mudah tersinggung</li><li>Rasa takut yang tidak rasional</li></ul></div><div class="symptom-card symptom-card--behavior"><div class="symptom-icon">🔄</div><h3>Gejala Perilaku</h3><ul><li>Menghindari situasi tertentu</li><li>Sulit membuat keputusan</li><li>Menarik diri dari sosial</li><li>Kebiasaan gelisah (fidgeting)</li><li>Prokrastinasi berlebihan</li></ul></div></div></section><section id="penyebab-utama" class="article-section"><h2>Penyebab Utama Kecemasan</h2><ol class="article-list article-list--numbered"><li><strong>Faktor Genetik</strong> — Riwayat keluarga dengan gangguan kecemasan dapat meningkatkan risiko seseorang mengalami kondisi serupa.</li><li><strong>Pengalaman Traumatis</strong> — Peristiwa traumatis di masa lalu, seperti kekerasan, kecelakaan, atau kehilangan, dapat memicu kecemasan jangka panjang.</li><li><strong>Tekanan Hidup</strong> — Stres pekerjaan, masalah keuangan, konflik hubungan, atau perubahan besar dalam hidup.</li><li><strong>Ketidakseimbangan Kimia Otak</strong> — Perubahan pada neurotransmitter seperti serotonin dan dopamin dapat memengaruhi tingkat kecemasan.</li><li><strong>Tipe Kepribadian</strong> — Orang dengan sifat perfeksionis atau yang cenderung berpikir berlebihan lebih rentan terhadap kecemasan.</li></ol></section><section id="cara-mengatasinya" class="article-section"><h2>Cara Mengatasinya Sehari-hari</h2><div class="tip-cards"><div class="tip-card"><span class="tip-number">01</span><div class="tip-content"><h3>Teknik Pernapasan Dalam</h3><p>Latihan pernapasan 4-7-8: Hirup napas selama 4 detik, tahan selama 7 detik, lalu hembuskan perlahan selama 8 detik. Ulangi 3-4 kali.</p></div></div><div class="tip-card"><span class="tip-number">02</span><div class="tip-content"><h3>Praktik Mindfulness</h3><p>Luangkan 5-10 menit setiap hari untuk meditasi mindfulness. Fokus pada sensasi saat ini tanpa menghakimi pikiran yang muncul.</p></div></div><div class="tip-card"><span class="tip-number">03</span><div class="tip-content"><h3>Olahraga Teratur</h3><p>Aktivitas fisik melepaskan endorfin yang secara alami mengurangi kecemasan. Cukup 30 menit jalan kaki setiap hari sudah memberi efek positif.</p></div></div><div class="tip-card"><span class="tip-number">04</span><div class="tip-content"><h3>Journaling</h3><p>Tulis pikiran dan perasaanmu setiap hari. Ini membantu mengidentifikasi pemicu kecemasan dan memproses emosi dengan lebih sehat.</p></div></div></div><div class="article-highlight-box"><h3>💡 Tahukah Kamu?</h3><p><strong>Cognitive Behavioral Therapy (CBT)</strong> adalah salah satu pendekatan terapi yang paling efektif untuk mengatasi gangguan kecemasan. CBT membantu mengidentifikasi dan mengubah pola pikir negatif yang memicu kecemasan.</p></div></section><section id="kapan-mencari-bantuan" class="article-section"><h2>Kapan Harus Mencari Bantuan Profesional?</h2><p>Pertimbangkan untuk berkonsultasi dengan psikolog atau psikiater jika kamu mengalami:</p><ul class="article-list article-list--check"><li>Kecemasan berlangsung lebih dari 6 bulan</li><li>Mengganggu pekerjaan, sekolah, atau hubungan</li><li>Menyebabkan serangan panik berulang</li><li>Membuatmu menghindari aktivitas penting</li><li>Disertai pikiran untuk menyakiti diri sendiri</li><li>Tidak membaik dengan upaya mandiri</li></ul><div class="article-cta-box"><h3>Siap Memulai Perjalananmu?</h3><p>Berbicara dengan psikolog profesional bisa menjadi langkah pertama menuju kesehatan mental yang lebih baik.</p><a href="/" class="btn-primary">Konsultasi Gratis</a></div></section>',
  'kecemasan',
  '#2E86DE',
  '#EBF4FF',
  '/assets/blog_anxiety.png',
  'Dr. Rani Kusuma, M.Psi.',
  'Psikolog Klinis · Spesialis Gangguan Kecemasan',
  '8 menit baca',
  true,
  true
),
(
  'Self-Care Bukan Egois: Panduan Merawat Diri untuk Kesehatan Mental',
  'self-care-bukan-egois',
  'Banyak orang merasa bersalah saat meluangkan waktu untuk diri sendiri. Padahal, self-care adalah fondasi penting untuk kesehatan mental yang berkelanjutan.',
  '<section id="pengertian-self-care" class="article-section"><h2>Apa Itu Self-Care?</h2><p>Self-care adalah tindakan sadar yang kita lakukan untuk menjaga kesehatan fisik, mental, dan emosional kita. Ini bukan tentang menjadi egois — ini tentang memastikan kita memiliki energi dan kesehatan untuk bisa hadir bagi diri sendiri dan orang lain.</p></section><section id="mengapa-penting" class="article-section"><h2>Mengapa Self-Care Penting?</h2><p>Ketika kita terus-menerus memberikan tanpa mengisi ulang energi kita, kita berisiko mengalami burnout, kelelahan emosional, dan bahkan masalah kesehatan fisik. Self-care membantu kita mempertahankan keseimbangan yang sehat.</p></section><section id="tips-praktis" class="article-section"><h2>Tips Self-Care Praktis</h2><div class="tip-cards"><div class="tip-card"><span class="tip-number">01</span><div class="tip-content"><h3>Tetapkan Batasan</h3><p>Belajar mengatakan "tidak" tanpa rasa bersalah. Batasan yang sehat melindungi energi mentalmu.</p></div></div><div class="tip-card"><span class="tip-number">02</span><div class="tip-content"><h3>Tidur Berkualitas</h3><p>Prioritaskan 7-9 jam tidur setiap malam. Tidur yang baik adalah fondasi kesehatan mental.</p></div></div><div class="tip-card"><span class="tip-number">03</span><div class="tip-content"><h3>Koneksi Sosial</h3><p>Luangkan waktu bersama orang-orang yang memberi energi positif dan membuatmu merasa dihargai.</p></div></div></div></section>',
  'selfcare',
  '#27AE60',
  '#E8F8F0',
  '/assets/blog_selfcare.png',
  'Sari Andini, S.Psi.',
  'Psikolog · Konselor Kesehatan Mental',
  '6 menit baca',
  false,
  true
),
(
  'Mindfulness untuk Pemula: Langkah Pertama Menuju Ketenangan',
  'mindfulness-untuk-pemula',
  'Mindfulness bisa terdengar rumit, tapi sebenarnya sangat sederhana. Pelajari cara memulai praktik mindfulness yang bisa mengubah cara kamu menghadapi stres.',
  '<section id="apa-itu-mindfulness" class="article-section"><h2>Apa Itu Mindfulness?</h2><p>Mindfulness adalah praktik membawa perhatian penuh pada momen saat ini tanpa menghakimi. Ini bukan tentang mengosongkan pikiran, melainkan tentang mengamati pikiran dan perasaan kita dengan rasa ingin tahu dan kebaikan.</p></section><section id="manfaat" class="article-section"><h2>Manfaat Mindfulness</h2><p>Penelitian menunjukkan bahwa praktik mindfulness secara teratur dapat mengurangi stres, meningkatkan fokus, memperbaiki kualitas tidur, dan bahkan memperkuat sistem kekebalan tubuh.</p></section><section id="cara-memulai" class="article-section"><h2>Cara Memulai</h2><div class="tip-cards"><div class="tip-card"><span class="tip-number">01</span><div class="tip-content"><h3>Mulai dengan 5 Menit</h3><p>Duduk dengan nyaman, tutup mata, dan fokus pada napasmu selama 5 menit. Ketika pikiran mengembara, kembalikan perhatian ke napas tanpa menghakimi.</p></div></div><div class="tip-card"><span class="tip-number">02</span><div class="tip-content"><h3>Body Scan</h3><p>Pindai tubuhmu dari ujung kaki hingga kepala. Perhatikan sensasi apa pun tanpa mencoba mengubahnya.</p></div></div></div></section>',
  'mindfulness',
  '#8E44AD',
  '#F5EEF8',
  '/assets/blog_mindfulness.png',
  'Budi Hartono, M.Psi.',
  'Psikolog · Praktisi Mindfulness',
  '5 menit baca',
  false,
  true
),
(
  'Cara Berbicara tentang Kesehatan Mental dengan Orang Terdekat',
  'cara-berbicara-tentang-kesehatan-mental',
  'Memulai percakapan tentang kesehatan mental bisa terasa sulit. Berikut panduan praktis untuk membicarakan topik ini dengan orang-orang yang kamu sayangi.',
  '<section id="mengapa-penting" class="article-section"><h2>Mengapa Percakapan Ini Penting?</h2><p>Stigma seputar kesehatan mental masih menjadi hambatan besar. Namun, percakapan terbuka bisa menjadi langkah awal menuju pemahaman dan dukungan yang lebih baik.</p></section><section id="tips-percakapan" class="article-section"><h2>Tips Memulai Percakapan</h2><div class="tip-cards"><div class="tip-card"><span class="tip-number">01</span><div class="tip-content"><h3>Pilih Waktu yang Tepat</h3><p>Cari momen yang tenang dan privat. Hindari memulai percakapan saat emosi sedang tinggi.</p></div></div><div class="tip-card"><span class="tip-number">02</span><div class="tip-content"><h3>Gunakan \"Aku\" Statement</h3><p>Mulailah dengan perasaanmu sendiri: \"Aku merasa khawatir...\" daripada \"Kamu harus...\"</p></div></div></div></section>',
  'relasi',
  '#E67E22',
  '#FEF5E7',
  '/assets/blog_connection.png',
  'Laila Putri, M.Psi.',
  'Psikolog · Spesialis Terapi Keluarga',
  '7 menit baca',
  false,
  true
),
(
  'Sedih vs. Depresi: Bagaimana Membedakannya?',
  'sedih-vs-depresi',
  'Merasa sedih adalah hal yang wajar. Tapi bagaimana kamu tahu kapan kesedihan berubah menjadi depresi? Pelajari perbedaan penting antara keduanya.',
  '<section id="perbedaan-utama" class="article-section"><h2>Perbedaan Utama</h2><p>Kesedihan adalah emosi normal yang biasanya memiliki pemicu yang jelas dan akan mereda seiring waktu. Depresi, di sisi lain, adalah kondisi medis yang melibatkan perubahan berkelanjutan dalam mood, pikiran, dan perilaku selama minimal dua minggu.</p></section><section id="tanda-depresi" class="article-section"><h2>Tanda-tanda Depresi</h2><ul class="article-list article-list--check"><li>Perasaan hampa atau putus asa yang berkepanjangan</li><li>Kehilangan minat pada aktivitas yang dulu disukai</li><li>Perubahan nafsu makan atau berat badan</li><li>Gangguan tidur (insomnia atau hipersomnia)</li><li>Kelelahan dan kehilangan energi</li></ul></section>',
  'depresi',
  '#2E4057',
  '#E8ECF0',
  NULL,
  'Muhammad Rizal, Sp.KJ',
  'Psikiater · Spesialis Gangguan Mood',
  '6 menit baca',
  false,
  true
),
(
  'Rutinitas Pagi yang Menenangkan untuk Kesehatan Mental',
  'rutinitas-pagi-menenangkan',
  'Cara kamu memulai pagi menentukan bagaimana kamu menjalani hari. Temukan rutinitas pagi yang bisa membantu menjaga kesehatan mentalmu.',
  '<section id="pentingnya-rutinitas" class="article-section"><h2>Mengapa Rutinitas Pagi Penting?</h2><p>Pagi yang tenang dan terstruktur memberikan fondasi yang kuat untuk menghadapi tantangan hari ini. Ketika kita memulai hari dengan kebiasaan positif, kita membangun ketahanan mental yang lebih baik.</p></section><section id="rutinitas-rekomendasi" class="article-section"><h2>Rekomendasi Rutinitas</h2><div class="tip-cards"><div class="tip-card"><span class="tip-number">01</span><div class="tip-content"><h3>Bangun Tanpa Gadget</h3><p>Hindari melihat ponsel selama 30 menit pertama setelah bangun. Biarkan pikiranmu bangun secara alami.</p></div></div><div class="tip-card"><span class="tip-number">02</span><div class="tip-content"><h3>Gratitude Journaling</h3><p>Tulis 3 hal yang kamu syukuri setiap pagi. Praktik sederhana ini mengubah cara otakmu memandang hari.</p></div></div></div></section>',
  'selfcare',
  '#27AE60',
  '#E8F8F0',
  NULL,
  'Sari Andini, S.Psi.',
  'Psikolog · Konselor Kesehatan Mental',
  '5 menit baca',
  false,
  true
),
(
  'Teknik Pernapasan 4-7-8 untuk Meredakan Kecemasan',
  'teknik-pernapasan-4-7-8',
  'Teknik pernapasan sederhana ini bisa menjadi senjata ampuh melawan kecemasan. Pelajari cara melakukannya dengan benar dan kapan menggunakannya.',
  '<section id="apa-itu-4-7-8" class="article-section"><h2>Apa Itu Teknik 4-7-8?</h2><p>Teknik pernapasan 4-7-8, yang dikembangkan oleh Dr. Andrew Weil, adalah metode pernapasan yang dirancang untuk mempromosikan relaksasi. Angka-angka merujuk pada hitungan detik: tarik napas selama 4 detik, tahan selama 7 detik, dan hembuskan selama 8 detik.</p></section><section id="cara-melakukan" class="article-section"><h2>Langkah-langkah</h2><div class="tip-cards"><div class="tip-card"><span class="tip-number">01</span><div class="tip-content"><h3>Persiapan</h3><p>Duduk atau berbaring dengan nyaman. Letakkan ujung lidah di belakang gigi depan atas.</p></div></div><div class="tip-card"><span class="tip-number">02</span><div class="tip-content"><h3>Tarik Napas (4 detik)</h3><p>Hirup napas melalui hidung secara perlahan sambil menghitung hingga 4.</p></div></div><div class="tip-card"><span class="tip-number">03</span><div class="tip-content"><h3>Tahan (7 detik)</h3><p>Tahan napas sambil menghitung hingga 7. Ini memberikan waktu bagi oksigen untuk menyerap.</p></div></div><div class="tip-card"><span class="tip-number">04</span><div class="tip-content"><h3>Hembuskan (8 detik)</h3><p>Hembuskan napas melalui mulut dengan bunyi \"whoosh\" selama 8 detik.</p></div></div></div></section>',
  'kecemasan',
  '#2E86DE',
  '#EBF4FF',
  NULL,
  'Dr. Rani Kusuma, M.Psi.',
  'Psikolog Klinis · Spesialis Gangguan Kecemasan',
  '4 menit baca',
  false,
  true
);
