import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Video, ArrowRight } from "lucide-react";
import { Event } from "@/types/events";

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const isOnline = event.event_type === "ONLINE";
  const isFree = event.pricing_type === "FREE";
  
  // Format the date properly
  const eventDate = new Date(event.start_datetime);
  const formattedDate = format(eventDate, "dd MMM yyyy");
  const formattedTime = format(eventDate, "HH:mm");
  
  // Calculate remaining seats
  const remainingSeats = event.quota > 0 ? event.quota - event.registered_count : null;
  const isSoldOut = event.quota > 0 && remainingSeats !== null && remainingSeats <= 0;

  if (featured) {
    return (
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row mb-12 transition-transform hover:-translate-y-1 duration-300">
        <div className="relative w-full md:w-5/12 aspect-[16/9] md:aspect-auto bg-slate-100">
          {event.cover_image ? (
            <Image 
              src={event.cover_image} 
              alt={event.title} 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="text-sm font-medium">No Image Available</span>
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {event.event_type}
            </span>
          </div>
        </div>
        <div className="p-6 md:p-10 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              {isFree ? 'FREE' : 'PAID'}
            </span>
            {remainingSeats !== null && (
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${isSoldOut ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                {isSoldOut ? 'Sold Out' : `${remainingSeats} seats left`}
              </span>
            )}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
            {event.title}
          </h3>
          
          <p className="text-slate-600 mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {event.short_description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">{formattedDate}</p>
                <p className="text-sm text-slate-500">{formattedTime} WIB</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              {isOnline ? (
                <Video className="w-5 h-5 text-slate-400 mt-0.5" />
              ) : (
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900 line-clamp-1">{isOnline ? event.meeting_platform || 'Online Meeting' : event.venue_name || 'Location TBA'}</p>
                <p className="text-sm text-slate-500">{isOnline ? 'Link provided after registration' : 'Offline Event'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Link 
              href={`/events/${event.slug}/register`} 
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Register Now
            </Link>
            <Link 
              href={`/events/${event.slug}`} 
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Standard Card
  return (
    <Link 
      href={`/events/${event.slug}`} 
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[16/9] md:aspect-[4/3] overflow-hidden bg-slate-100">
        {event.cover_image ? (
          <Image 
            src={event.cover_image} 
            alt={event.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm">
            {event.event_type}
          </span>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm ${isFree ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
            {isFree ? 'FREE' : 'PAID'}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col">
        <div className="flex items-center text-slate-500 text-xs font-medium gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {event.title}
        </h3>
        
        <p className="text-slate-500 text-xs md:text-sm mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed flex-1">
          {event.short_description}
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
          <div className="flex flex-col gap-1">
             <div className="flex items-center text-slate-600 text-xs font-medium gap-1.5">
                {isOnline ? <Video className="w-3.5 h-3.5 text-slate-400" /> : <MapPin className="w-3.5 h-3.5 text-slate-400" />}
                <span className="line-clamp-1 max-w-[120px]">{isOnline ? event.meeting_platform || 'Online' : event.venue_name || 'TBA'}</span>
             </div>
             {remainingSeats !== null && (
                <span className={`text-[10px] font-medium ${isSoldOut ? 'text-red-500' : 'text-slate-400'}`}>
                  {isSoldOut ? 'Sold Out' : `${remainingSeats} seats left`}
                </span>
             )}
          </div>
          <span className="inline-flex items-center justify-center p-2 rounded-full bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
