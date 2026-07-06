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
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-1 text-sm"
      >
        <Download className="w-4 h-4" />
        Download / Print
      </button>
      <button 
        onClick={handleAddToCalendar}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-transparent border-2 border-[#BFDBFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] rounded-full font-bold transition-all duration-300 hover:-translate-y-1 text-sm"
      >
        <CalendarPlus className="w-4 h-4" />
        Add to Calendar
      </button>
    </div>
  );
}
