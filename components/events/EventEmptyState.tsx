import React from "react";
import Link from "next/link";
import { CalendarX2 } from "lucide-react";

export default function EventEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <CalendarX2 className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">No Events Available Yet</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        We're preparing exciting events for our community. Please check back again soon or explore our other resources in the meantime.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
