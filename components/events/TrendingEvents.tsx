"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { TrendingUp, Flame, Star, Zap } from "lucide-react";
import { Event } from "@/types/events";

interface TrendingEventsProps {
  events: Event[];
}

export default function TrendingEvents({ events }: TrendingEventsProps) {
  if (!events || events.length === 0) return null;

  const badges = [
    { label: "Trending", icon: TrendingUp, color: "bg-blue-100 text-blue-700" },
    { label: "Hot", icon: Flame, color: "bg-red-100 text-red-700" },
    { label: "Editor's Pick", icon: Star, color: "bg-amber-100 text-amber-700" },
    { label: "New", icon: Zap, color: "bg-emerald-100 text-emerald-700" }
  ];

  return (
    <section className="py-16 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">Trending This Month</h2>
          <p className="text-[#64748B] text-lg">Explore the most popular events in our community.</p>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 snap-x snap-mandatory">
          {events.slice(0, 5).map((event, index) => {
            const badge = badges[index % badges.length];
            const eventDate = new Date(event.start_datetime);
            
            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="snap-start shrink-0 w-[300px] sm:w-[350px] group bg-white rounded-[24px] border border-[#E5E7EB] overflow-hidden shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] hover:border-blue-100 hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {event.cover_image ? (
                     <Image 
                       src={event.cover_image} 
                       alt={event.title} 
                       fill 
                       className="object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-medium">No Image</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md bg-white/90 ${badge.color.split(' ')[1]}`}>
                      <badge.icon className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-bold text-[#2563EB] mb-2">{format(eventDate, "dd MMM yyyy")}</div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 line-clamp-2 group-hover:text-[#2563EB] transition-colors leading-tight">{event.title}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#F8FAFC]">
                    <span className="text-sm font-semibold text-[#64748B]">{event.pricing_type === 'FREE' ? 'Free' : 'Paid'}</span>
                    <span className="text-[#2563EB] font-medium text-sm group-hover:underline">View Event</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
