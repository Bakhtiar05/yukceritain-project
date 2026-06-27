import { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Konsultasi Psikologi | YukceritaIN",
  description: "Layanan konsultasi psikologi profesional. Booking jadwal Anda sekarang.",
};

export default function KonsultasiPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4 animate-fade-enter">
            Pesan Jadwal Konsultasi
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto animate-fade-enter" style={{ animationDelay: '100ms' }}>
            Langkah awal menuju kesehatan mental yang lebih baik. Ceritakan apa yang Anda rasakan, dan kami akan membantu menemukan jalan keluarnya.
          </p>
        </div>

        <BookingWizard />
      </div>
    </div>
  );
}
