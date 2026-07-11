"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Bookmark } from "lucide-react";
import { Event } from "@/types/events";
import { useFavorites } from "@/hooks/useFavorites";

interface MobileUpcomingEventsProps {
  events: Event[];
  title?: string;
}

export default function MobileUpcomingEvents({ events, title = "Upcoming Events" }: MobileUpcomingEventsProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!events || events.length === 0) {
    return (
      <div className="px-4 py-8 text-center bg-white">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">{title}</h2>
        <p className="text-slate-500 text-sm">No events found matching your criteria.</p>
      </div>
    );
  }

  return (
    <section className="py-6 px-4 bg-white dark:bg-background min-h-[400px]">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
      </div>

      <div className="flex flex-col gap-4">
        {events.map((event) => {
          const isOnline = event.event_type === "ONLINE";
          const isFree = event.pricing_type === "FREE";
          const formattedDate = format(new Date(event.start_datetime), "dd MMM");
          const formattedTime = format(new Date(event.start_datetime), "HH:mm");
          
          const remainingSeats = event.quota > 0 ? event.quota - event.registered_count : null;
          const isSoldOut = event.quota > 0 && remainingSeats !== null && remainingSeats <= 0;

          return (
            <div 
              key={event.id}
              className="group flex gap-4 bg-white dark:bg-card p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors"
            >
              <div className="relative w-[84px] sm:w-[100px] h-[84px] sm:h-[100px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                {event.cover_image ? (
                  <Image
                    src={event.cover_image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-500 text-xs">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 py-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                    {formattedDate} • {formattedTime}
                  </span>
                  <button 
                    onClick={() => toggleFavorite(event.id)}
                    className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 -mt-1 -mr-1 p-1 transition-colors"
                  >
                    <Bookmark 
                      className={`w-4 h-4 ${isFavorite(event.id) ? 'fill-red-500 text-red-500 dark:text-red-500' : ''}`} 
                    />
                  </button>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                  <Link href={`/events/${event.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {event.title}
                  </Link>
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-auto mb-2 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {remainingSeats !== null ? (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isSoldOut ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        {isSoldOut ? 'Sold Out' : `${remainingSeats} left`}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Unlimited
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${isFree ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                      {isFree ? 'Free' : 'Paid'}
                    </span>
                  </div>

                  <Link 
                    href={`/events/${event.slug}`}
                    className="text-xs font-bold text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
