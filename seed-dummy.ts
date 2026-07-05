import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyCounselors = [
  {
    slug: "dr-budi-santoso",
    full_name: "Dr. Budi Santoso",
    title: "M.Psi., Psikolog",
    profession: "Psikolog Klinis Dewasa",
    photo_url: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random",
    gender: "Laki-laki",
    specialization: "Depresi, Kecemasan, Manajemen Stres, Burnout",
    short_bio: "Berpengalaman lebih dari 8 tahun membantu individu dewasa mengatasi tantangan psikologis dan menemukan kembali makna hidup mereka.",
    full_bio: "Dr. Budi Santoso adalah seorang psikolog klinis yang berfokus pada pendekatan Cognitive Behavioral Therapy (CBT). Beliau sangat peduli terhadap kesehatan mental pekerja di daerah urban yang sering mengalami burnout dan tingkat stres tinggi.",
    education: "S1 Psikologi Universitas Indonesia\nS2 Magister Psikologi Profesi Universitas Gadjah Mada",
    experience_years: 8,
    languages: ["Indonesia", "English"],
    rating: 4.9,
    total_reviews: 124,
    is_active: true,
    is_public: true,
    display_order: 10
  },
  {
    slug: "anita-wijaya",
    full_name: "Anita Wijaya",
    title: "S.Psi., M.Psi.",
    profession: "Psikolog Anak & Remaja",
    photo_url: "https://ui-avatars.com/api/?name=Anita+Wijaya&background=random",
    gender: "Perempuan",
    specialization: "Pola Asuh, Trauma Anak, Gangguan Belajar, ADHD",
    short_bio: "Membantu anak-anak dan remaja melewati fase pertumbuhan dengan sehat, serta mendampingi orang tua dalam pola asuh (parenting).",
    full_bio: "Anita Wijaya merupakan psikolog anak dan remaja yang percaya bahwa masa kanak-kanak merupakan fondasi penting bagi perkembangan manusia. Beliau memiliki pengalaman luas dalam menangani kasus perundungan (bullying) dan trauma masa kecil.",
    education: "S1 Psikologi Universitas Padjadjaran\nS2 Magister Profesi Klinis Anak Universitas Indonesia",
    experience_years: 5,
    languages: ["Indonesia", "English"],
    rating: 5.0,
    total_reviews: 89,
    is_active: true,
    is_public: true,
    display_order: 20
  },
  {
    slug: "diana-putri",
    full_name: "Diana Putri",
    title: "M.Psi., Psikolog",
    profession: "Konselor Pernikahan & Keluarga",
    photo_url: "https://ui-avatars.com/api/?name=Diana+Putri&background=random",
    gender: "Perempuan",
    specialization: "Konseling Pasangan, Konflik Keluarga, Pranikah",
    short_bio: "Fokus mendampingi pasangan dalam membangun komunikasi yang sehat, menyelesaikan konflik, dan mempersiapkan pernikahan.",
    full_bio: "Diana Putri merupakan konselor keluarga yang bersertifikasi. Beliau membantu banyak pasangan dalam mengatasi kebuntuan komunikasi, perselingkuhan, hingga persiapan pranikah untuk meminimalisir perceraian.",
    education: "S1 Psikologi Universitas Diponegoro\nS2 Psikologi Terapan Universitas Airlangga",
    experience_years: 10,
    languages: ["Indonesia"],
    rating: 4.8,
    total_reviews: 215,
    is_active: true,
    is_public: true,
    display_order: 30
  }
];

async function seed() {
  console.log("Seeding dummy counselors...");
  const { data, error } = await supabase.from("counselors").insert(dummyCounselors).select();

  if (error) {
    console.error("Error inserting counselors:", error);
  } else {
    console.log(`Successfully inserted ${data.length} counselors.`);
    console.log(data.map(c => c.full_name).join(", "));
  }
}

seed();
