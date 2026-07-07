import React from "react";
import { getPublicEvents } from "@/app/actions/events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Events',
  description: 'Temukan berbagai event, webinar, dan workshop seputar kesehatan mental dari YukceritaIN.',
  openGraph: {
    title: 'Events | YukceritaIN',
    description: 'Temukan berbagai event, webinar, dan workshop seputar kesehatan mental dari YukceritaIN.',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events | YukceritaIN',
    description: 'Temukan berbagai event, webinar, dan workshop seputar kesehatan mental dari YukceritaIN.',
  },
};

import MobileHeader from "@/components/events/mobile/MobileHeader";
import Navbar from '@/components/layout/Navbar';
import MobileSearchBar from "@/components/events/mobile/MobileSearchBar";
import AutoHeroBanner from "@/components/events/mobile/AutoHeroBanner";
import CategoryFilter from "@/components/events/mobile/CategoryFilter";
import MobileFeaturedEvents from "@/components/events/mobile/MobileFeaturedEvents";
import MobileUpcomingEvents from "@/components/events/mobile/MobileUpcomingEvents";
import QuickStats from "@/components/events/mobile/QuickStats";
import WhyJoin from "@/components/events/mobile/WhyJoin";

export const revalidate = 3600;

export default async function PublicEventsPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  // Await searchParams in Next.js 15
  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search.toLowerCase() : "";
  const filter = typeof searchParams?.filter === 'string' ? searchParams.filter : "all";

  const allEvents = await getPublicEvents();

  const upcomingEvents = allEvents.filter(e => e.status === "Published" && new Date(e.start_datetime) >= new Date());

  // Featured Events for banners and featured section
  const featuredEvents = upcomingEvents.filter(e => e.is_featured);

  // Filtered Events for "Upcoming Events" or Search Results
  let filteredEvents = upcomingEvents;

  if (search) {
    filteredEvents = filteredEvents.filter(
      e => e.title.toLowerCase().includes(search) || e.short_description.toLowerCase().includes(search)
    );
  }

  if (filter && filter !== "all") {
    const now = new Date();
    switch (filter) {
      case "online":
        filteredEvents = filteredEvents.filter(e => e.event_type === "ONLINE");
        break;
      case "offline":
        filteredEvents = filteredEvents.filter(e => e.event_type === "OFFLINE");
        break;
      case "free":
        filteredEvents = filteredEvents.filter(e => e.pricing_type === "FREE");
        break;
      case "paid":
        filteredEvents = filteredEvents.filter(e => e.pricing_type === "PAID");
        break;
      case "workshop":
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes("workshop") || e.short_description.toLowerCase().includes("workshop"));
        break;
      case "webinar":
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes("webinar") || e.short_description.toLowerCase().includes("webinar"));
        break;
      case "community":
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes("community") || e.short_description.toLowerCase().includes("community"));
        break;
      case "mental":
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes("mental") || e.short_description.toLowerCase().includes("mental"));
        break;
      case "meetup":
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes("meetup") || e.short_description.toLowerCase().includes("meetup"));
        break;
      case "support":
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes("support") || e.short_description.toLowerCase().includes("support"));
        break;
      case "career":
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes("career") || e.short_description.toLowerCase().includes("career"));
        break;
      default:
        break;
    }
  }

  const isDefaultView = !search && (!filter || filter === "all");

  return (
    <main className="min-h-screen bg-white relative pb-10">
      <Navbar hideOnDesktop={true} />
      <MobileHeader />
      
      <div className="max-w-md mx-auto w-full md:max-w-2xl lg:max-w-4xl relative">
        <MobileSearchBar />
        
        {isDefaultView && featuredEvents.length > 0 && (
          <AutoHeroBanner events={featuredEvents} />
        )}

        <div id="all-events" className="scroll-mt-24 pt-2">
          <CategoryFilter />
        </div>

        {isDefaultView && featuredEvents.length > 0 && (
          <MobileFeaturedEvents events={featuredEvents} />
        )}

        <MobileUpcomingEvents 
          events={filteredEvents} 
          title={search ? `Search Results (${filteredEvents.length})` : "Upcoming Events"}
        />

        {isDefaultView && (
          <>
            <QuickStats />
            <WhyJoin />
          </>
        )}
      </div>
    </main>
  );
}
