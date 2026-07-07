import React from "react";
import { getEventBySlug, getPublicEvents } from "@/app/actions/events";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Video, Clock, Users, ArrowLeft, ArrowRight, UserRound, HelpCircle } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { EventJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export async function generateStaticParams() {
  const events = await getPublicEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: 'Event Tidak Ditemukan' };

  return {
    title: event.title,
    description: event.short_description || undefined,
    openGraph: {
      title: event.title,
      description: event.short_description || undefined,
      images: event.cover_image ? [{ url: event.cover_image }] : undefined,
      type: 'website',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.short_description || undefined,
      images: event.cover_image ? [event.cover_image] : undefined,
    },
  };
}

export default async function EventDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  // Fetch related events (same category/type or just upcoming)
  const allEvents = await getPublicEvents();
  const relatedEvents = allEvents
    .filter(e => e.id !== event.id && e.status === "Published" && new Date(e.start_datetime) >= new Date())
    .slice(0, 3);

  const isRegistrationOpen = event.status === "Published" && new Date(event.registration_deadline) > new Date();
  const remainingSeats = event.quota > 0 ? event.quota - event.registered_count : null;
  const isFull = event.quota > 0 && remainingSeats !== null && remainingSeats <= 0;
  const isFree = event.pricing_type === "FREE";
  
  const eventDate = new Date(event.start_datetime);
  const formattedDate = format(eventDate, "EEEE, dd MMMM yyyy");
  const formattedTime = format(eventDate, "HH:mm");
  const endTime = format(new Date(event.end_datetime), "HH:mm");

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      {/* 1. Cover Image Section */}
      <div className="w-full h-[40vh] md:h-[50vh] bg-slate-900 relative">
        {event.cover_image ? (
          <>
            <Image src={event.cover_image} alt={event.title} fill className="object-cover opacity-60" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-32 relative z-20 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Main Content Column */}
        <div className="flex-1 w-full space-y-8">
          
          <Breadcrumbs 
            items={[
              { name: 'Beranda', url: '/' },
              { name: 'Events', url: '/events' },
              { name: event.title, url: `/events/${event.slug}` }
            ]} 
            className="text-white/80" 
          />

          <EventJsonLd event={event} />

          {/* 2. Event Summary Card */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                {event.event_type}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {isFree ? 'FREE ENTRY' : 'PAID EVENT'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              {event.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              {event.short_description}
            </p>
          </div>

          {/* 3. Event Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 items-start shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Date & Time</h3>
                <p className="text-slate-600 text-sm">{formattedDate}</p>
                <p className="text-slate-500 text-sm">{formattedTime} - {endTime} WIB</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 items-start shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                {event.event_type === 'ONLINE' ? <Video className="w-6 h-6 text-purple-500" /> : <MapPin className="w-6 h-6 text-purple-500" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{event.event_type === 'ONLINE' ? 'Platform' : 'Location'}</h3>
                <p className="text-slate-600 text-sm">{event.event_type === 'ONLINE' ? event.meeting_platform || 'Online Meeting' : event.venue_name || 'Location TBA'}</p>
                {event.event_type === 'OFFLINE' && event.venue_address && (
                  <p className="text-slate-500 text-sm line-clamp-1 mt-1">{event.venue_address}</p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Speaker Section */}
          {event.speaker && (
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Meet the Speaker</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <UserRound className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{event.speaker}</h4>
                  <p className="text-slate-500">Expert Speaker</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. About the Event */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">About this Event</h3>
            <div className="prose prose-slate prose-lg max-w-none prose-p:leading-relaxed prose-p:text-slate-600">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
          
          {/* 6. FAQ (Registration Info) */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-slate-400" />
              Good to Know
            </h3>
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-900 mb-2">Registration Deadline</h4>
                <p className="text-slate-600">{format(new Date(event.registration_deadline), "EEEE, dd MMMM yyyy HH:mm")} WIB</p>
              </div>
              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-900 mb-2">Organizer</h4>
                <p className="text-slate-600">{event.organizer || "YukceritaIN Community"}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">How to access</h4>
                <p className="text-slate-600">You will receive a confirmation email with a unique QR code and necessary access links once your registration is successful.</p>
              </div>
            </div>
          </div>

        </div>

        {/* 7. Sticky Registration Card (Desktop) */}
        <div className="hidden lg:block w-[400px] flex-shrink-0 sticky top-24">
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col">
            <div className="mb-6 pb-6 border-b border-slate-100">
              <span className="text-slate-500 font-medium block mb-2">Ticket Price</span>
              {isFree ? (
                <div className="text-4xl font-bold text-emerald-500">Free</div>
              ) : (
                <div className="text-4xl font-bold text-slate-900">
                  <span className="text-2xl text-slate-400 mr-1">Rp</span>
                  {event.price.toLocaleString("id-ID")}
                </div>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-0.5">Tanggal</p>
                  <p className="font-semibold text-slate-900">{format(new Date(event.start_datetime), "EEEE, dd MMMM yyyy")}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-0.5">Waktu</p>
                  <p className="font-semibold text-slate-900">{format(new Date(event.start_datetime), "HH:mm")} - {format(new Date(event.end_datetime), "HH:mm")} WIB</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  {event.event_type === 'ONLINE' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-0.5">Lokasi ({event.event_type})</p>
                  <p className="font-semibold text-slate-900">
                    {event.event_type === 'ONLINE' ? (event.meeting_platform || 'Online Platform') : (event.venue_name || 'TBA')}
                  </p>
                  {event.event_type === 'OFFLINE' && event.venue_address && (
                    <p className="text-sm text-slate-500 mt-0.5">{event.venue_address}</p>
                  )}
                </div>
              </div>
              
              {event.speaker && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium mb-0.5">Pembicara</p>
                    <p className="font-semibold text-slate-900">{event.speaker}</p>
                  </div>
                </div>
              )}
            </div>

            {isRegistrationOpen && !isFull ? (
              <Link href={`/events/${event.slug}/register`} className="block w-full py-4 px-6 text-center text-white bg-blue-600 font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                Daftar Sekarang
              </Link>
            ) : (
              <button disabled className="w-full py-4 px-6 text-center text-slate-500 bg-slate-100 font-bold rounded-xl cursor-not-allowed">
                {isFull ? "Kuota Penuh" : "Pendaftaran Ditutup"}
              </button>
            )}
            
            {isRegistrationOpen && (
              <p className="text-center text-xs text-slate-500 mt-4">
                Ditutup pada {format(new Date(event.registration_deadline), "dd MMM yyyy, HH:mm")}
              </p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <p className="text-sm text-slate-600 font-medium mb-3">Bagikan Acara Ini</p>
            <div className="flex justify-center gap-3">
               <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
               </button>
               <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-sky-100 hover:text-sky-500 transition-colors">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
               </button>
               <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-green-100 hover:text-green-600 transition-colors">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
               </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 8. Related Events */}
      {relatedEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-900">You might also like</h2>
            <Link href="/events" className="text-blue-600 font-semibold hover:text-blue-700 hidden sm:block">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedEvents.map(related => (
              <EventCard key={related.id} event={related} />
            ))}
          </div>
        </section>
      )}

      {/* 9. Mobile Sticky Bottom Registration */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_20px_rgb(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-xs text-slate-500 font-medium mb-0.5">Ticket Price</p>
            {isFree ? (
              <p className="text-xl font-bold text-emerald-500">Free</p>
            ) : (
              <p className="text-xl font-bold text-slate-900"><span className="text-sm mr-1">Rp</span>{event.price.toLocaleString("id-ID")}</p>
            )}
          </div>
          {isRegistrationOpen && !isFull ? (
            <Link
              href={`/events/${event.slug}/register`}
              className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl font-bold transition-colors"
            >
              Register
            </Link>
          ) : (
            <button disabled className="flex-1 max-w-[200px] py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed text-sm">
              {!isRegistrationOpen ? "Closed" : "Sold Out"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
