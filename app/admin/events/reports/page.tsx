import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminEventsReportsPage() {
  const supabase = await createAdminClient();

  const { data: events } = await supabase.from("events").select("id, title, registered_count, quota, price, pricing_type");
  const { data: payments } = await supabase.from("event_payments").select("amount").eq("payment_status", "PAID");

  const totalRevenue = payments?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  
  // Calculate top events by registration
  const topEvents = events?.sort((a, b) => b.registered_count - a.registered_count).slice(0, 5) || [];
  
  // Overall attendance rate (registered vs quota, only for events with quota)
  const eventsWithQuota = events?.filter(e => e.quota > 0) || [];
  const totalQuota = eventsWithQuota.reduce((acc, curr) => acc + curr.quota, 0);
  const totalRegForQuotaEvents = eventsWithQuota.reduce((acc, curr) => acc + curr.registered_count, 0);
  const fillRate = totalQuota > 0 ? Math.round((totalRegForQuotaEvents / totalQuota) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Event Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString("id-ID")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Average Fill Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fillRate}%</div>
            <p className="text-xs text-slate-500">For events with quota limits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.reduce((acc, curr) => acc + curr.registered_count, 0) || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Top Events by Registration</h2>
        </div>
        <div className="p-6 space-y-4">
          {topEvents.map((event, index) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{event.title}</h4>
                  <p className="text-sm text-slate-500">{event.pricing_type} Event</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">{event.registered_count} <span className="text-sm font-normal text-slate-500">registered</span></div>
                {event.quota > 0 && <div className="text-xs text-slate-500">of {event.quota} quota</div>}
              </div>
            </div>
          ))}
          {topEvents.length === 0 && (
            <p className="text-center text-slate-500 py-4">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
