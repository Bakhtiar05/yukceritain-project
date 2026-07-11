"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users, Bookmark, ArrowRight } from "lucide-react";
import { Event } from "@/types/events";
import { useFavorites } from "@/hooks/useFavorites";

interface MobileFeaturedEventsProps {
  events: Event[];
}

export default function MobileFeaturedEvents({ events }: MobileFeaturedEventsProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!events || events.length === 0) return null;

  return (
    <section className="py-6 bg-slate-50 dark:bg-background border-y border-slate-100 dark:border-slate-800">
      <div className="px-4 mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Featured Events</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Recommended for you</p>
        </div>
      </div>

      <div className="flex overflow-x-auto no-scrollbar px-4 pb-6 pt-2 -mt-2 gap-4 snap-x">
        {events.map((event) => {
          const isOnline = event.event_type === "ONLINE";
          const formattedDate = format(new Date(event.start_datetime), "dd MMM");
          const formattedTime = format(new Date(event.start_datetime), "HH:mm");
          
          return (
            <div 
              key={event.id}
              className="snap-start flex-shrink-0 w-[300px] sm:w-[340px] bg-white dark:bg-card rounded-[24px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-200"
            >
              <Link href={`/events/${event.slug}`} className="block">
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                  {event.cover_image ? (
                    <Image
                      src={event.cover_image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
                      No Image
                    </div>
                  )}
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(event.id);
                    }}
                    className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm text-slate-600 dark:text-slate-300 transition-colors hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Bookmark className={`w-4 h-4 ${isFavorite(event.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-semibold gap-2">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>{formattedDate} • {formattedTime}</span>
                    </div>
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Featured
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-2 leading-tight">
                    {event.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {event.short_description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{event.registered_count} joined</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
