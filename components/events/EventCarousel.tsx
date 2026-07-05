"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";
import { Event } from "@/types/events";

interface EventCarouselProps {
  events: Event[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth * 0.75; // Scroll by roughly one card width
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!events || events.length === 0) return null;

  return (
    <div className="relative group">
      {/* Scroll Buttons - Hidden on Mobile (since they can swipe), Visible on Desktop/Tablet if needed, or always visible. We'll show them on hover for desktop, and always visible for mobile if requested, but usually mobile users just swipe. The user specifically asked for "button swipe" so we'll show them on mobile too (or md:hidden if they meant indicators). Let's show small buttons on mobile too. */}
      
      <button 
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 bg-white/90 hover:bg-white text-slate-800 p-2 md:p-3 rounded-full shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus:opacity-100"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button 
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 bg-white/90 hover:bg-white text-slate-800 p-2 md:p-3 rounded-full shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus:opacity-100"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {events.map(event => (
          <div key={event.id} className="w-[75vw] sm:w-[280px] snap-center shrink-0 md:w-auto md:shrink md:snap-align-none h-full">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}
