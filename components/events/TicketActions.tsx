"use client";

import React from "react";
import { Download, CalendarPlus } from "lucide-react";
import { format } from "date-fns";

interface TicketActionsProps {
  eventTitle: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  location: string;
}

export default function TicketActions({
  eventTitle,
  eventDescription,
  startDate,
  endDate,
  location,
}: TicketActionsProps) {
  
  const handleDownload = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Convert to UTC strings and format
    const formatForGCal = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const gcalStart = formatForGCal(start);
    const gcalEnd = formatForGCal(end);

    const title = encodeURIComponent(eventTitle);
    const details = encodeURIComponent(eventDescription);
    const loc = encodeURIComponent(location);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${gcalStart}/${gcalEnd}&details=${details}&location=${loc}`;

    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
      <button 
        onClick={handleDownload}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-md"
      >
        <Download className="w-4 h-4" />
        Download / Print
      </button>
      <button 
        onClick={handleAddToCalendar}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
      >
        <CalendarPlus className="w-4 h-4" />
        Add to Calendar
      </button>
    </div>
  );
}
