import { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Konsultasi Psikologi | YukceritaIN",
  description: "Layanan konsultasi psikologi profesional. Booking jadwal Anda sekarang.",
};

export default function KonsultasiPage() {
  return (
    <div className="min-h-screen booking-page-bg pt-20 md:pt-28 pb-16 md:pb-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative z-10">
        <div className="text-center flex flex-col items-center gap-3 mb-6 md:mb-12">
          <h1 className="text-3xl md:text-[42px] font-display font-bold text-[#0F172A] animate-fade-enter leading-snug md:leading-tight tracking-tight max-w-[300px] md:max-w-none">
            Daftar Jadwal Konseling
          </h1>

        </div>

        <BookingWizard />
      </div>
    </div>
  );
}
