import { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import MobileHeader from "@/components/events/mobile/MobileHeader";

export const metadata: Metadata = {
  title: "Konsultasi Psikologi | YukceritaIN",
  description: "Layanan konsultasi psikologi profesional. Booking jadwal Anda sekarang.",
};

export default function KonsultasiPage() {
  return (
    <>

      <MobileHeader title="Daftar Konseling" hideBookmark={true} />
      <div className="min-h-screen booking-page-bg dark:!bg-none dark:!bg-background pt-6 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative z-10">
          <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat formulir pendaftaran...</div>}>
            <BookingWizard />
          </Suspense>
        </div>
      </div>
    </>
  );
}
