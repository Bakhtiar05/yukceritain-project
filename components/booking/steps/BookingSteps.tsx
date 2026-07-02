"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookingFormData } from "@/lib/schemas/booking";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, addDays, startOfDay, getDay } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, User, Mail, Phone, MapPin, Search, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getBookedSlots } from "@/app/actions/booking";
import { toZonedTime } from "date-fns-tz";

export const stepAnimation = "animate-in fade-in slide-in-from-bottom-4 duration-500";

const PROVINCES = [
  "Nanggroe Aceh Darussalam", "Sumatera Utara", "Sumatera Selatan", "Sumatera Barat", "Bengkulu", 
  "Riau", "Kepulauan Riau", "Jambi", "Lampung", "Bangka Belitung", 
  "Kalimantan Barat", "Kalimantan Timur", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Utara", 
  "Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", 
  "Bali", "Nusa Tenggara Timur", "Nusa Tenggara Barat", 
  "Gorontalo", "Sulawesi Barat", "Sulawesi Tengah", "Sulawesi Utara", "Sulawesi Tenggara", "Sulawesi Selatan", 
  "Maluku Utara", "Maluku", 
  "Papua Barat", "Papua", "Papua Tengah", "Papua Pegunungan", "Papua Selatan", "Papua Barat Daya"
].sort();

const TIME_SLOTS = [
  "09:00 - 10:00 WIB",
  "10:00 - 11:00 WIB",
  "11:00 - 12:00 WIB",
  "13:00 - 14:00 WIB",
  "14:00 - 15:00 WIB",
  "15:00 - 16:00 WIB",
];

// --- Welcome Step ---
export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center space-y-8 py-12", stepAnimation)}>
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm">
        👋
      </div>
      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
          Selamat datang di YukCeritaIN
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed">
          Kami akan membantu Anda menjadwalkan sesi konsultasi. Proses ini hanya memakan waktu sekitar 2 menit.
        </p>
      </div>
      <Button 
        onClick={onStart}
        className="h-14 px-8 text-lg font-semibold rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all"
      >
        Mulai Booking
      </Button>
    </div>
  );
}

// --- Name Step ---
export function NameStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <div className={cn("max-w-xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Siapa nama lengkap Anda?</h2>
      <p className="text-slate-500">Kami ingin memastikan data Anda tercatat dengan benar.</p>
      
      <div className="relative">
        <Input 
          {...register("nama_lengkap")} 
          placeholder="Contoh: Budi Santoso"
          className="h-16 text-lg rounded-2xl pl-4 pr-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          autoFocus
          autoComplete="name"
        />
      </div>
      {errors.nama_lengkap && <p className="text-rose-500 text-sm mt-2">{errors.nama_lengkap.message}</p>}
    </div>
  );
}

// --- Nickname Step ---
export function NicknameStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <div className={cn("max-w-xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Apa nama panggilan Anda?</h2>
      <p className="text-slate-500">Nama panggilan yang nyaman akan membuat sesi terasa lebih hangat.</p>
      
      <div className="relative">
        <Input 
          {...register("nama_panggilan")} 
          placeholder="Contoh: Budi"
          className="h-16 text-lg rounded-2xl pl-4 pr-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          autoFocus
        />
      </div>
      {errors.nama_panggilan && <p className="text-rose-500 text-sm mt-2">{errors.nama_panggilan.message}</p>}
    </div>
  );
}

// --- Email Step ---
export function EmailStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <div className={cn("max-w-xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Ke mana kami harus mengirimkan konfirmasi Anda?</h2>
      <p className="text-slate-500">Kami akan mengirimkan jadwal dan tautan Google Meet ke email ini.</p>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Mail className="h-6 w-6 text-slate-400" />
        </div>
        <Input 
          {...register("email")} 
          type="email"
          placeholder="email.anda@contoh.com"
          className="h-16 text-lg rounded-2xl pl-12 pr-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          autoFocus
          autoComplete="email"
        />
      </div>
      {errors.email && <p className="text-rose-500 text-sm mt-2">{errors.email.message}</p>}
      <p className="text-sm text-slate-400">Anda sudah melakukannya dengan baik. Privasi Anda terjaga.</p>
    </div>
  );
}

