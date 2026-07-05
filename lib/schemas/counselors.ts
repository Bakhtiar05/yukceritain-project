import { z } from "zod";

export const counselorSchema = z.object({
  full_name: z.string().min(2, "Nama lengkap wajib diisi"),
  title: z.string().optional(),
  profession: z.string().min(2, "Profesi wajib diisi"),
  photo_url: z.string().optional().or(z.literal("")),
  photo_file: z.any()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= 5 * 1024 * 1024;
    }, "Ukuran maksimal foto adalah 5 MB")
    .optional(),
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  specialization: z.string().min(2, "Spesialisasi wajib diisi"),
  short_bio: z.string().min(10, "Bio singkat wajib diisi").max(200, "Bio singkat maksimal 200 karakter"),
  full_bio: z.string().optional(),
  education: z.string().optional(),
  experience_years: z.coerce.number().min(0, "Pengalaman tidak boleh negatif").default(0),
  languages: z.string().min(1, "Bahasa wajib diisi"),
  rating: z.coerce.number().min(0).max(5).default(5),
  total_reviews: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
  is_public: z.boolean().default(true),
  display_order: z.coerce.number().default(0),
});

export type CounselorFormData = z.input<typeof counselorSchema>;
export type CounselorFormOutput = z.output<typeof counselorSchema>;
