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
    { id: "upcoming", label: "Upcoming" },
    { id: "online", label: "Online" },
    { id: "offline", label: "Offline" },
    { id: "free", label: "Free" },
    { id: "paid", label: "Paid" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <section className="pb-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-6 justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Search */}
        <div className="relative w-full lg:w-1/3 flex-shrink-0">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => handleFilterClick("all")}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                !searchParams.get("filter") || searchParams.get("filter") === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
                  className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