// --- Phone Step ---
export function PhoneStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <div className={cn("max-w-xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Berapa nomor WhatsApp Anda yang aktif?</h2>
      <p className="text-slate-500">Digunakan untuk pengingat sebelum sesi Anda dimulai.</p>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Phone className="h-6 w-6 text-slate-400" />
        </div>
        <Input 
          {...register("nomor_hp")} 
          type="tel"
          placeholder="081234567890"
          className="h-16 text-lg rounded-2xl pl-12 pr-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          autoFocus
          autoComplete="tel"
        />
      </div>
      {errors.nomor_hp && <p className="text-rose-500 text-sm mt-2">{errors.nomor_hp.message}</p>}
    </div>
  );
}

// --- DobNikStep ---
export function DobNikStep() {
  const { register, control, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <div className={cn("max-w-xl mx-auto space-y-8", stepAnimation)}>
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Kapan Anda lahir?</h2>
        <p className="text-slate-500">Membantu konselor kami memahami Anda lebih baik.</p>
        
        <div className="mt-4">
          <Controller
            control={control}
            name="tanggal_lahir"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-16 text-left text-lg font-normal rounded-2xl bg-slate-50 border-slate-200 hover:bg-slate-100 px-4",
                      !field.value && "text-slate-400"
                    )}
                  >
                    {field.value ? format(field.value, "PPP", { locale: id }) : <span>Pilih tanggal lahir</span>}
                    <CalendarIcon className="ml-auto h-5 w-5 text-slate-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white z-50 border border-slate-200 shadow-lg rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    captionLayout="dropdown"
                    startMonth={new Date(1940, 0)}
                    endMonth={new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.tanggal_lahir && <p className="text-rose-500 text-sm mt-2">{errors.tanggal_lahir.message}</p>}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Berapa Nomor Induk Kependudukan (NIK) Anda?</h2>
        <p className="text-slate-500">Diperlukan untuk keperluan administrasi resmi.</p>
        <div className="mt-4">
          <Input 
            {...register("nik")} 
            placeholder="16 digit NIK"
            className="h-16 text-lg rounded-2xl px-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {errors.nik && <p className="text-rose-500 text-sm mt-2">{errors.nik.message}</p>}
        </div>
      </div>
    </div>
  );
}

