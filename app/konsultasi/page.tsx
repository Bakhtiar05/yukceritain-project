import { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Konsultasi Psikologi | YukceritaIN",
  description: "Layanan konsultasi psikologi profesional. Booking jadwal Anda sekarang.",
};

export default function KonsultasiPage() {
  return (
    <div className="min-h-screen booking-page-bg pt-20 md:pt-20 pb-16 md:pb-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative z-10">
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat formulir pendaftaran...</div>}>
          <BookingWizard />
        </Suspense>
      </div>
    </div>
  );
}
