import React from "react";
import { getPublicEvents } from "@/app/actions/events";
import HeroSection from "@/components/events/HeroSection";
import EventSearchAndFilters from "@/components/events/EventSearchAndFilters";
import EventCard from "@/components/events/EventCard";
import EventEmptyState from "@/components/events/EventEmptyState";
import TrendingEvents from "@/components/events/TrendingEvents";
import CommunityBenefits from "@/components/events/CommunityBenefits";
import Testimonials from "@/components/events/Testimonials";
import SpeakersGrid from "@/components/events/SpeakersGrid";
import EventTimeline from "@/components/events/EventTimeline";
import Newsletter from "@/components/events/Newsletter";

export const dynamic = 'force-dynamic';

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

  // Statistics calculations
  const upcomingEvents = allEvents.filter(e => e.status === "Published" && new Date(e.start_datetime) >= new Date());

  // Featured Event (first published event marked as featured)
  const featuredEvent = upcomingEvents.find(e => e.is_featured);

  // Trending Events (dummy sort for demonstration)
  const trendingEvents = [...allEvents].filter(e => e.status === "Published").slice(0, 5);

  // Filtered Events for "All Events" section
  let filteredEvents = allEvents;

  if (search) {
    filteredEvents = filteredEvents.filter(
      e => e.title.toLowerCase().includes(search) || e.short_description.toLowerCase().includes(search)
    );
  }

  if (filter) {
    const now = new Date();
    switch (filter) {
      case "upcoming":
        filteredEvents = filteredEvents.filter(e => e.status === "Published" && new Date(e.start_datetime) >= now);
        break;
      case "completed":
        filteredEvents = filteredEvents.filter(e => e.status === "Completed" || new Date(e.start_datetime) < now);
        break;
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
      default:
        break;
    }
  }

  const isDefaultView = !search && (!filter || filter === "all");

  return (
    <main className="min-h-screen bg-white bg-noise relative z-0">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Search & Filters (Floating) */}
      <EventSearchAndFilters />

      {/* 3. Featured Event */}
      {isDefaultView && featuredEvent && (
        <div className="relative w-full bg-gradient-to-b from-[#F8FAFC]/50 to-white">
          <section className="pt-8 pb-4 md:pt-16 md:pb-8 max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <EventCard event={featuredEvent} featured={true} />
          </section>
        </div>
      )}

      {/* 4. Events Section (Upcoming or Search Results) */}
      <section id="events" className="pt-8 pb-16 md:py-16 w-full relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.15] pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            {isDefaultView ? "Upcoming Events" : "Search Results"}
          </h2>
          <p className="text-[#64748B] text-lg">
            {isDefaultView ? "Find the event that suits your interests." : `${filteredEvents.length} events found`}
          </p>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EventEmptyState />
        )}
        </div>
      </section>

      {/* 6. Trending Section */}
      {isDefaultView && (
        <TrendingEvents events={trendingEvents} />
      )}

      {/* 7. Community Benefits */}
      {isDefaultView && (
        <CommunityBenefits />
      )}

      {/* 8. Event Timeline */}
      {isDefaultView && (
        <EventTimeline />
      )}

      {/* 9. Testimonials */}
      {isDefaultView && (
        <Testimonials />
      )}

      {/* 10. Speakers */}
      {isDefaultView && (
        <SpeakersGrid />
      )}

      {/* 11. Newsletter */}
      <Newsletter />

    </main>
  );
}
