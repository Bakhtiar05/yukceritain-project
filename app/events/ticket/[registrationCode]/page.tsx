import React from "react";
import { getRegistrationByCode } from "@/app/actions/events";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Video, Clock, CheckCircle2, QrCode as QrCodeIcon, ChevronLeft } from "lucide-react";
import TicketActions from "@/components/events/TicketActions";

export const dynamic = 'force-dynamic';

export default async function TicketPage(props: { params: Promise<{ registrationCode: string }> }) {
  const params = await props.params;
  const regCode = params.registrationCode;
  const registration = await getRegistrationByCode(regCode);

  if (!registration || !registration.events) {
    notFound();
  }

  const event = registration.events;

  // We should only show the ticket if payment is PAID or FREE
  const isPaidOrFree = registration.payment_status === "PAID" || registration.payment_status === "FREE";

  return (
    <main className="min-h-screen bg-slate-100 py-12 md:py-20 flex items-center justify-center font-sans">
      <div className="max-w-3xl w-full px-4">
        
        <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-medium">
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Detail Acara
        </Link>
        
        {isPaidOrFree ? (
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative">
            {/* Top Colored Section */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
              <h1 className="relative z-10 text-white font-bold tracking-[0.2em] text-sm md:text-base bg-black/20 px-6 py-2 rounded-full border border-white/20 backdrop-blur-sm shadow-inner uppercase">
                YUKCERITAIN E-TICKET
              </h1>
            </div>

            {/* Cutouts */}
            <div className="absolute top-32 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full z-20 shadow-inner" />
            <div className="absolute top-32 right-0 translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full z-20 shadow-inner" />
            
            {/* Dashed line */}
            <div className="absolute top-32 left-8 right-8 h-px border-t-2 border-dashed border-slate-200 z-10" />

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
              
              {/* Event Info */}
              <div className="flex-1 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {event.event_type}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-2">{event.title}</h2>
                  <p className="text-slate-500 font-medium">Participant: <span className="text-slate-900">{registration.full_name}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Date</p>
                    <p className="font-semibold text-slate-900">{format(new Date(event.start_datetime), "dd MMM yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                    <p className="font-semibold text-slate-900">{format(new Date(event.start_datetime), "HH:mm")} WIB</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Location</p>
                    <p className="font-semibold text-slate-900">
                      {event.event_type === 'ONLINE' ? (event.meeting_platform || 'Online Meeting') : (event.venue_name || 'TBA')}
                    </p>
                  </div>
                </div>

                <TicketActions 
                  eventTitle={event.title}
                  eventDescription={event.short_description}
                  startDate={event.start_datetime}
                  endDate={event.end_datetime}
                  location={event.event_type === "ONLINE" ? (event.meeting_platform || "Online") : (event.venue_name || "TBA")}
                />
              </div>

              {/* QR Code Section */}
              <div className="w-full md:w-64 flex flex-col items-center justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-8 md:pt-0 md:pl-12">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4 text-center">Scan at Entrance</p>
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 mb-6 relative group cursor-pointer">
                   {/* In a real app, generate actual QR image. Here we use a placeholder or lucide icon */}
                   <div className="w-40 h-40 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-100 group-hover:bg-slate-100 transition-colors">
                      <QrCodeIcon className="w-24 h-24 text-slate-900" />
                   </div>
                   
                   {/* Mock corner markers for style */}
                   <div className="absolute top-3 left-3 w-4 h-4 border-t-4 border-l-4 border-blue-600 rounded-tl" />
                   <div className="absolute top-3 right-3 w-4 h-4 border-t-4 border-r-4 border-blue-600 rounded-tr" />
                   <div className="absolute bottom-3 left-3 w-4 h-4 border-b-4 border-l-4 border-blue-600 rounded-bl" />
                   <div className="absolute bottom-3 right-3 w-4 h-4 border-b-4 border-r-4 border-blue-600 rounded-br" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Registration Code</p>
                  <p className="font-mono font-bold text-lg text-slate-900 tracking-widest">{registration.registration_code}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-xl">
             <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-yellow-600" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Menunggu Pembayaran</h2>
             <p className="text-slate-500 mb-8 max-w-md mx-auto">
               Tiket Anda akan diterbitkan setelah pembayaran berhasil dikonfirmasi. Jika Anda sudah membayar, harap tunggu beberapa saat.
             </p>
             <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">
               Refresh Halaman
             </button>
          </div>
        )}
      </div>
    </main>
  );
}