// --- Gender & Province Step ---
export function GenderProvinceStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const jenisKelamin = watch("jenis_kelamin");
  const provinsi = watch("provinsi");
  
  return (
    <div className={cn("max-w-xl mx-auto space-y-8", stepAnimation)}>
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Apa jenis kelamin Anda?</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {["Laki-laki", "Perempuan"].map((jk) => (
            <button
              key={jk}
              type="button"
              onClick={() => setValue("jenis_kelamin", jk as any, { shouldValidate: true })}
              className={cn(
                "h-16 rounded-2xl border-2 text-lg font-medium transition-all",
                jenisKelamin === jk 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {jk}
            </button>
          ))}
        </div>
        {errors.jenis_kelamin && <p className="text-rose-500 text-sm mt-2">{errors.jenis_kelamin.message}</p>}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Di provinsi mana Anda tinggal?</h2>
        <div className="mt-4">
          <select 
            {...register("provinsi")}
            className="w-full h-16 text-lg rounded-2xl px-4 bg-slate-50 border border-slate-200 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>Pilih provinsi...</option>
            {PROVINCES.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
          {errors.provinsi && <p className="text-rose-500 text-sm mt-2">{errors.provinsi.message}</p>}
        </div>
      </div>
    </div>
  );
}

// --- Address Step ---
export function AddressStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <div className={cn("max-w-xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Bisa tuliskan alamat lengkap Anda?</h2>
      <p className="text-slate-500">Hanya digunakan untuk pendataan administratif.</p>
      
      <div className="relative">
        <Textarea 
          {...register("alamat_lengkap")} 
          placeholder="Jl. Sudirman No. 1..."
          className="min-h-[120px] text-lg rounded-2xl p-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
          autoFocus
        />
      </div>
      {errors.alamat_lengkap && <p className="text-rose-500 text-sm mt-2">{errors.alamat_lengkap.message}</p>}
    </div>
  );
}

// --- Status Step ---
export function StatusStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const statusVal = watch("status");
  const options = ["Pelajar", "Mahasiswa", "Orang Tua", "Lainnya"];

  return (
    <div className={cn("max-w-xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Apa status aktivitas Anda saat ini?</h2>
      <p className="text-slate-500">Membantu kami menyesuaikan pendekatan konseling yang tepat.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setValue("status", opt as any, { shouldValidate: true })}
            className={cn(
              "h-16 rounded-2xl border-2 text-base font-medium transition-all text-left px-5",
              statusVal === opt 
                ? "border-blue-600 bg-blue-50 text-blue-700" 
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {errors.status && <p className="text-rose-500 text-sm mt-2">{errors.status.message}</p>}

      {statusVal === "Lainnya" && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
          <Input 
            {...register("status_lainnya")} 
            placeholder="Sebutkan status Anda..."
            className="h-16 text-lg rounded-2xl px-4 bg-slate-50 border-slate-200 focus:bg-white"
            autoFocus
          />
          {errors.status_lainnya && <p className="text-rose-500 text-sm mt-2">{errors.status_lainnya.message}</p>}
        </div>
      )}
    </div>
  );
}

// --- Topic Step ---
export function TopicStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const topics = watch("topik_permasalahan") || [];
  
  const topicOptions = [
    "Kecemasan / Anxiety",
    "Depresi",
    "Stres Akademik",
    "Masalah Keluarga",
    "Hubungan Asmara",
    "Pengembangan Diri",
    "Karir / Pekerjaan",
    "Trauma",
    "Lainnya"
  ];

  const toggleTopic = (topic: string) => {
    if (topics.includes(topic)) {
      setValue("topik_permasalahan", topics.filter(t => t !== topic), { shouldValidate: true });
    } else {
      setValue("topik_permasalahan", [...topics, topic], { shouldValidate: true });
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Topik apa yang paling menggambarkan situasi Anda?</h2>
      <p className="text-slate-500">Anda dapat memilih lebih dari satu topik.</p>
      
      <div className="flex flex-wrap gap-3 mt-4">
        {topicOptions.map((topic) => {
          const isSelected = topics.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={cn(
                "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all",
                isSelected 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {topic}
            </button>
          )
        })}
      </div>
      {errors.topik_permasalahan && <p className="text-rose-500 text-sm mt-2">{errors.topik_permasalahan.message}</p>}

      {topics.includes("Lainnya") && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
          <Input 
            {...register("topik_lainnya")} 
            placeholder="Tuliskan topik spesifik lainnya..."
            className="h-14 text-base rounded-2xl px-4 bg-slate-50 border-slate-200 focus:bg-white w-full max-w-md"
            autoFocus
          />
          {errors.topik_lainnya && <p className="text-rose-500 text-sm mt-2">{errors.topik_lainnya.message}</p>}
        </div>
      )}
    </div>
  );
}

// --- Story Step (Dedicated Full Screen) ---
export function StoryStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <div className={cn("max-w-3xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Bisa ceritakan situasi yang sedang Anda alami?</h2>
      <p className="text-slate-500 text-lg leading-relaxed">
        Luangkan waktu Anda. Bagikan apa yang membuat Anda merasa nyaman. Tim kami akan membacanya dengan penuh perhatian.
      </p>
      
      <div className="relative mt-8">
        <Textarea 
          {...register("ceritakan_permasalahan")} 
          placeholder="Saya akhir-akhir ini merasa..."
          className="min-h-[250px] md:min-h-[350px] text-lg rounded-2xl p-6 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all resize-y shadow-inner"
          autoFocus
        />
      </div>
      {errors.ceritakan_permasalahan && <p className="text-rose-500 text-sm mt-2">{errors.ceritakan_permasalahan.message}</p>}
      <p className="text-sm text-slate-400 mt-4 text-center">Tidak perlu terburu-buru. Kami di sini untuk mendengarkan.</p>
    </div>
  );
}

// --- Method & Date Step ---
export function MethodDateStep() {
  const { watch, setValue, control, formState: { errors } } = useFormContext<BookingFormData>();
  const metode = watch("metode_konsultasi");

  const now = new Date();
  const nowWib = toZonedTime(now, "Asia/Jakarta");
  const minDate = addDays(startOfDay(nowWib), 1);

  const isDateDisabled = (date: Date) => {
    const day = getDay(date);
    if (day < 2 || day > 5) return true; // Selasa(2) - Jumat(5)
    if (isBefore(date, minDate)) return true;
    return false;
  };

  return (
    <div className={cn("max-w-xl mx-auto space-y-8", stepAnimation)}>
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Bagaimana Anda ingin melangsungkan sesi?</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {["Online", "Offline"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setValue("metode_konsultasi", m as any, { shouldValidate: true })}
              className={cn(
                "h-16 rounded-2xl border-2 text-lg font-medium transition-all flex items-center justify-center gap-2",
                metode === m 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {m === "Online" ? "💻 Google Meet" : "📍 Tatap Muka"}
            </button>
          ))}
        </div>
        {errors.metode_konsultasi && <p className="text-rose-500 text-sm mt-2">{errors.metode_konsultasi.message}</p>}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Kapan Anda ingin menjadwalkan sesi?</h2>
        <p className="text-slate-500">Konsultasi tersedia hari Selasa - Jumat.</p>
        <div className="mt-4">
          <Controller
            control={control}
            name="tanggal_konsultasi"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-16 text-left text-lg font-normal rounded-2xl bg-slate-50 border-slate-200 hover:bg-slate-100 px-4",
                      !field.value && "text-slate-400"
                    )}
                  >
                    {field.value ? format(field.value, "PPP", { locale: id }) : <span>Pilih tanggal sesi</span>}
                    <CalendarIcon className="ml-auto h-5 w-5 text-slate-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white z-50 border border-slate-200 shadow-lg rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={isDateDisabled}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.tanggal_konsultasi && <p className="text-rose-500 text-sm mt-2">{errors.tanggal_konsultasi.message}</p>}
        </div>
      </div>
    </div>
  );
}

// --- Time Step ---
export function TimeStep() {
  const { watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const waktu = watch("waktu_konsultasi");
  const tgl = watch("tanggal_konsultasi");
  const metode = watch("metode_konsultasi");

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const fetchTime = useCallback(async (date: Date) => {
    setLoading(true);
    setSlotError(null);
    try {
      const slots = await getBookedSlots(date);
      setBookedSlots(slots);
    } catch (e) {
      console.error(e);
      setSlotError("Gagal memuat jadwal yang sudah terisi. Silakan coba lagi nanti.");
      setBookedSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tgl) {
      fetchTime(tgl);
      setValue("waktu_konsultasi", "");
    }
  }, [tgl, fetchTime, setValue]);

  return (
    <div className={cn("max-w-xl mx-auto space-y-6", stepAnimation)}>
      <h2 className="text-3xl font-display font-bold text-slate-900">Pukul berapa yang sesuai untuk Anda?</h2>
      <p className="text-slate-500">
        Menampilkan slot waktu untuk {tgl ? format(tgl, "dd MMMM yyyy", { locale: id }) : "..."}
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p>Memeriksa ketersediaan jadwal...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {TIME_SLOTS.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = waktu === time;

            return (
              <button
                key={time}
                type="button"
                disabled={isBooked}
                onClick={() => setValue("waktu_konsultasi", time, { shouldValidate: true })}
                className={cn(
                  "w-full flex flex-col items-center justify-center rounded-xl border-2 p-4 text-sm font-medium transition-all duration-200",
                  isBooked 
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60" 
                    : isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600"
                )}
              >
                <span>{time}</span>
                {isBooked && <span className="text-[10px] mt-1 text-red-500 font-bold uppercase tracking-wider">Penuh</span>}
              </button>
            )
          })}
        </div>
      )}
      
      {slotError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {slotError}
        </div>
      )}
      
      {errors.waktu_konsultasi && <p className="text-rose-500 text-sm mt-2">{errors.waktu_konsultasi.message}</p>}
    </div>
  );
}

