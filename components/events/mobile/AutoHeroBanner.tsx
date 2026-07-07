"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Event } from "@/types/events";

interface AutoHeroBannerProps {
  events: Event[];
}

export default function AutoHeroBanner({ events }: AutoHeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [events.length]);

  if (!events || events.length === 0) return null;

  const event = events[currentIndex];
  const isOnline = event.event_type === "ONLINE";
  const formattedDate = format(new Date(event.start_datetime), "MMM dd");

  return (
    <div className="px-4 py-2 w-full">
      <div className="relative w-full aspect-[4/5] sm:aspect-video md:aspect-[21/9] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-slate-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {event.cover_image ? (
              <Image
                src={event.cover_image}
                alt={event.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200">
                <span className="text-slate-400 font-medium">No Image</span>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
            
            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex flex-col justify-end text-white">
              <div className="flex gap-2 mb-3">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  Featured
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {event.pricing_type === "FREE" ? "Free" : "Paid"}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight line-clamp-2 drop-shadow-sm">
                {event.title}
              </h2>
              
              <div className="flex items-center gap-4 text-xs md:text-sm text-white/90 mb-4 drop-shadow-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-blue-300" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-300" />
                  <span>{isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>
              
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex items-center justify-between w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-xl font-bold transition-all text-sm md:text-base group"
              >
                <span>Join Now</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        {events.length > 1 && (
          <div className="absolute top-4 right-4 flex gap-1.5 z-10">
            {events.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Small Hero CTA - Extracted out per instruction, but it's often placed right below */}
      <div className="flex justify-center mt-5 mb-2 px-2">
        <Link 
          href="#all-events"
          className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm max-w-[280px] w-full"
        >
          Explore All Events
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
