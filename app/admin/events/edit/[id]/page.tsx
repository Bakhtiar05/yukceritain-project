import React from "react";
import EventForm from "@/components/admin/events/EventForm";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const supabase = await createAdminClient();
  
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!event) {
    notFound();
  }

  // Format dates for the datetime-local input (YYYY-MM-DDThh:mm)
  const formatForInput = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
  };

  const initialData = {
    ...event,
    start_datetime: formatForInput(event.start_datetime),
    end_datetime: formatForInput(event.end_datetime),
    registration_deadline: formatForInput(event.registration_deadline),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Edit Event: {event.title}</h1>
      </div>
      
      <EventForm initialData={initialData} />
    </div>
  );
}
