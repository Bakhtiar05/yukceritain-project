import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Video, ArrowRight, CheckCircle2, Users, Star } from "lucide-react";
import { Event } from "@/types/events";
import ShareButton from "./ShareButton";

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const isOnline = event.event_type === "ONLINE";
  const isFree = event.pricing_type === "FREE";
  
  const eventDate = new Date(event.start_datetime);
  const formattedDate = format(eventDate, "dd MMM yyyy");
  const formattedTime = format(eventDate, "HH:mm");
  
  const remainingSeats = event.quota > 0 ? event.quota - event.registered_count : null;
  const isSoldOut = event.quota > 0 && remainingSeats !== null && remainingSeats <= 0;

  if (featured) {
    return (
      <div className="bg-white dark:bg-card rounded-[32px] overflow-hidden border border-[#E5E7EB] dark:border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row mb-12 group transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.1)] dark:hover:border-slate-700">
        <div className="relative w-full lg:w-[55%] aspect-square lg:aspect-auto overflow-hidden bg-slate-100 dark:bg-slate-800">
          {event.cover_image ? (
            <Image 
              src={event.cover_image} 
              alt={event.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-800">
              <span className="text-sm font-medium">No Image Available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="bg-[#2563EB]/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              FEATURED
            </span>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex gap-2">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-[12px] shadow-sm">
                {event.event_type}
              </span>
              <span className={`backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-[12px] shadow-sm ${isFree ? 'bg-emerald-500/80' : 'bg-[#60A5FA]/80'}`}>
                {isFree ? 'FREE' : 'PAID'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center bg-white dark:bg-card">
          <div className="flex items-center gap-3 mb-6">
             <div className="flex items-center gap-2 text-[#2563EB] dark:text-blue-400 bg-[#EFF6FF] dark:bg-blue-900/30 px-3 py-1.5 rounded-full text-sm font-semibold">
                <CalendarDays className="w-4 h-4" />
                <span>{formattedDate} • {formattedTime} WIB</span>
             </div>
             {remainingSeats !== null && (
               <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${isSoldOut ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-700'}`}>
                 {isSoldOut ? 'Sold Out' : `${remainingSeats} Seats Left`}
               </span>
             )}
          </div>
          
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] dark:text-white mb-4 leading-tight tracking-tight">
            {event.title}
          </h3>
          
          <p className="text-[#64748B] dark:text-slate-400 text-lg mb-8 line-clamp-3 leading-relaxed">
            {event.short_description}
          </p>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] dark:bg-blue-900/30 flex items-center justify-center text-[#2563EB] dark:text-blue-400 font-bold text-sm">
              {event.speaker?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A] dark:text-white">{event.speaker || 'YukCeritain Organizer'}</p>
              <p className="text-xs text-[#64748B] dark:text-slate-400">Event Speaker</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-10 text-sm font-medium text-[#0F172A] dark:text-slate-300">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#22C55E]" /> E-Certificate</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#22C55E]" /> Networking</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#22C55E]" /> Live Q&A Session</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#22C55E]" /> Session Recording</div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Link 
              href={`/events/${event.slug}/register`} 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-1 text-base"
            >
              Register Now
            </Link>
            <Link 
              href={`/events/${event.slug}`} 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[#BFDBFE] dark:border-blue-900/50 hover:border-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-full font-bold transition-all duration-300 hover:-translate-y-1 text-base"
            >
              Learn More
            </Link>
            <ShareButton title={event.title} slug={event.slug} />
          </div>
        </div>
      </div>
    );
  }

  // Standard Card
  return (
    <Link 
      href={`/events/${event.slug}`} 
      className="group bg-white dark:bg-card rounded-[24px] border border-[#E5E7EB] dark:border-border overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] hover:border-blue-100 dark:hover:border-slate-700 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F8FAFC] dark:bg-slate-800">
        {event.cover_image ? (
          <Image 
            src={event.cover_image} 
            alt={event.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-500 bg-slate-100 dark:bg-slate-800">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm text-[#0F172A] text-xs font-bold px-3 py-1.5 rounded-[10px] shadow-sm">
            {event.event_type}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-[10px] shadow-sm ${isFree ? 'bg-[#22C55E] text-white' : 'bg-[#2563EB] text-white'}`}>
            {isFree ? 'FREE' : 'PAID'}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-[#2563EB] dark:text-blue-400 text-xs font-semibold gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#64748B] dark:text-slate-400">
             {isOnline ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
             <span className="line-clamp-1 max-w-[100px]">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2 line-clamp-2 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors leading-tight">
          {event.title}
        </h3>
        
        <p className="text-[#64748B] dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
          {event.short_description}
        </p>

        <div className="flex flex-col gap-4 mt-auto">
          {/* Organizers and Avatars */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EFF6FF] dark:bg-blue-900/30 border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-[#2563EB] dark:text-blue-400 font-bold text-xs shadow-sm">
                {event.speaker?.charAt(0) || 'Y'}
              </div>
              <span className="text-sm font-semibold text-[#0F172A] dark:text-slate-300 line-clamp-1 max-w-[100px]">{event.speaker || 'Organizer'}</span>
            </div>
            
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-card bg-[#F8FAFC] dark:bg-slate-800 flex items-center justify-center">
                  <Users className="w-3 h-3 text-[#64748B] dark:text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F8FAFC] dark:border-border">
             {remainingSeats !== null && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-[8px] ${isSoldOut ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-[#EFF6FF] dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400'}`}>
                  {isSoldOut ? 'Sold Out' : `${remainingSeats} seats left`}
                </span>
             )}
            <div className="flex items-center gap-2 ml-auto">
              <ShareButton title={event.title} slug={event.slug} />
              <span className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 group-hover:-translate-y-1">
                Register <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
