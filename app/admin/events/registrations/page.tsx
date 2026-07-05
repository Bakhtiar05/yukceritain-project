import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { Search, Download, Eye } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: { event?: string };
}) {
  const supabase = await createAdminClient();
  const eventId = searchParams.event;

  let query = supabase.from("event_registrations").select("*, events(title, event_type, pricing_type)").order("created_at", { ascending: false });

  if (eventId) {
    query = query.eq("event_id", eventId);
  }

  const { data: registrations } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Registrations</h1>
        <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors w-fit flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search participant, email, or code..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Participant</th>
                <th className="px-6 py-3 font-medium">Event</th>
                <th className="px-6 py-3 font-medium">Reg Code</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Check-in</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {registrations?.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{reg.full_name}</div>
                    <div className="text-slate-500 text-xs">{reg.email}</div>
                    <div className="text-slate-500 text-xs">{reg.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {reg.events?.title}
                    <div className="text-xs text-slate-400">{reg.events?.event_type}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {reg.registration_code}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reg.payment_status === 'PAID' || reg.payment_status === 'FREE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reg.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {reg.checked_in_at ? (
                      <div>
                        <span className="text-green-600 font-medium text-xs">Yes</span>
                        <div className="text-slate-500 text-[10px] mt-1">{format(new Date(reg.checked_in_at), "dd MMM, HH:mm")}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!registrations || registrations.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No registrations found.
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
