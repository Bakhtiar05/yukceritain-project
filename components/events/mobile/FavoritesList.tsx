"use client";

import React from "react";
import { Event } from "@/types/events";
import { useFavorites } from "@/hooks/useFavorites";
import MobileUpcomingEvents from "@/components/events/mobile/MobileUpcomingEvents";

export default function FavoritesList({ allEvents }: { allEvents: Event[] }) {
  const { favorites, isLoaded } = useFavorites();

  if (!isLoaded) {
    return <div className="min-h-screen bg-white p-8 text-center text-slate-500">Loading...</div>;
  }

  const favoriteEvents = allEvents.filter(event => favorites.includes(event.id));

  return (
    <div className="min-h-screen bg-white pb-10">
      <MobileUpcomingEvents 
        events={favoriteEvents} 
        title="Your Favorited Events" 
      />
    </div>
  );
}
