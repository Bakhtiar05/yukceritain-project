"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BlogMobileSearchBar() {
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
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="md:hidden px-4 py-3 relative z-40 bg-white">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div 
          className={`flex-1 flex items-center bg-white border rounded-full px-4 py-2.5 transition-all duration-300 ${
            isFocused 
              ? "border-blue-500 shadow-[0_4px_20px_-5px_rgba(59,130,246,0.2)] ring-2 ring-blue-100" 
              : "border-slate-200 shadow-sm hover:border-slate-300"
          }`}
        >
          <Search className={`w-4 h-4 mr-2 transition-colors ${isFocused ? "text-blue-500" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Cari artikel..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        
        <button 
          type="button"
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </form>
      
      <div className="mt-3 flex items-center justify-between">
        <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 transition-colors">
          <ListFilter className="w-3.5 h-3.5 text-blue-500" />
          Kategori
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </button>
      </div>
    </div>
  );
}
