import React from "react";
import { getEventBySlug } from "@/app/actions/events";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import RegistrationForm from "@/components/events/RegistrationForm";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function EventRegistrationPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const isRegistrationOpen = event.status === "Published" && new Date(event.registration_deadline) > new Date();
  const isFull = event.quota > 0 && event.registered_count >= event.quota;

  if (!isRegistrationOpen || isFull) {
    redirect(`/events/${event.slug}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Acara
        </Link>
        
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl flex flex-col md:flex-row">
          
          {/* Left Side: Summary */}
          <div className="w-full md:w-2/5 bg-slate-900 text-white p-8 md:p-10 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {event.cover_image && <Image src={event.cover_image} alt="bg" fill className="object-cover" />}
            </div>
            <div className="relative z-10 flex-1">
              <span className="bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider inline-block mb-4">
                REGISTRASI ACARA
              </span>
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <p className="text-slate-400 text-sm mb-8">{event.short_description}</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Tiket E-Certificate</p>
                    <p className="text-xs text-slate-400">Diberikan setelah acara</p>
                  </div>
                </div>
                {event.pricing_type === 'PAID' && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Pembayaran Aman</p>
                      <p className="text-xs text-slate-400">Diproses oleh Xendit</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-8 border-t border-slate-800">
              <p className="text-slate-400 text-sm mb-1">Total Biaya</p>
              {event.pricing_type === 'FREE' ? (
                <div className="text-3xl font-bold text-green-400">Gratis</div>
              ) : (
                <div className="text-3xl font-bold">Rp {event.price.toLocaleString("id-ID")}</div>
              )}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-3/5 p-8 md:p-10 bg-white">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Formulir Pendaftaran</h1>
              <p className="text-slate-500 text-sm">Lengkapi data diri Anda di bawah ini. Pastikan email dan nomor WhatsApp aktif.</p>
            </div>
            
            <RegistrationForm eventId={event.id} isFree={event.pricing_type === 'FREE'} />
          </div>

        </div>
      </div>
    </main>
  );
}
