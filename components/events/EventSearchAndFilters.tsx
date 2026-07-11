"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EventSearchAndFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const currentFilter = searchParams.get("filter") || "all";

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      
      router.push(`/events?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, router]);

  const handleFilterClick = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    router.push(`/events?${params.toString()}`, { scroll: false });
  };

  const filters = [
    { id: "workshop", label: "Workshop" },
    { id: "webinar", label: "Webinar" },
    { id: "community", label: "Community" },
    { id: "online", label: "Online" },
    { id: "offline", label: "Offline" },
    { id: "free", label: "Free" },
    { id: "paid", label: "Paid" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <section className="relative -mt-8 max-w-5xl mx-auto px-4 md:px-8 z-40">
      <div className="flex flex-col items-center gap-6 w-full">
        
        {/* Search */}
        <div className="relative w-full max-w-2xl mx-auto shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#64748B] dark:text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-full text-[#0F172A] dark:text-foreground placeholder:text-[#64748B] dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-card focus:border-[#60A5FA] focus:ring-4 focus:ring-[#EFF6FF] dark:focus:ring-blue-900/20 transition-all outline-none font-medium shadow-sm"
            placeholder="Cari event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="w-full overflow-x-auto hide-scrollbar flex justify-start md:justify-center">
          <div className="flex items-center gap-2 px-1 py-1">
            <button
              onClick={() => handleFilterClick("all")}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                !searchParams.get("filter") || searchParams.get("filter") === "all"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-card border border-slate-200 dark:border-slate-800 text-[#64748B] dark:text-slate-300 hover:bg-[#EFF6FF] dark:hover:bg-slate-800 hover:text-[#0F172A] dark:hover:text-white"
              }`}
            >
              Semua
            </button>
            {filters.map((filter) => {
              const isActive = currentFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "bg-white dark:bg-card border border-slate-200 dark:border-slate-800 text-[#64748B] dark:text-slate-300 hover:bg-[#EFF6FF] dark:hover:bg-slate-800 hover:text-[#0F172A] dark:hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
