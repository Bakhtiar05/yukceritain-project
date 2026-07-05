"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormValues } from "@/lib/validations/events";
import { createEvent, updateEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface EventFormProps {
  initialData?: any; // To be typed properly later
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: initialData || {
      title: "",
      slug: "",
      description: "",
      short_description: "",
      cover_image: "",
      event_type: "ONLINE",
      pricing_type: "FREE",
      price: 0,
      currency: "IDR",
      speaker: "",
      organizer: "YukceritaIN",
      venue_name: "",
      venue_address: "",
      google_maps_url: "",
      meeting_platform: "",
      meeting_link: "",
      start_datetime: "",
      end_datetime: "",
      registration_deadline: "",
      quota: 0,
      waiting_list_enabled: false,
      status: "Draft",
      is_featured: false,
    },
  });

  const pricingType = form.watch("pricing_type");
  const eventType = form.watch("event_type");

  async function onSubmit(data: EventFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      if (initialData?.id) {
        const res = await updateEvent(initialData.id, data);
        if (res.error) throw new Error(res.error);
      } else {
        const res = await createEvent(data);
        if (res.error) throw new Error(res.error);
      }
      router.push("/admin/events/list");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Simplified form for generation - in production use Shadcn UI components properly.
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-xl border border-slate-200">
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input {...form.register("title")} className="w-full border rounded-lg p-2" placeholder="Event Title" />
              {form.formState.errors.title && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input {...form.register("slug")} className="w-full border rounded-lg p-2" placeholder="event-slug" />
              {form.formState.errors.slug && <p className="text-red-500 text-xs mt-1">{form.formState.errors.slug.message}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <input {...form.register("short_description")} className="w-full border rounded-lg p-2" />
            {form.formState.errors.short_description && <p className="text-red-500 text-xs mt-1">{form.formState.errors.short_description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Description</label>
            <textarea {...form.register("description")} className="w-full border rounded-lg p-2 h-32" />
            {form.formState.errors.description && <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
            <input {...form.register("cover_image")} className="w-full border rounded-lg p-2" />
            {form.formState.errors.cover_image && <p className="text-red-500 text-xs mt-1">{form.formState.errors.cover_image.message}</p>}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Schedule</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date & Time</label>
            <input type="datetime-local" {...form.register("start_datetime")} className="w-full border rounded-lg p-2" />
            {form.formState.errors.start_datetime && <p className="text-red-500 text-xs mt-1">{form.formState.errors.start_datetime.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date & Time</label>
            <input type="datetime-local" {...form.register("end_datetime")} className="w-full border rounded-lg p-2" />
            {form.formState.errors.end_datetime && <p className="text-red-500 text-xs mt-1">{form.formState.errors.end_datetime.message}</p>}
          </div>
        </div>

        {/* Location & Type */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Location & Type</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Event Type</label>
            <select {...form.register("event_type")} className="w-full border rounded-lg p-2">
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>

          {eventType === "ONLINE" ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Platform</label>
                <input {...form.register("meeting_platform")} className="w-full border rounded-lg p-2" placeholder="Zoom, Google Meet" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Link</label>
                <input {...form.register("meeting_link")} className="w-full border rounded-lg p-2" placeholder="https://..." />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Venue Name</label>
                <input {...form.register("venue_name")} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Venue Address</label>
                <input {...form.register("venue_address")} className="w-full border rounded-lg p-2" />
              </div>
            </>
          )}
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Pricing</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Pricing Type</label>
            <select {...form.register("pricing_type")} className="w-full border rounded-lg p-2">
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {pricingType === "PAID" && (
            <div>
              <label className="block text-sm font-medium mb-1">Price (IDR)</label>
              <input type="number" {...form.register("price")} className="w-full border rounded-lg p-2" />
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Settings</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Quota (0 for unlimited)</label>
            <input type="number" {...form.register("quota")} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Registration Deadline</label>
            <input type="datetime-local" {...form.register("registration_deadline")} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select {...form.register("status")} className="w-full border rounded-lg p-2">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Closed">Closed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...form.register("is_featured")} id="is_featured" />
            <label htmlFor="is_featured" className="text-sm font-medium">Is Featured</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 mr-2"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {initialData ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
