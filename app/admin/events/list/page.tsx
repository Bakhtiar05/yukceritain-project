import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Filter, PenTool, Trash2, Eye } from "lucide-react";

import DeleteEventButton from "@/components/admin/events/DeleteEventButton";

export const dynamic = 'force-dynamic';

export default async function AdminEventsListPage() {
  const supabase = await createAdminClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">All Events</h1>
        <Link href="/admin/events/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-fit">
          + Create Event
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Event</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Schedule</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {events?.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{event.title}</div>
                    <div className="text-slate-500 text-xs flex gap-2 mt-1">
                      <span>{event.registered_count} / {event.quota === 0 ? 'Unlimited' : event.quota} seats</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 font-medium text-xs bg-slate-100 px-2 py-1 rounded">
                      {event.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {event.pricing_type === 'FREE' ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      <span className="text-slate-900">Rp {event.price.toLocaleString("id-ID")}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Published' ? 'bg-green-100 text-green-700' :
                      event.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {format(new Date(event.start_datetime), "dd MMM yyyy")}
                    <br />
                    <span className="text-xs">{format(new Date(event.start_datetime), "HH:mm")}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/events/${event.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/events/edit/${event.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <PenTool className="w-4 h-4" />
                      </Link>
                      <DeleteEventButton id={event.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!events || events.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No events found. Let's create one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
