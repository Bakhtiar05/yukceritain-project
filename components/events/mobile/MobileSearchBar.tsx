"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, MapPin, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MobileSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [search, setSearch] = useState(initialSearch);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="px-4 pt-3 pb-1 relative z-40 bg-white dark:bg-background">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div 
          className={`flex-1 flex items-center bg-white dark:bg-card border rounded-full px-4 py-2.5 transition-all duration-300 ${
            isFocused 
              ? "border-blue-500 shadow-[0_4px_20px_-5px_rgba(59,130,246,0.2)] ring-2 ring-blue-100 dark:ring-blue-900/20" 
              : "border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <Search className={`w-4 h-4 mr-2 transition-colors ${isFocused ? "text-blue-500" : "text-slate-400 dark:text-slate-500"}`} />
          <input
            type="text"
            placeholder="Search workshops, webinars..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        
        <button 
          type="button"
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-full shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </form>
      
      {/* Online / Offline buttons */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("filter", "online");
            router.push(`/events?${params.toString()}`);
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-border transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          Online Event
        </button>
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("filter", "offline");
            router.push(`/events?${params.toString()}`);
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-border transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          Offline Event
        </button>
      </div>
    </div>
  );
}
