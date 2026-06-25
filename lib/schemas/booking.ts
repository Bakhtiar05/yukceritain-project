import { z } from "zod";

export const bookingSchema = z.object({
  // Step 1
  email: z.string().email("Email tidak valid"),
  nama_lengkap: z.string().min(2, "Nama lengkap wajib diisi"),
  nama_panggilan: z.string().min(2, "Nama panggilan wajib diisi"),
  tanggal_lahir: z.date({
    message: "Tanggal lahir wajib diisi",
  }),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    message: "Pilih jenis kelamin",
  }),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  nomor_hp: z.string().regex(/^08\d{8,11}$/, "Nomor HP tidak valid, contoh: 081234567890"),
  alamat_lengkap: z.string().min(5, "Alamat lengkap wajib diisi"),
  provinsi: z.string().min(2, "Pilih provinsi"),

  // Step 2
  status: z.enum(["Pelajar", "Mahasiswa", "Orang Tua", "Lainnya"], { message: "Pilih status" }),
  status_lainnya: z.string().optional(),
  alasan: z.enum(["Kemauan sendiri", "Saran dari teman", "Lainnya"], { message: "Pilih alasan" }),
  alasan_lainnya: z.string().optional(),
  topik_permasalahan: z.array(z.string()).min(1, "Pilih setidaknya satu topik"),
  topik_lainnya: z.string().optional(),
  ceritakan_permasalahan: z.string().min(50, "Ceritakan permasalahan minimal 50 karakter").max(3000, "Maksimal 3000 karakter"),

  // Step 3
  tanggal_konsultasi: z.date({ message: "Pilih tanggal konsultasi" }),
  waktu_konsultasi: z.string({ message: "Pilih waktu konsultasi" }),
  metode_konsultasi: z.enum(["Online", "Offline"], { message: "Pilih metode konsultasi" }),

  // Step 4
  urutan_konseling: z.enum(["Pertama", "Kedua", "Ketiga", "Keempat", "Lebih dari Empat"], { message: "Pilih ini konseling ke berapa" }),
  sumber_informasi: z.enum(["WhatsApp", "Instagram", "Campaign", "Teman", "Lainnya"], { message: "Pilih sumber informasi" }),
  sumber_informasi_lainnya: z.string().optional(),
}).superRefine((data, ctx) => {
  // Step 2 Refinements
  if (data.status === "Lainnya" && (!data.status_lainnya || data.status_lainnya.trim().length === 0)) {
    ctx.addIssue({ code: "custom", path: ["status_lainnya"], message: "Isi status lainnya" });
  }
  if (data.alasan === "Lainnya" && (!data.alasan_lainnya || data.alasan_lainnya.trim().length === 0)) {
    ctx.addIssue({ code: "custom", path: ["alasan_lainnya"], message: "Isi alasan lainnya" });
  }
  if (data.topik_permasalahan.includes("Lainnya") && (!data.topik_lainnya || data.topik_lainnya.trim().length === 0)) {
    ctx.addIssue({ code: "custom", path: ["topik_lainnya"], message: "Isi topik lainnya" });
  }
  
  // Step 4 Refinements
  if (data.sumber_informasi === "Lainnya" && (!data.sumber_informasi_lainnya || data.sumber_informasi_lainnya.trim().length === 0)) {
    ctx.addIssue({ code: "custom", path: ["sumber_informasi_lainnya"], message: "Isi sumber informasi lainnya" });
  }
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const defaultBookingValues: Partial<BookingFormData> = {
  email: "",
  nama_lengkap: "",
  nama_panggilan: "",
  jenis_kelamin: undefined,
  nik: "",
  nomor_hp: "",
  alamat_lengkap: "",
  provinsi: "",
  status: undefined,
  status_lainnya: "",
  alasan: undefined,
  alasan_lainnya: "",
  topik_permasalahan: [],
  topik_lainnya: "",
  ceritakan_permasalahan: "",
  tanggal_konsultasi: undefined,
  waktu_konsultasi: "",
  metode_konsultasi: undefined,
  urutan_konseling: undefined,
  sumber_informasi: undefined,
  sumber_informasi_lainnya: "",
};
