"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users, Bookmark, ArrowRight } from "lucide-react";
import { Event } from "@/types/events";

interface MobileFeaturedEventsProps {
  events: Event[];
}

export default function MobileFeaturedEvents({ events }: MobileFeaturedEventsProps) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-6 bg-slate-50 border-y border-slate-100">
      <div className="px-4 mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Featured Events</h2>
          <p className="text-sm text-slate-500 mt-0.5">Recommended for you</p>
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
              className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-200"
            >
              <Link href={`/events/${event.slug}`} className="block">
                <div className="relative aspect-[4/3] bg-slate-100">
                  {event.cover_image ? (
                    <Image
                      src={event.cover_image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                      No Image
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-sm text-blue-600 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                      Featured
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm shadow-sm text-slate-600">
                    <Bookmark className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center text-blue-600 text-xs font-semibold gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>{formattedDate} • {formattedTime}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5 line-clamp-2 leading-tight">
                    {event.title}
                  </h3>
                  
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {event.short_description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-3 border-t border-slate-100">
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
