import React from "react";
import EventForm from "@/components/admin/events/EventForm";

export const dynamic = 'force-dynamic';

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Create New Event</h1>
      </div>
      
      <EventForm />
    </div>
  );
}
