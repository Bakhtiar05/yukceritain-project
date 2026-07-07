import React from "react";
import { getPublicEvents } from "@/app/actions/events";
import { Metadata } from "next";
import Navbar from '@/components/layout/Navbar';
import MobileHeader from "@/components/events/mobile/MobileHeader";
import FavoritesList from "@/components/events/mobile/FavoritesList";

export const metadata: Metadata = {
  title: 'Favorited Events',
  description: 'Your favorited events on YukceritaIN.',
};

export const revalidate = 3600;

export default async function FavoritesPage() {
  const allEvents = await getPublicEvents();

  return (
    <main className="min-h-screen bg-white relative pb-10">
      <Navbar hideOnDesktop={true} />
      <MobileHeader title="Favorited Events" backUrl="/events" />
      
      <div className="max-w-md mx-auto w-full md:max-w-2xl lg:max-w-4xl relative">
        <FavoritesList allEvents={allEvents} />
      </div>
    </main>
  );
}
