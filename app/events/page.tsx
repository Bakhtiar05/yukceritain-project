import React from "react";
import { getPublicEvents } from "@/app/actions/events";
import CompactIntro from "@/components/events/CompactIntro";
import EventSearchAndFilters from "@/components/events/EventSearchAndFilters";
import CommunityInsights from "@/components/events/CommunityInsights";
import EventCard from "@/components/events/EventCard";
import EventCarousel from "@/components/events/EventCarousel";
import EventEmptyState from "@/components/events/EventEmptyState";
import FooterCTA from "@/components/events/FooterCTA";

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
  const completedEvents = allEvents.filter(e => e.status === "Completed" || new Date(e.start_datetime) < new Date());
  const participantsCount = allEvents.reduce((acc, cur) => acc + cur.registered_count, 0) + 1200; // adding base number for realism
  const speakersCount = new Set(allEvents.map(e => e.speaker).filter(Boolean)).size + 45; // adding base number

  // Featured Event (first published event marked as featured)
  const featuredEvent = upcomingEvents.find(e => e.is_featured);

  // Top 3 Upcoming Events (excluding featured if any)
  const topUpcoming = upcomingEvents
    .filter(e => e.id !== featuredEvent?.id)
    .slice(0, 3);

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
      default:
        break;
    }
  }

  // Hide featured & top upcoming if the user is actively searching or filtering specific things (optional, but cleaner)
  const isDefaultView = !search && (!filter || filter === "all");

  return (
    <main className="min-h-screen bg-slate-50/50">
      
      {/* 1. Compact Intro */}
      <CompactIntro />

      {/* 2. Search Area */}
      <EventSearchAndFilters />

      {/* 3. Community Insights */}
      {isDefaultView && (
        <CommunityInsights 
          upcomingCount={upcomingEvents.length}
          completedCount={completedEvents.length}
          participantsCount={participantsCount}
          speakersCount={speakersCount}
        />
      )}

      {/* 4. Featured Event */}
      {isDefaultView && featuredEvent && (
        <section className="pt-16 pb-8 max-w-7xl mx-auto px-4 md:px-8">
          <EventCard event={featuredEvent} featured={true} />
        </section>
      )}

      {/* 5. Upcoming Events (Top 3) */}
      {isDefaultView && topUpcoming.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Upcoming Events</h2>
            <p className="text-slate-500 text-lg">Don't miss out on our most anticipated sessions.</p>
          </div>
          <EventCarousel events={topUpcoming} />
        </section>
      )}

      {/* 6. Browse All Events (Filtered view) */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10 flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {isDefaultView ? "All Events" : "Search Results"}
          </h2>
          <span className="text-slate-500 font-medium">{filteredEvents.length} events found</span>
        </div>

        {filteredEvents.length > 0 ? (
          <EventCarousel events={filteredEvents} />
        ) : (
          <EventEmptyState />
        )}
      </section>

      {/* 9. Footer CTA */}
      <FooterCTA />

    </main>
  );
}
