import React from "react";
import CheckInScanner from "@/components/admin/events/CheckInScanner";

export const dynamic = 'force-dynamic';

export default function AdminCheckInPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Check-In</h1>
          <p className="text-slate-500 mt-1">Scan QR Code or enter registration code manually to check in participants.</p>
        </div>
      </div>
      
      <CheckInScanner />
    </div>
  );
}
