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
      <div className="flex flex-col lg:flex-row items-center gap-4 justify-between bg-white p-3 rounded-[28px] border border-[#E5E7EB] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)]">
        
        {/* Search */}
        <div className="relative w-full lg:w-[35%] flex-shrink-0">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#64748B]" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-6 py-3.5 bg-[#F8FAFC] border-transparent rounded-[20px] text-[#0F172A] placeholder:text-[#64748B] focus:bg-white focus:border-[#60A5FA] focus:ring-4 focus:ring-[#EFF6FF] transition-all outline-none font-medium"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="w-full lg:w-auto overflow-x-auto hide-scrollbar flex-grow">
          <div className="flex items-center gap-1.5 px-1 py-1">
            <button
              onClick={() => handleFilterClick("all")}
              className={`whitespace-nowrap px-5 py-2.5 rounded-[16px] text-sm font-semibold transition-all duration-300 ${
                !searchParams.get("filter") || searchParams.get("filter") === "all"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-transparent text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#0F172A]"
              }`}
            >
              All
            </button>
            {filters.map((filter) => {
              const isActive = currentFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-[16px] text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "bg-transparent text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#0F172A]"
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