// --- Source Step ---
export function SourceStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const sumber = watch("sumber_informasi");
  const alasan = watch("alasan");
  const urutan = watch("urutan_konseling");
  
  const alasans = ["Kemauan sendiri", "Saran dari teman", "Lainnya"];
  const urutans = ["Pertama", "Kedua", "Ketiga", "Keempat", "Lebih dari Empat"];
  const sources = ["WhatsApp", "Instagram", "Campaign", "Teman", "Lainnya"];

  return (
    <div className={cn("max-w-xl mx-auto space-y-8", stepAnimation)}>
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Apa alasan Anda mencari layanan konseling?</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {alasans.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("alasan", opt as any, { shouldValidate: true })}
              className={cn(
                "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all",
                alasan === opt 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {alasan === "Lainnya" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <Input 
              {...register("alasan_lainnya")} 
              placeholder="Sebutkan alasan lainnya..."
              className="h-12 rounded-xl px-4 bg-slate-50 border-slate-200"
            />
            {errors.alasan_lainnya && <p className="text-rose-500 text-sm mt-2">{errors.alasan_lainnya.message}</p>}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Ini konseling Anda yang ke berapa?</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {urutans.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("urutan_konseling", opt as any, { shouldValidate: true })}
              className={cn(
                "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all",
                urutan === opt 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.urutan_konseling && <p className="text-rose-500 text-sm mt-2">{errors.urutan_konseling.message}</p>}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Dari mana Anda mengetahui YukCeritaIN?</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {sources.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("sumber_informasi", opt as any, { shouldValidate: true })}
              className={cn(
                "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all",
                sumber === opt 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.sumber_informasi && <p className="text-rose-500 text-sm mt-2">{errors.sumber_informasi.message}</p>}
        
        {sumber === "Lainnya" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <Input 
              {...register("sumber_informasi_lainnya")} 
              placeholder="Sebutkan dari mana..."
              className="h-12 rounded-xl px-4 bg-slate-50 border-slate-200"
            />
            {errors.sumber_informasi_lainnya && <p className="text-rose-500 text-sm mt-2">{errors.sumber_informasi_lainnya.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Review Step ---
export function ReviewStep({ onEdit }: { onEdit: (stepIndex: number) => void }) {
  const { watch } = useFormContext<BookingFormData>();
  const data = watch();

  const Card = ({ title, onEditClick, children }: any) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <button onClick={onEditClick} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Ubah
        </button>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const Item = ({ label, value }: { label: string, value: any }) => (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-1 gap-1 sm:gap-4">
      <span className="text-sm text-slate-500 min-w-[120px]">{label}</span>
      <span className="text-sm font-medium text-slate-900 sm:text-right">{value || "-"}</span>
    </div>
  );

  return (
    <div className={cn("max-w-3xl mx-auto space-y-6 pb-12", stepAnimation)}>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Tinjau Ringkasan Anda</h2>
        <p className="text-slate-500">Pastikan seluruh data sudah sesuai sebelum mengirimkan permohonan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Data Diri" onEditClick={() => onEdit(1)}>
          <Item label="Nama Lengkap" value={data.nama_lengkap} />
          <Item label="Nama Panggilan" value={data.nama_panggilan} />
          <Item label="Email" value={data.email} />
          <Item label="Nomor HP" value={data.nomor_hp} />
          <Item label="Tanggal Lahir" value={data.tanggal_lahir ? format(data.tanggal_lahir, "dd MMM yyyy", { locale: id }) : ""} />
          <Item label="Jenis Kelamin" value={data.jenis_kelamin} />
          <Item label="NIK" value={data.nik} />
        </Card>

        <Card title="Info Konsultasi" onEditClick={() => onEdit(11)}>
          <Item label="Metode" value={data.metode_konsultasi} />
          <Item label="Tanggal" value={data.tanggal_konsultasi ? format(data.tanggal_konsultasi, "dd MMM yyyy", { locale: id }) : ""} />
          <Item label="Waktu" value={data.waktu_konsultasi} />
          <Item label="Status" value={data.status === "Lainnya" ? data.status_lainnya : data.status} />
          <Item label="Konseling Ke-" value={data.urutan_konseling} />
        </Card>

        <div className="md:col-span-2">
          <Card title="Alamat & Topik" onEditClick={() => onEdit(6)}>
            <Item label="Provinsi" value={data.provinsi} />
            <Item label="Alamat Lengkap" value={data.alamat_lengkap} />
            <div className="pt-3 mt-3 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-2">Topik yang dipilih:</p>
              <div className="flex flex-wrap gap-2">
                {data.topik_permasalahan?.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    {t === "Lainnya" ? data.topik_lainnya : t}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card title="Situasi Anda" onEditClick={() => onEdit(10)}>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl">
              {data.ceritakan_permasalahan}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
