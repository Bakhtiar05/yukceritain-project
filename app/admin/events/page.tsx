import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UsersRound, CreditCard, Tent } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminEventsDashboard() {
  const supabase = await createAdminClient();

  const { data: events } = await supabase.from("events").select("*");
  const { data: registrations } = await supabase.from("event_registrations").select("*, events(title, pricing_type)");
  const { data: payments } = await supabase.from("event_payments").select("*").eq("payment_status", "PAID");

  const totalEvents = events?.length || 0;
  const upcomingEvents = events?.filter(e => new Date(e.start_datetime) > new Date() && e.status === "Published").length || 0;
  const completedEvents = events?.filter(e => e.status === "Completed").length || 0;
  
  const totalRegistrations = registrations?.length || 0;
  const totalRevenue = payments?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const recentRegistrations = registrations?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Event Dashboard</h1>
        <Link href="/admin/events/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-slate-500">{upcomingEvents} upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Registrations</CardTitle>
            <UsersRound className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString("id-ID")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Completed Events</CardTitle>
            <Tent className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEvents}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Registrations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Participant</th>
                <th className="px-6 py-3 font-medium">Event</th>
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentRegistrations.map((reg: any) => (
                <tr key={reg.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{reg.full_name}</div>
                    <div className="text-slate-500 text-xs">{reg.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{reg.events?.title}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{reg.registration_code}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reg.payment_status === 'PAID' || reg.payment_status === 'FREE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reg.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {format(new Date(reg.created_at), "dd MMM yyyy, HH:mm")}
                  </td>
                </tr>
              ))}
              {recentRegistrations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No registrations yet
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
