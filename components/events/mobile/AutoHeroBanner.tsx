"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, MapPin, Share2, Handshake } from "lucide-react";
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
      <div className="relative w-full aspect-square sm:aspect-[16/10] md:aspect-[21/9] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-slate-100">
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

        {/* Top Bar (Pagination and Share) */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
          {/* Pagination Dots */}
          <div className="flex gap-1.5 pointer-events-auto">
            {events.length > 1 && events.map((_, idx) => (
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

          {/* Share Button */}
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: event.title,
                  text: event.short_description,
                  url: `${window.location.origin}/events/${event.slug}`,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/events/${event.slug}`);
                alert("Link copied to clipboard!");
              }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/30 transition-colors pointer-events-auto"
            aria-label="Share event"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Hero CTAs */}
      <div className="flex flex-row justify-center gap-3 mt-5 mb-2 px-4 w-full">
        <Link 
          href="/events/partner"
          className="flex-1 px-4 py-3 bg-white hover:bg-blue-50 border border-blue-600 text-blue-600 rounded-full font-medium transition-all duration-300 hover:scale-[0.98] active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm h-[44px]"
        >
          <Handshake className="w-4 h-4" />
          Partner
        </Link>
        <Link 
          href="#all-events"
          className="flex-1 px-4 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm h-[44px]"
        >
          Explore
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
